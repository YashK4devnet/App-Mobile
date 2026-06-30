/**
 * Dynamically generates the initial state object by traversing the provided schemas.
 * Reduces the need for manual state initialization.
 */
export const generateInitialState = (schemas) => {
  const state = {};
  
  const processField = (f) => {
    if (f.type === 'heading' || f.type === 'row' || f.type === 'group') {
      if (f.fields) f.fields.forEach(processField);
      return;
    }
    if (!f.name) return;
    
    if (f.type === 'power-question') {
      state[f.name] = { score: '', findings: '', image: null };
    } else if (f.type === 'power-photo-question') {
      state[f.name] = { image: null, findings: '' };
    } else if (f.type === 'document-list') {
      state[f.name] = [];
    } else if (f.type === 'image-upload') {
      state[f.name] = null;
    } else {
      state[f.name] = f.value || ''; 
    }
  };

  Object.values(schemas).forEach(schema => schema.forEach(processField));
  
  // Hardcoded default map selection since it's a radio group that defaults empty
  state.isMapAccurate = '';
  return state;
};

/**
 * Validates any given subsection schema dynamically.
 */
export const validateSchema = (schema, data) => {
  const errors = {};

  const processField = (f) => {
    if (f.type === 'heading' || f.type === 'row' || f.type === 'group') {
      if (f.fields) f.fields.forEach(processField);
      return;
    }
    if (!f.name) return;
    if (f.showIf && !f.showIf(data)) return;

    if (f.required) {
      if (f.type === 'power-question') {
        const err = {};
        if (!data[f.name]?.score) err.score = "Score is required";
        
        const imgVal = data[f.name]?.image;
        const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
        if (!hasImg) err.image = "Evidence image is required";
        
        if (Object.keys(err).length > 0) errors[f.name] = err;
      } else if (f.type === 'power-photo-question') {
        const err = {};
        const imgVal = data[f.name]?.image;
        const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
        if (!hasImg) err.image = "Evidence image is required";
        
        if (Object.keys(err).length > 0) errors[f.name] = err;
      } else if (f.type === 'image-upload') {
        const val = data[f.name];
        const hasImg = typeof val === 'object' && val !== null ? !!val.url : !!val;
        if (!hasImg) errors[f.name] = "Image is required";
      } else {
        if (!data[f.name]) errors[f.name] = `${f.label || 'Field'} is required`;
      }
    }

    // Dynamic list validation: if rows are added, validate they are completely filled
    if (f.type === 'document-list') {
      const rows = data[f.name] || [];
      const incomplete = rows.some(row => {
        const hasImg = typeof row.documentImage === 'object' && row.documentImage !== null 
          ? !!row.documentImage.url 
          : !!row.documentImage;
        return !row.documentName || !hasImg;
      });
      if (incomplete) {
        errors[f.name] = "Please provide both a name and an image for all added documents";
      }
    }
  };

  schema.forEach(processField);
  return errors;
};

/**
 * Checks if a section is completely empty (no interactions made).
 */
export const isSchemaEmpty = (schema, data) => {
  let empty = true;

  const processField = (f) => {
    if (f.type === 'heading' || f.type === 'row' || f.type === 'group') {
      if (f.fields) f.fields.forEach(processField);
      return;
    }
    if (!f.name) return;
    if (f.showIf && !f.showIf(data)) return;
    if (f.disabled) return; 

    if (f.type === 'power-question') {
      const val = data[f.name];
      const hasImg = typeof val?.image === 'object' && val?.image !== null ? !!val.image.url : !!val?.image;
      if (val?.score || val?.findings || hasImg) empty = false;
    } else if (f.type === 'power-photo-question') {
      const val = data[f.name];
      const hasImg = typeof val?.image === 'object' && val?.image !== null ? !!val.image.url : !!val?.image;
      if (hasImg || val?.findings) empty = false;
    } else if (f.type === 'document-list') {
      if (data[f.name] && data[f.name].length > 0) empty = false;
    } else {
      const val = data[f.name];
      const hasVal = typeof val === 'object' && val !== null ? !!val.url : (val && val !== f.value);
      if (hasVal) empty = false; 
    }
  };

  schema.forEach(processField);
  return empty;
};

/**
 * Calculates progress for a specific subsection dynamically.
 */
export const calculateSchemaProgress = (schema, data) => {
  let total = 0;
  let filled = 0;

  const processField = (f) => {
    if (f.type === 'heading' || f.type === 'row' || f.type === 'group') {
      if (f.fields) f.fields.forEach(processField);
      return;
    }
    if (!f.name) return;
    if (f.showIf && !f.showIf(data)) return;
    
    total++;
    if (f.type === 'power-question') {
      const val = data[f.name];
      const hasImg = typeof val?.image === 'object' && val?.image !== null ? !!val.image.url : !!val?.image;
      if (val?.score && hasImg) filled++;
    } else if (f.type === 'power-photo-question') {
      const val = data[f.name];
      const hasImg = typeof val?.image === 'object' && val?.image !== null ? !!val.image.url : !!val?.image;
      if (hasImg) filled++;
    } else {
      const val = data[f.name];
      const hasVal = typeof val === 'object' && val !== null ? !!val.url : !!val;
      if (hasVal) filled++;
    }
  };

  schema.forEach(processField);
  return { total, filled, percent: Math.round((filled / (total || 1)) * 100) };
};

/**
 * Calculates the global progress across all schemas dynamically.
 */
export const calculateGlobalProgress = (schemas, data) => {
  let globalTotal = 0;
  let globalFilled = 0;
  
  Object.values(schemas).forEach(schema => {
    const { total, filled } = calculateSchemaProgress(schema, data);
    globalTotal += total;
    globalFilled += filled;
  });

  return Math.round((globalFilled / (globalTotal || 1)) * 100);
};
