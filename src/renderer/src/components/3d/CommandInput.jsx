/* eslint-disable react/prop-types */
import { useState } from 'react'

// Command input component
export default function CommandInput({ onCommand }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) {
      onCommand(input.trim().toLowerCase())
      setInput('')
    }
  }

  return (
    <div
      className="command-input"
      style={{
        position: 'absolute',
        bottom: '20px',
        left: '20px',
        right: '20px',
        zIndex: 100
      }}
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Commands: create cube | select all | scale selected 2 | rotate cube1 45 | move selected to 0 0 0"
          style={{
            flex: 1,
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            fontSize: '14px'
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
          Execute
        </button>
      </form>
    </div>
  )
}