// Keyshots Settings Panel
// Manages API credentials and user preferences

const KeyshotsSettings = {
  getSlackIcon() {
    return '<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#4A154B"/><path d="M13 8C13 9.1 12.1 10 11 10C9.9 10 9 9.1 9 8C9 6.9 9.9 6 11 6C12.1 6 13 6.9 13 8Z" fill="#E01E5A"/><path d="M11 10H13V14H11C9.9 14 9 13.1 9 12V10Z" fill="#E01E5A"/><path d="M24 13C22.9 13 22 12.1 22 11C22 9.9 22.9 9 24 9C25.1 9 26 9.9 26 11C26 12.1 25.1 13 24 13Z" fill="#36C5F0"/><path d="M22 11V13H18V11C18 9.9 18.9 9 20 9H22Z" fill="#36C5F0"/><path d="M19 24C19 22.9 19.9 22 21 22C22.1 22 23 22.9 23 24C23 25.1 22.1 26 21 26C19.9 26 19 25.1 19 24Z" fill="#2EB67D"/><path d="M21 22H19V18H21C22.1 18 23 18.9 23 20V22Z" fill="#2EB67D"/><path d="M8 19C9.1 19 10 19.9 10 21C10 22.1 9.1 23 8 23C6.9 23 6 22.1 6 21C6 19.9 6.9 19 8 19Z" fill="#ECB22E"/><path d="M10 21V19H14V21C14 22.1 13.1 23 12 23H10Z" fill="#ECB22E"/></svg>';
  },

  getNotionIcon() {
    return '<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="white"/><path d="M9 7L12 6.5L23 5.5L24 6V23L22 25L10 25.5L8 24V9L9 7Z" fill="white" stroke="black" stroke-width="1.5"/><path d="M10 9V23L21 22.5V8L10 9Z" stroke="black" stroke-width="1.5"/><line x1="12" y1="12" x2="18" y2="12" stroke="black" stroke-width="1.2" stroke-linecap="round"/><line x1="12" y1="15" x2="18" y2="15" stroke="black" stroke-width="1.2" stroke-linecap="round"/><line x1="12" y1="18" x2="15" y2="18" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg>';
  },

  getSettingsIcon() {
    return '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#636366"/><circle cx="16" cy="16" r="4" stroke="white" stroke-width="2"/><path d="M16 6V9M16 23V26M6 16H9M23 16H26M9.17 9.17L11.29 11.29M20.71 20.71L22.83 22.83M9.17 22.83L11.29 20.71M20.71 11.29L22.83 9.17" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>';
  },

  getBackIcon() {
    return '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 3L5 7L9 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  },

  async render() {
    const content = document.getElementById('keyshots-content');
    const footer = document.getElementById('keyshots-footer');
    if (footer) footer.style.display = 'none';
    
    const slackWebhook = await KeyshotsStorage.get(KeyshotsStorage.KEYS.SLACK_WEBHOOK) || '';
    const notionToken = await KeyshotsStorage.get(KeyshotsStorage.KEYS.NOTION_TOKEN) || '';
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
  },

  async handleSave() {
    const slackWebhook = document.getElementById('keyshots-settings-slack')?.value.trim();
    const notionToken = document.getElementById('keyshots-settings-notion')?.value.trim();
    const saveBtn = document.getElementById('keyshots-settings-save');
    
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
    }
    
    try {
      await KeyshotsStorage.set(KeyshotsStorage.KEYS.SLACK_WEBHOOK, slackWebhook);
      await KeyshotsStorage.set(KeyshotsStorage.KEYS.NOTION_TOKEN, notionToken);
      
      KeyshotsOverlay.showMessage('success', 'Settings saved!');
    } catch (error) {
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save Settings';
      }
      this.showError('Failed to save settings');
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
