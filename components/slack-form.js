// Keyshots Slack Form
// Handles Slack message composition and webhook submission

const KeyshotsSlackForm = {
  getIcon() {
    return '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#4A154B"/><path d="M13 8C13 9.1 12.1 10 11 10C9.9 10 9 9.1 9 8C9 6.9 9.9 6 11 6C12.1 6 13 6.9 13 8Z" fill="#E01E5A"/><path d="M11 10H13V14H11C9.9 14 9 13.1 9 12V10Z" fill="#E01E5A"/><path d="M24 13C22.9 13 22 12.1 22 11C22 9.9 22.9 9 24 9C25.1 9 26 9.9 26 11C26 12.1 25.1 13 24 13Z" fill="#36C5F0"/><path d="M22 11V13H18V11C18 9.9 18.9 9 20 9H22Z" fill="#36C5F0"/><path d="M19 24C19 22.9 19.9 22 21 22C22.1 22 23 22.9 23 24C23 25.1 22.1 26 21 26C19.9 26 19 25.1 19 24Z" fill="#2EB67D"/><path d="M21 22H19V18H21C22.1 18 23 18.9 23 20V22Z" fill="#2EB67D"/><path d="M8 19C9.1 19 10 19.9 10 21C10 22.1 9.1 23 8 23C6.9 23 6 22.1 6 21C6 19.9 6.9 19 8 19Z" fill="#ECB22E"/><path d="M10 21V19H14V21C14 22.1 13.1 23 12 23H10Z" fill="#ECB22E"/></svg>';
  },

  getBackIcon() {
    return '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 3L5 7L9 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  },

  async render() {
    const content = document.getElementById('keyshots-content');
    const footer = document.getElementById('keyshots-footer');
    if (footer) footer.style.display = 'none';
    
    const webhookUrl = await KeyshotsStorage.get(KeyshotsStorage.KEYS.SLACK_WEBHOOK);
    
    if (!webhookUrl) {
      content.innerHTML = 
        '<div class="keyshots-form">' +
          '<div class="keyshots-form-title">' +
            '<button type="button" class="keyshots-back-btn" id="keyshots-slack-back">' + this.getBackIcon() + '</button>' +
            '<span class="keyshots-command-icon">' + this.getIcon() + '</span>' +
            '<span>Send Message</span>' +
          '</div>' +
          '<div class="keyshots-message keyshots-message-error" style="margin-bottom: 24px;">' +
            '<span class="keyshots-message-icon">⚠</span>' +
            '<span class="keyshots-message-text">Slack webhook not configured. Set it up in Settings.</span>' +
          '</div>' +
          '<div class="keyshots-form-actions">' +
            '<button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-slack-back-btn">Back</button>' +
            '<button type="button" class="keyshots-btn keyshots-btn-primary" id="keyshots-slack-settings">Open Settings</button>' +
          '</div>' +
        '</div>';
      
      document.getElementById('keyshots-slack-back')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
      document.getElementById('keyshots-slack-back-btn')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
      document.getElementById('keyshots-slack-settings')?.addEventListener('click', () => KeyshotsOverlay.showView('settings'));
      return;
    }
    
    content.innerHTML = 
      '<form class="keyshots-form" id="keyshots-slack-form">' +
        '<div class="keyshots-form-title">' +
          '<button type="button" class="keyshots-back-btn" id="keyshots-slack-back">' + this.getBackIcon() + '</button>' +
          '<span class="keyshots-command-icon">' + this.getIcon() + '</span>' +
          '<span>Send Message</span>' +
        '</div>' +
        
        '<div class="keyshots-form-group">' +
          '<label class="keyshots-form-label">Message</label>' +
          '<textarea id="keyshots-slack-message" class="keyshots-form-textarea" placeholder="What would you like to say?" required></textarea>' +
        '</div>' +
        
        '<div class="keyshots-form-actions">' +
          '<button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-slack-cancel">Cancel</button>' +
          '<button type="submit" class="keyshots-btn keyshots-btn-primary" id="keyshots-slack-submit">Send Message<span class="keyshots-kbd">⌘↵</span></button>' +
        '</div>' +
      '</form>';
    
    this.setupEventListeners();
    
    setTimeout(() => {
      document.getElementById('keyshots-slack-message')?.focus();
    }, 50);
  },

  setupEventListeners() {
    const form = document.getElementById('keyshots-slack-form');
    const backBtn = document.getElementById('keyshots-slack-back');
    const cancelBtn = document.getElementById('keyshots-slack-cancel');
    
    backBtn?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    cancelBtn?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  },

  async handleSubmit() {
    const message = document.getElementById('keyshots-slack-message')?.value.trim();
    const submitBtn = document.getElementById('keyshots-slack-submit');
    
    if (!message) {
      this.showError('Please enter a message');
      return;
    }
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
    }
    
    const result = await KeyshotsAPI.sendSlackMessage(message);
    
    if (result.success) {
      KeyshotsOverlay.showMessage('success', 'Message sent to Slack!');
    } else {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message<span class="keyshots-kbd">⌘↵</span>';
      }
      this.showError(result.error || 'Failed to send message');
    }
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
