import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { ExclamationCircleIcon, CameraIcon, TrashIcon } from '../Icons';
import { Label } from './Label';
import { compressImage } from '../../utils/imageUtils';

// Handle ES module default import mismatch with react-signature-canvas in Vite
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
  const [activeTab, setActiveTab] = useState('draw'); // 'draw' or 'upload'
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
      const dataURL = sigCanvas.current.getCanvas().toDataURL('image/png');
      try {
        const compressedBase64 = await compressImage(dataURL, 800, 0.8);
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(now - offset)).toISOString().slice(0, 16);
        onChange(name, { url: compressedBase64, timestamp: localISOTime });
      } catch (err) {
        console.error("Failed to compress signature image", err);
      }
    }
  };

  const clearSignature = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (sigCanvas.current && isInteractive) {
      sigCanvas.current.clear();
    }
  };

  const handleFileChange = async (e) => {
    if (!isInteractive) return;
    const file = e.target.files[0];
    if (file) {
      try {
        const compressedBase64 = await compressImage(file, 800, 0.8);
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
    
    // Switch back to draw tab as default
    setActiveTab('draw');
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
             <p className="text-[12px] text-white/50">Loading signature...</p>
          </div>
        ) : hasImage ? (
          <div className="relative border-2 border-transparent">
             <div className="relative aspect-[21/9] w-full bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
               <img src={imgUrl} alt={label} className="w-full h-full object-contain p-2 bg-white" />
               {isInteractive && (
                 <button 
                   type="button" 
                   onClick={removeImage}
                   className="absolute bottom-2 right-2 bg-rose-500 active:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-md transition-colors flex items-center gap-1 cursor-pointer"
                 >
                   <TrashIcon className="w-3.5 h-3.5" />
                   Remove
                 </button>
               )}
             </div>
          </div>
        ) : !isInteractive ? (
          <div className="flex flex-col items-center justify-center py-6 px-4 text-center bg-white/5 rounded-xl border border-white/10">
            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center mb-2">
              <CameraIcon className="w-5 h-5 text-white/30" />
            </div>
            <p className="text-[12px] font-medium text-white/50">No signature available</p>
          </div>
        ) : (
          <div className="flex flex-col h-full w-full">
            {/* Tabs */}
            <div className="flex w-full border-b border-white/20 bg-transparent">
              <button
                type="button"
                onClick={() => setActiveTab('draw')}
                className={`flex-1 py-2 text-[12px] font-medium transition-colors cursor-pointer ${activeTab === 'draw' ? 'text-[#ff6b6b] border-b-2 border-[#ff6b6b] bg-white/10' : 'text-white/50 hover:bg-white/10'}`}
              >
                Draw Signature
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 text-[12px] font-medium transition-colors cursor-pointer ${activeTab === 'upload' ? 'text-[#ff6b6b] border-b-2 border-[#ff6b6b] bg-white/10' : 'text-white/50 hover:bg-white/10'}`}
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
                      className="bg-white border border-slate-200 text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg text-[11px] font-medium shadow-sm transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={saveSignature}
                      className="bg-[#4ecdc4] hover:bg-[#4ecdc4]/80 text-[#0F0F23] px-4 py-1.5 rounded-lg text-[11px] font-medium shadow-sm transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-transparent">
                <div className="w-12 h-12 bg-[#ff6b6b]/10 border border-white/10 rounded-full flex items-center justify-center mb-3 text-[#ff6b6b] shadow-sm">
                  <CameraIcon className="w-6 h-6" />
                </div>
                <p className="text-[13px] font-medium text-white/90 mb-3">Upload signature or seal</p>
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
                    Upload File
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {hasImage && isInteractive && (
        <div className="mt-2.5 p-3 bg-white/5 border border-white/20 rounded-xl space-y-1">
          <label className="text-[10px] font-medium text-white/50 uppercase tracking-wider block">
            Signature Timestamp (Auto-generated, editable)
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
