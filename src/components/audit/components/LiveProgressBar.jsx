import React from 'react';
import { useWatch } from 'react-hook-form';
import ProgressBar from './ProgressBar';

/**
 * A wrapper around ProgressBar that subscribes to form changes in real-time.
 * This prevents the entire form page from re-rendering on every keystroke,
 * while still keeping the progress bar instantly updated.
 */
export default function LiveProgressBar({ schema, control, calculateProgressFn }) {
  // Subscribe to live form data updates for the progress bar
  const formData = useWatch({ control }) || {};
  
  // Calculate progress using the live data
  const subProgress = calculateProgressFn(schema, formData);
  
  return (
    <ProgressBar 
      percent={subProgress.percent}
      filled={subProgress.filled}
      total={subProgress.total}
      label="Subsection Progress"
    />
  );
}
