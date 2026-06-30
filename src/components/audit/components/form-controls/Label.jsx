import React from 'react';

export const Label = ({ htmlFor, text, required }) => (
  <label htmlFor={htmlFor} className="text-[13px] font-semibold text-slate-800 block mb-2 leading-tight">
    {text} {required && <span className="text-red-500">*</span>}
  </label>
);
