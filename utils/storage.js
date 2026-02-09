// Keyshots Storage Utilities
// Wrapper around chrome.storage.local for settings persistence

const KeyshotsStorage = {
  /**
   * Get a value from storage
   * @param {string} key - The key to retrieve
   * @returns {Promise<any>} - The stored value or undefined
   */
  async get(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key]);
      });
    });
  },

  /**
   * Set a value in storage
   * @param {string} key - The key to store
   * @param {any} value - The value to store
   * @returns {Promise<void>}
   */
  async set(key, value) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    });
  },

  /**
   * Remove a value from storage
   * @param {string} key - The key to remove
   * @returns {Promise<void>}
   */
  async remove(key) {
    return new Promise((resolve) => {
      chrome.storage.local.remove([key], resolve);
    });
  },

  /**
   * Get all settings at once
   * @returns {Promise<Object>}
   */
  async getAll() {
    return new Promise((resolve) => {
      chrome.storage.local.get(null, (result) => {
        resolve(result);
      });
    });
  },

  // Storage keys
  KEYS: {
    SLACK_WEBHOOK: 'slackWebhookUrl',
    NOTION_TOKEN: 'notionToken',
    NOTION_DATABASES: 'notionDatabases',
    RECENT_EMAILS: 'recentEmails'
  }
};
