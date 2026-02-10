// Keyshots Activity Fetcher
// Fetches activity data from GitHub and Notion for standup generation

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
   * Fetch all activity from all configured sources
   */
  async fetchAllActivity() {
    const githubToken = await KeyshotsStorage.get('github_token');
    const githubUsername = await KeyshotsStorage.get('github_username');
    const notionToken = await KeyshotsStorage.get(KeyshotsStorage.KEYS.NOTION_TOKEN);

    const results = {
      commits: [],
      tasks: [],
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

    return results;
  }
};
