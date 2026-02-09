// Keyshots UI Helpers
// Shared loading states, error messages, and success messages

const KeyshotsUI = {
  showLoadingState(title, steps) {
    const content = document.getElementById('keyshots-content');
    const footer = document.getElementById('keyshots-footer');
    const header = document.getElementById('keyshots-header');
    
    if (footer) footer.style.display = 'none';
    if (header) header.style.display = 'none';
    
    let stepsHtml = steps.map((step, index) => {
      const status = index === 0 ? 'keyshots-step-active' : '';
      const icon = index === 0 ? '⚡' : '○';
      return `
        <div class="keyshots-loading-step ${status}" data-step="${index}">
          <span class="keyshots-loading-step-icon">${icon}</span>
          <span>${step}</span>
        </div>
      `;
    }).join('');
    
    content.innerHTML = `
      <div class="keyshots-loading-overlay">
        <div class="keyshots-loading-title">✨ ${title}</div>
        <div class="keyshots-loading-steps">
          ${stepsHtml}
        </div>
        <div class="keyshots-spinner"></div>
      </div>
    `;
    
    // Animate steps
    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length - 1) {
        const stepElements = document.querySelectorAll('.keyshots-loading-step');
        if (stepElements[currentStep]) {
          stepElements[currentStep].classList.remove('keyshots-step-active');
          stepElements[currentStep].classList.add('keyshots-step-complete');
          stepElements[currentStep].querySelector('.keyshots-loading-step-icon').textContent = '✓';
        }
        
        currentStep++;
        if (stepElements[currentStep]) {
          stepElements[currentStep].classList.add('keyshots-step-active');
          stepElements[currentStep].querySelector('.keyshots-loading-step-icon').textContent = '⚡';
        }
      } else {
        clearInterval(interval);
      }
    }, 700);
    
    // Store interval so it can be cleared
    this.loadingInterval = interval;
    
    return interval;
  },

  clearLoadingState() {
    if (this.loadingInterval) {
      clearInterval(this.loadingInterval);
      this.loadingInterval = null;
    }
  },

  showError(message, showBackButton = true) {
    this.clearLoadingState();
    const content = document.getElementById('keyshots-content');
    const footer = document.getElementById('keyshots-footer');
    
    if (footer) footer.style.display = 'none';
    
    content.innerHTML = `
      <div class="keyshots-message-container keyshots-message-error-container">
        <div class="keyshots-message-icon-large">✕</div>
        <div class="keyshots-message-title">${message}</div>
        ${showBackButton ? '<button class="keyshots-btn keyshots-btn-secondary" id="keyshots-error-back">Go Back</button>' : ''}
      </div>
    `;
    
    document.getElementById('keyshots-error-back')?.addEventListener('click', () => {
      KeyshotsOverlay.showCommandPalette();
    });
  },

  showSuccess(message, autoClose = true) {
    this.clearLoadingState();
    const content = document.getElementById('keyshots-content');
    const footer = document.getElementById('keyshots-footer');
    
    if (footer) footer.style.display = 'none';
    
    content.innerHTML = `
      <div class="keyshots-message-container keyshots-message-success-container">
        <div class="keyshots-message-icon-large">✓</div>
        <div class="keyshots-message-title">${message}</div>
      </div>
    `;
    
    if (autoClose) {
      setTimeout(() => {
        window.KeyshotsApp.hide();
      }, 1500);
    }
  }
};
