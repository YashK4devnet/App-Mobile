import React, { useRef, useState, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { ExclamationCircleIcon, CameraIcon, TrashIcon } from '../Icons';
import { Label } from './Label';

// Handle ES module default import mismatch with react-signature-canvas in Vite
const SignatureCanvasComponent = SignatureCanvas.default || SignatureCanvas;

export function FormSignature({
  label,
  name,
  value,
  error,
  onChange,
  required = false
}) {
  const [activeTab, setActiveTab] = useState('draw'); // 'draw' or 'upload'
  const sigCanvas = useRef(null);
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const imgUrl = typeof value === 'object' && value !== null ? value.url : value;
  const imgTimestamp = typeof value === 'object' && value !== null ? value.timestamp : '';
  const hasImage = !!imgUrl;

  useEffect(() => {
    const handleResize = () => {
      if (sigCanvas.current && activeTab === 'draw' && !hasImage) {
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
    
    if (activeTab === 'draw' && !hasImage) {
      window.addEventListener('resize', handleResize);
      setTimeout(handleResize, 50);
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab, hasImage]);

  const saveSignature = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
      const dataURL = sigCanvas.current.getTrimmedCanvas().toDataURL('image/png');
      const now = new Date();
      const offset = now.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(now - offset)).toISOString().slice(0, 16);
      onChange(name, { url: dataURL, timestamp: localISOTime });
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
    setActiveTab('draw');
  };

  return (
    <div className="space-y-1.5 text-left">
      <Label text={label} required={required} />
      
      {/* Hidden file inputs for upload tab */}
      <input 
        type="file" 
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleFileChange}
        className="hidden" 
      />
      <input 
        type="file" 
        accept="image/*"
        ref={galleryInputRef}
        onChange={handleFileChange}
        className="hidden" 
      />

      <div 
        className={`relative w-full overflow-hidden rounded-xl border transition-all group flex flex-col ${
          hasImage 
            ? 'border-transparent bg-transparent' 
            : error 
              ? 'border-red-300 bg-red-50' 
              : 'border-slate-300 bg-slate-50'
        }`}
      >
        {hasImage ? (
          <div className="relative border-2 border-transparent group">
             <div className="relative aspect-[21/9] w-full bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200">
               <img src={imgUrl} alt={label} className="w-full h-full object-contain p-2 opacity-90 group-hover:opacity-100 transition-opacity bg-white" />
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                 <button 
                   type="button" 
                   onClick={removeImage}
                   className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                 >
                   <TrashIcon className="w-3.5 h-3.5" />
                   Discard
                 </button>
               </div>
             </div>
          </div>
        ) : (
          <div className="flex flex-col h-full w-full">
            {/* Tabs */}
            <div className="flex w-full border-b border-slate-200 bg-white/50">
              <button
                type="button"
                onClick={() => setActiveTab('draw')}
                className={`flex-1 py-2 text-[12px] font-bold transition-colors cursor-pointer ${activeTab === 'draw' ? 'text-[#F98A15] border-b-2 border-[#F98A15] bg-white' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                Draw Signature
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-2 text-[12px] font-bold transition-colors cursor-pointer ${activeTab === 'upload' ? 'text-[#F98A15] border-b-2 border-[#F98A15] bg-white' : 'text-slate-500 hover:bg-slate-100'}`}
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
                      className="bg-white border border-slate-200 text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={saveSignature}
                      className="bg-[#F98A15] hover:bg-[#e07b0f] text-white px-4 py-1.5 rounded-lg text-[11px] font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="flex flex-col items-center justify-center py-8 px-4 text-center bg-white">
                <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mb-3 text-[#F98A15] shadow-sm">
                  <CameraIcon className="w-6 h-6" />
                </div>
                <p className="text-[13px] font-bold text-slate-700 mb-3">Upload signature or seal</p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={triggerCamera}
                    className="bg-[#F98A15] hover:bg-[#e07b0f] text-white px-4 py-2 rounded-xl text-[12px] font-bold transition-colors shadow-sm active:scale-95 cursor-pointer"
                  >
                    Take Photo
                  </button>
                  <button
                    type="button"
                    onClick={triggerGallery}
                    className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-xl text-[12px] font-bold transition-colors shadow-sm active:scale-95 cursor-pointer"
                  >
                    Upload File
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {hasImage && (
        <div className="mt-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Signature Timestamp (Auto-generated, editable)
          </label>
          <input
            type="datetime-local"
            value={imgTimestamp || ''}
            onChange={(e) => {
              onChange(name, { url: imgUrl, timestamp: e.target.value });
            }}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-[13px] text-slate-800 focus:border-[#F98A15] outline-none"
          />
        </div>
      )}

      {error && (
        <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
          <ExclamationCircleIcon className="w-3.5 h-3.5" />
          {error}
        </p>
      )}
    </div>
  );
}
