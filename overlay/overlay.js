// Keyshots Overlay Manager
// Handles view state, keyboard navigation, and component rendering

const KeyshotsOverlay = {
  currentView: 'command-palette',
  selectedIndex: 0,

  init() {
    this.setupKeyboardHandlers();
  },

  setupKeyboardHandlers() {
    document.addEventListener('keydown', (e) => {
      const overlay = document.getElementById('keyshots-overlay');
      if (!overlay || overlay.classList.contains('keyshots-hidden')) {
        return;
      }

      // Escape to close or go back
      if (e.key === 'Escape') {
        e.preventDefault();
        if (this.currentView === 'command-palette') {
          window.KeyshotsApp.hide();
        } else {
          this.showCommandPalette();
        }
        return;
      }

      // Handle command palette navigation
      if (this.currentView === 'command-palette') {
        this.handleCommandPaletteKeys(e);
      }

      // Handle Cmd+Enter for form submission
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        const submitBtn = document.querySelector('.keyshots-btn-primary:not(:disabled)');
        if (submitBtn) {
          e.preventDefault();
          submitBtn.click();
        }
      }
    });
  },

  handleCommandPaletteKeys(e) {
    const items = document.querySelectorAll('.keyshots-command-item');
    if (items.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.selectedIndex = Math.min(this.selectedIndex + 1, items.length - 1);
      this.updateSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
      this.updateSelection(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const activeItem = items[this.selectedIndex];
      if (activeItem) {
        activeItem.click();
      }
    }
  },

  updateSelection(items) {
    items.forEach((item, index) => {
      if (index === this.selectedIndex) {
        item.classList.add('keyshots-active');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('keyshots-active');
      }
    });
  },

  showCommandPalette() {
    this.currentView = 'command-palette';
    this.selectedIndex = 0;
    
    const header = document.getElementById('keyshots-header');
    const content = document.getElementById('keyshots-content');
    const search = document.getElementById('keyshots-search');
    
    if (header) header.style.display = 'block';
    if (search) {
      search.value = '';
      search.placeholder = 'Search actions...';
      search.focus();
    }
    
    if (typeof KeyshotsCommandPalette !== 'undefined') {
      KeyshotsCommandPalette.render();
    }
  },

  showView(viewName, options = {}) {
    this.currentView = viewName;
    
    const header = document.getElementById('keyshots-header');
    const footer = document.getElementById('keyshots-footer');
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    
    switch (viewName) {
      case 'gmail':
        if (typeof KeyshotsGmailForm !== 'undefined') {
          KeyshotsGmailForm.render();
        }
        break;
      case 'slack':
        if (typeof KeyshotsSlackForm !== 'undefined') {
          KeyshotsSlackForm.render();
        }
        break;
      case 'notion':
        if (typeof KeyshotsNotionForm !== 'undefined') {
          KeyshotsNotionForm.render();
        }
        break;
      case 'settings':
        if (typeof KeyshotsSettings !== 'undefined') {
          KeyshotsSettings.render();
        }
        break;
      // Smart AI-powered views
      case 'smart-email':
        if (typeof KeyshotsSmartEmailForm !== 'undefined') {
          KeyshotsSmartEmailForm.render(options);
        }
        break;
      case 'smart-slack':
        if (typeof KeyshotsSmartSlackForm !== 'undefined') {
          KeyshotsSmartSlackForm.render(options);
        }
        break;
      case 'smart-tasks':
        if (typeof KeyshotsExtractTasksForm !== 'undefined') {
          KeyshotsExtractTasksForm.render(options);
        }
        break;
    }
  },

  showMessage(type, message) {
    const content = document.getElementById('keyshots-content');
    const footer = document.getElementById('keyshots-footer');
    const icon = type === 'success' ? '✓' : '✕';
    
    if (footer) footer.style.display = 'none';
    
    content.innerHTML = `
      <div style="padding: 24px 16px; text-align: center;">
        <div class="keyshots-message keyshots-message-${type}" style="display: inline-flex; margin: 0 auto;">
          <span class="keyshots-message-icon">${icon}</span>
          <span class="keyshots-message-text">${message}</span>
        </div>
      </div>
    `;
    
    // Auto-close on success
    if (type === 'success') {
      setTimeout(() => {
        window.KeyshotsApp.hide();
      }, 1200);
    }
  },

  showLoading(text = 'Loading...') {
    const content = document.getElementById('keyshots-content');
    const footer = document.getElementById('keyshots-footer');
    
    if (footer) footer.style.display = 'none';
    
    content.innerHTML = `
      <div class="keyshots-loading">
        <div class="keyshots-spinner"></div>
        <span class="keyshots-loading-text">${text}</span>
      </div>
    `;
  }
};
