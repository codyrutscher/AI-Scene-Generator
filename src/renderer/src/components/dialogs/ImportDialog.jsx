import React, { useState, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  Alert,
  AlertTitle,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  Upload,
  Description,
  Close,
  Warning,
  CheckCircle,
  Visibility,
  CloudUpload
} from '@mui/icons-material';
import { JSONExportService } from '../../services/jsonExportService.js';

const ImportDialog = ({ isOpen, onClose, onImport }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState(null);
  const fileInputRef = useRef(null);

  // Reset state when dialog opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setValidationResult(null);
      setPreviewData(null);
      setIsValidating(false);
      setIsImporting(false);
      setImportError(null);
      setDragActive(false);
    }
  }, [isOpen]);

  const handleFileSelect = useCallback(async (file) => {
    if (!file) return;

    setSelectedFile(file);
    setValidationResult(null);
    setPreviewData(null);
    setImportError(null);
    setIsValidating(true);

    try {
      // Validate file
      const validation = await JSONExportService.validateImport(file);
      setValidationResult(validation);

      if (validation.isValid) {
        // Generate preview
        const preview = await JSONExportService.createPreviewData(file);
        setPreviewData(preview);
      }
    } catch (error) {
      console.error('File validation failed:', error);
      setImportError(error.message);
    } finally {
      setIsValidating(false);
    }
  }, []);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        handleFileSelect(file);
      } else {
        setImportError('Please select a JSON file');
      }
    }
  }, [handleFileSelect]);

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !validationResult?.isValid) return;

    setIsImporting(true);
    setImportError(null);

    try {
      const sceneData = await JSONExportService.importScene(selectedFile);
      onImport(sceneData);
      onClose();
    } catch (error) {
      console.error('Import failed:', error);
      setImportError(error.message);
    } finally {
      setIsImporting(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }; 
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { maxHeight: '90vh' }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Upload color="primary" />
            <Typography variant="h6">Import Scene</Typography>
          </Box>
          <IconButton
            onClick={onClose}
            disabled={isImporting}
            size="small"
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* File Upload Area */}
          <Paper
            variant="outlined"
            sx={{
              position: 'relative',
              border: '2px dashed',
              borderColor: dragActive 
                ? 'primary.main' 
                : selectedFile 
                ? 'success.main' 
                : 'grey.300',
              backgroundColor: dragActive 
                ? 'primary.50' 
                : selectedFile 
                ? 'success.50' 
                : 'transparent',
              p: 4,
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                borderColor: dragActive 
                  ? 'primary.main' 
                  : selectedFile 
                  ? 'success.main' 
                  : 'grey.400'
              }
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileInputChange}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer'
              }}
              disabled={isValidating || isImporting}
            />
            
            {selectedFile ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <CheckCircle sx={{ fontSize: 48, color: 'success.main' }} />
                <Typography variant="body2" fontWeight="medium">{selectedFile.name}</Typography>
                <Typography variant="caption" color="text.secondary">{formatFileSize(selectedFile.size)}</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <Description sx={{ fontSize: 48, color: 'text.secondary' }} />
                <Typography variant="body2" fontWeight="medium">
                  Drop your JSON file here, or click to browse
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supports scene files exported from this application
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Validation Status */}
          {isValidating && (
            <Alert severity="info">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2">Validating file...</Typography>
              </Box>
            </Alert>
          )}

          {/* Validation Results */}
          {validationResult && !isValidating && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {validationResult.isValid ? (
                <Alert severity="success">
                  <Typography variant="body2" fontWeight="medium">File is valid</Typography>
                </Alert>
              ) : (
                <Alert severity="error">
                  <AlertTitle>Validation Failed</AlertTitle>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {validationResult.errors.map((error, index) => (
                      <Typography component="li" key={index} variant="body2">
                        {error}
                      </Typography>
                    ))}
                  </Box>
                </Alert>
              )}

              {validationResult.warnings.length > 0 && (
                <Alert severity="warning">
                  <AlertTitle>Warnings</AlertTitle>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {validationResult.warnings.map((warning, index) => (
                      <Typography component="li" key={index} variant="body2">
                        {warning}
                      </Typography>
                    ))}
                  </Box>
                </Alert>
              )}
            </Box>
          )}

          {/* Preview Data */}
          {previewData && validationResult?.isValid && (
            <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Visibility color="action" />
                <Typography variant="body2" fontWeight="medium">Scene Preview</Typography>
              </Box>
              
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Objects</Typography>
                  <Typography variant="body2" fontWeight="medium">{previewData.objectCount}</Typography>
                </Box>
                
                <Box>
                  <Typography variant="caption" color="text.secondary">App Version</Typography>
                  <Typography variant="body2" fontWeight="medium">{previewData.appVersion || 'Unknown'}</Typography>
                </Box>
              </Box>

              {(previewData.hasCamera || previewData.hasLighting) && (
                <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  {previewData.hasCamera && (
                    <Chip 
                      label="Includes camera position" 
                      size="small" 
                      color="success" 
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  )}
                  {previewData.hasLighting && (
                    <Chip 
                      label="Includes lighting setup" 
                      size="small" 
                      color="success" 
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  )}
                </Box>
              )}

              {previewData.objectTypes && previewData.objectTypes.length > 0 && (
                <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Object Types:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {previewData.objectTypes.map((type, index) => (
                      <Chip
                        key={index}
                        label={type}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
          )}

          {/* Import Error */}
          {importError && (
            <Alert severity="error">
              <AlertTitle>Import Failed</AlertTitle>
              {importError}
            </Alert>
          )}

          {/* Import Warning */}
          {validationResult?.isValid && (
            <Alert severity="warning">
              <AlertTitle>Import Notice</AlertTitle>
              Importing will replace the current scene. Make sure to export your current work if needed.
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={isImporting}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleImport}
          disabled={!validationResult?.isValid || isImporting || isValidating}
          variant="contained"
          startIcon={isImporting ? <CloudUpload sx={{ animation: 'spin 1s linear infinite' }} /> : <Upload />}
        >
          Import Scene
        </Button>
       </DialogActions>
     </Dialog>
   );
 };

 export default ImportDialog;