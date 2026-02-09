// Keyshots Gemini API Client
// Handles AI-powered content generation using Google's Gemini API

const KeyshotsGemini = {
  API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent',

  async getApiKey() {
    const result = await KeyshotsStorage.get('gemini_api_key');
    return result || null;
  },

  async generateContent(prompt) {
    const apiKey = await this.getApiKey();
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const response = await fetch(`${this.API_ENDPOINT}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Keyshots: Gemini API call failed:', error);
      throw error;
    }
  },

  async generateEmailFromContext(context) {
    const prompt = `
Generate a professional email based on this context:

Page Title: ${context.pageTitle}
Page URL: ${context.pageUrl}
Selected Text: ${context.selectedText || 'None'}
Page Content Summary: ${!context.selectedText ? context.pageContent?.substring(0, 1500) : 'N/A'}

Task: Create an email that shares this content appropriately.

Requirements:
- If text is selected, use it as a quote or key point
- If no selection, summarize the page content
- Professional but friendly tone
- Include the source URL
- Keep it concise (under 150 words)

Return ONLY a JSON object with this exact structure (no markdown, no code fences, no preamble):
{"subject": "Clear, descriptive subject line (max 60 chars)", "body": "Email body with proper formatting"}
`;

    const response = await this.generateContent(prompt);
    const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      return JSON.parse(cleanResponse);
    } catch (e) {
      // Try to extract JSON from the response
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse AI response');
    }
  },

  async generateSlackSummary(context) {
    const prompt = `
Create a Slack-friendly summary of this content:

Page Title: ${context.pageTitle}
Page URL: ${context.pageUrl}
Content: ${context.selectedText || context.pageContent?.substring(0, 2000)}

Requirements:
- Casual, conversational tone
- Use Slack markdown (*bold*, _italic_)
- Add relevant emojis (2-3 max)
- Bullet points for key takeaways
- Include source link at bottom
- Maximum 200 words

Return ONLY a JSON object (no markdown, no code fences, no preamble):
{"message": "Formatted Slack message with markdown and emojis", "suggestedChannel": "suggested channel name based on content"}
`;

    const response = await this.generateContent(prompt);
    const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      return JSON.parse(cleanResponse);
    } catch (e) {
      const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse AI response');
    }
  },

  async extractTasks(text) {
    const prompt = `
Analyze this text and extract action items/tasks:

Text:
${text}

Requirements:
- Identify clear action items or to-dos
- Infer assignee if mentioned (otherwise "Unassigned")
- Infer due date if mentioned (otherwise null)
- Assign priority: high, medium, or low based on urgency keywords
- Return empty array if no tasks found

Return ONLY a JSON array (no markdown, no code fences, no preamble):
[{"task": "Clear description of the task", "assignee": "Person's name or Unassigned", "dueDate": "YYYY-MM-DD or null", "priority": "high|medium|low"}]
`;

    const response = await this.generateContent(prompt);
    const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      return JSON.parse(cleanResponse);
    } catch (e) {
      const jsonMatch = cleanResponse.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    }
  },

  async testConnection(apiKey) {
    try {
      const response = await fetch(`${this.API_ENDPOINT}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: 'Say "Hello, Keyshots!" in a friendly way. Keep it under 10 words.' }]
          }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Connection failed');
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};
