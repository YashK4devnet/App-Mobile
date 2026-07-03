import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon } from './Icons';

export default function AuditSuccessOverlay({ show, title, message }) {
  const navigate = useNavigate();

  if (!show) return null;

  return (
    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-6 animate-fade-in">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 text-center max-w-sm w-full shadow-2xl border border-white/20 scale-100 transition-transform duration-300">
        <div className="w-16 h-16 bg-[#4ecdc4]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#4ecdc4]/40">
          <CheckIcon className="w-8 h-8 text-[#4ecdc4]" />
        </div>
        <h4 className="text-lg font-bold text-white mb-1 leading-tight">
          {title}
        </h4>
        <p className="text-xs text-white/50 font-bold mb-6">
          {message}
        </p>
        <button
          type="button"
          onClick={() => navigate('..')}
          className="w-full py-3.5 bg-[#ff6b6b] hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-900/20 active:scale-[0.98] transition-all text-[14px] cursor-pointer"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
