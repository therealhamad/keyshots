// Keyshots Content Script
// Handles overlay injection and visibility management

(function() {
  'use strict';

  let overlayInjected = false;

  // Listen for messages from the background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleOverlay') {
      toggleOverlay();
    }
  });

  // Also listen for keyboard shortcut directly (backup)
  document.addEventListener('keydown', (e) => {
    // Option+Space on Mac, Ctrl+Shift+K on Windows/Linux
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const isOptionSpace = isMac && e.altKey && e.code === 'Space';
    const isCtrlShiftK = !isMac && e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'k';
    
    if (isOptionSpace || isCtrlShiftK) {
      e.preventDefault();
      toggleOverlay();
    }
  });

  function toggleOverlay() {
    if (!overlayInjected) {
      injectOverlay();
      overlayInjected = true;
    }
    
    const overlay = document.getElementById('keyshots-overlay');
    if (overlay) {
      const isHidden = overlay.classList.contains('keyshots-hidden');
      if (isHidden) {
        showOverlay();
      } else {
        hideOverlay();
      }
    }
  }

  function injectOverlay() {
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'keyshots-overlay';
    overlay.className = 'keyshots-hidden';
    
    overlay.innerHTML = `
      <div id="keyshots-backdrop"></div>
      <div id="keyshots-modal">
        <div id="keyshots-header">
          <input type="text" id="keyshots-search" placeholder="Search actions..." autocomplete="off" spellcheck="false" />
        </div>
        <div id="keyshots-content">
          <!-- Content rendered dynamically -->
        </div>
        <div id="keyshots-footer" class="keyshots-footer">
          <div class="keyshots-footer-action">
            <span>Open</span>
            <span class="keyshots-footer-key">↵</span>
          </div>
          <div class="keyshots-footer-action">
            <span class="keyshots-footer-key">↑</span>
            <span class="keyshots-footer-key">↓</span>
          </div>
          <div class="keyshots-footer-action">
            <span>Close</span>
            <span class="keyshots-footer-key">esc</span>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Set up event listeners
    const backdrop = document.getElementById('keyshots-backdrop');
    backdrop.addEventListener('click', hideOverlay);
    
    // Initialize the overlay manager
    if (typeof KeyshotsOverlay !== 'undefined') {
      KeyshotsOverlay.init();
    }
  }

  function showOverlay() {
    const overlay = document.getElementById('keyshots-overlay');
    if (overlay) {
      overlay.classList.remove('keyshots-hidden');
      
      // Reset to command palette view
      if (typeof KeyshotsOverlay !== 'undefined') {
        KeyshotsOverlay.showCommandPalette();
      }
      
      // Focus search input
      setTimeout(() => {
        const search = document.getElementById('keyshots-search');
        if (search) {
          search.value = '';
          search.focus();
        }
      }, 50);
    }
  }

  function hideOverlay() {
    const overlay = document.getElementById('keyshots-overlay');
    if (overlay) {
      overlay.classList.add('keyshots-hidden');
    }
  }

  // Expose functions globally for other components
  window.KeyshotsApp = {
    show: showOverlay,
    hide: hideOverlay,
    toggle: toggleOverlay
  };
})();
