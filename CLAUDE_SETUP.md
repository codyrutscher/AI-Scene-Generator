# Claude AI Natural Language Commands

This 3D scene editor now supports natural language commands powered by Claude Sonnet 4.5!

## Setup

1. **Install dependencies** (if you haven't already):
   ```bash
   npm install
   ```

2. **Get a Claude API key**:
   - Go to https://console.anthropic.com/
   - Sign up or log in
   - Navigate to API Keys
   - Create a new API key

3. **Enable AI in the app**:
   - Click the "AI: OFF" button in the command input area
   - Paste your API key (starts with `sk-ant-...`)
   - Click "Save"
   - The button will change to "AI: ON" and the input border will turn blue

## Usage

Once enabled, you can type natural language commands instead of structured commands:

### Natural Language Examples:
- "make a red cube"
- "add a house at position 5 2 0"
- "create a blue sphere"
- "select everything"
- "select all the cubes"
- "make it twice as big"
- "scale the selected objects by 2"
- "turn the cube 90 degrees"
- "rotate cube1 45 degrees"
- "move it up by 2 units"
- "move selected to 0 5 0"
- "delete the sphere"
- "remove all selected objects"

### Traditional Commands Still Work:
- `create cube red`
- `create model house at 5 2 0`
- `select all`
- `scale selected 2`
- `rotate cube1 45`
- `move selected to 0 0 0`
- `delete selected`

## How It Works

1. You type a natural language command
2. Claude Sonnet 4.5 interprets your intent and converts it to a structured command
3. The structured command is executed in the 3D scene
4. You see the result immediately

## Privacy & Storage

- Your API key is stored locally in your browser's localStorage
- Commands are sent to Anthropic's API for processing
- No command history is stored or sent anywhere else
- Click "AI: ON" to disable and remove your API key

## Troubleshooting

**"AI parsing failed" error:**
- Check your API key is valid
- Ensure you have API credits available
- Check your internet connection

**Commands not working:**
- Try being more specific (e.g., "create a red cube" instead of "make something red")
- Use object names for specific operations (e.g., "rotate cube1" instead of "rotate it")
- Fall back to traditional commands if needed

**To disable AI:**
- Click the "AI: ON" button
- Your API key will be removed from localStorage
