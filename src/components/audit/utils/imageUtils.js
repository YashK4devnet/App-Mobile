/**
 * Image processing utilities
 */

/**
 * Compresses an image (File or Data URL) using HTML5 Canvas.
 * Returns a Promise that resolves to a smaller Base64 Data URL.
 * 
 * @param {File|string} fileOrDataUrl - The image to compress
 * @param {number} maxWidth - Maximum width (default 1280)
 * @param {number} quality - JPEG compression quality 0-1 (default 0.7)
 * @returns {Promise<string>} Compressed Base64 Data URL
 */
export const compressImage = (fileOrDataUrl, maxWidth = 1280, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    let src = fileOrDataUrl;
    let isFile = typeof fileOrDataUrl !== 'string';

    const processImage = (imageSrc) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Ensure solid background for transparent images when converting to JPEG
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = (err) => reject(new Error("Failed to load image for compression"));
      img.src = imageSrc;
    };

    if (isFile) {
      const reader = new FileReader();
      reader.onload = (e) => processImage(e.target.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(fileOrDataUrl);
    } else {
      processImage(src);
    }
  });
};

/**
 * Strips the Data URI prefix so the Base64 string can be sent to Odoo
 * 
 * @param {string} dataUrl - e.g. "data:image/jpeg;base64,/9j/4AAQSk..."
 * @returns {string} Raw Base64 string "/9j/4AAQSk..."
 */
export const prepareBase64ForOdoo = (dataUrl) => {
  if (!dataUrl) return false;
  if (typeof dataUrl !== 'string') return false;
  if (dataUrl.includes(',')) {
    return dataUrl.split(',')[1];
  }
  return dataUrl;
};
