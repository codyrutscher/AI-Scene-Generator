/* eslint-disable react/prop-types */

// Selection info display
export default function SelectionInfo({ selectedObjects, selectedCount, totalCount, lastAction }) {
  // Determine action type for better styling
  const getActionStyle = (action) => {
    // Handle both string and object types for lastAction
    const actionText = typeof action === 'string' ? action : (action?.text || action?.message || String(action))
    
    if (actionText.includes('Created') || actionText.includes('Selected')) {
      return { color: '#28a745', fontWeight: 'bold' } // Green for success
    } else if (
      actionText.includes('Moved') ||
      actionText.includes('Scaled') ||
      actionText.includes('Rotated')
    ) {
      return { color: '#007bff', fontWeight: 'bold' } // Blue for transformations
    } else if (actionText.includes('Deselected') || actionText.includes('not found')) {
      return { color: '#dc3545', fontWeight: 'normal' } // Red for warnings/deselection
    }
    return { color: '#6c757d', fontWeight: 'normal' } // Gray for default
  }

  return (
    <div
      style={{
        position: 'absolute',
        top: '80px',
        right: '20px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
        minWidth: '220px',
        maxWidth: '300px',
        zIndex: 100,
        border: '1px solid rgba(0,0,0,0.1)'
      }}
    >
      <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#333' }}>Scene Control</h3>

      <div style={{ marginBottom: '12px', fontSize: '13px', color: '#666' }}>
        <strong>Total Objects:</strong> {totalCount}
      </div>

      {lastAction && (
        <div
          style={{
            marginBottom: '12px',
            fontSize: '12px',
            padding: '8px',
            backgroundColor: 'rgba(0,0,0,0.05)',
            borderRadius: '4px',
            borderLeft: '3px solid #007bff',
            ...getActionStyle(lastAction)
          }}
        >
          <strong>Last Action:</strong>
          <br />
          {typeof lastAction === 'string' ? lastAction : (lastAction?.text || lastAction?.message || String(lastAction))}
        </div>
      )}

      <h4 style={{ margin: '12px 0 8px 0', fontSize: '14px', color: '#333' }}>Selected Objects</h4>
      {selectedCount === 0 ? (
        <p style={{ margin: 0, color: '#999', fontSize: '12px', fontStyle: 'italic' }}>
          No objects selected
        </p>
      ) : (
        <>
          <ul style={{ margin: '0 0 8px 0', padding: '0 0 0 20px' }}>
            {Array.from(selectedObjects || []).map((name) => (
              <li
                key={name}
                style={{
                  marginBottom: '4px',
                  fontSize: '12px',
                  color: '#333',
                  fontWeight: '500'
                }}
              >
                {name}
              </li>
            ))}
          </ul>
          <div
            style={{
              fontSize: '11px',
              color: '#007bff',
              fontWeight: 'bold',
              textAlign: 'center',
              padding: '4px',
              backgroundColor: 'rgba(0,123,255,0.1)',
              borderRadius: '3px'
            }}
          >
            {selectedCount} object{selectedCount !== 1 ? 's' : ''} selected
          </div>
        </>
      )}

      <div
        style={{
          marginTop: '12px',
          fontSize: '11px',
          color: '#999',
          borderTop: '1px solid rgba(0,0,0,0.1)',
          paddingTop: '8px'
        }}
      >
        💡 Try: scale, rotate, move commands
      </div>
    </div>
  )
}