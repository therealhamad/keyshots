# Keyshots

A keyboard-driven overlay interface for executing common actions across integrated apps without leaving your current context. Think Raycast/Spotlight, but for actions instead of search.

## Features

- **Global Keyboard Shortcut**: Press `Option+Space` (Mac) or `Ctrl+Shift+K` (Windows/Linux) anywhere in Chrome
- **Command Palette**: Searchable list of available actions with keyboard navigation
- **Gmail Integration**: Send emails via mailto: link (opens your default mail client)
- **Slack Integration**: Post messages directly to Slack via webhooks
- **Notion Integration**: Create pages in your Notion databases via API

## Installation

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked**
5. Select the `keyshots` directory

## Configuration

Before using Slack and Notion integrations, you need to configure them:

1. Press `Option+Space` (Mac) or `Ctrl+Shift+K` (Windows) to open Keyshots
2. Type "settings" and press Enter (or select Settings from the list)
3. Configure your integrations:

### Slack Setup

1. Go to [api.slack.com/messaging/webhooks](https://api.slack.com/messaging/webhooks)
2. Create a new Incoming Webhook
3. Copy the webhook URL and paste it in Keyshots settings

### Notion Setup

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Create a new integration
3. Copy the Internal Integration Token
4. Paste the token in Keyshots settings
5. Click "Refresh" to load your databases
6. **Important**: Share your Notion databases with your integration for them to appear

## Usage

### Opening the Overlay

Press `Option+Space` (Mac) or `Ctrl+Shift+K` (Windows/Linux) on any webpage.

### Navigation

- **Type** to filter commands
- **Arrow Keys** (↑/↓) to navigate the list
- **Enter** to select a command
- **Escape** to close the overlay or go back

### Available Commands

| Command | Description |
|---------|-------------|
| Send Gmail | Compose and send an email (opens mail client) |
| Send Slack Message | Post a message to your configured Slack channel |
| Create Notion Page | Create a new page in a Notion database |
| Settings | Configure API credentials |

### Keyboard Shortcuts in Forms

- **Cmd/Ctrl+Enter**: Submit the form
- **Escape**: Cancel and return to command palette

## Project Structure

```
keyshots/
├── manifest.json              # Chrome extension manifest (V3)
├── background/
│   └── service-worker.js      # Keyboard shortcut listener
├── content/
│   └── content-script.js      # Overlay injection & state management
├── overlay/
│   ├── overlay.css            # All styling
│   └── overlay.js             # Overlay logic & rendering
├── components/
│   ├── command-palette.js     # Command list & navigation
│   ├── gmail-form.js          # Email form (mailto:)
│   ├── slack-form.js          # Slack webhook form
│   ├── notion-form.js         # Notion API form
│   └── settings.js            # Settings panel
├── utils/
│   ├── api-client.js          # API calls (Slack, Notion)
│   └── storage.js             # chrome.storage.local wrapper
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

## Known Limitations

- **Gmail**: Uses mailto: protocol, which opens your default mail client instead of sending directly
- **Slack**: Requires a pre-configured webhook URL (messages go to one channel)
- **Notion**: Requires manual token setup and database sharing
- **Chrome Only**: Not available in other browsers

## Development

This extension is built with vanilla JavaScript, no build step required. Simply edit the files and reload the extension in `chrome://extensions/`.

## License

MIT
