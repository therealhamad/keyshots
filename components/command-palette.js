// Keyshots Command Palette
// Renders and manages the searchable command list with smart context-aware actions

const KeyshotsCommandPalette = {
  // Store current context and all commands for filtering
  currentContext: null,
  allCommands: [],

  // SVG icons for apps
  getIcon(type) {
    const icons = {
      gmail: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#EA4335"/><path d="M8 11L16 17L24 11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="6" y="9" width="20" height="14" rx="2" stroke="white" stroke-width="2"/></svg>',
      
      slack: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#4A154B"/><path d="M13 8C13 9.1 12.1 10 11 10C9.9 10 9 9.1 9 8C9 6.9 9.9 6 11 6C12.1 6 13 6.9 13 8Z" fill="#E01E5A"/><path d="M11 10H13V14H11C9.9 14 9 13.1 9 12V10Z" fill="#E01E5A"/><path d="M24 13C22.9 13 22 12.1 22 11C22 9.9 22.9 9 24 9C25.1 9 26 9.9 26 11C26 12.1 25.1 13 24 13Z" fill="#36C5F0"/><path d="M22 11V13H18V11C18 9.9 18.9 9 20 9H22Z" fill="#36C5F0"/><path d="M19 24C19 22.9 19.9 22 21 22C22.1 22 23 22.9 23 24C23 25.1 22.1 26 21 26C19.9 26 19 25.1 19 24Z" fill="#2EB67D"/><path d="M21 22H19V18H21C22.1 18 23 18.9 23 20V22Z" fill="#2EB67D"/><path d="M8 19C9.1 19 10 19.9 10 21C10 22.1 9.1 23 8 23C6.9 23 6 22.1 6 21C6 19.9 6.9 19 8 19Z" fill="#ECB22E"/><path d="M10 21V19H14V21C14 22.1 13.1 23 12 23H10Z" fill="#ECB22E"/></svg>',
      
      notion: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="white"/><path d="M9 7L12 6.5L23 5.5L24 6V23L22 25L10 25.5L8 24V9L9 7Z" fill="white" stroke="black" stroke-width="1.5"/><path d="M10 9V23L21 22.5V8L10 9Z" stroke="black" stroke-width="1.5"/><line x1="12" y1="12" x2="18" y2="12" stroke="black" stroke-width="1.2" stroke-linecap="round"/><line x1="12" y1="15" x2="18" y2="15" stroke="black" stroke-width="1.2" stroke-linecap="round"/><line x1="12" y1="18" x2="15" y2="18" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg>',
      
      settings: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#636366"/><circle cx="16" cy="16" r="4" stroke="white" stroke-width="2"/><path d="M16 6V9M16 23V26M6 16H9M23 16H26M9.17 9.17L11.29 11.29M20.71 20.71L22.83 22.83M9.17 22.83L11.29 20.71M20.71 11.29L22.83 9.17" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>',

      smart: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#5856D6"/><path d="M16 6L18.5 13.5L26 16L18.5 18.5L16 26L13.5 18.5L6 16L13.5 13.5L16 6Z" fill="white"/></svg>',

      tasks: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#34C759"/><path d="M10 16L14 20L22 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',

      standup: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#5856D6"/><path d="M10 12H22M10 16H22M10 20H18" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>'
    };
    return icons[type] || icons.settings;
  },

  // Base commands (always available)
  baseCommands: [
    {
      id: 'generate-standup',
      name: 'Generate Standup Update',
      description: 'Auto-create from your recent activity',
      iconType: 'standup',
      type: 'Smart',
      badge: '✨',
      keywords: ['standup', 'update', 'daily', 'status', 'report', 'morning', 'sync'],
      category: 'Smart Actions',
      action: () => KeyshotsOverlay.showView('standup')
    },
    {
      id: 'send-gmail',
      name: 'Send Email',
      description: 'Gmail',
      iconType: 'gmail',
      type: 'Action',
      keywords: ['email', 'mail', 'gmail', 'send', 'message', 'compose'],
      category: 'Actions',
      action: () => KeyshotsOverlay.showView('gmail')
    },
    {
      id: 'send-slack',
      name: 'Send Message',
      description: 'Slack',
      iconType: 'slack',
      type: 'Action',
      keywords: ['slack', 'message', 'chat', 'send', 'channel', 'dm'],
      category: 'Actions',
      action: () => KeyshotsOverlay.showView('slack')
    },
    {
      id: 'create-notion',
      name: 'Create Page',
      description: 'Notion',
      iconType: 'notion',
      type: 'Action',
      keywords: ['notion', 'page', 'note', 'create', 'document', 'new'],
      category: 'Actions',
      action: () => KeyshotsOverlay.showView('notion')
    },
    {
      id: 'settings',
      name: 'Settings',
      description: 'Keyshots',
      iconType: 'settings',
      type: 'Command',
      keywords: ['settings', 'config', 'preferences', 'setup', 'api', 'configure'],
      category: 'System',
      action: () => KeyshotsOverlay.showView('settings')
    }
  ],

  // Get smart commands based on current context
  getSmartCommands(context) {
    const smartCommands = [];
    
    if (context.hasSelection) {
      // Text is selected - offer quote/share actions
      smartCommands.push({
        id: 'smart-email-quote',
        name: 'Email This Quote',
        description: 'Share selected text via email',
        iconType: 'smart',
        type: 'Smart',
        badge: '✨',
        keywords: ['email', 'quote', 'share', 'selected', 'smart'],
        category: 'Smart Actions',
        action: () => KeyshotsOverlay.showView('smart-email', { context, type: 'quote' })
      });

      smartCommands.push({
        id: 'smart-slack-quote',
        name: 'Share to Slack',
        description: 'Post selected text to Slack',
        iconType: 'smart',
        type: 'Smart',
        badge: '✨',
        keywords: ['slack', 'share', 'quote', 'smart'],
        category: 'Smart Actions',
        action: () => KeyshotsOverlay.showView('smart-slack', { context })
      });

      // Check if selected text looks like tasks
      if (context.hasSelection && KeyshotsContext.hasTaskLikeContent()) {
        smartCommands.push({
          id: 'smart-extract-tasks',
          name: 'Extract Tasks',
          description: 'Find action items in selection',
          iconType: 'tasks',
          type: 'Smart',
          badge: '✨',
          keywords: ['tasks', 'extract', 'todo', 'action', 'smart'],
          category: 'Smart Actions',
          action: () => KeyshotsOverlay.showView('smart-tasks', { context })
        });
      }
    } else if (context.isArticle) {
      // On an article page - offer summarization actions
      smartCommands.push({
        id: 'smart-email-page',
        name: 'Email This Page',
        description: 'Share this article via email',
        iconType: 'smart',
        type: 'Smart',
        badge: '✨',
        keywords: ['email', 'article', 'page', 'share', 'smart'],
        category: 'Smart Actions',
        action: () => KeyshotsOverlay.showView('smart-email', { context, type: 'page' })
      });

      smartCommands.push({
        id: 'smart-slack-summarize',
        name: 'Summarize for Slack',
        description: 'Share article summary to Slack',
        iconType: 'smart',
        type: 'Smart',
        badge: '✨',
        keywords: ['slack', 'summarize', 'article', 'smart'],
        category: 'Smart Actions',
        action: () => KeyshotsOverlay.showView('smart-slack', { context })
      });
    }

    return smartCommands;
  },

  // Build all commands including smart ones
  buildCommands() {
    // Detect current context
    this.currentContext = typeof KeyshotsContext !== 'undefined' ? KeyshotsContext.detect() : null;
    
    // Get smart commands based on context
    const smartCommands = this.currentContext ? this.getSmartCommands(this.currentContext) : [];
    
    // Combine smart + base commands
    this.allCommands = [...smartCommands, ...this.baseCommands];
    
    // Legacy compatibility
    this.commands = this.allCommands;
    
    return this.allCommands;
  },

  render(filterText = '') {
    const content = document.getElementById('keyshots-content');
    const footer = document.getElementById('keyshots-footer');
    
    // Build commands fresh each render to get current context
    this.buildCommands();
    
    const filteredCommands = this.filterCommands(filterText);
    
    if (footer) footer.style.display = 'flex';
    
    if (filteredCommands.length === 0) {
      content.innerHTML = '<div class="keyshots-empty">No actions found for "' + this.escapeHtml(filterText) + '"</div>';
      return;
    }

    // Show context indicator if there's a selection
    let html = '';
    
    if (this.currentContext?.hasSelection && !filterText) {
      const preview = this.currentContext.selectedText.substring(0, 60) + 
        (this.currentContext.selectedText.length > 60 ? '...' : '');
      html += '<div class="keyshots-context-indicator">' +
        '<span class="keyshots-context-icon">📝</span>' +
        '<span class="keyshots-context-text">Text selected (' + this.currentContext.selectedText.length + ' chars)</span>' +
        '<div class="keyshots-context-preview">"' + this.escapeHtml(preview) + '"</div>' +
      '</div>';
    } else if (this.currentContext?.isArticle && !filterText) {
      html += '<div class="keyshots-context-indicator">' +
        '<span class="keyshots-context-icon">📄</span>' +
        '<span class="keyshots-context-text">Article detected (' + this.currentContext.wordCount + ' words)</span>' +
      '</div>';
    }

    const grouped = this.groupByCategory(filteredCommands);
    let globalIndex = 0;
    
    for (const [category, commands] of Object.entries(grouped)) {
      html += '<div class="keyshots-section-header">' + category + '</div>';
      html += '<ul class="keyshots-command-list">';
      
      commands.forEach((cmd) => {
        const activeClass = globalIndex === 0 ? ' keyshots-active' : '';
        html += '<li class="keyshots-command-item' + activeClass + '" data-command-id="' + cmd.id + '" data-index="' + globalIndex + '">';
        html += '<span class="keyshots-command-icon">' + this.getIcon(cmd.iconType) + '</span>';
        html += '<div class="keyshots-command-info">';
        html += '<div class="keyshots-command-name">' + cmd.name;
        if (cmd.badge) {
          html += '<span class="keyshots-command-badge">' + cmd.badge + '</span>';
        }
        html += '</div>';
        html += '<div class="keyshots-command-description">' + cmd.description + '</div>';
        html += '</div>';
        html += '<span class="keyshots-command-type">' + cmd.type + '</span>';
        html += '</li>';
        globalIndex++;
      });
      
      html += '</ul>';
    }

    content.innerHTML = html;
    
    // Add click handlers
    const items = content.querySelectorAll('.keyshots-command-item');
    items.forEach((item) => {
      item.addEventListener('click', () => {
        const commandId = item.dataset.commandId;
        const command = this.allCommands.find(c => c.id === commandId);
        if (command) {
          command.action();
        }
      });

      item.addEventListener('mouseenter', () => {
        items.forEach(i => i.classList.remove('keyshots-active'));
        item.classList.add('keyshots-active');
        KeyshotsOverlay.selectedIndex = parseInt(item.dataset.index) || 0;
      });
    });

    KeyshotsOverlay.selectedIndex = 0;
  },

  groupByCategory(commands) {
    const groups = {};
    commands.forEach(cmd => {
      const category = cmd.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(cmd);
    });
    return groups;
  },

  filterCommands(filterText) {
    if (!filterText.trim()) {
      return this.allCommands;
    }

    const searchTerm = filterText.toLowerCase().trim();
    
    return this.allCommands.filter(cmd => {
      const nameMatch = cmd.name.toLowerCase().includes(searchTerm);
      const descMatch = cmd.description.toLowerCase().includes(searchTerm);
      const keywordMatch = cmd.keywords.some(kw => kw.includes(searchTerm));
      return nameMatch || descMatch || keywordMatch;
    });
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  },

  init() {
    const search = document.getElementById('keyshots-search');
    if (search) {
      search.addEventListener('input', (e) => {
        if (KeyshotsOverlay.currentView === 'command-palette') {
          this.render(e.target.value);
        }
      });
    }
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => KeyshotsCommandPalette.init(), 100);
  });
} else {
  setTimeout(() => KeyshotsCommandPalette.init(), 100);
}
