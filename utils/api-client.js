// Keyshots API Client
// Routes API calls through background script to avoid CORS issues

const KeyshotsAPI = {
  /**
   * Send a message to Slack via webhook (routed through background script)
   * @param {string} message - The message to send
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async sendSlackMessage(message) {
    // Get webhook URL from storage
    const webhookUrl = await KeyshotsStorage.get(KeyshotsStorage.KEYS.SLACK_WEBHOOK);
    
    if (!webhookUrl) {
      return { success: false, error: 'Slack webhook not configured' };
    }

    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'slackSendMessage', webhookUrl, message },
        (response) => {
          if (chrome.runtime.lastError) {
            resolve({ success: false, error: chrome.runtime.lastError.message });
          } else {
            resolve(response || { success: false, error: 'No response from background script' });
          }
        }
      );
    });
  },

  /**
   * Create a new page in Notion (routed through background script)
   * @param {string} token - Notion integration token
   * @param {string} databaseId - The database ID to create page in
   * @param {string} title - Page title
   * @param {string} content - Page content
   * @returns {Promise<{success: boolean, error?: string, pageUrl?: string}>}
   */
  async createNotionPage(token, databaseId, title, content) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'notionCreatePage', token, databaseId, title, content },
        (response) => {
          if (chrome.runtime.lastError) {
            resolve({ success: false, error: chrome.runtime.lastError.message });
          } else {
            resolve(response || { success: false, error: 'No response from background script' });
          }
        }
      );
    });
  },

  /**
   * Fetch available databases from Notion (routed through background script)
   * @param {string} token - Notion integration token
   * @returns {Promise<{success: boolean, databases?: Array, error?: string}>}
   */
  async fetchNotionDatabases(token) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'notionFetchDatabases', token },
        (response) => {
          if (chrome.runtime.lastError) {
            resolve({ success: false, error: chrome.runtime.lastError.message });
          } else {
            resolve(response || { success: false, error: 'No response from background script' });
          }
        }
      );
    });
  }
};
