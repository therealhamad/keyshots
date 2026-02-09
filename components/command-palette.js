// Keyshots Command Palette
// Renders and manages the searchable command list

const KeyshotsCommandPalette = {
  // SVG icons for apps - using simple inline data URLs for reliability
  getIcon(type) {
    const icons = {
      gmail: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#EA4335"/><path d="M8 11L16 17L24 11" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><rect x="6" y="9" width="20" height="14" rx="2" stroke="white" stroke-width="2"/></svg>',
      
      slack: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#4A154B"/><path d="M13 8C13 9.1 12.1 10 11 10C9.9 10 9 9.1 9 8C9 6.9 9.9 6 11 6C12.1 6 13 6.9 13 8Z" fill="#E01E5A"/><path d="M11 10H13V14H11C9.9 14 9 13.1 9 12V10Z" fill="#E01E5A"/><path d="M24 13C22.9 13 22 12.1 22 11C22 9.9 22.9 9 24 9C25.1 9 26 9.9 26 11C26 12.1 25.1 13 24 13Z" fill="#36C5F0"/><path d="M22 11V13H18V11C18 9.9 18.9 9 20 9H22Z" fill="#36C5F0"/><path d="M19 24C19 22.9 19.9 22 21 22C22.1 22 23 22.9 23 24C23 25.1 22.1 26 21 26C19.9 26 19 25.1 19 24Z" fill="#2EB67D"/><path d="M21 22H19V18H21C22.1 18 23 18.9 23 20V22Z" fill="#2EB67D"/><path d="M8 19C9.1 19 10 19.9 10 21C10 22.1 9.1 23 8 23C6.9 23 6 22.1 6 21C6 19.9 6.9 19 8 19Z" fill="#ECB22E"/><path d="M10 21V19H14V21C14 22.1 13.1 23 12 23H10Z" fill="#ECB22E"/></svg>',
      
      notion: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="white"/><path d="M9 7L12 6.5L23 5.5L24 6V23L22 25L10 25.5L8 24V9L9 7Z" fill="white" stroke="black" stroke-width="1.5"/><path d="M10 9V23L21 22.5V8L10 9Z" stroke="black" stroke-width="1.5"/><line x1="12" y1="12" x2="18" y2="12" stroke="black" stroke-width="1.2" stroke-linecap="round"/><line x1="12" y1="15" x2="18" y2="15" stroke="black" stroke-width="1.2" stroke-linecap="round"/><line x1="12" y1="18" x2="15" y2="18" stroke="black" stroke-width="1.2" stroke-linecap="round"/></svg>',
      
      settings: '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#636366"/><circle cx="16" cy="16" r="4" stroke="white" stroke-width="2"/><path d="M16 6V9M16 23V26M6 16H9M23 16H26M9.17 9.17L11.29 11.29M20.71 20.71L22.83 22.83M9.17 22.83L11.29 20.71M20.71 11.29L22.83 9.17" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>'
    };
    return icons[type] || icons.settings;
  },

  commands: [
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

  render(filterText = '') {
    const content = document.getElementById('keyshots-content');
    const footer = document.getElementById('keyshots-footer');
    const filteredCommands = this.filterCommands(filterText);
    
    if (footer) footer.style.display = 'flex';
    
    if (filteredCommands.length === 0) {
      content.innerHTML = '<div class="keyshots-empty">No actions found for "' + this.escapeHtml(filterText) + '"</div>';
      return;
    }

    const grouped = this.groupByCategory(filteredCommands);
    
    let html = '';
    let globalIndex = 0;
    
    for (const [category, commands] of Object.entries(grouped)) {
      html += '<div class="keyshots-section-header">' + category + '</div>';
      html += '<ul class="keyshots-command-list">';
      
      commands.forEach((cmd) => {
        const activeClass = globalIndex === 0 ? ' keyshots-active' : '';
        html += '<li class="keyshots-command-item' + activeClass + '" data-command-id="' + cmd.id + '" data-index="' + globalIndex + '">';
        html += '<span class="keyshots-command-icon">' + this.getIcon(cmd.iconType) + '</span>';
        html += '<div class="keyshots-command-info">';
        html += '<div class="keyshots-command-name">' + cmd.name + '</div>';
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
        const command = this.commands.find(c => c.id === commandId);
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
      return this.commands;
    }

    const searchTerm = filterText.toLowerCase().trim();
    
    return this.commands.filter(cmd => {
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
