/**
 * Dynamically generates the initial state object by traversing the provided schemas.
 */
export const generateInitialState = (schemas) => {
  const state = {};
  
  const processField = (f) => {
    if (f.type === 'heading' || f.type === 'row' || f.type === 'group') {
      if (f.fields) f.fields.forEach(processField);
      return;
    }
    if (!f.name) return;
    
    const fieldType = f.subType || f.type;
    
    if (fieldType === 'network-question') {
      state[f.name] = { observation: '', remarks: '', image: null };
    } else if (fieldType === 'image-upload') {
      state[f.name] = null;
    } else if (fieldType === 'device-photo-list' || fieldType === 'custom-questions') {
      state[f.name] = [];
    } else if (fieldType === 'numbered-text-list') {
      state[f.name] = [];
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

    const fieldType = f.subType || f.type;

    if (f.required) {
      if (fieldType === 'network-question') {
        const err = {};
        if (!data[f.name]?.observation) err.observation = "Observation is required";
        
        const imgVal = data[f.name]?.image;
        const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
        if (!hasImg) err.image = "Evidence image is required";
        
        if (Object.keys(err).length > 0) errors[f.name] = err;
      } else if (fieldType === 'image-upload') {
        const val = data[f.name];
        const hasImg = typeof val === 'object' && val !== null ? !!val.url : !!val;
        if (!hasImg) errors[f.name] = "Image is required";
      } else if (fieldType === 'device-photo-list') {
        const list = data[f.name] || [];
        if (list.length === 0) {
          errors[f.name] = "At least one photo is required";
        } else {
          const hasInvalid = list.some(item => {
            const imgVal = item.deviceImage;
            const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
            return !item.deviceName || !hasImg;
          });
          if (hasInvalid) errors[f.name] = "All entries must have a name and photo";
        }
      } else if (fieldType === 'numbered-text-list') {
        const list = data[f.name] || [];
        if (list.length === 0) {
          errors[f.name] = "At least one entry is required";
        } else {
          const hasEmpty = list.some(item => !item || !item.trim());
          if (hasEmpty) errors[f.name] = "Entries cannot be empty";
        }
      } else {
        if (!data[f.name]) errors[f.name] = `${f.label || 'Field'} is required`;
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

    const fieldType = f.subType || f.type;

    let hasVal = false;
    if (fieldType === 'network-question') {
      const qVal = data[f.name];
      const imgVal = qVal?.image;
      const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
      hasVal = !!(qVal?.observation || qVal?.remarks || hasImg);
    } else if (fieldType === 'device-photo-list' || fieldType === 'custom-questions') {
      const list = data[f.name] || [];
      hasVal = list.length > 0;
    } else if (fieldType === 'numbered-text-list') {
      const list = data[f.name] || [];
      hasVal = list.length > 0;
    } else {
      const val = data[f.name];
      hasVal = typeof val === 'object' && val !== null ? !!val.url : (val && val !== f.value);
    }
    
    if (hasVal) empty = false; 
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
    
    const fieldType = f.subType || f.type;
    
    total++;
    if (fieldType === 'network-question') {
      const qVal = data[f.name];
      const imgVal = qVal?.image;
      const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
      if (qVal?.observation && hasImg) filled++;
    } else if (fieldType === 'device-photo-list' || fieldType === 'custom-questions') {
      const list = data[f.name] || [];
      const validCount = list.filter(item => {
        const imgVal = item.deviceImage || item.image; // handle both device image and custom question image
        const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
        return (item.deviceName || item.questionTitle) && hasImg;
      }).length;
      if (validCount > 0) filled++;
    } else if (fieldType === 'numbered-text-list') {
      const list = data[f.name] || [];
      const validCount = list.filter(item => item && item.trim()).length;
      if (validCount > 0) filled++;
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
