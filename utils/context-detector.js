// Keyshots Context Detector
// Detects page context for smart action suggestions

const KeyshotsContext = {
  detect() {
    const selectedText = window.getSelection().toString().trim();
    const pageTitle = document.title;
    const pageUrl = window.location.href;
    
    return {
      hasSelection: selectedText.length > 0,
      selectedText: selectedText,
      pageTitle: pageTitle,
      pageUrl: pageUrl,
      pageType: this.detectPageType(),
      isArticle: this.isArticlePage(),
      pageContent: this.extractMainContent(),
      wordCount: this.countWords()
    };
  },

  detectPageType() {
    const hostname = window.location.hostname;
    
    if (hostname.includes('github.com')) return 'github';
    if (hostname.includes('mail.google.com')) return 'gmail';
    if (hostname.includes('notion.so')) return 'notion';
    if (hostname.includes('slack.com')) return 'slack';
    if (hostname.includes('linkedin.com')) return 'linkedin';
    if (hostname.includes('twitter.com') || hostname.includes('x.com')) return 'twitter';
    if (hostname.includes('medium.com')) return 'medium';
    if (hostname.includes('dev.to')) return 'devto';
    if (hostname.includes('stackoverflow.com')) return 'stackoverflow';
    
    return 'general';
  },

  isArticlePage() {
    const wordCount = this.countWords();
    
    // Articles typically have more than 300 words
    if (wordCount > 300) {
      const hasArticleTag = document.querySelector('article') !== null;
      const hasMetaArticle = document.querySelector('meta[property="og:type"][content="article"]') !== null;
      
      if (hasArticleTag || hasMetaArticle) {
        return true;
      }
      
      // Check for common article class names
      const articleIndicators = ['article', 'post', 'entry', 'content', 'story', 'blog'];
      const bodyClasses = document.body.className.toLowerCase();
      
      return articleIndicators.some(indicator => bodyClasses.includes(indicator));
    }
    
    return false;
  },

  extractMainContent() {
    // Try to get the main content of the page
    // Priority: selected text > <article> > <main> > largest text block
    
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 50) {
      return selectedText.substring(0, 3000);
    }
    
    const article = document.querySelector('article');
    if (article) {
      return this.cleanText(article.innerText).substring(0, 3000);
    }
    
    const main = document.querySelector('main');
    if (main) {
      return this.cleanText(main.innerText).substring(0, 3000);
    }
    
    // Fallback: get body text
    const bodyText = document.body.innerText || document.body.textContent;
    return this.cleanText(bodyText).substring(0, 3000);
  },

  cleanText(text) {
    // Remove extra whitespace and normalize
    return text
      .replace(/\s+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  },

  countWords() {
    const text = this.extractMainContent();
    return text.split(/\s+/).filter(word => word.length > 0).length;
  },

  hasTaskLikeContent() {
    const text = window.getSelection().toString().trim();
    if (!text) return false;
    
    const taskPatterns = [
      /\b(task|todo|action item|need to|must|should|will|deadline|due|assign|priority|urgent)\b/i,
      /\b(complete|finish|deliver|submit|review|approve|schedule|plan)\b/i,
      /^\s*[-•*]\s+/m, // Bullet points
      /^\s*\d+\.\s+/m  // Numbered lists
    ];
    
    return taskPatterns.some(pattern => pattern.test(text));
  }
};
