// File download utility for handling browser-based file downloads

export class FileDownloadUtil {
  /**
   * Download a Blob as a file
   * @param {Blob} blob - The blob to download
   * @param {string} filename - The filename for the download
   */
  static downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  /**
   * Download an ArrayBuffer as a file
   * @param {ArrayBuffer} buffer - The array buffer to download
   * @param {string} filename - The filename for the download
   */
  static downloadArrayBuffer(buffer, filename) {
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    this.downloadBlob(blob, filename);
  }

  /**
   * Generate a filename with timestamp
   * @param {string} baseName - The base name for the file
   * @param {string} format - The file format/extension
   * @returns {string} The generated filename
   */
  static generateFilename(baseName, format) {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
    return `${sanitizedBaseName}_${timestamp}.${format}`;
  }

  /**
   * Validate file size
   * @param {number} size - The file size in bytes
   * @param {number} maxSize - The maximum allowed size in bytes
   * @returns {boolean} True if file size is valid
   */
  static validateFileSize(size, maxSize) {
    return size <= maxSize;
  }

  /**
   * Format file size for display
   * @param {number} bytes - The file size in bytes
   * @returns {string} The formatted file size string
   */
  static formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}