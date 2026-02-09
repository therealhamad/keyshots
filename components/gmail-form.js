// Keyshots Gmail Form
// Handles email composition and sending via Gmail API

const KeyshotsGmailForm = {
  getIcon() {
    return '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#EA4335"/><path d="M8 11L16 17L24 11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="6" y="9" width="20" height="14" rx="2" stroke="white" stroke-width="2"/></svg>';
  },

  getBackIcon() {
    return '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 3L5 7L9 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  },

  async render() {
    const content = document.getElementById('keyshots-content');
    const footer = document.getElementById('keyshots-footer');
    if (footer) footer.style.display = 'none';
    
    // Check if Gmail is configured (has OAuth client ID)
    const isConfigured = await this.checkGmailConfigured();
    
    if (!isConfigured) {
      content.innerHTML = 
        '<div class="keyshots-form">' +
          '<div class="keyshots-form-title">' +
            '<button type="button" class="keyshots-back-btn" id="keyshots-gmail-back">' + this.getBackIcon() + '</button>' +
            '<span class="keyshots-command-icon">' + this.getIcon() + '</span>' +
            '<span>Send Email</span>' +
          '</div>' +
          '<div class="keyshots-message keyshots-message-error" style="margin-bottom: 24px;">' +
            '<span class="keyshots-message-icon">⚠</span>' +
            '<span class="keyshots-message-text">Gmail API not configured. Please add your OAuth Client ID to manifest.json.</span>' +
          '</div>' +
          '<div class="keyshots-form-actions">' +
            '<button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-gmail-back-btn">Back</button>' +
          '</div>' +
        '</div>';
      
      document.getElementById('keyshots-gmail-back')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
      document.getElementById('keyshots-gmail-back-btn')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
      return;
    }
    
    content.innerHTML = 
      '<form class="keyshots-form" id="keyshots-gmail-form">' +
        '<div class="keyshots-form-title">' +
          '<button type="button" class="keyshots-back-btn" id="keyshots-gmail-back">' + this.getBackIcon() + '</button>' +
          '<span class="keyshots-command-icon">' + this.getIcon() + '</span>' +
          '<span>Send Email</span>' +
        '</div>' +
        
        '<div class="keyshots-form-group">' +
          '<label class="keyshots-form-label">Recipient</label>' +
          '<input type="email" id="keyshots-gmail-to" class="keyshots-form-input" placeholder="name@example.com" required />' +
        '</div>' +
        
        '<div class="keyshots-form-group">' +
          '<label class="keyshots-form-label">Subject</label>' +
          '<input type="text" id="keyshots-gmail-subject" class="keyshots-form-input" placeholder="What\'s this about?" required />' +
        '</div>' +
        
        '<div class="keyshots-form-group">' +
          '<label class="keyshots-form-label">Message</label>' +
          '<textarea id="keyshots-gmail-body" class="keyshots-form-textarea" placeholder="Write your message here..."></textarea>' +
        '</div>' +
        
        '<div class="keyshots-form-actions">' +
          '<button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-gmail-cancel">Cancel</button>' +
          '<button type="submit" class="keyshots-btn keyshots-btn-primary" id="keyshots-gmail-submit">Send Email<span class="keyshots-kbd">⌘↵</span></button>' +
        '</div>' +
      '</form>';
    
    this.setupEventListeners();
    
    setTimeout(() => {
      document.getElementById('keyshots-gmail-to')?.focus();
    }, 50);
  },

  async checkGmailConfigured() {
    // Check if the Gmail API is configured via background script
    return await KeyshotsGmailAPI.isConfigured();
  },

  setupEventListeners() {
    const form = document.getElementById('keyshots-gmail-form');
    const backBtn = document.getElementById('keyshots-gmail-back');
    const cancelBtn = document.getElementById('keyshots-gmail-cancel');
    
    backBtn?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    cancelBtn?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  },

  async handleSubmit() {
    const to = document.getElementById('keyshots-gmail-to')?.value.trim();
    const subject = document.getElementById('keyshots-gmail-subject')?.value.trim();
    const body = document.getElementById('keyshots-gmail-body')?.value.trim();
    const submitBtn = document.getElementById('keyshots-gmail-submit');
    
    if (!to) {
      this.showError('Please enter a recipient email address');
      return;
    }
    
    if (!this.isValidEmail(to)) {
      this.showError('Please enter a valid email address');
      return;
    }
    
    if (!subject) {
      this.showError('Please enter a subject');
      return;
    }

    // Disable button and show loading
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
    }

    // Send via Gmail API
    try {
      const result = await KeyshotsGmailAPI.sendEmail(to, subject, body || '');
      
      if (result.success) {
        this.storeRecentEmail(to);
        KeyshotsOverlay.showMessage('success', 'Email sent successfully!');
      } else {
        // Re-enable button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Send Email<span class="keyshots-kbd">⌘↵</span>';
        }
        this.showError(result.error || 'Failed to send email');
      }
    } catch (error) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Email<span class="keyshots-kbd">⌘↵</span>';
      }
      this.showError(error.message || 'Failed to send email');
    }
  },

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  async storeRecentEmail(email) {
    try {
      const recentEmails = await KeyshotsStorage.get(KeyshotsStorage.KEYS.RECENT_EMAILS) || [];
      const updated = [email, ...recentEmails.filter(e => e !== email)].slice(0, 10);
      await KeyshotsStorage.set(KeyshotsStorage.KEYS.RECENT_EMAILS, updated);
    } catch (error) {
      console.log('Keyshots: Could not store recent email', error);
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
