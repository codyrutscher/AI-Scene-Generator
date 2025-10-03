import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormLabel,
  FormControlLabel,
  Checkbox,
  TextField,
  Typography,
  Box,
  Grid,
  Paper,
  IconButton,
  Alert,
  AlertTitle,
  LinearProgress
} from '@mui/material';
import {
  Download,
  Close,
  Warning,
  Archive as Package,
  CloudDownload,
  TextSnippet
} from '@mui/icons-material';
import { JSONExportService } from '../../services/jsonExportService.js';
import { GLBExportService } from '../../services/glbExportService.js';
import { FileDownloadUtil } from '../../services/fileDownloadUtil.js'; 

const ExportDialog = ({ isOpen, onClose, scene, sceneData }) => {
  const [exportOptions, setExportOptions] = useState({
    format: 'json',
    filename: 'scene',
    includeCamera: true,
    includeLighting: true,
    includeMetadata: true,
    onlyVisible: true
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState({
    stage: 'preparing',
    progress: 0,
    message: ''
  });
  const [validationResult, setValidationResult] = useState(null);
  const [exportError, setExportError] = useState(null);

  // Validate scene when format changes
  useEffect(() => {
    if (isOpen && exportOptions.format === 'glb' && scene) {
      const result = GLBExportService.validateScene(scene);
      setValidationResult(result);
    } else {
      setValidationResult(null);
    }
  }, [isOpen, exportOptions.format, scene]);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setIsExporting(false);
      setExportProgress({ stage: 'preparing', progress: 0, message: '' });
      setExportError(null);
      setExportOptions(prev => ({
        ...prev,
        filename: `scene_${new Date().toISOString().slice(0, 10)}`
      }));
    }
  }, [isOpen]);

  const handleExport = async () => {
    if (!sceneData || (exportOptions.format === 'glb' && !scene)) {
      setExportError('Missing scene data for export');
      return;
    }

    setIsExporting(true);
    setExportError(null);

    try {
      if (exportOptions.format === 'json') {
        await handleJSONExport();
      } else {
        await handleGLBExport();
      }
    } catch (error) {
      console.error('Export failed:', error);
      setExportError(error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const handleJSONExport = async () => {
    setExportProgress({ stage: 'preparing', progress: 20, message: 'Preparing scene data...' });
    
    await new Promise(resolve => setTimeout(resolve, 300)); // Brief delay for UX
    
    setExportProgress({ stage: 'processing', progress: 60, message: 'Generating JSON...' });
    
    const blob = await JSONExportService.exportScene(sceneData, exportOptions);
    
    setExportProgress({ stage: 'generating', progress: 90, message: 'Creating download...' });
    
    const filename = FileDownloadUtil.generateFilename(exportOptions.filename, 'json');
    FileDownloadUtil.downloadBlob(blob, filename);
    
    setExportProgress({ stage: 'complete', progress: 100, message: 'Export complete!' });
    
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleGLBExport = async () => {
    setExportProgress({ stage: 'preparing', progress: 10, message: 'Preparing 3D scene...' });
    
    // Prepare scene for export
    const exportScene = GLBExportService.prepareSceneForExport(scene);
    
    setExportProgress({ stage: 'processing', progress: 40, message: 'Converting to GLB format...' });
    
    const arrayBuffer = await GLBExportService.exportScene(exportScene, exportOptions);
    
    setExportProgress({ stage: 'generating', progress: 90, message: 'Creating download...' });
    
    const filename = FileDownloadUtil.generateFilename(exportOptions.filename, 'glb');
    FileDownloadUtil.downloadArrayBuffer(arrayBuffer, filename);
    
    setExportProgress({ stage: 'complete', progress: 100, message: 'Export complete!' });
    
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const handleOptionChange = (key, value) => {
    setExportOptions(prev => ({
      ...prev,
      [key]: value
    }));
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
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Download color="primary" />
          <Typography variant="h6">Export Scene</Typography>
        </Box>
        <IconButton
          onClick={onClose}
          disabled={isExporting}
          size="small"
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Format Selection */}
          <FormControl component="fieldset">
            <FormLabel component="legend" sx={{ mb: 2 }}>
              Export Format
            </FormLabel>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Paper
                  variant={exportOptions.format === 'json' ? 'elevation' : 'outlined'}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    textAlign: 'center',
                    border: exportOptions.format === 'json' ? 2 : 1,
                    borderColor: exportOptions.format === 'json' ? 'primary.main' : 'grey.300',
                    backgroundColor: exportOptions.format === 'json' ? 'primary.50' : 'transparent',
                    '&:hover': {
                      borderColor: 'primary.main'
                    }
                  }}
                  onClick={() => handleOptionChange('format', 'json')}
                >
                  <TextSnippet sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body2" fontWeight="medium">JSON</Typography>
                  <Typography variant="caption" color="text.secondary">Scene data</Typography>
                </Paper>
              </Grid>
              
              <Grid item xs={6}>
                <Paper
                  variant={exportOptions.format === 'glb' ? 'elevation' : 'outlined'}
                  sx={{
                    p: 2,
                    cursor: 'pointer',
                    textAlign: 'center',
                    border: exportOptions.format === 'glb' ? 2 : 1,
                    borderColor: exportOptions.format === 'glb' ? 'primary.main' : 'grey.300',
                    backgroundColor: exportOptions.format === 'glb' ? 'primary.50' : 'transparent',
                    '&:hover': {
                      borderColor: 'primary.main'
                    }
                  }}
                  onClick={() => handleOptionChange('format', 'glb')}
                >
                  <Package sx={{ fontSize: 32, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body2" fontWeight="medium">GLB</Typography>
                  <Typography variant="caption" color="text.secondary">3D model</Typography>
                </Paper>
              </Grid>
            </Grid>
          </FormControl>

          {/* Filename Input */}
          <Box>
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 1 }}>
              Filename
            </Typography>
            <TextField
              fullWidth
              value={exportOptions.filename}
              onChange={(e) => handleOptionChange('filename', e.target.value)}
              disabled={isExporting}
              placeholder="Enter filename"
              InputProps={{
                endAdornment: (
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    .{exportOptions.format}
                  </Typography>
                )
              }}
            />
          </Box>

          {/* Export Options */}
          <Box>
            <Typography variant="body2" fontWeight="medium" sx={{ mb: 2 }}>
              Export Options
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {exportOptions.format === 'json' && (
                <>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={exportOptions.includeCamera}
                        onChange={(e) => handleOptionChange('includeCamera', e.target.checked)}
                        disabled={isExporting}
                      />
                    }
                    label="Include camera position"
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={exportOptions.includeLighting}
                        onChange={(e) => handleOptionChange('includeLighting', e.target.checked)}
                        disabled={isExporting}
                      />
                    }
                    label="Include lighting setup"
                  />
                  
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={exportOptions.includeMetadata}
                        onChange={(e) => handleOptionChange('includeMetadata', e.target.checked)}
                        disabled={isExporting}
                      />
                    }
                    label="Include metadata"
                  />
                </>
              )}
              
              {exportOptions.format === 'glb' && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={exportOptions.onlyVisible}
                      onChange={(e) => handleOptionChange('onlyVisible', e.target.checked)}
                      disabled={isExporting}
                    />
                  }
                  label="Export only visible objects"
                />
              )}
            </Box>
          </Box>

          {/* Validation Results for GLB */}
          {validationResult && exportOptions.format === 'glb' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {validationResult.warnings.length > 0 && (
                <Alert severity="warning">
                  <AlertTitle>Warnings</AlertTitle>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {validationResult.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </Box>
                </Alert>
              )}
              
              {validationResult.unsupportedFeatures.length > 0 && (
                <Alert severity="error">
                  <AlertTitle>Unsupported Features</AlertTitle>
                  <Box component="ul" sx={{ m: 0, pl: 2 }}>
                    {validationResult.unsupportedFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </Box>
                </Alert>
              )}
            </Box>
          )}

          {/* Export Progress */}
          {isExporting && (
            <Alert severity="info" sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CloudDownload sx={{ animation: 'spin 1s linear infinite' }} />
                <Typography variant="body2" fontWeight="medium">
                  {exportProgress.message}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={exportProgress.progress} 
                sx={{ mt: 1 }}
              />
            </Alert>
          )}

          {/* Export Error */}
          {exportError && (
            <Alert severity="error">
              <AlertTitle>Export Failed</AlertTitle>
              {exportError}
            </Alert>
          )}

          {/* Scene Info */}
          <Paper variant="outlined" sx={{ p: 2, backgroundColor: 'grey.50' }}>
            <Typography variant="body2" color="text.secondary">
              <Box component="div">Objects: {sceneData?.objects?.length || 0}</Box>
              <Box component="div">Format: {exportOptions.format.toUpperCase()}</Box>
              {exportOptions.format === 'glb' && validationResult && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  Max file size: 50MB
                </Typography>
              )}
            </Typography>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          disabled={isExporting}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleExport}
          disabled={isExporting || !exportOptions.filename.trim()}
          variant="contained"
          startIcon={isExporting ? <CloudDownload sx={{ animation: 'spin 1s linear infinite' }} /> : <Download />}
        >
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExportDialog;