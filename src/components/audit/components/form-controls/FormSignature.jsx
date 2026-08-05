import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { ExclamationCircleIcon, CameraIcon, TrashIcon } from '../Icons';
import { Label } from './Label';
import { compressImage } from '../../utils/imageUtils';

const SignatureCanvasComponent = SignatureCanvas.default || SignatureCanvas;

export function FormSignature({
  label,
  name,
  value,
  error,
  onChange,
  required = false,
  readOnly = false,
  disabled = false
}) {
  const [activeTab, setActiveTab] = useState('draw');
  const sigCanvas = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const imgUrl = typeof value === 'object' && value !== null ? value.url : value;
  const imgTimestamp = typeof value === 'object' && value !== null ? value.timestamp : '';
  const isPending = typeof value === 'object' && value !== null && value.pendingFetch;
  const hasImage = !!imgUrl;

  const isInteractive = !readOnly && !disabled;

  useEffect(() => {
    const handleResize = () => {
      if (sigCanvas.current && activeTab === 'draw' && !hasImage && isInteractive) {
        const canvas = sigCanvas.current.getCanvas();
        if (canvas) {
          const ratio = Math.max(window.devicePixelRatio || 1, 1);
          canvas.width = canvas.offsetWidth * ratio;
          canvas.height = canvas.offsetHeight * ratio;
          canvas.getContext("2d").scale(ratio, ratio);
          sigCanvas.current.clear();
        }
      }
    };
    
    if (activeTab === 'draw' && !hasImage && isInteractive) {
      window.addEventListener('resize', handleResize);
      setTimeout(handleResize, 50);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab, hasImage, isInteractive]);

  const saveSignature = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!isInteractive) return;
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataUrl = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(now - offset)).toISOString().slice(0, 16);
      onChange(name, { url: dataUrl, timestamp: localISOTime });
    }
  };

  const clearSignature = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (sigCanvas.current) {
      sigCanvas.current.clear();
    }
  };

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
        console.error("Failed to compress signature image", err);
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
    if (sigCanvas.current) sigCanvas.current.clear();
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
  };

  const [isFullscreen, setIsFullscreen] = useState(false);

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
              ? 'border-rose-300 bg-rose-50' 
              : 'border-slate-300 bg-white'
        }`}
      >
        {isPending ? (
          <div className="relative aspect-video w-full bg-slate-100 flex flex-col items-center justify-center border border-slate-200 rounded-xl">
             <div className="w-6 h-6 border-2 border-[#ff7700] border-t-transparent rounded-full animate-spin mb-2"></div>
             <p className="text-[12px] text-slate-500 font-medium">Loading signature...</p>
          </div>
        ) : hasImage ? (
          <>
            <div 
              className={`relative aspect-video w-full bg-white rounded-xl overflow-hidden border border-slate-300 shadow-xs ${!isInteractive ? 'cursor-pointer' : ''}`}
              onClick={() => { if (!isInteractive) setIsFullscreen(true); }}
            >
              <img src={imgUrl} alt={label} className="w-full h-full object-contain p-2 transition-opacity" />
              {isInteractive && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button 
                    type="button" 
                    onClick={removeImage}
                    className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                    Clear / Re-sign
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
                  className="max-w-full max-h-full object-contain bg-white rounded-xl p-4 select-none" 
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}
          </>
        ) : !isInteractive ? (
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center bg-slate-100 rounded-xl border border-slate-200">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mb-2">
              <CameraIcon className="w-5 h-5 text-slate-400" />
            </div>
            <p className="text-[12px] font-medium text-slate-500">No signature available</p>
          </div>
        ) : (
          <div className="flex flex-col h-full w-full">
            {/* Tabs */}
            <div className="flex w-full border-b border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => setActiveTab('draw')}
                className={`flex-1 py-2 text-[12px] font-bold transition-colors cursor-pointer ${activeTab === 'draw' ? 'text-[#ff7700] border-b-2 border-[#ff7700] bg-white' : 'text-slate-500 hover:bg-white'}`}
              >
                Draw Signature
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 text-[12px] font-bold transition-colors cursor-pointer ${activeTab === 'upload' ? 'text-[#ff7700] border-b-2 border-[#ff7700] bg-white' : 'text-slate-500 hover:bg-white'}`}
              >
                Upload / Camera
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'draw' && (
              <div className="flex flex-col bg-white">
                <div className="w-full h-40 border-b border-dashed border-slate-200 relative bg-slate-50/50">
                  <SignatureCanvasComponent 
                    ref={sigCanvas}
                    penColor="black"
                    canvasProps={{className: 'w-full h-full cursor-crosshair touch-none'}}
                    backgroundColor="rgba(255, 255, 255, 0)"
                  />
                  <div className="absolute bottom-2 right-2 flex gap-2">
                     <button
                      type="button"
                      onClick={clearSignature}
                      className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-[11px] font-semibold shadow-xs transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={saveSignature}
                      className="bg-[#ff7700] hover:bg-[#ea580c] text-white px-4 py-1.5 rounded-lg text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-white">
                <div className="w-12 h-12 bg-[#ff7700]/10 border border-[#ff7700]/20 rounded-full flex items-center justify-center mb-3 text-[#ff7700] shadow-xs">
                  <CameraIcon className="w-6 h-6" />
                </div>
                <p className="text-[13px] font-bold text-[#0f172a] mb-3">Upload signature or seal</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={triggerCamera}
                    className="bg-[#ff7700] hover:bg-[#ea580c] text-white px-4 py-2 rounded-xl text-[12px] font-bold transition-colors shadow-xs active:scale-95 cursor-pointer"
                  >
                    Take Photo
                  </button>
                  <button
                    type="button"
                    onClick={triggerGallery}
                    className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-[12px] font-semibold transition-colors shadow-xs active:scale-95 cursor-pointer"
                  >
                    Upload File
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {hasImage && isInteractive && (
        <div className="mt-2.5 p-3 bg-white border border-slate-200 rounded-xl space-y-1 shadow-xs">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Signature Timestamp (Auto-generated, editable)
          </label>
          <input
            type="datetime-local"
            value={imgTimestamp || ''}
            onChange={(e) => {
              onChange(name, { url: imgUrl, timestamp: e.target.value });
            }}
            className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-[13px] text-[#0f172a] focus:border-[#ff7700] outline-none shadow-xs"
          />
        </div>
      )}

      {error && !readOnly && (
        <p className="text-[11px] text-rose-500 font-medium mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
