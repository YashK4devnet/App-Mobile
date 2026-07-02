import React from 'react';

export const Label = ({ htmlFor, text, required }) => (
  <label htmlFor={htmlFor} className="text-[13px] font-light tracking-wide text-white block mb-2 leading-tight">
    {text} {required && <span className="text-[#ff6b6b]">*</span>}
  </label>
);
