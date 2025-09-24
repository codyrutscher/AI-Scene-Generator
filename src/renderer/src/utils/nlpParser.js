/**
 * Natural Language Processing utility for parsing 3D scene commands
 * Extracts object type, coordinates, and attributes from user input
 */

export class NLPParser {
  constructor() {
    // Object type patterns
    this.objectPatterns = {
      car: /\b(car|vehicle|automobile|truck|van)s?\b/i,
      house: /\b(house|home|building|cottage|mansion)s?\b/i,
      tree: /\b(tree|plant|bush|shrub)s?\b/i,
      furniture: /\b(chair|table|desk|sofa|bed|furniture)s?\b/i,
      person: /\b(person|people|human|character|figure)s?\b/i,
      animal: /\b(animal|dog|cat|bird|horse)s?\b/i
    };

    // Coordinate patterns
    this.coordinatePatterns = {
      // Matches patterns like "at (5,10)", "at 5,10", "at (5, 10)"
      parentheses: /at\s*\(?\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)?/i,
      // Matches "x=5 z=10" or "x:5 z:10"
      explicit: /x\s*[=:]\s*(-?\d+(?:\.\d+)?).*?z\s*[=:]\s*(-?\d+(?:\.\d+)?)/i,
      // Matches "position 5 10"
      position: /position\s+(-?\d+(?:\.\d+)?)\s+(-?\d+(?:\.\d+)?)/i
    };

    // Color patterns
    this.colorPatterns = {
      red: /\b(red|crimson|scarlet)\b/i,
      blue: /\b(blue|navy|azure)\b/i,
      green: /\b(green|emerald|lime)\b/i,
      yellow: /\b(yellow|gold|amber)\b/i,
      orange: /\b(orange|tangerine)\b/i,
      purple: /\b(purple|violet|magenta)\b/i,
      black: /\b(black|dark)\b/i,
      white: /\b(white|light)\b/i,
      brown: /\b(brown|tan|beige)\b/i,
      gray: /\b(gray|grey|silver)\b/i
    };

    // Direction patterns
    this.directionPatterns = {
      north: /\b(north|up|forward)\b/i,
      south: /\b(south|down|backward)\b/i,
      east: /\b(east|right)\b/i,
      west: /\b(west|left)\b/i
    };

    // Action patterns
    this.actionPatterns = {
      place: /\b(place|put|add|insert|position)\b/i,
      remove: /\b(remove|delete|clear|take away)\b/i,
      move: /\b(move|relocate|shift)\b/i
    };
  }

  /**
   * Parse a natural language command
   * @param {string} command - The user's natural language command
   * @returns {Object} Parsed command object
   */
  parseCommand(command) {
    if (!command || typeof command !== 'string') {
      return { error: 'Invalid command' };
    }

    const result = {
      action: this.extractAction(command),
      objectType: this.extractObjectType(command),
      coordinates: this.extractCoordinates(command),
      color: this.extractColor(command),
      direction: this.extractDirection(command),
      originalCommand: command.trim()
    };

    // Validate required fields
    if (!result.action) {
      result.error = 'No action detected. Try using words like "place", "add", or "put".';
    }
    
    if (!result.objectType) {
      result.error = 'No object type detected. Try specifying what to place (car, house, tree, etc.).';
    }
    
    if (!result.coordinates) {
      result.error = 'No coordinates detected. Try using format like "at (0,0)" or "at 5,10".';
    }

    return result;
  }

  /**
   * Extract action from command
   * @param {string} command
   * @returns {string|null}
   */
  extractAction(command) {
    for (const [action, pattern] of Object.entries(this.actionPatterns)) {
      if (pattern.test(command)) {
        return action;
      }
    }
    return null;
  }

  /**
   * Extract object type from command
   * @param {string} command
   * @returns {string|null}
   */
  extractObjectType(command) {
    for (const [type, pattern] of Object.entries(this.objectPatterns)) {
      if (pattern.test(command)) {
        return type;
      }
    }
    return null;
  }

  /**
   * Extract coordinates from command
   * @param {string} command
   * @returns {Object|null}
   */
  extractCoordinates(command) {
    // Try different coordinate patterns
    for (const [patternName, pattern] of Object.entries(this.coordinatePatterns)) {
      const match = command.match(pattern);
      if (match) {
        const x = parseFloat(match[1]);
        const z = parseFloat(match[2]);
        
        // Validate coordinates are within reasonable bounds
        if (!isNaN(x) && !isNaN(z) && Math.abs(x) <= 50 && Math.abs(z) <= 50) {
          return { x, z };
        }
      }
    }
    return null;
  }

  /**
   * Extract color from command
   * @param {string} command
   * @returns {string|null}
   */
  extractColor(command) {
    for (const [color, pattern] of Object.entries(this.colorPatterns)) {
      if (pattern.test(command)) {
        return color;
      }
    }
    return null;
  }

  /**
   * Extract direction from command
   * @param {string} command
   * @returns {string|null}
   */
  extractDirection(command) {
    for (const [direction, pattern] of Object.entries(this.directionPatterns)) {
      if (pattern.test(command)) {
        return direction;
      }
    }
    return null;
  }

  /**
   * Get suggestions for incomplete commands
   * @param {string} command
   * @returns {Array}
   */
  getSuggestions(command) {
    const suggestions = [];
    
    if (!this.extractAction(command)) {
      suggestions.push('Try starting with "place", "add", or "put"');
    }
    
    if (!this.extractObjectType(command)) {
      suggestions.push('Specify what to place: car, house, tree, furniture, etc.');
    }
    
    if (!this.extractCoordinates(command)) {
      suggestions.push('Add coordinates like "at (0,0)" or "at 5,10"');
    }
    
    return suggestions;
  }

  /**
   * Generate example commands
   * @returns {Array}
   */
  getExampleCommands() {
    return [
      'place a red car at (0,0)',
      'add a house at (10,15)',
      'put a blue car at (-5,8)',
      'place a green tree at (3,-7)',
      'add a brown house at (20,20)',
      'place furniture at (0,5)'
    ];
  }
}

// Export singleton instance
export const nlpParser = new NLPParser();
export default nlpParser;