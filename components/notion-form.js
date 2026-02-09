// Keyshots Notion Form
// Handles Notion page creation with database selection

const KeyshotsNotionForm = {
  databases: [],

  getIcon() {
    return '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="white"/><path d="M9 7L12 6.5L23 5.5L24 6V23L22 25L10 25.5L8 24V9L9 7Z" fill="white" stroke="black" stroke-width="1.5"/><path d="M10 9V23L21 22.5V8L10 9Z" stroke="black" stroke-width="1.5"/><line x1="12" y1="12" x2="18" y2="12" stroke="black" stroke-width="1.2" stroke-linecap="round"/><line x1="12" y1="15" x2="18" y2="15" stroke="black" stroke-width="1.2" stroke-linecap="round"/><line x1="12" y1="18" x2="15" y2="18" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg>';
  },

  getBackIcon() {
    return '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 3L5 7L9 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  },

  async render() {
    const content = document.getElementById('keyshots-content');
    const footer = document.getElementById('keyshots-footer');
    if (footer) footer.style.display = 'none';
    
    const token = await KeyshotsStorage.get(KeyshotsStorage.KEYS.NOTION_TOKEN);
    
    if (!token) {
      content.innerHTML = 
        '<div class="keyshots-form">' +
          '<div class="keyshots-form-title">' +
            '<button type="button" class="keyshots-back-btn" id="keyshots-notion-back">' + this.getBackIcon() + '</button>' +
            '<span class="keyshots-command-icon">' + this.getIcon() + '</span>' +
            '<span>Create Page</span>' +
          '</div>' +
          '<div class="keyshots-message keyshots-message-error" style="margin-bottom: 24px;">' +
            '<span class="keyshots-message-icon">⚠</span>' +
            '<span class="keyshots-message-text">Notion integration not configured. Set it up in Settings.</span>' +
          '</div>' +
          '<div class="keyshots-form-actions">' +
            '<button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-notion-back-btn">Back</button>' +
            '<button type="button" class="keyshots-btn keyshots-btn-primary" id="keyshots-notion-settings">Open Settings</button>' +
          '</div>' +
        '</div>';
      
      document.getElementById('keyshots-notion-back')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
      document.getElementById('keyshots-notion-back-btn')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
      document.getElementById('keyshots-notion-settings')?.addEventListener('click', () => KeyshotsOverlay.showView('settings'));
      return;
    }
    
    this.databases = await KeyshotsStorage.get(KeyshotsStorage.KEYS.NOTION_DATABASES) || [];
    
    if (this.databases.length === 0) {
      content.innerHTML = 
        '<div class="keyshots-form">' +
          '<div class="keyshots-form-title">' +
            '<button type="button" class="keyshots-back-btn" id="keyshots-notion-back">' + this.getBackIcon() + '</button>' +
            '<span class="keyshots-command-icon">' + this.getIcon() + '</span>' +
            '<span>Create Page</span>' +
          '</div>' +
          '<div class="keyshots-loading">' +
            '<div class="keyshots-spinner"></div>' +
            '<span class="keyshots-loading-text">Loading databases...</span>' +
          '</div>' +
        '</div>';
      
      document.getElementById('keyshots-notion-back')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
      
      await this.fetchDatabases(token);
      return;
    }
    
    this.renderForm();
  },

  async fetchDatabases(token) {
    const result = await KeyshotsAPI.fetchNotionDatabases(token);
    
    if (result.success && result.databases) {
      this.databases = result.databases;
      await KeyshotsStorage.set(KeyshotsStorage.KEYS.NOTION_DATABASES, result.databases);
      this.renderForm();
    } else {
      const content = document.getElementById('keyshots-content');
      content.innerHTML = 
        '<div class="keyshots-form">' +
          '<div class="keyshots-form-title">' +
            '<button type="button" class="keyshots-back-btn" id="keyshots-notion-back">' + this.getBackIcon() + '</button>' +
            '<span class="keyshots-command-icon">' + this.getIcon() + '</span>' +
            '<span>Create Page</span>' +
          '</div>' +
          '<div class="keyshots-message keyshots-message-error" style="margin-bottom: 24px;">' +
            '<span class="keyshots-message-icon">✕</span>' +
            '<span class="keyshots-message-text">' + (result.error || 'Failed to load databases. Check your token.') + '</span>' +
          '</div>' +
          '<div class="keyshots-form-actions">' +
            '<button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-notion-back-btn">Back</button>' +
            '<button type="button" class="keyshots-btn keyshots-btn-primary" id="keyshots-notion-settings">Open Settings</button>' +
          '</div>' +
        '</div>';
      
      document.getElementById('keyshots-notion-back')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
      document.getElementById('keyshots-notion-back-btn')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
      document.getElementById('keyshots-notion-settings')?.addEventListener('click', () => KeyshotsOverlay.showView('settings'));
    }
  },

  renderForm() {
    const content = document.getElementById('keyshots-content');
    
    let databaseOptions = '';
    this.databases.forEach(db => {
      databaseOptions += '<option value="' + db.id + '">' + this.escapeHtml(db.name) + '</option>';
    });
    
    content.innerHTML = 
      '<form class="keyshots-form" id="keyshots-notion-form">' +
        '<div class="keyshots-form-title">' +
          '<button type="button" class="keyshots-back-btn" id="keyshots-notion-back">' + this.getBackIcon() + '</button>' +
          '<span class="keyshots-command-icon">' + this.getIcon() + '</span>' +
          '<span>Create Page</span>' +
        '</div>' +
        
        '<div class="keyshots-form-group">' +
          '<label class="keyshots-form-label">Database</label>' +
          '<select id="keyshots-notion-database" class="keyshots-form-select" required>' + databaseOptions + '</select>' +
        '</div>' +
        
        '<div class="keyshots-form-group">' +
          '<label class="keyshots-form-label">Title</label>' +
          '<input type="text" id="keyshots-notion-title" class="keyshots-form-input" placeholder="Page title" required />' +
        '</div>' +
        
        '<div class="keyshots-form-group">' +
          '<label class="keyshots-form-label">Content</label>' +
          '<textarea id="keyshots-notion-content" class="keyshots-form-textarea" placeholder="Add some content (optional)..."></textarea>' +
        '</div>' +
        
        '<div class="keyshots-form-actions">' +
          '<button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-notion-cancel">Cancel</button>' +
          '<button type="submit" class="keyshots-btn keyshots-btn-primary" id="keyshots-notion-submit">Create Page<span class="keyshots-kbd">⌘↵</span></button>' +
        '</div>' +
      '</form>';
    
    this.setupEventListeners();
    
    setTimeout(() => {
      document.getElementById('keyshots-notion-title')?.focus();
    }, 50);
  },

  setupEventListeners() {
    const form = document.getElementById('keyshots-notion-form');
    const backBtn = document.getElementById('keyshots-notion-back');
    const cancelBtn = document.getElementById('keyshots-notion-cancel');
    
    backBtn?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    cancelBtn?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  },

  async handleSubmit() {
    const databaseId = document.getElementById('keyshots-notion-database')?.value;
    const title = document.getElementById('keyshots-notion-title')?.value.trim();
    const pageContent = document.getElementById('keyshots-notion-content')?.value.trim();
    const submitBtn = document.getElementById('keyshots-notion-submit');
    
    if (!databaseId) {
      this.showError('Please select a database');
      return;
    }
    
    if (!title) {
      this.showError('Please enter a title');
      return;
    }
    
    const token = await KeyshotsStorage.get(KeyshotsStorage.KEYS.NOTION_TOKEN);
    
    if (!token) {
      this.showError('Notion token not configured');
      return;
    }
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Creating...';
    }
    
    const result = await KeyshotsAPI.createNotionPage(token, databaseId, title, pageContent);
    
    if (result.success) {
      KeyshotsOverlay.showMessage('success', 'Page created in Notion!');
    } else {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Create Page<span class="keyshots-kbd">⌘↵</span>';
      }
      this.showError(result.error || 'Failed to create page');
    }
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  showError(message) {
    let errorEl = document.querySelector('.keyshots-form-error');
    if (!errorEl) {
      errorEl = document.createElement('div');
      errorEl.className = 'keyshots-form-error keyshots-message keyshots-message-error';
      errorEl.style.marginBottom = '20px';
      const title = document.querySelector('.keyshots-form-title');
      if (title) title.insertAdjacentElement('afterend', errorEl);
    }
    
    errorEl.innerHTML = '<span class="keyshots-message-icon">✕</span><span class="keyshots-message-text">' + message + '</span>';
    
    setTimeout(() => errorEl?.remove(), 3000);
  }
};
