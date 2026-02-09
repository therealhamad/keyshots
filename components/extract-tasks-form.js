// Keyshots Extract Tasks Form
// AI-powered task extraction from selected text

const KeyshotsExtractTasksForm = {
  context: null,
  tasks: [],
  selectedDestination: 'clipboard',

  getBackIcon() {
    return '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 3L5 7L9 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  },

  getIcon() {
    return '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#34C759"/><path d="M10 16L14 20L22 12" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  },

  async render(options = {}) {
    this.context = options.context || KeyshotsContext.detect();
    
    // Show loading state
    KeyshotsUI.showLoadingState('Extract Tasks', [
      'Analyzing text',
      'Identifying action items',
      'Assigning priorities'
    ]);
    
    try {
      // Check if Gemini is configured
      const apiKey = await KeyshotsStorage.get('gemini_api_key');
      if (!apiKey) {
        KeyshotsUI.showError('Gemini API key not configured. Please add it in Settings.');
        return;
      }
      
      // Check if there's selected text
      if (!this.context.hasSelection || !this.context.selectedText) {
        KeyshotsUI.showError('Please select some text first.');
        return;
      }
      
      // Extract tasks with AI
      this.tasks = await KeyshotsGemini.extractTasks(this.context.selectedText);
      
      KeyshotsUI.clearLoadingState();
      
      if (!this.tasks || this.tasks.length === 0) {
        KeyshotsUI.showError('No action items found in the selected text.');
        return;
      }
      
      // Render form with extracted tasks
      this.renderForm();
      
    } catch (error) {
      console.error('Keyshots: Failed to extract tasks:', error);
      KeyshotsUI.showError('Failed to extract tasks: ' + (error.message || 'Unknown error'));
    }
  },

  renderForm() {
    const content = document.getElementById('keyshots-content');
    const footer = document.getElementById('keyshots-footer');
    
    if (footer) footer.style.display = 'none';
    
    const tasksHtml = this.tasks.map((task, index) => {
      const priorityClass = `keyshots-priority-${task.priority}`;
      const priorityIcon = task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢';
      
      return `
        <div class="keyshots-task-item" data-task-index="${index}">
          <div class="keyshots-task-checkbox">
            <input type="checkbox" id="keyshots-task-${index}" checked />
          </div>
          <div class="keyshots-task-details">
            <div class="keyshots-task-title">${this.escapeHtml(task.task)}</div>
            <div class="keyshots-task-meta">
              <span class="keyshots-task-assignee">👤 ${this.escapeHtml(task.assignee)}</span>
              ${task.dueDate ? `<span class="keyshots-task-due">📅 ${task.dueDate}</span>` : ''}
              <span class="keyshots-task-priority ${priorityClass}">
                ${priorityIcon} ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </span>
            </div>
          </div>
        </div>
      `;
    }).join('');
    
    content.innerHTML = `
      <div class="keyshots-form" id="keyshots-extract-tasks-form">
        <div class="keyshots-form-title">
          <button type="button" class="keyshots-back-btn" id="keyshots-tasks-back">${this.getBackIcon()}</button>
          <span class="keyshots-command-icon">${this.getIcon()}</span>
          <span>Extract Tasks</span>
        </div>
        
        <div class="keyshots-tasks-summary">
          Found ${this.tasks.length} task${this.tasks.length !== 1 ? 's' : ''} ✨
        </div>
        
        <div class="keyshots-tasks-list">
          ${tasksHtml}
        </div>
        
        <div class="keyshots-form-group">
          <label class="keyshots-form-label">Save to</label>
          <div class="keyshots-destination-options">
            <button type="button" class="keyshots-destination-btn keyshots-destination-active" data-destination="clipboard">
              📋 Clipboard
            </button>
            <button type="button" class="keyshots-destination-btn" data-destination="notion">
              📝 Notion
            </button>
          </div>
        </div>
        
        <div class="keyshots-form-actions">
          <button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-tasks-cancel">Cancel</button>
          <button type="button" class="keyshots-btn keyshots-btn-primary" id="keyshots-tasks-create">Create Tasks<span class="keyshots-kbd">⌘↵</span></button>
        </div>
      </div>
    `;
    
    this.setupEventListeners();
  },

  setupEventListeners() {
    document.getElementById('keyshots-tasks-back')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    document.getElementById('keyshots-tasks-cancel')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    document.getElementById('keyshots-tasks-create')?.addEventListener('click', () => this.handleCreate());
    
    // Destination toggle
    document.querySelectorAll('.keyshots-destination-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.keyshots-destination-btn').forEach(b => b.classList.remove('keyshots-destination-active'));
        e.target.classList.add('keyshots-destination-active');
        this.selectedDestination = e.target.dataset.destination;
      });
    });
  },

  async handleCreate() {
    const selectedTasks = [];
    const createBtn = document.getElementById('keyshots-tasks-create');
    
    document.querySelectorAll('.keyshots-task-item').forEach((item, index) => {
      const checkbox = item.querySelector('input[type="checkbox"]');
      if (checkbox && checkbox.checked) {
        selectedTasks.push(this.tasks[index]);
      }
    });
    
    if (selectedTasks.length === 0) {
      this.showError('Please select at least one task.');
      return;
    }
    
    if (createBtn) {
      createBtn.disabled = true;
      createBtn.innerHTML = 'Creating...';
    }
    
    try {
      if (this.selectedDestination === 'clipboard') {
        await this.copyToClipboard(selectedTasks);
        KeyshotsUI.showSuccess(`${selectedTasks.length} task${selectedTasks.length !== 1 ? 's' : ''} copied to clipboard!`);
      } else if (this.selectedDestination === 'notion') {
        // Check if Notion is configured
        const notionToken = await KeyshotsStorage.get(KeyshotsStorage.KEYS.NOTION_TOKEN);
        if (!notionToken) {
          if (createBtn) {
            createBtn.disabled = false;
            createBtn.innerHTML = 'Create Tasks<span class="keyshots-kbd">⌘↵</span>';
          }
          this.showError('Notion not configured. Please add your token in Settings.');
          return;
        }
        
        // For now, copy to clipboard with Notion-friendly format
        await this.copyToClipboardForNotion(selectedTasks);
        KeyshotsUI.showSuccess(`${selectedTasks.length} task${selectedTasks.length !== 1 ? 's' : ''} copied! Paste into Notion.`);
      }
    } catch (error) {
      if (createBtn) {
        createBtn.disabled = false;
        createBtn.innerHTML = 'Create Tasks<span class="keyshots-kbd">⌘↵</span>';
      }
      this.showError(error.message || 'Failed to create tasks');
    }
  },

  async copyToClipboard(tasks) {
    const taskText = tasks.map(t => {
      let line = `☐ ${t.task}`;
      if (t.assignee && t.assignee !== 'Unassigned') {
        line += ` (@${t.assignee})`;
      }
      if (t.dueDate) {
        line += ` [Due: ${t.dueDate}]`;
      }
      line += ` [${t.priority.toUpperCase()}]`;
      return line;
    }).join('\n');
    
    await navigator.clipboard.writeText(taskText);
  },

  async copyToClipboardForNotion(tasks) {
    // Format for easy pasting into Notion
    const taskText = tasks.map(t => {
      let line = `- [ ] ${t.task}`;
      const meta = [];
      if (t.assignee && t.assignee !== 'Unassigned') {
        meta.push(`@${t.assignee}`);
      }
      if (t.dueDate) {
        meta.push(`📅 ${t.dueDate}`);
      }
      if (t.priority === 'high') {
        meta.push('🔴 High');
      } else if (t.priority === 'medium') {
        meta.push('🟡 Medium');
      }
      if (meta.length > 0) {
        line += ` (${meta.join(' | ')})`;
      }
      return line;
    }).join('\n');
    
    await navigator.clipboard.writeText(taskText);
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
