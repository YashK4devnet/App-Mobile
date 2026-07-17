import React from 'react';
import { ExclamationCircleIcon, CameraIcon, TrashIcon } from '../Icons';
import { Label } from './Label';
import { compressImage } from '../../utils/imageUtils';

export function FormImageUpload({ 
  label, 
  name, 
  value, 
  error, 
  onChange, 
  required = false,
  readOnly = false,
  disabled = false
}) {
  const cameraInputRef = React.useRef(null);
  const galleryInputRef = React.useRef(null);

  const imgUrl = typeof value === 'object' && value !== null ? value.url : value;
  const imgTimestamp = typeof value === 'object' && value !== null ? value.timestamp : '';
  const isPending = typeof value === 'object' && value !== null && value.pendingFetch;
  const hasImage = !!imgUrl;

  const isInteractive = !readOnly && !disabled;

  const handleFileChange = async (e) => {
    if (!isInteractive) return;
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file, 1280, 0.7);
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(now - offset)).toISOString().slice(0, 16);
        onChange(name, { url: compressedBase64, timestamp: localISOTime });
      } catch (err) {
        console.error("Failed to compress image", err);
      }
    }
  };

  const triggerCamera = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInteractive && cameraInputRef.current) cameraInputRef.current.click();
  };

  const triggerGallery = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInteractive && galleryInputRef.current) galleryInputRef.current.click();
  };

  const removeImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isInteractive) return;
    onChange(name, null);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const [isFullscreen, setIsFullscreen] = React.useState(false);

  return (
    <div className="space-y-1.5 text-left">
      <Label text={label} required={required} />
      
      {/* Camera Input */}
      <input 
        type="file" 
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleFileChange}
        className="hidden" 
        disabled={!isInteractive}
      />
      
      {/* Gallery Input */}
      <input 
        type="file" 
        accept="image/*"
        ref={galleryInputRef}
        onChange={handleFileChange}
        className="hidden" 
        disabled={!isInteractive}
      />

      <div 
        className={`relative w-full overflow-hidden rounded-xl border-2 border-dashed transition-all group ${
          hasImage || !isInteractive
            ? 'border-transparent' 
            : error 
              ? 'border-red-300 bg-red-50' 
              : 'border-white/20 bg-white/5'
        }`}
      >
        {isPending ? (
          <div className="relative aspect-video w-full bg-black/20 flex flex-col items-center justify-center border border-white/10 rounded-xl">
             <div className="w-6 h-6 border-2 border-[#4ecdc4] border-t-transparent rounded-full animate-spin mb-2"></div>
             <p className="text-[12px] text-white/50">Loading image...</p>
          </div>
        ) : hasImage ? (
          <>
            <div 
              className={`relative aspect-video w-full bg-black rounded-xl overflow-hidden border border-white/10 ${!isInteractive ? 'cursor-pointer' : ''}`}
              onClick={() => { if (!isInteractive) setIsFullscreen(true); }}
            >
              <img src={imgUrl} alt={label} className="w-full h-full object-contain opacity-90 transition-opacity" />
              {isInteractive && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    type="button" 
                    onClick={triggerCamera}
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    Retake
                  </button>
                  <button 
                    type="button" 
                    onClick={removeImage}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Fullscreen Image Modal */}
            {isFullscreen && (
              <div 
                className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-pointer"
                onClick={() => setIsFullscreen(false)}
              >
                <div className="absolute top-safe right-4 mt-4">
                  <button 
                    type="button"
                    className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full backdrop-blur-md transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <img 
                  src={imgUrl} 
                  alt={label} 
                  className="max-w-full max-h-full object-contain select-none" 
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </>
        ) : !isInteractive ? (
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center bg-white/5 rounded-xl border border-white/10">
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-2">
              <CameraIcon className="w-5 h-5 text-white/30" />
            </div>
            <p className="text-[12px] font-medium text-white/50">No image available</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="w-12 h-12 bg-[#ff6b6b]/10 rounded-full flex items-center justify-center mb-3 shadow-sm text-[#ff6b6b]">
              <CameraIcon className="w-6 h-6" />
            </div>
            <p className="text-[13px] font-medium text-white/90 mb-3">{label}</p>
            
            <div className="flex gap-3">
              <button
                type="button"
                onClick={triggerCamera}
                className="bg-[#ff6b6b] hover:bg-[#ff6b6b]/80 text-white px-4 py-2 rounded-xl text-[12px] font-medium transition-colors shadow-sm active:scale-95 cursor-pointer"
              >
                Take Photo
              </button>
              <button
                type="button"
                onClick={triggerGallery}
                className="bg-white/10 border border-white/20 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[12px] font-medium transition-colors shadow-sm active:scale-95 cursor-pointer"
              >
                Upload
              </button>
            </div>
          </div>
        )}
      </div>

      {hasImage && isInteractive && (
        <div className="mt-2.5 p-3 bg-white/5 border border-white/20 rounded-xl space-y-1">
          <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider block">
            Photo Timestamp (Auto-generated, editable)
          </label>
          <input
            type="datetime-local"
            value={imgTimestamp || ''}
            onChange={(e) => {
              onChange(name, { url: imgUrl, timestamp: e.target.value });
            }}
            className="w-full bg-white/5 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1.5 text-[13px] text-white focus:border-[#4ecdc4] outline-none"
          />
        </div>
      )}

      {error && !readOnly && (
        <p className="text-[11px] text-[#ff6b6b] font-medium mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
