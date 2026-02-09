// Keyshots Gmail API
// Handles Gmail OAuth and email sending via messaging to background script

const KeyshotsGmailAPI = {
  /**
   * Check if Gmail API is configured
   * @returns {Promise<boolean>}
   */
  async isConfigured() {
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage({ action: 'gmailCheckConfigured' }, (response) => {
          if (chrome.runtime.lastError) {
            resolve(false);
          } else {
            resolve(response?.configured === true);
          }
        });
      } catch (e) {
        resolve(false);
      }
    });
  },

  /**
   * Send email via Gmail API (through background script)
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} body - Email body (plain text)
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  async sendEmail(to, subject, body) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'gmailSendEmail', to, subject, body },
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
   * Sign out from Gmail
   */
  async signOut() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage({ action: 'gmailSignOut' }, (response) => {
        resolve(response || { success: true });
      });
    });
  }
};
