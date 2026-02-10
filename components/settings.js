// Keyshots Settings Panel
// Manages API credentials and user preferences

const KeyshotsSettings = {
  getSlackIcon() {
    return '<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#4A154B"/><path d="M13 8C13 9.1 12.1 10 11 10C9.9 10 9 9.1 9 8C9 6.9 9.9 6 11 6C12.1 6 13 6.9 13 8Z" fill="#E01E5A"/><path d="M11 10H13V14H11C9.9 14 9 13.1 9 12V10Z" fill="#E01E5A"/><path d="M24 13C22.9 13 22 12.1 22 11C22 9.9 22.9 9 24 9C25.1 9 26 9.9 26 11C26 12.1 25.1 13 24 13Z" fill="#36C5F0"/><path d="M22 11V13H18V11C18 9.9 18.9 9 20 9H22Z" fill="#36C5F0"/><path d="M19 24C19 22.9 19.9 22 21 22C22.1 22 23 22.9 23 24C23 25.1 22.1 26 21 26C19.9 26 19 25.1 19 24Z" fill="#2EB67D"/><path d="M21 22H19V18H21C22.1 18 23 18.9 23 20V22Z" fill="#2EB67D"/><path d="M8 19C9.1 19 10 19.9 10 21C10 22.1 9.1 23 8 23C6.9 23 6 22.1 6 21C6 19.9 6.9 19 8 19Z" fill="#ECB22E"/><path d="M10 21V19H14V21C14 22.1 13.1 23 12 23H10Z" fill="#ECB22E"/></svg>';
  },

  getNotionIcon() {
    return '<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="white"/><path d="M9 7L12 6.5L23 5.5L24 6V23L22 25L10 25.5L8 24V9L9 7Z" fill="white" stroke="black" stroke-width="1.5"/><path d="M10 9V23L21 22.5V8L10 9Z" stroke="black" stroke-width="1.5"/><line x1="12" y1="12" x2="18" y2="12" stroke="black" stroke-width="1.2" stroke-linecap="round"/><line x1="12" y1="15" x2="18" y2="15" stroke="black" stroke-width="1.2" stroke-linecap="round"/><line x1="12" y1="18" x2="15" y2="18" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg>';
  },

  getGeminiIcon() {
    return '<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#1A73E8"/><path d="M16 6L18.5 13.5L26 16L18.5 18.5L16 26L13.5 18.5L6 16L13.5 13.5L16 6Z" fill="white"/><circle cx="16" cy="16" r="3" fill="#1A73E8"/></svg>';
  },

  getSettingsIcon() {
    return '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#636366"/><circle cx="16" cy="16" r="4" stroke="white" stroke-width="2"/><path d="M16 6V9M16 23V26M6 16H9M23 16H26M9.17 9.17L11.29 11.29M20.71 20.71L22.83 22.83M9.17 22.83L11.29 20.71M20.71 11.29L22.83 9.17" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>';
  },

  getBackIcon() {
    return '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 3L5 7L9 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  },

  getGitHubIcon() {
    return '<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#24292e"/><path d="M16 6C10.477 6 6 10.477 6 16c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0116 9.207c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C23.138 24.163 26 20.418 26 16c0-5.523-4.477-10-10-10z" fill="white"/></svg>';
  },

  getCalendarIcon() {
    return '<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#4285F4"/><rect x="7" y="9" width="18" height="16" rx="2" stroke="white" stroke-width="2"/><path d="M7 13H25" stroke="white" stroke-width="2"/><path d="M12 7V11" stroke="white" stroke-width="2" stroke-linecap="round"/><path d="M20 7V11" stroke="white" stroke-width="2" stroke-linecap="round"/><rect x="10" y="16" width="4" height="3" rx="0.5" fill="white"/><rect x="10" y="20" width="4" height="3" rx="0.5" fill="white"/><rect x="18" y="16" width="4" height="3" rx="0.5" fill="white"/></svg>';
  },

  async render() {
    const content = document.getElementById('keyshots-content');
    const footer = document.getElementById('keyshots-footer');
    if (footer) footer.style.display = 'none';
    
    const slackWebhook = await KeyshotsStorage.get(KeyshotsStorage.KEYS.SLACK_WEBHOOK) || '';
    const notionToken = await KeyshotsStorage.get(KeyshotsStorage.KEYS.NOTION_TOKEN) || '';
    const geminiApiKey = await KeyshotsStorage.get('gemini_api_key') || '';
    const githubToken = await KeyshotsStorage.get('github_token') || '';
    const githubUsername = await KeyshotsStorage.get('github_username') || '';
    const calendarConnected = await KeyshotsStorage.get('calendar_connected') || false;
    const notionDatabases = await KeyshotsStorage.get(KeyshotsStorage.KEYS.NOTION_DATABASES) || [];
    
    const dbCount = notionDatabases.length;
    const dbText = dbCount > 0 ? dbCount + ' database' + (dbCount > 1 ? 's' : '') + ' connected' : 'No databases connected';
    
    content.innerHTML = 
      '<div class="keyshots-form" id="keyshots-settings-form">' +
        '<div class="keyshots-form-title">' +
          '<button type="button" class="keyshots-back-btn" id="keyshots-settings-back">' + this.getBackIcon() + '</button>' +
          '<span class="keyshots-command-icon">' + this.getSettingsIcon() + '</span>' +
          '<span>Settings</span>' +
        '</div>' +
        
        // Gemini AI Section
        '<div class="keyshots-settings-section">' +
          '<div class="keyshots-settings-title">' +
            '<span class="keyshots-command-icon">' + this.getGeminiIcon() + '</span>' +
            '<span>Gemini AI</span>' +
            '<span class="keyshots-settings-badge">Smart Actions</span>' +
          '</div>' +
          '<div class="keyshots-form-group" style="margin-bottom: 0;">' +
            '<label class="keyshots-form-label">API Key</label>' +
            '<div class="keyshots-settings-row">' +
              '<input type="password" id="keyshots-settings-gemini" class="keyshots-form-input" style="flex: 1;" placeholder="AIza..." value="' + this.escapeHtml(geminiApiKey) + '" />' +
              '<button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-settings-test-gemini" style="height: 48px; padding: 0 14px; font-size: 13px; margin-left: 8px;">Test</button>' +
            '</div>' +
            '<div class="keyshots-settings-hint">Get your API key from <a href="https://aistudio.google.com/app/apikey" target="_blank">Google AI Studio</a></div>' +
          '</div>' +
        '</div>' +
        
        // GitHub Section (for Standup)
        '<div class="keyshots-settings-section">' +
          '<div class="keyshots-settings-title">' +
            '<span class="keyshots-command-icon">' + this.getGitHubIcon() + '</span>' +
            '<span>GitHub</span>' +
            '<span class="keyshots-settings-badge">Standup</span>' +
          '</div>' +
          '<div class="keyshots-form-group">' +
            '<label class="keyshots-form-label">Personal Access Token</label>' +
            '<div class="keyshots-settings-row">' +
              '<input type="password" id="keyshots-settings-github-token" class="keyshots-form-input" style="flex: 1;" placeholder="ghp_..." value="' + this.escapeHtml(githubToken) + '" />' +
              '<button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-settings-test-github" style="height: 48px; padding: 0 14px; font-size: 13px; margin-left: 8px;">Test</button>' +
            '</div>' +
            '<div class="keyshots-settings-hint">Create a token at <a href="https://github.com/settings/tokens" target="_blank">GitHub Settings</a> with <code>repo</code> and <code>read:user</code> scopes</div>' +
          '</div>' +
          '<div class="keyshots-form-group" style="margin-bottom: 0;">' +
            '<label class="keyshots-form-label">Username</label>' +
            '<input type="text" id="keyshots-settings-github-username" class="keyshots-form-input" placeholder="your-github-username" value="' + this.escapeHtml(githubUsername) + '" />' +
          '</div>' +
        '</div>' +
        
        // Google Calendar Section (for Standup)
        '<div class="keyshots-settings-section">' +
          '<div class="keyshots-settings-title">' +
            '<span class="keyshots-command-icon">' + this.getCalendarIcon() + '</span>' +
            '<span>Google Calendar</span>' +
            '<span class="keyshots-settings-badge">Standup</span>' +
          '</div>' +
          '<div class="keyshots-form-group" style="margin-bottom: 0;">' +
            '<label class="keyshots-form-label">Connection Status</label>' +
            '<div class="keyshots-settings-row">' +
              '<span style="flex: 1; font-size: 14px; color: ' + (calendarConnected ? '#34c759' : 'rgba(255, 255, 255, 0.5)') + ';">' + 
                (calendarConnected ? '✓ Connected' : 'Not connected') + 
              '</span>' +
              (calendarConnected ? 
                '<button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-settings-disconnect-calendar" style="height: 36px; padding: 0 14px; font-size: 13px;">Disconnect</button>' :
                '<button type="button" class="keyshots-btn keyshots-btn-primary" id="keyshots-settings-connect-calendar" style="height: 36px; padding: 0 14px; font-size: 13px;">Connect</button>'
              ) +
            '</div>' +
            '<div class="keyshots-settings-hint">Access your calendar to include meetings in standup</div>' +
          '</div>' +
        '</div>' +
        
        // Slack Section
        '<div class="keyshots-settings-section">' +
          '<div class="keyshots-settings-title">' +
            '<span class="keyshots-command-icon">' + this.getSlackIcon() + '</span>' +
            '<span>Slack</span>' +
          '</div>' +
          '<div class="keyshots-form-group" style="margin-bottom: 0;">' +
            '<label class="keyshots-form-label">Webhook URL</label>' +
            '<input type="url" id="keyshots-settings-slack" class="keyshots-form-input" placeholder="https://hooks.slack.com/services/..." value="' + this.escapeHtml(slackWebhook) + '" />' +
            '<div class="keyshots-settings-hint">Create a webhook at <a href="https://api.slack.com/messaging/webhooks" target="_blank">api.slack.com</a></div>' +
          '</div>' +
        '</div>' +
        
        // Notion Section
        '<div class="keyshots-settings-section">' +
          '<div class="keyshots-settings-title">' +
            '<span class="keyshots-command-icon">' + this.getNotionIcon() + '</span>' +
            '<span>Notion</span>' +
          '</div>' +
          '<div class="keyshots-form-group">' +
            '<label class="keyshots-form-label">Integration Token</label>' +
            '<input type="password" id="keyshots-settings-notion" class="keyshots-form-input" placeholder="secret_..." value="' + this.escapeHtml(notionToken) + '" />' +
            '<div class="keyshots-settings-hint">Create an integration at <a href="https://www.notion.so/my-integrations" target="_blank">notion.so/my-integrations</a></div>' +
          '</div>' +
          '<div class="keyshots-form-group" style="margin-bottom: 0;">' +
            '<label class="keyshots-form-label">Databases</label>' +
            '<div class="keyshots-settings-row">' +
              '<span style="flex: 1; font-size: 14px; color: rgba(255, 255, 255, 0.5);">' + dbText + '</span>' +
              '<button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-settings-fetch-dbs" style="height: 36px; padding: 0 14px; font-size: 13px;">Refresh</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        
        '<div class="keyshots-form-actions">' +
          '<button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-settings-cancel">Cancel</button>' +
          '<button type="button" class="keyshots-btn keyshots-btn-primary" id="keyshots-settings-save">Save Settings</button>' +
        '</div>' +
      '</div>';
    
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.getElementById('keyshots-settings-back')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    document.getElementById('keyshots-settings-cancel')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    document.getElementById('keyshots-settings-save')?.addEventListener('click', () => this.handleSave());
    document.getElementById('keyshots-settings-fetch-dbs')?.addEventListener('click', () => this.handleFetchDatabases());
    document.getElementById('keyshots-settings-test-gemini')?.addEventListener('click', () => this.handleTestGemini());
    document.getElementById('keyshots-settings-test-github')?.addEventListener('click', () => this.handleTestGitHub());
    document.getElementById('keyshots-settings-connect-calendar')?.addEventListener('click', () => this.handleConnectCalendar());
    document.getElementById('keyshots-settings-disconnect-calendar')?.addEventListener('click', () => this.handleDisconnectCalendar());
  },

  async handleSave() {
    const slackWebhook = document.getElementById('keyshots-settings-slack')?.value.trim();
    const notionToken = document.getElementById('keyshots-settings-notion')?.value.trim();
    const geminiApiKey = document.getElementById('keyshots-settings-gemini')?.value.trim();
    const githubToken = document.getElementById('keyshots-settings-github-token')?.value.trim();
    const githubUsername = document.getElementById('keyshots-settings-github-username')?.value.trim();
    const saveBtn = document.getElementById('keyshots-settings-save');
    
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
    }
    
    try {
      await KeyshotsStorage.set(KeyshotsStorage.KEYS.SLACK_WEBHOOK, slackWebhook);
      await KeyshotsStorage.set(KeyshotsStorage.KEYS.NOTION_TOKEN, notionToken);
      await KeyshotsStorage.set('gemini_api_key', geminiApiKey);
      await KeyshotsStorage.set('github_token', githubToken);
      await KeyshotsStorage.set('github_username', githubUsername);
      
      KeyshotsOverlay.showMessage('success', 'Settings saved!');
    } catch (error) {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Settings';
      }
      this.showError('Failed to save settings');
    }
  },

  async handleTestGitHub() {
    const token = document.getElementById('keyshots-settings-github-token')?.value.trim();
    const username = document.getElementById('keyshots-settings-github-username')?.value.trim();
    const testBtn = document.getElementById('keyshots-settings-test-github');
    
    if (!token || !username) {
      this.showError('Please enter both token and username');
      return;
    }
    
    if (testBtn) {
      testBtn.disabled = true;
      testBtn.textContent = 'Testing...';
    }
    
    // Test via background script to avoid CORS
    const result = await new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'githubFetchActivity', token, username },
        (response) => {
          if (chrome.runtime.lastError) {
            resolve({ success: false, error: chrome.runtime.lastError.message });
          } else {
            resolve(response || { success: false, error: 'No response' });
          }
        }
      );
    });
    
    if (testBtn) {
      testBtn.disabled = false;
      testBtn.textContent = 'Test';
    }
    
    if (result.success) {
      this.showSuccess('GitHub connected! Found ' + (result.commits?.length || 0) + ' recent commits');
    } else {
      this.showError(result.error || 'Connection failed');
    }
  },

  async handleConnectCalendar() {
    const connectBtn = document.getElementById('keyshots-settings-connect-calendar');
    
    if (connectBtn) {
      connectBtn.disabled = true;
      connectBtn.textContent = 'Connecting...';
    }
    
    // Use the service worker to handle OAuth
    const result = await new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'calendarConnect' },
        (response) => {
          if (chrome.runtime.lastError) {
            resolve({ success: false, error: chrome.runtime.lastError.message });
          } else {
            resolve(response || { success: false, error: 'No response' });
          }
        }
      );
    });
    
    if (result.success) {
      await KeyshotsStorage.set('calendar_connected', true);
      this.showSuccess('Google Calendar connected!');
      setTimeout(() => this.render(), 1500);
    } else {
      if (connectBtn) {
        connectBtn.disabled = false;
        connectBtn.textContent = 'Connect';
      }
      this.showError(result.error || 'Failed to connect');
    }
  },

  async handleDisconnectCalendar() {
    const disconnectBtn = document.getElementById('keyshots-settings-disconnect-calendar');
    
    if (disconnectBtn) {
      disconnectBtn.disabled = true;
      disconnectBtn.textContent = 'Disconnecting...';
    }
    
    // Clear stored token
    await KeyshotsStorage.set('calendar_token', null);
    await KeyshotsStorage.set('calendar_connected', false);
    
    this.showSuccess('Google Calendar disconnected');
    setTimeout(() => this.render(), 1500);
  },

  async handleTestGemini() {
    const apiKey = document.getElementById('keyshots-settings-gemini')?.value.trim();
    const testBtn = document.getElementById('keyshots-settings-test-gemini');
    
    if (!apiKey) {
      this.showError('Please enter a Gemini API key');
      return;
    }
    
    if (testBtn) {
      testBtn.disabled = true;
      testBtn.textContent = 'Testing...';
    }
    
    const result = await KeyshotsGemini.testConnection(apiKey);
    
    if (testBtn) {
      testBtn.disabled = false;
      testBtn.textContent = 'Test';
    }
    
    if (result.success) {
      this.showSuccess('Gemini API connected!');
    } else {
      this.showError(result.error || 'Connection failed');
    }
  },

  async handleFetchDatabases() {
    const notionToken = document.getElementById('keyshots-settings-notion')?.value.trim();
    const fetchBtn = document.getElementById('keyshots-settings-fetch-dbs');
    
    if (!notionToken) {
      this.showError('Please enter a Notion token first');
      return;
    }
    
    if (fetchBtn) {
      fetchBtn.disabled = true;
      fetchBtn.textContent = 'Loading...';
    }
    
    const result = await KeyshotsAPI.fetchNotionDatabases(notionToken);
    
    if (result.success && result.databases) {
      await KeyshotsStorage.set(KeyshotsStorage.KEYS.NOTION_DATABASES, result.databases);
      
      if (fetchBtn) {
        fetchBtn.disabled = false;
        fetchBtn.textContent = 'Refresh';
      }
      
      this.showSuccess('Found ' + result.databases.length + ' database' + (result.databases.length !== 1 ? 's' : ''));
      
      setTimeout(() => this.render(), 1500);
    } else {
      if (fetchBtn) {
        fetchBtn.disabled = false;
        fetchBtn.textContent = 'Refresh';
      }
      this.showError(result.error || 'Failed to fetch databases');
    }
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  showError(message) {
    this.showMessage('error', message);
  },

  showSuccess(message) {
    this.showMessage('success', message);
  },

  showMessage(type, message) {
    document.querySelector('.keyshots-settings-message')?.remove();
    
    const messageEl = document.createElement('div');
    messageEl.className = 'keyshots-settings-message keyshots-message keyshots-message-' + type;
    messageEl.style.marginBottom = '20px';
    
    const icon = type === 'success' ? '✓' : '✕';
    messageEl.innerHTML = '<span class="keyshots-message-icon">' + icon + '</span><span class="keyshots-message-text">' + message + '</span>';
    
    const title = document.querySelector('.keyshots-form-title');
    if (title) title.insertAdjacentElement('afterend', messageEl);
    
    setTimeout(() => messageEl?.remove(), 3000);
  }
};
