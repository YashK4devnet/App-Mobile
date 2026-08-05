import React from 'react';

export const Label = ({ htmlFor, text, required }) => (
  <label htmlFor={htmlFor} className="text-[13px] font-semibold tracking-tight text-[#0f172a] block mb-2 leading-tight">
    {text} {required && <span className="text-rose-500">*</span>}
  </label>
);
