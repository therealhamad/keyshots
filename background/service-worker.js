// Keyshots Background Service Worker
// Listens for keyboard shortcut and handles Gmail API operations

// OAuth Configuration - Uses launchWebAuthFlow for Manifest V3
const OAUTH_CONFIG = {
  clientId: '495152588629-98g5suvfjc1bkmcktljqnptiosoh7jg0.apps.googleusercontent.com',
  scopes: ['https://www.googleapis.com/auth/gmail.send'],
  redirectUri: `https://${chrome.runtime.id}.chromiumapp.org/`
};

// Token storage key
const TOKEN_STORAGE_KEY = 'gmail_access_token';

chrome.commands.onCommand.addListener((command) => {
  if (command === 'toggle-overlay') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { action: 'toggleOverlay' });
      }
    });
  }
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Gmail actions
  if (request.action === 'gmailSendEmail') {
    handleSendEmail(request.to, request.subject, request.body).then(sendResponse);
    return true;
  }
  
  if (request.action === 'gmailCheckConfigured') {
    sendResponse({ configured: true });
    return false;
  }
  
  if (request.action === 'gmailSignOut') {
    handleSignOut().then(sendResponse);
    return true;
  }

  // Slack actions
  if (request.action === 'slackSendMessage') {
    handleSlackMessage(request.webhookUrl, request.message).then(sendResponse);
    return true;
  }

  // Notion actions
  if (request.action === 'notionFetchDatabases') {
    handleNotionFetchDatabases(request.token).then(sendResponse);
    return true;
  }

  if (request.action === 'notionCreatePage') {
    handleNotionCreatePage(request.token, request.databaseId, request.title, request.content).then(sendResponse);
    return true;
  }

  // GitHub activity for standup
  if (request.action === 'githubFetchActivity') {
    handleGitHubFetchActivity(request.token, request.username).then(sendResponse);
    return true;
  }

  // Notion activity for standup
  if (request.action === 'notionFetchActivity') {
    handleNotionFetchActivity(request.token).then(sendResponse);
    return true;
  }
});

// Get stored token or initiate OAuth flow
async function getAccessToken(interactive = true) {
  // Check for stored token first
  const stored = await chrome.storage.local.get(TOKEN_STORAGE_KEY);
  if (stored[TOKEN_STORAGE_KEY]) {
    // Verify token is still valid
    const isValid = await verifyToken(stored[TOKEN_STORAGE_KEY]);
    if (isValid) {
      return { success: true, token: stored[TOKEN_STORAGE_KEY] };
    }
    // Token expired, clear it
    await chrome.storage.local.remove(TOKEN_STORAGE_KEY);
  }

  if (!interactive) {
    return { success: false, error: 'Not authenticated' };
  }

  // Start OAuth flow
  return await initiateOAuthFlow();
}

// Verify token is still valid
async function verifyToken(token) {
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`);
    return response.ok;
  } catch {
    return false;
  }
}

// Initiate OAuth flow using launchWebAuthFlow
async function initiateOAuthFlow() {
  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', OAUTH_CONFIG.clientId);
  authUrl.searchParams.set('redirect_uri', OAUTH_CONFIG.redirectUri);
  authUrl.searchParams.set('response_type', 'token');
  authUrl.searchParams.set('scope', OAUTH_CONFIG.scopes.join(' '));
  authUrl.searchParams.set('prompt', 'consent');

  return new Promise((resolve) => {
    chrome.identity.launchWebAuthFlow(
      {
        url: authUrl.toString(),
        interactive: true
      },
      async (redirectUrl) => {
        if (chrome.runtime.lastError) {
          resolve({ success: false, error: chrome.runtime.lastError.message });
          return;
        }

        if (!redirectUrl) {
          resolve({ success: false, error: 'Authentication was cancelled' });
          return;
        }

        // Extract access token from redirect URL
        const url = new URL(redirectUrl);
        const hashParams = new URLSearchParams(url.hash.substring(1));
        const accessToken = hashParams.get('access_token');

        if (accessToken) {
          // Store the token
          await chrome.storage.local.set({ [TOKEN_STORAGE_KEY]: accessToken });
          resolve({ success: true, token: accessToken });
        } else {
          const error = hashParams.get('error') || 'No access token received';
          resolve({ success: false, error });
        }
      }
    );
  });
}

// Send email via Gmail API
async function handleSendEmail(to, subject, body) {
  const authResult = await getAccessToken(true);
  
  if (!authResult.success) {
    return { success: false, error: authResult.error || 'Authentication failed' };
  }

  const token = authResult.token;
  const email = createEmail(to, subject, body);
  const encodedEmail = base64UrlEncode(email);

  try {
    const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw: encodedEmail })
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      
      // If token expired, clear it and retry once
      if (response.status === 401) {
        await chrome.storage.local.remove(TOKEN_STORAGE_KEY);
        // Retry with fresh token
        const retryAuth = await getAccessToken(true);
        if (retryAuth.success) {
          const retryResponse = await fetch('https://www.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${retryAuth.token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ raw: encodedEmail })
          });
          if (retryResponse.ok) {
            return { success: true };
          }
        }
        return { success: false, error: 'Session expired. Please try again.' };
      }
      
      return { 
        success: false, 
        error: errorData.error?.message || 'Failed to send email' 
      };
    }
  } catch (error) {
    return { success: false, error: error.message || 'Network error' };
  }
}

// Create RFC 2822 formatted email
function createEmail(to, subject, body) {
  const lines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    '',
    body
  ];
  return lines.join('\r\n');
}

// Base64 URL encode (Gmail API requires URL-safe base64)
function base64UrlEncode(str) {
  const base64 = btoa(unescape(encodeURIComponent(str)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Sign out from Gmail
async function handleSignOut() {
  const stored = await chrome.storage.local.get(TOKEN_STORAGE_KEY);
  if (stored[TOKEN_STORAGE_KEY]) {
    try {
      await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${stored[TOKEN_STORAGE_KEY]}`);
    } catch (e) {
      // Ignore revoke errors
    }
    await chrome.storage.local.remove(TOKEN_STORAGE_KEY);
  }
  return { success: true };
}

// ==================== SLACK API ====================

async function handleSlackMessage(webhookUrl, message) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: message })
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorText = await response.text();
      return { success: false, error: errorText || 'Failed to send message' };
    }
  } catch (error) {
    return { success: false, error: error.message || 'Network error' };
  }
}

// ==================== NOTION API ====================

async function handleNotionFetchDatabases(token) {
  try {
    const response = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        filter: { property: 'object', value: 'database' },
        page_size: 100
      })
    });

    if (response.ok) {
      const data = await response.json();
      const databases = data.results.map(db => ({
        id: db.id,
        name: db.title?.[0]?.plain_text || 'Untitled'
      }));
      return { success: true, databases };
    } else {
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.message || 'Failed to fetch databases' 
      };
    }
  } catch (error) {
    return { success: false, error: error.message || 'Network error' };
  }
}

async function handleNotionCreatePage(token, databaseId, title, content) {
  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          title: {
            title: [{ text: { content: title } }]
          }
        },
        children: content ? [{
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [{ text: { content: content } }]
          }
        }] : []
      })
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, pageUrl: data.url };
    } else {
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.message || 'Failed to create page' 
      };
    }
  } catch (error) {
    return { success: false, error: error.message || 'Network error' };
  }
}

// ==================== GITHUB API (Standup) ====================

async function handleGitHubFetchActivity(token, username) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/events?per_page=100`,
      {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.message || `GitHub API error: ${response.status}`,
        commits: []
      };
    }

    const events = await response.json();
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Filter for PushEvents from last 24h
    const commits = events
      .filter(e => {
        if (e.type !== 'PushEvent') return false;
        const eventDate = new Date(e.created_at);
        return eventDate > cutoff;
      })
      .flatMap(e => e.payload.commits.map(c => ({
        message: c.message.split('\n')[0], // First line only
        repo: e.repo.name,
        time: e.created_at,
        url: `https://github.com/${e.repo.name}/commit/${c.sha}`
      })));

    // Deduplicate by message
    const uniqueCommits = [];
    const seen = new Set();
    
    for (const commit of commits) {
      if (!seen.has(commit.message)) {
        seen.add(commit.message);
        uniqueCommits.push(commit);
      }
    }

    return { success: true, commits: uniqueCommits };
  } catch (error) {
    return { success: false, error: error.message || 'Network error', commits: [] };
  }
}

// ==================== NOTION ACTIVITY (Standup) ====================

async function handleNotionFetchActivity(token) {
  try {
    const response = await fetch('https://api.notion.com/v1/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify({
        filter: {
          property: 'object',
          value: 'page'
        },
        sort: {
          direction: 'descending',
          timestamp: 'last_edited_time'
        },
        page_size: 100
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.message || `Notion API error: ${response.status}`,
        tasks: []
      };
    }

    const data = await response.json();
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    // Filter for recently edited pages
    const tasks = data.results
      .filter(page => {
        const lastEdited = new Date(page.last_edited_time);
        return lastEdited > cutoff;
      })
      .map(page => {
        // Try to get title from different property types
        let title = 'Untitled';
        
        if (page.properties.Name?.title?.[0]?.plain_text) {
          title = page.properties.Name.title[0].plain_text;
        } else if (page.properties.Title?.title?.[0]?.plain_text) {
          title = page.properties.Title.title[0].plain_text;
        } else if (page.properties.title?.title?.[0]?.plain_text) {
          title = page.properties.title.title[0].plain_text;
        }
        
        // Try to determine if it's marked as done/completed
        const status = page.properties.Status?.status?.name || 
                      page.properties.Status?.select?.name ||
                      null;
        
        const isCompleted = status && 
          (status.toLowerCase().includes('done') || 
           status.toLowerCase().includes('complete'));
        
        return {
          title: title,
          status: status,
          isCompleted: isCompleted,
          lastEdited: page.last_edited_time,
          url: page.url
        };
      })
      // Only include completed tasks or recently edited ones with titles
      .filter(task => task.isCompleted || task.title !== 'Untitled');

    return { success: true, tasks };
  } catch (error) {
    return { success: false, error: error.message || 'Network error', tasks: [] };
  }
}
