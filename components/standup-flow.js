// Keyshots Standup Flow
// Automated standup generator with GitHub, Notion, and Calendar integration

const KeyshotsStandupFlow = {
  // State for standup data
  standupData: {
    commits: [],
    tasks: [],
    meetings: [],
    blockers: '',
    selectedCommits: [],
    selectedTasks: [],
    selectedMeetings: []
  },

  getBackIcon() {
    return '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 3L5 7L9 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  },

  getIcon() {
    return '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="32" height="32" rx="7" fill="#5856D6"/><path d="M10 12H22M10 16H22M10 20H18" stroke="white" stroke-width="2" stroke-linecap="round"/></svg>';
  },

  async render() {
    // Start by fetching data
    await this.fetchStandupData();
  },

  async fetchStandupData() {
    const content = document.getElementById('keyshots-content');
    const footer = document.getElementById('keyshots-footer');
    const header = document.getElementById('keyshots-header');
    
    if (footer) footer.style.display = 'none';
    if (header) header.style.display = 'none';
    
    // Show loading state
    content.innerHTML = `
      <div class="keyshots-loading-overlay">
        <div class="keyshots-loading-title">📊 Generate Standup</div>
        <div class="keyshots-loading-steps">
          <div class="keyshots-loading-step keyshots-step-active" id="keyshots-step-github">
            <span class="keyshots-loading-step-icon">⚡</span>
            <span>Fetching GitHub commits (last 24h)</span>
          </div>
          <div class="keyshots-loading-step" id="keyshots-step-notion">
            <span class="keyshots-loading-step-icon">○</span>
            <span>Checking Notion tasks</span>
          </div>
          <div class="keyshots-loading-step" id="keyshots-step-calendar">
            <span class="keyshots-loading-step-icon">○</span>
            <span>Loading calendar events</span>
          </div>
        </div>
        <div class="keyshots-spinner"></div>
        <p style="color: rgba(255, 255, 255, 0.4); font-size: 13px; margin-top: 16px;">
          This may take a few seconds
        </p>
      </div>
    `;

    try {
      // Fetch all activity
      const activity = await KeyshotsActivityFetcher.fetchAllActivity();
      
      // Animate step completion - GitHub
      const stepGithub = document.getElementById('keyshots-step-github');
      if (stepGithub) {
        stepGithub.classList.remove('keyshots-step-active');
        stepGithub.classList.add('keyshots-step-complete');
        stepGithub.querySelector('.keyshots-loading-step-icon').textContent = '✓';
      }
      
      // Animate step - Notion
      const stepNotion = document.getElementById('keyshots-step-notion');
      if (stepNotion) {
        stepNotion.classList.add('keyshots-step-active');
        stepNotion.querySelector('.keyshots-loading-step-icon').textContent = '⚡';
      }
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      if (stepNotion) {
        stepNotion.classList.remove('keyshots-step-active');
        stepNotion.classList.add('keyshots-step-complete');
        stepNotion.querySelector('.keyshots-loading-step-icon').textContent = '✓';
      }

      // Animate step - Calendar
      const stepCalendar = document.getElementById('keyshots-step-calendar');
      if (stepCalendar) {
        stepCalendar.classList.add('keyshots-step-active');
        stepCalendar.querySelector('.keyshots-loading-step-icon').textContent = '⚡';
      }
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      if (stepCalendar) {
        stepCalendar.classList.remove('keyshots-step-active');
        stepCalendar.classList.add('keyshots-step-complete');
        stepCalendar.querySelector('.keyshots-loading-step-icon').textContent = '✓';
      }
      
      // Store data
      this.standupData.commits = activity.commits || [];
      this.standupData.tasks = activity.tasks || [];
      this.standupData.meetings = activity.meetings || [];
      
      // Pre-select all items
      this.standupData.selectedCommits = this.standupData.commits.map((_, i) => i);
      this.standupData.selectedTasks = this.standupData.tasks.map((_, i) => i);
      this.standupData.selectedMeetings = this.standupData.meetings.map((_, i) => i);
      
      // Check if we have any data
      const hasData = this.standupData.commits.length > 0 || this.standupData.tasks.length > 0 || this.standupData.meetings.length > 0;
      
      if (!hasData) {
        this.showNoActivityFound(activity.errors);
        return;
      }
      
      // Show activity review after a brief delay
      await new Promise(resolve => setTimeout(resolve, 400));
      this.showActivityReview();
      
    } catch (error) {
      console.error('Keyshots: Failed to fetch standup data:', error);
      KeyshotsUI.showError('Failed to fetch activity data. Please check your integration settings.');
    }
  },

  showNoActivityFound(errors = []) {
    const content = document.getElementById('keyshots-content');
    
    let errorHtml = '';
    if (errors.length > 0) {
      errorHtml = '<div class="keyshots-standup-errors">' +
        errors.map(e => '<div class="keyshots-standup-error-item">⚠️ ' + e.source + ': ' + e.error + '</div>').join('') +
      '</div>';
    }
    
    content.innerHTML = `
      <div class="keyshots-message-container">
        <div class="keyshots-message-icon-large">📭</div>
        <div class="keyshots-message-title">No activity found in the last 24 hours</div>
        ${errorHtml}
        <p style="color: rgba(255, 255, 255, 0.4); font-size: 13px; margin-bottom: 20px;">
          Make sure your GitHub and Notion are configured in Settings.
        </p>
        <div style="display: flex; gap: 12px;">
          <button class="keyshots-btn keyshots-btn-secondary" id="keyshots-standup-settings">Open Settings</button>
          <button class="keyshots-btn keyshots-btn-primary" id="keyshots-standup-back">Go Back</button>
        </div>
      </div>
    `;
    
    document.getElementById('keyshots-standup-back')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    document.getElementById('keyshots-standup-settings')?.addEventListener('click', () => KeyshotsOverlay.showView('settings'));
  },

  showActivityReview() {
    const content = document.getElementById('keyshots-content');
    const { commits, tasks, meetings } = this.standupData;
    
    let html = `
      <div class="keyshots-form">
        <div class="keyshots-form-title">
          <button type="button" class="keyshots-back-btn" id="keyshots-standup-back">${this.getBackIcon()}</button>
          <span class="keyshots-command-icon">${this.getIcon()}</span>
          <span>Generate Standup</span>
        </div>

        <div class="keyshots-standup-summary">
          Found activity from last 24 hours ✨
        </div>

        <div class="keyshots-standup-sections">
    `;

    // GitHub commits section
    if (commits.length > 0) {
      html += `
        <div class="keyshots-activity-section">
          <div class="keyshots-activity-section-header">
            <input type="checkbox" id="keyshots-toggle-commits" checked />
            <label for="keyshots-toggle-commits">
              <strong>GitHub</strong> (${commits.length} commit${commits.length !== 1 ? 's' : ''})
            </label>
          </div>
          <div class="keyshots-activity-items">
            ${commits.map((commit, index) => `
              <div class="keyshots-activity-item">
                <input type="checkbox" id="keyshots-commit-${index}" data-type="commits" data-index="${index}" checked />
                <label for="keyshots-commit-${index}">
                  <div class="keyshots-activity-item-title">${this.escapeHtml(commit.message)}</div>
                  <div class="keyshots-activity-item-meta">
                    ${commit.repo.split('/')[1] || commit.repo} • ${this.formatTime(commit.time)}
                  </div>
                </label>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Notion tasks section
    if (tasks.length > 0) {
      html += `
        <div class="keyshots-activity-section">
          <div class="keyshots-activity-section-header">
            <input type="checkbox" id="keyshots-toggle-tasks" checked />
            <label for="keyshots-toggle-tasks">
              <strong>Notion</strong> (${tasks.length} task${tasks.length !== 1 ? 's' : ''})
            </label>
          </div>
          <div class="keyshots-activity-items">
            ${tasks.map((task, index) => `
              <div class="keyshots-activity-item">
                <input type="checkbox" id="keyshots-task-${index}" data-type="tasks" data-index="${index}" checked />
                <label for="keyshots-task-${index}">
                  <div class="keyshots-activity-item-title">${this.escapeHtml(task.title)}</div>
                  <div class="keyshots-activity-item-meta">
                    ${task.status ? task.status + ' • ' : ''}${this.formatTime(task.lastEdited)}
                  </div>
                </label>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Google Calendar meetings section
    if (meetings.length > 0) {
      html += `
        <div class="keyshots-activity-section">
          <div class="keyshots-activity-section-header">
            <input type="checkbox" id="keyshots-toggle-meetings" checked />
            <label for="keyshots-toggle-meetings">
              <strong>Calendar</strong> (${meetings.length} meeting${meetings.length !== 1 ? 's' : ''})
            </label>
          </div>
          <div class="keyshots-activity-items">
            ${meetings.map((meeting, index) => `
              <div class="keyshots-activity-item">
                <input type="checkbox" id="keyshots-meeting-${index}" data-type="meetings" data-index="${index}" checked />
                <label for="keyshots-meeting-${index}">
                  <div class="keyshots-activity-item-title">${this.escapeHtml(meeting.summary)}</div>
                  <div class="keyshots-activity-item-meta">
                    ${this.formatMeetingTime(meeting.start)} • ${meeting.duration}min • ${meeting.attendees} attendees
                  </div>
                </label>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    html += `
        </div>

        <div class="keyshots-blockers-section">
          <label class="keyshots-blockers-label">
            <input type="checkbox" id="keyshots-include-blockers" />
            <span>Include blockers/challenges?</span>
          </label>
          <div id="keyshots-blockers-input-container" style="display: none; margin-top: 12px;">
            <textarea id="keyshots-blockers-input" class="keyshots-form-textarea" placeholder="Any blockers or challenges? (optional)" rows="3"></textarea>
          </div>
        </div>

        <div class="keyshots-form-actions">
          <button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-standup-cancel">Cancel</button>
          <button type="button" class="keyshots-btn keyshots-btn-primary" id="keyshots-standup-generate">Generate Update ✨</button>
        </div>
      </div>
    `;

    content.innerHTML = html;
    this.setupActivityReviewListeners();
  },

  setupActivityReviewListeners() {
    // Back/Cancel buttons
    document.getElementById('keyshots-standup-back')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    document.getElementById('keyshots-standup-cancel')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    
    // Generate button
    document.getElementById('keyshots-standup-generate')?.addEventListener('click', () => this.generateStandupMessage());
    
    // Toggle all checkboxes
    document.getElementById('keyshots-toggle-commits')?.addEventListener('change', (e) => {
      this.toggleAllItems('commits', e.target.checked);
    });
    document.getElementById('keyshots-toggle-tasks')?.addEventListener('change', (e) => {
      this.toggleAllItems('tasks', e.target.checked);
    });
    document.getElementById('keyshots-toggle-meetings')?.addEventListener('change', (e) => {
      this.toggleAllItems('meetings', e.target.checked);
    });
    
    // Individual checkboxes
    document.querySelectorAll('.keyshots-activity-item input[type="checkbox"]').forEach(checkbox => {
      checkbox.addEventListener('change', (e) => {
        const type = e.target.dataset.type;
        const index = parseInt(e.target.dataset.index);
        this.updateSelection(type, index, e.target.checked);
      });
    });
    
    // Blockers toggle
    document.getElementById('keyshots-include-blockers')?.addEventListener('change', (e) => {
      const container = document.getElementById('keyshots-blockers-input-container');
      if (container) {
        container.style.display = e.target.checked ? 'block' : 'none';
        if (e.target.checked) {
          document.getElementById('keyshots-blockers-input')?.focus();
        }
      }
    });
  },

  toggleAllItems(type, checked) {
    const keyMap = { commits: 'selectedCommits', tasks: 'selectedTasks', meetings: 'selectedMeetings' };
    const dataMap = { commits: this.standupData.commits, tasks: this.standupData.tasks, meetings: this.standupData.meetings };
    
    const key = keyMap[type];
    const items = dataMap[type];
    
    this.standupData[key] = checked ? items.map((_, i) => i) : [];
    
    document.querySelectorAll(`[data-type="${type}"]`).forEach(checkbox => {
      checkbox.checked = checked;
    });
  },

  updateSelection(type, index, checked) {
    const keyMap = { commits: 'selectedCommits', tasks: 'selectedTasks', meetings: 'selectedMeetings' };
    const key = keyMap[type];
    
    if (checked) {
      if (!this.standupData[key].includes(index)) {
        this.standupData[key].push(index);
      }
    } else {
      this.standupData[key] = this.standupData[key].filter(i => i !== index);
    }
  },

  async generateStandupMessage() {
    // Get blockers if included
    const includeBlockers = document.getElementById('keyshots-include-blockers')?.checked;
    if (includeBlockers) {
      this.standupData.blockers = document.getElementById('keyshots-blockers-input')?.value.trim() || '';
    } else {
      this.standupData.blockers = '';
    }

    // Show loading
    KeyshotsUI.showLoadingState('Generate Standup', [
      'Analyzing activity',
      'Formatting for Slack',
      'Adding context'
    ]);

    try {
      // Get Gemini API key
      const geminiApiKey = await KeyshotsStorage.get('gemini_api_key');
      
      if (!geminiApiKey) {
        KeyshotsUI.showError('Gemini API key not configured. Please add it in Settings.');
        return;
      }

      // Prepare selected data
      const selectedCommits = this.standupData.selectedCommits.map(i => this.standupData.commits[i]);
      const selectedTasks = this.standupData.selectedTasks.map(i => this.standupData.tasks[i]);
      const selectedMeetings = this.standupData.selectedMeetings.map(i => this.standupData.meetings[i]);

      // Generate standup with Gemini
      const standupMessage = await this.generateWithGemini(
        selectedCommits,
        selectedTasks,
        selectedMeetings,
        this.standupData.blockers
      );

      KeyshotsUI.clearLoadingState();
      
      // Show editable standup message
      this.showStandupEditor(standupMessage);

    } catch (error) {
      console.error('Keyshots: Failed to generate standup:', error);
      KeyshotsUI.showError('Failed to generate standup: ' + (error.message || 'Unknown error'));
    }
  },

  async generateWithGemini(commits, tasks, meetings, blockers) {
    const prompt = `
You are generating a daily standup update for Slack. Use a professional but friendly tone.

Data from last 24 hours:

${commits.length > 0 ? `GitHub Commits:\n${commits.map(c => `- ${c.message} (${c.repo.split('/')[1] || c.repo})`).join('\n')}\n` : ''}

${tasks.length > 0 ? `Notion Tasks:\n${tasks.map(t => `- ${t.title}${t.status ? ' (' + t.status + ')' : ''}`).join('\n')}\n` : ''}

${meetings.length > 0 ? `Meetings Attended:\n${meetings.map(m => `- ${m.summary} (${m.duration}min, ${m.attendees} attendees)`).join('\n')}\n` : ''}

${blockers ? `Blockers/Challenges:\n${blockers}\n` : ''}

Generate a standup update with these sections:
1. *Yesterday* 🗓️ - What was accomplished (combine commits + tasks, be specific but concise)
2. *Today* 📋 - What will be worked on (infer from yesterday's work + any unfinished items)
${meetings.length > 0 ? '3. *Meetings* 🤝 - Key meetings attended (keep concise, just meeting names)' : ''}
${blockers ? `${meetings.length > 0 ? '4' : '3'}. *Blockers* 🚧 - Challenges mentioned` : ''}

Requirements:
- Use Slack markdown formatting (*bold* for headers)
- Use bullet points (•) for items
- Add relevant emojis to section headers
- Keep each bullet concise (one line)
- Professional but conversational tone
- If commits are similar, group them intelligently
- Total length: under 250 words
- Do NOT add any preamble or explanation, ONLY return the standup message

Return ONLY the formatted standup message.
`;

    const response = await KeyshotsGemini.generateContent(prompt);
    return response.trim();
  },

  showStandupEditor(message) {
    const content = document.getElementById('keyshots-content');
    
    content.innerHTML = `
      <form class="keyshots-form" id="keyshots-standup-editor-form">
        <div class="keyshots-form-title">
          <button type="button" class="keyshots-back-btn" id="keyshots-standup-editor-back">${this.getBackIcon()}</button>
          <span class="keyshots-command-icon">${this.getIcon()}</span>
          <span>Generate Standup</span>
        </div>

        <div class="keyshots-form-group">
          <label class="keyshots-form-label">
            Standup Update
            <span class="keyshots-ai-badge">✨ AI Generated</span>
          </label>
          <textarea id="keyshots-standup-message" class="keyshots-form-textarea" style="min-height: 240px;" required>${this.escapeHtml(message)}</textarea>
          <div class="keyshots-form-hint">You can edit this message before posting</div>
        </div>

        <div class="keyshots-form-actions" style="justify-content: space-between;">
          <button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-standup-regenerate">✨ Regenerate</button>
          <div style="display: flex; gap: 12px;">
            <button type="button" class="keyshots-btn keyshots-btn-secondary" id="keyshots-standup-editor-cancel">Cancel</button>
            <button type="submit" class="keyshots-btn keyshots-btn-primary" id="keyshots-standup-post">Post to Slack<span class="keyshots-kbd">⌘↵</span></button>
          </div>
        </div>
      </form>
    `;

    // Event listeners
    document.getElementById('keyshots-standup-editor-back')?.addEventListener('click', () => this.showActivityReview());
    document.getElementById('keyshots-standup-editor-cancel')?.addEventListener('click', () => KeyshotsOverlay.showCommandPalette());
    document.getElementById('keyshots-standup-regenerate')?.addEventListener('click', () => this.generateStandupMessage());
    document.getElementById('keyshots-standup-editor-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleStandupSubmit();
    });

    // Focus message textarea
    document.getElementById('keyshots-standup-message')?.focus();
  },

  async handleStandupSubmit() {
    const message = document.getElementById('keyshots-standup-message')?.value.trim();
    const submitBtn = document.getElementById('keyshots-standup-post');
    
    if (!message) {
      return;
    }
    
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Posting...';
    }
    
    try {
      const result = await KeyshotsAPI.sendSlackMessage(message);
      
      if (result.success) {
        KeyshotsUI.showSuccess('Standup posted to Slack! 🎉');
      } else {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = 'Post to Slack<span class="keyshots-kbd">⌘↵</span>';
        }
        KeyshotsUI.showError(result.error || 'Failed to post to Slack');
      }
    } catch (error) {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Post to Slack<span class="keyshots-kbd">⌘↵</span>';
      }
      KeyshotsUI.showError(error.message || 'Failed to post to Slack');
    }
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '';
    return div.innerHTML;
  },

  formatTime(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      const diffMins = Math.floor((now - date) / (1000 * 60));
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  },

  formatMeetingTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  }
};
