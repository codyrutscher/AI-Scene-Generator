// Claude AI service for natural language command processing
import Anthropic from '@anthropic-ai/sdk'

class ClaudeService {
  constructor() {
    this.client = null
    this.apiKey = null
  }

  // Initialize Claude with API key
  initialize(apiKey) {
    if (!apiKey) {
      throw new Error('Claude API key is required')
    }
    this.apiKey = apiKey
    this.client = new Anthropic({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true // Required for browser usage
    })
  }

  // Check if Claude is initialized
  isInitialized() {
    return this.client !== null
  }

  // Parse natural language command into structured command
  async parseCommand(naturalLanguageInput, sceneContext = {}) {
    if (!this.isInitialized()) {
      throw new Error('Claude service not initialized. Please set your API key.')
    }

    const systemPrompt = `You are a 3D scene command parser. Convert natural language into structured commands.

Commands:
- create model <term> [at x y z] - Create 3D models
- create <type> [color] [at x y z] - Create shapes (cube, sphere, cylinder)
- clone [at x y z] - Duplicate selected objects
- select <target> - Select objects (all, none, cubes, spheres, or name)
- delete <target> - Delete objects
- scale <target> <value> - Scale objects
- rotate <target> <degrees> - Rotate objects
- move <target> to/by <x y z> - Move objects
- clear - Clear selection
- reset - Reset scene

Context:
Objects: ${sceneContext.objectNames?.join(', ') || 'none'}
Selected: ${sceneContext.selectedNames?.join(', ') || 'none'}

Rules:
1. "it", "this", "that" means "selected"
2. Real-world objects (car, building, tree) use "create model"
3. Bigger/smaller/grow/shrink means scale
4. Turn/spin/rotate means rotate
5. Move/shift/slide means move
6. Clone/copy/duplicate means clone
7. Extract coordinates from any format (commas, spaces, parentheses)
8. Be flexible with phrasing

Examples:
"create a car at 0 0 0" = create model car at 0 0 0
"add a car at 0,0,0" = create model car at 0 0 0
"make it bigger" = scale selected 2
"turn it 90 degrees" = rotate selected 90
"move it up 5" = move selected by 0 5 0
"clone it at 10 0 0" = clone at 10 0 0

Return ONLY the command, nothing else.`

    try {
      const message = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 200,
        messages: [{
          role: 'user',
          content: naturalLanguageInput
        }],
        system: systemPrompt
      })

      const response = message.content[0].text.trim()
      
      // Check for error response
      if (response.startsWith('ERROR:')) {
        throw new Error(response.substring(6).trim())
      }

      return response
    } catch (error) {
      console.error('Claude API error:', error)
      throw new Error(`Failed to parse command: ${error.message}`)
    }
  }
}

// Export singleton instance
export const claudeService = new ClaudeService()
