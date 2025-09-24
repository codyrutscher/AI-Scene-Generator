import React from 'react';

const ModelSearchResults = ({ 
  searchResults, 
  isVisible, 
  onClose, 
  onModelSelect, 
  isLoading = false 
}) => {
  if (!isVisible) return null;

  const handleModelClick = (model) => {
    if (onModelSelect) {
      onModelSelect(model);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="model-search-overlay"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
      }}
    >
      <div 
        className="model-search-modal"
        style={{
          backgroundColor: '#1a1a2e',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '800px',
          maxHeight: '600px',
          width: '90%',
          height: '80%',
          display: 'flex',
          flexDirection: 'column',
          border: '1px solid #333'
        }}
      >
        {/* Header */}
        <div 
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid #333',
            paddingBottom: '10px'
          }}
        >
          <h2 style={{ color: '#ffffff', margin: 0, fontSize: '18px' }}>
            {isLoading ? 'Searching...' : `Search Results ${searchResults?.total ? `(${searchResults.total})` : ''}`}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '5px 10px',
              borderRadius: '4px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div 
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '10px 0'
          }}
        >
          {isLoading ? (
            <div 
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                color: '#ffffff'
              }}
            >
              <div>Loading models...</div>
            </div>
          ) : searchResults?.error ? (
            <div 
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                color: '#ff4444',
                textAlign: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '18px', marginBottom: '10px' }}>No Results Found</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>{searchResults.error}</div>
              </div>
            </div>
          ) : searchResults?.models?.length > 0 ? (
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '15px',
                padding: '10px'
              }}
            >
              {searchResults.models.map((model) => (
                <div
                  key={model.id}
                  className="model-card"
                  onClick={() => handleModelClick(model)}
                  style={{
                    backgroundColor: '#2a2a3e',
                    borderRadius: '8px',
                    padding: '12px',
                    cursor: 'pointer',
                    border: '1px solid #333',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#3a3a4e';
                    e.currentTarget.style.borderColor = '#007acc';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#2a2a3e';
                    e.currentTarget.style.borderColor = '#333';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  {/* Thumbnail */}
                  <div 
                    style={{
                      width: '120px',
                      height: '80px',
                      marginBottom: '10px',
                      borderRadius: '4px',
                      overflow: 'hidden',
                      backgroundColor: '#1a1a2e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <img
                      src={model.thumbnail}
                      alt={model.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div 
                      style={{
                        display: 'none',
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: model.color || '#666666',
                        color: '#ffffff',
                        fontSize: '12px',
                        textAlign: 'center'
                      }}
                    >
                      {model.name}
                    </div>
                  </div>

                  {/* Model Info */}
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <div 
                      style={{
                        color: '#ffffff',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {model.name}
                    </div>
                    <div 
                      style={{
                        color: '#cccccc',
                        fontSize: '12px',
                        marginBottom: '4px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {model.description}
                    </div>
                    <div 
                      style={{
                        color: '#888888',
                        fontSize: '10px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {model.source}
                    </div>
                  </div>

                  {/* Download indicator */}
                  {model.downloadable && (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        backgroundColor: '#4CAF50',
                        color: '#ffffff',
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '10px'
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div 
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '200px',
                color: '#888888',
                textAlign: 'center'
              }}
            >
              <div>
                <div style={{ fontSize: '18px', marginBottom: '10px' }}>No Models Available</div>
                <div style={{ fontSize: '14px', opacity: 0.8 }}>Try searching for a different object type</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {searchResults?.models?.length > 0 && (
          <div 
            style={{
              borderTop: '1px solid #333',
              paddingTop: '15px',
              marginTop: '15px',
              textAlign: 'center'
            }}
          >
            <div style={{ color: '#888888', fontSize: '12px' }}>
              Click on a model to place it in your scene
            </div>
            {searchResults.searchQuery && (
              <div style={{ color: '#666666', fontSize: '11px', marginTop: '5px' }}>
                Search: "{searchResults.searchQuery}" • Source: {searchResults.source}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModelSearchResults;