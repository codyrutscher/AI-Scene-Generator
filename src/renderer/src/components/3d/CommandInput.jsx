/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { claudeService } from '../../utils/claudeService'

// Command input component with Claude AI integration
export default function CommandInput({ onCommand }) {
  const [input, setInput] = useState('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [isClaudeEnabled, setIsClaudeEnabled] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Check for saved API key on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('claude_api_key')
    if (savedKey) {
      try {
        claudeService.initialize(savedKey)
        setIsClaudeEnabled(true)
        setApiKey(savedKey)
      } catch (error) {
        console.error('Failed to initialize Claude:', error)
      }
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (input.trim() && !isProcessing) {
      setIsProcessing(true)
      try {
        await onCommand(input.trim())
        setInput('')
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const handleApiKeySubmit = (e) => {
    e.preventDefault()
    if (apiKey.trim()) {
      try {
        claudeService.initialize(apiKey.trim())
        localStorage.setItem('claude_api_key', apiKey.trim())
        setIsClaudeEnabled(true)
        setShowApiKeyInput(false)
      } catch (error) {
        alert('Failed to initialize Claude: ' + error.message)
      }
    }
  }

  const handleDisableClaude = () => {
    localStorage.removeItem('claude_api_key')
    setIsClaudeEnabled(false)
    setApiKey('')
  }

  return (
    <div
      className="command-input"
      style={{
        position: 'relative',
        width: '100%'
      }}
    >
      {/* API Key Setup */}
      {showApiKeyInput && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: 0,
            right: 0,
            marginBottom: '10px',
            padding: '15px',
            backgroundColor: '#2a2a2a',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          <form onSubmit={handleApiKeySubmit}>
            <div style={{ marginBottom: '10px', color: '#fff', fontSize: '14px' }}>
              Enter your Claude API key to enable natural language commands:
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-ant-..."
                style={{
                  flex: 1,
                  padding: '10px',
                  border: '1px solid #555',
                  borderRadius: '4px',
                  fontSize: '14px',
                  backgroundColor: '#1a1a1a',
                  color: '#fff'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4a90e2',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowApiKeyInput(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Main Command Input */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            isClaudeEnabled
              ? "Type anything: 'make a red cube', 'add a house at 5 0 0', 'select everything', 'make it bigger'..."
              : "Commands: create cube | create model house at 0 0 0 | select all | scale selected 2..."
          }
          disabled={isProcessing}
          style={{
            flex: 1,
            padding: '12px',
            border: isClaudeEnabled ? '2px solid #4a90e2' : '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px',
            backgroundColor: isProcessing ? '#f5f5f5' : '#fff',
            opacity: isProcessing ? 0.7 : 1
          }}
        />
        <button
          type="submit"
          disabled={isProcessing}
          style={{
            padding: '12px 24px',
            backgroundColor: isProcessing ? '#999' : '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
            fontWeight: '500'
          }}
        >
          {isProcessing ? 'Processing...' : 'Execute'}
        </button>
        
        {/* AI Toggle Button */}
        {isClaudeEnabled ? (
          <button
            type="button"
            onClick={handleDisableClaude}
            title="Disable AI (Claude)"
            style={{
              padding: '12px',
              backgroundColor: '#4a90e2',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              minWidth: '80px'
            }}
          >
            AI: ON
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            title="Enable AI (Claude)"
            style={{
              padding: '12px',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '500',
              minWidth: '80px'
            }}
          >
            AI: OFF
          </button>
        )}
      </form>
    </div>
  )
}