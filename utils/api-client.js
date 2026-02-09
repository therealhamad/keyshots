// Keyshots API Client
// Handles external API calls for Slack and Notion

const KeyshotsAPI = {
  /**
   * Send a message to Slack via webhook
   * @param {string} webhookUrl - The Slack webhook URL
   * @param {string} message - The message to send
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async sendSlackMessage(webhookUrl, message) {
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
  },

  /**
   * Create a new page in Notion
   * @param {string} token - Notion integration token
   * @param {string} databaseId - The database ID to create page in
   * @param {string} title - Page title
   * @param {string} content - Page content
   * @returns {Promise<{success: boolean, error?: string, pageUrl?: string}>}
   */
  async createNotionPage(token, databaseId, title, content) {
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
  },

  /**
   * Fetch available databases from Notion
   * @param {string} token - Notion integration token
   * @returns {Promise<{success: boolean, databases?: Array, error?: string}>}
   */
  async fetchNotionDatabases(token) {
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
};
