// Keyshots Smart Email Form
// AI-powered email composition with context awareness

const KeyshotsSmartEmailForm = {
  context: null,
  type: 'page',

  getBackIcon() {
    return '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 3L5 7L9 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  },

  getIcon() {
    return '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#5856D6"/><path d="M16 6L18.5 13.5L26 16L18.5 18.5L16 26L13.5 18.5L6 16L13.5 13.5L16 6Z" fill="white"/></svg>';
  },

  async render(options = {}) {
    this.context = options.context || KeyshotsContext.detect();
    this.type = options.type || 'page';
    
    const title = this.type === 'quote' ? 'Email This Quote' : 'Email This Page';
    
    // Show loading state
    KeyshotsUI.showLoadingState(title, [
      'Reading content',
      'Writing subject line', 
      'Composing message'
    ]);
    
    try {
      // Check if Gemini is configured
      const apiKey = await KeyshotsStorage.get('gemini_api_key');
      if (!apiKey) {
        KeyshotsUI.showError('Gemini API key not configured. Please add it in Settings.');
        return;
      }
      
      // Generate email content with AI
      const emailData = await KeyshotsGemini.generateEmailFromContext(this.context);
      
      KeyshotsUI.clearLoadingState();
      
      // Render form with AI-generated content
      this.renderForm(emailData, title);
      
    } catch (error) {
      console.error('Keyshots: Failed to generate email:', error);
      KeyshotsUI.showError('Failed to generate email: ' + (error.message || 'Unknown error'));
    }
  },

  renderForm(emailData, title) {
    const content = document.getElementById('keyshots-content');
    const footer = document.getElementById('keyshots-footer');
    
    if (footer) footer.style.display = 'none';
    
    content.innerHTML = `
      <form class="keyshots-form" id="keyshots-smart-email-form">
        <div class="keyshots-form-title">
          <button type="button" class="keyshots-back-btn" id="keyshots-smart-email-back">${this.getBackIcon()}</button>
          <span class="keyshots-command-icon">${this.getIcon()}</span>
          <span>${title}</span>
        </div>
        
        <div class="keyshots-form-group">
          <label class="keyshots-form-label">Recipient</label>
          <input type="email" id="keyshots-smart-email-to" class="keyshots-form-input" placeholder="name@example.com" required />
        </div>
        
        <div class="keyshots-form-group">
          <label class="keyshots-form-label">
            Subject
            <span class="keyshots-ai-badge">✨ AI Generated</span>
          </label>
          <input type="text" id="keyshots-smart-email-subject" class="keyshots-form-input" value="${this.escapeHtml(emailData.subject)}" required />
        </div>
        
        <div class="keyshots-form-group">
          <label class="keyshots-form-label">
            Message
            <span class="keyshots-ai-badge">✨ AI Generated</span>
          </label>
          <textarea id="keyshots-smart-email-body" class="keyshots-form-textarea" required>${this.escapeHtml(emailData.body)}</textarea>
        </div>
        
        <div class="keyshots-form-actions">
          <button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-smart-email-cancel">Cancel</button>
          <button type="submit" class="keyshots-btn keyshots-btn-primary" id="keyshots-smart-email-submit">Send Email<span class="keyshots-kbd">⌘↵</span></button>
        </div>
      </form>
    `;
    
    this.setupEventListeners();
    
    // Focus recipient field
    setTimeout(() => {
      document.getElementById('keyshots-smart-email-to')?.focus();
    }, 50);
  },

  setupEventListeners() {
    document.getElementById('keyshots-smart-email-back')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    document.getElementById('keyshots-smart-email-cancel')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    document.getElementById('keyshots-smart-email-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  },

  async handleSubmit() {
    const to = document.getElementById('keyshots-smart-email-to')?.value.trim();
    const subject = document.getElementById('keyshots-smart-email-subject')?.value.trim();
    const body = document.getElementById('keyshots-smart-email-body')?.value.trim();
    const submitBtn = document.getElementById('keyshots-smart-email-submit');
    
    if (!to || !this.isValidEmail(to)) {
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
    
    try {
      // Use Gmail API to send
      const result = await KeyshotsGmailAPI.sendEmail(to, subject, body || '');
      
      if (result.success) {
        KeyshotsUI.showSuccess('Email sent successfully!');
      } else {
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

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
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
