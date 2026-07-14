/**
 * Dynamically generates the initial state object by traversing the provided schemas.
 * Reduces the need for manual state initialization.
 */
export const generateInitialState = (schemas, odooData = null) => {
  const state = {};
  
  // Helper to find a specific line by id across all arrays in odooData
  const getOdooLine = (idStr) => {
    if (!odooData || !idStr.startsWith('odoo_')) return null;
    const id = parseInt(idStr.replace('odoo_', ''), 10);
    
    for (const key of Object.keys(odooData)) {
      if (Array.isArray(odooData[key])) {
        const line = odooData[key].find(item => item.id === id);
        if (line) return line;
      }
    }
    return null;
  };
  
  const processField = (f) => {
    if (f.type === 'heading' || f.type === 'row' || f.type === 'group') {
      if (f.fields) f.fields.forEach(processField);
      return;
    }
    if (!f.name) return;
    
    const fieldType = f.subType || f.type;
    
    if (fieldType === 'power-question' || fieldType === 'power-photo-question') {
      const lineData = getOdooLine(f.name);
      state[f.name] = { 
        findings: [lineData?.findings, lineData?.remark].filter(Boolean).join(' - ') || '', 
        score: lineData?.score || '', 
        image: null 
      };
    } else if (fieldType === 'document-list' || fieldType === 'custom-questions') {
      state[f.name] = [];
    } else if (f.type === 'image-upload') {
      state[f.name] = null;
    } else {
      let odooVal = null;
      if (odooData) {
        if (f.name === 'reportName') odooVal = odooData.reportName || odooData.systemAuditName;
        else if (f.name === 'auditDate') odooVal = odooData.auditDate ? String(odooData.auditDate).split(' ')[0] : '';
        else if (f.name === 'auditorName') odooVal = odooData.auditorName || (odooData.auditors && odooData.auditors[0] ? odooData.auditors[0].auditor : '');
        else if (f.name === 'auditManager') odooVal = odooData.auditManager || '';
        else if (f.name === 'systemAuditName') odooVal = odooData.systemAuditName;
        else if (f.name === 'reportNumber') odooVal = odooData.reference || odooData.id?.toString();
        else if (f.name === 'state') odooVal = odooData.venue?.state;
        else if (f.name === 'city') odooVal = odooData.venue?.city;
        else if (f.name === 'venueName') odooVal = odooData.venue?.name;
        else if (f.name === 'address') odooVal = [odooData.venue?.city, odooData.venue?.state].filter(Boolean).join(', ') || odooData.venue?.completeAddress;
      }
      state[f.name] = odooVal || f.value || ''; 
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
      if (fieldType === 'power-question') {
        const err = {};
        if (!data[f.name]?.score) err.score = "Score is required";
        
        const imgVal = data[f.name]?.image;
        const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
        if (!hasImg) err.image = "Evidence image is required";
        
        if (Object.keys(err).length > 0) errors[f.name] = err;
      } else if (fieldType === 'power-photo-question') {
        const err = {};
        const imgVal = data[f.name]?.image;
        const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
        if (!hasImg) err.image = "Evidence image is required";
        
        if (Object.keys(err).length > 0) errors[f.name] = err;
      } else if (fieldType === 'image-upload') {
        const val = data[f.name];
        const hasImg = typeof val === 'object' && val !== null ? !!val.url : !!val;
        if (!hasImg) errors[f.name] = "Image is required";
      } else {
        if (!data[f.name]) errors[f.name] = `${f.label || 'Field'} is required`;
      }
    }

    // Dynamic list validation: if rows are added, validate they are completely filled
    if (fieldType === 'document-list') {
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

    const fieldType = f.subType || f.type;

    if (fieldType === 'power-question') {
      const val = data[f.name];
      const hasImg = typeof val?.image === 'object' && val?.image !== null ? !!val.image.url : !!val?.image;
      if (val?.score || val?.findings || hasImg) empty = false;
    } else if (fieldType === 'power-photo-question') {
      const val = data[f.name];
      const hasImg = typeof val?.image === 'object' && val?.image !== null ? !!val.image.url : !!val?.image;
      if (hasImg || val?.findings) empty = false;
    } else if (fieldType === 'document-list' || fieldType === 'custom-questions') {
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
    
    const fieldType = f.subType || f.type;
    
    total++;
    if (fieldType === 'power-question') {
      const val = data[f.name];
      const hasImg = typeof val?.image === 'object' && val?.image !== null ? !!val.image.url : !!val?.image;
      if (val?.score && hasImg) filled++;
    } else if (fieldType === 'power-photo-question') {
      const val = data[f.name];
      const hasImg = typeof val?.image === 'object' && val?.image !== null ? !!val.image.url : !!val?.image;
      if (hasImg) filled++;
    } else if (fieldType === 'document-list' || fieldType === 'custom-questions') {
      const list = data[f.name] || [];
      // count any entries at all
      if (list.length > 0) filled++;
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
