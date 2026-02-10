// Keyshots Activity Fetcher
// Fetches activity data from GitHub, Notion, and Google Calendar for standup generation

const KeyshotsActivityFetcher = {
  /**
   * Fetch GitHub commits from last 24 hours
   */
  async fetchGitHubActivity(token, username) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'githubFetchActivity', token, username },
        (response) => {
          if (chrome.runtime.lastError) {
            resolve({ success: false, error: chrome.runtime.lastError.message, commits: [] });
          } else {
            resolve(response || { success: false, error: 'No response', commits: [] });
          }
        }
      );
    });
  },

  /**
   * Fetch Notion tasks completed/edited in last 24 hours
   */
  async fetchNotionActivity(token) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'notionFetchActivity', token },
        (response) => {
          if (chrome.runtime.lastError) {
            resolve({ success: false, error: chrome.runtime.lastError.message, tasks: [] });
          } else {
            resolve(response || { success: false, error: 'No response', tasks: [] });
          }
        }
      );
    });
  },

  /**
   * Fetch Google Calendar meetings from last 24 hours
   */
  async fetchCalendarActivity() {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(
        { action: 'calendarFetchActivity' },
        (response) => {
          if (chrome.runtime.lastError) {
            resolve({ success: false, error: chrome.runtime.lastError.message, meetings: [] });
          } else {
            resolve(response || { success: false, error: 'No response', meetings: [] });
          }
        }
      );
    });
  },

  /**
   * Fetch all activity from all configured sources
   */
  async fetchAllActivity() {
    const githubToken = await KeyshotsStorage.get('github_token');
    const githubUsername = await KeyshotsStorage.get('github_username');
    const notionToken = await KeyshotsStorage.get(KeyshotsStorage.KEYS.NOTION_TOKEN);
    const calendarConnected = await KeyshotsStorage.get('calendar_connected');

    const results = {
      commits: [],
      tasks: [],
      meetings: [],
      errors: []
    };

    // Fetch GitHub commits
    if (githubToken && githubUsername) {
      try {
        const ghResult = await this.fetchGitHubActivity(githubToken, githubUsername);
        if (ghResult.success) {
          results.commits = ghResult.commits || [];
        } else {
          results.errors.push({ source: 'GitHub', error: ghResult.error });
        }
      } catch (error) {
        results.errors.push({ source: 'GitHub', error: error.message });
      }
    }

    // Fetch Notion tasks
    if (notionToken) {
      try {
        const notionResult = await this.fetchNotionActivity(notionToken);
        if (notionResult.success) {
          results.tasks = notionResult.tasks || [];
        } else {
          results.errors.push({ source: 'Notion', error: notionResult.error });
        }
      } catch (error) {
        results.errors.push({ source: 'Notion', error: error.message });
      }
    }

    // Fetch Google Calendar meetings
    if (calendarConnected) {
      try {
        const calResult = await this.fetchCalendarActivity();
        if (calResult.success) {
          results.meetings = calResult.meetings || [];
        } else {
          results.errors.push({ source: 'Google Calendar', error: calResult.error });
        }
      } catch (error) {
        results.errors.push({ source: 'Google Calendar', error: error.message });
      }
    }
    return results;
  }
};
