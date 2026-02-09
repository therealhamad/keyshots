// Keyshots Smart Slack Form
// AI-powered Slack message composition with summarization

const KeyshotsSmartSlackForm = {
  context: null,

  getBackIcon() {
    return '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 3L5 7L9 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  },

  getIcon() {
    return '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#5856D6"/><path d="M16 6L18.5 13.5L26 16L18.5 18.5L16 26L13.5 18.5L6 16L13.5 13.5L16 6Z" fill="white"/></svg>';
  },

  async render(options = {}) {
    this.context = options.context || KeyshotsContext.detect();
    
    const title = this.context.hasSelection ? 'Share to Slack' : 'Summarize for Slack';
    
    // Show loading state
    KeyshotsUI.showLoadingState(title, [
      'Reading content',
      'Extracting key points',
      'Formatting for Slack'
    ]);
    
    try {
      // Check if Gemini is configured
      const apiKey = await KeyshotsStorage.get('gemini_api_key');
      if (!apiKey) {
        KeyshotsUI.showError('Gemini API key not configured. Please add it in Settings.');
        return;
      }
      
      // Check if Slack is configured
      const slackWebhook = await KeyshotsStorage.get(KeyshotsStorage.KEYS.SLACK_WEBHOOK);
      if (!slackWebhook) {
        KeyshotsUI.showError('Slack webhook not configured. Please add it in Settings.');
        return;
      }
      
      // Generate Slack summary with AI
      const slackData = await KeyshotsGemini.generateSlackSummary(this.context);
      
      KeyshotsUI.clearLoadingState();
      
      // Render form with AI-generated content
      this.renderForm(slackData, title);
      
    } catch (error) {
      console.error('Keyshots: Failed to generate Slack summary:', error);
      KeyshotsUI.showError('Failed to generate summary: ' + (error.message || 'Unknown error'));
    }
  },

  renderForm(slackData, title) {
    const content = document.getElementById('keyshots-content');
    const footer = document.getElementById('keyshots-footer');
    
    if (footer) footer.style.display = 'none';
    
    const suggestedChannel = slackData.suggestedChannel || 'general';
    
    content.innerHTML = `
      <form class="keyshots-form" id="keyshots-smart-slack-form">
        <div class="keyshots-form-title">
          <button type="button" class="keyshots-back-btn" id="keyshots-smart-slack-back">${this.getBackIcon()}</button>
          <span class="keyshots-command-icon">${this.getIcon()}</span>
          <span>${title}</span>
        </div>
        
        <div class="keyshots-form-group">
          <label class="keyshots-form-label">
            Channel
            <span class="keyshots-ai-badge">✨ Suggested</span>
          </label>
          <input type="text" id="keyshots-smart-slack-channel" class="keyshots-form-input" value="#${this.escapeHtml(suggestedChannel)}" placeholder="#general" />
          <div class="keyshots-form-hint">For display purposes - message goes to configured webhook</div>
        </div>
        
        <div class="keyshots-form-group">
          <label class="keyshots-form-label">
            Message
            <span class="keyshots-ai-badge">✨ AI Generated</span>
          </label>
          <textarea id="keyshots-smart-slack-message" class="keyshots-form-textarea" required>${this.escapeHtml(slackData.message)}</textarea>
        </div>
        
        <div class="keyshots-form-actions">
          <button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-smart-slack-cancel">Cancel</button>
          <button type="submit" class="keyshots-btn keyshots-btn-primary" id="keyshots-smart-slack-submit">Post to Slack<span class="keyshots-kbd">⌘↵</span></button>
        </div>
      </form>
    `;
    
    this.setupEventListeners();
    
    // Focus message field
    setTimeout(() => {
      document.getElementById('keyshots-smart-slack-message')?.focus();
    }, 50);
  },

  setupEventListeners() {
    document.getElementById('keyshots-smart-slack-back')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    document.getElementById('keyshots-smart-slack-cancel')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    document.getElementById('keyshots-smart-slack-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  },

  async handleSubmit() {
    const message = document.getElementById('keyshots-smart-slack-message')?.value.trim();
    const submitBtn = document.getElementById('keyshots-smart-slack-submit');
    
    if (!message) {
      this.showError('Please enter a message');
      return;
    }
    
    // Disable button and show loading
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Posting...';
    }
    
    try {
      // Use Slack API to send
      const result = await KeyshotsAPI.sendSlackMessage(message);
      
      if (result.success) {
        KeyshotsUI.showSuccess('Posted to Slack!');
      } else {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Post to Slack<span class="keyshots-kbd">⌘↵</span>';
        }
        this.showError(result.error || 'Failed to post to Slack');
      }
    } catch (error) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Post to Slack<span class="keyshots-kbd">⌘↵</span>';
      }
      this.showError(error.message || 'Failed to post to Slack');
    }
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
