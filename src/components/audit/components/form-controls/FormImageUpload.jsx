import React from 'react';
import { ExclamationCircleIcon, CameraIcon, TrashIcon } from '../Icons';
import { Label } from './Label';

export function FormImageUpload({ 
  label, 
  name, 
  value, 
  error, 
  onChange, 
  required = false 
}) {
  const cameraInputRef = React.useRef(null);
  const galleryInputRef = React.useRef(null);

  const imgUrl = typeof value === 'object' && value !== null ? value.url : value;
  const imgTimestamp = typeof value === 'object' && value !== null ? value.timestamp : '';
  const hasImage = !!imgUrl;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(now - offset)).toISOString().slice(0, 16);
        onChange(name, { url: reader.result, timestamp: localISOTime });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCamera = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cameraInputRef.current) cameraInputRef.current.click();
  };

  const triggerGallery = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (galleryInputRef.current) galleryInputRef.current.click();
  };

  const removeImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(name, null);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

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
      />
      
      {/* Gallery Input */}
      <input 
        type="file" 
        accept="image/*"
        ref={galleryInputRef}
        onChange={handleFileChange}
        className="hidden" 
      />

      <div 
        className={`relative w-full overflow-hidden rounded-xl border-2 border-dashed transition-all group ${
          hasImage 
            ? 'border-transparent' 
            : error 
              ? 'border-red-300 bg-red-50' 
              : 'border-white/20 bg-white/5'
        }`}
      >
        {hasImage ? (
          <div className="relative aspect-video w-full bg-black">
            <img src={imgUrl} alt={label} className="w-full h-full object-contain opacity-90 group-hover:opacity-100 transition-opacity" />
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

      {hasImage && (
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

      {error && (
        <p className="text-[11px] text-[#ff6b6b] font-medium mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
