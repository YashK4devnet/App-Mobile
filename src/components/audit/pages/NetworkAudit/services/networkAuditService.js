import { reportApiService } from '../../../services/reportApiService';

/**
 * Dynamically generates the initial state object by traversing the provided schemas.
 */
export const generateInitialState = (schemas, odooData = null) => {
  const state = {};

  // Helper to find a specific line by id across all arrays in odooData
  const getOdooLine = (idStr) => {
    if (!odooData || !idStr.startsWith('odoo_')) return null;
    
    let id;
    const match = idStr.match(/^odoo_.+___(\d+)$/);
    if (match) {
      id = parseInt(match[1], 10);
    } else {
      id = parseInt(idStr.replace('odoo_', ''), 10);
    }
    
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
    
    if (fieldType === 'network-question') {
      const lineData = getOdooLine(f.name);
      state[f.name] = { 
        findings: lineData?.score || lineData?.findings || '', 
        remark: [lineData?.remark, lineData?.remarks].filter(Boolean).join(' - ') || '', 
        image: null 
      };
    } else if (fieldType === 'image-upload') {
      state[f.name] = null;
    } else if (fieldType === 'device-photo-list' || fieldType === 'custom-questions') {
      state[f.name] = [];
    } else if (fieldType === 'numbered-text-list') {
      state[f.name] = [];
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
        else if (f.name === 'address') odooVal = [odooData.venue?.city, odooData.venue?.state].filter(Boolean).join(', ');
      }
      state[f.name] = odooVal || f.value || ''; 
    }
  };

  Object.values(schemas).forEach(schema => schema.forEach(processField));
  
  // Hardcoded default map selection since it's a radio group that defaults empty
  state.isMapAccurate = '';
  return state;
};

const getFieldValue = (data, fieldName) => {
  if (!data) return undefined;
  if (data[fieldName] !== undefined) return data[fieldName];
  
  const reconstructed = {};
  let found = false;
  if (typeof data === 'object') {
    Object.keys(data).forEach(key => {
      if (key.startsWith(fieldName + '.')) {
        const subKey = key.split('.')[1];
        reconstructed[subKey] = data[key];
        found = true;
      }
    });
  }
  return found ? reconstructed : undefined;
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
        if (!getFieldValue(data, f.name)?.observation) err.observation = "Observation is required";
        
        const imgVal = getFieldValue(data, f.name)?.image;
        const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
        if (!hasImg) err.image = "Evidence image is required";
        
        if (Object.keys(err).length > 0) errors[f.name] = err;
      } else if (fieldType === 'image-upload') {
        const val = getFieldValue(data, f.name);
        const hasImg = typeof val === 'object' && val !== null ? !!val.url : !!val;
        if (!hasImg) errors[f.name] = "Image is required";
      } else if (fieldType === 'device-photo-list') {
        const list = getFieldValue(data, f.name) || [];
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
        const list = getFieldValue(data, f.name) || [];
        if (list.length === 0) {
          errors[f.name] = "At least one entry is required";
        } else {
          const hasEmpty = list.some(item => {
            const val = typeof item === 'object' && item !== null ? item.observation : item;
            return !val || typeof val.trim !== 'function' || !val.trim();
          });
          if (hasEmpty) errors[f.name] = "Entries cannot be empty";
        }
      } else {
        if (!getFieldValue(data, f.name)) errors[f.name] = `${f.label || 'Field'} is required`;
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
      const qVal = getFieldValue(data, f.name);
      const imgVal = qVal?.image;
      const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
      hasVal = !!(qVal?.observation || qVal?.remarks || hasImg);
    } else if (fieldType === 'device-photo-list' || fieldType === 'custom-questions') {
      const list = getFieldValue(data, f.name) || [];
      hasVal = list.length > 0;
    } else if (fieldType === 'numbered-text-list') {
      const list = getFieldValue(data, f.name) || [];
      hasVal = list.length > 0;
    } else {
      const val = getFieldValue(data, f.name);
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
      const qVal = getFieldValue(data, f.name);
      const imgVal = qVal?.image;
      const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
      if (qVal?.observation && hasImg) filled++;
    } else if (fieldType === 'device-photo-list' || fieldType === 'custom-questions') {
      const list = getFieldValue(data, f.name) || [];
      const validCount = list.filter(item => {
        const imgVal = item.deviceImage || item.image; // handle both device image and custom question image
        const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
        return (item.deviceName || item.questionTitle) && hasImg;
      }).length;
      if (validCount > 0) filled++;
    } else if (fieldType === 'numbered-text-list') {
      const list = getFieldValue(data, f.name) || [];
      const validCount = list.filter(item => {
        const val = typeof item === 'object' && item !== null ? item.observation : item;
        return val && typeof val.trim === 'function' && val.trim();
      }).length;
      if (validCount > 0) filled++;
    } else {
      const val = getFieldValue(data, f.name);
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

/**
 * Parses the current section data and saves it to the backend via the PATCH lines API.
 */
export const saveNetworkSection = async (reportId, schema, currentData, payloadKey) => {
  console.warn(`[DIAGNOSTICS] Starting saveNetworkSection. reportId: ${reportId}, payloadKey: ${payloadKey}`);
  console.warn(`[DIAGNOSTICS] Schema length: ${schema ? schema.length : 0}`);
  
  if (!schema || schema.length === 0) {
    console.warn("[DIAGNOSTICS] Schema is empty. Exiting.");
    return;
  }

  if (payloadKey === 'Signatures') {
    const signatures = {};
    schema.forEach(f => {
      let val = currentData[f.name];
      if (f.type === 'signature' || f.type === 'image-upload') {
        let imgData = val?.url || "";
        if (imgData.includes(',')) imgData = imgData.split(',')[1];
        signatures[f.name] = imgData;
      } else {
        signatures[f.name] = val || "";
      }
    });
    return reportApiService.patchAuditSection(reportId, { signatures });
  }

  const promises = [];
  const payloadsByLineField = {};

  const processField = (f) => {
    if (f.type === 'heading' || f.type === 'row' || f.type === 'group') {
      if (f.fields) f.fields.forEach(processField);
      return;
    }
    if (!f.name) return;

    let val = currentData[f.name];
    
    // In case react-hook-form flattened the values (e.g., 'odoo_network_architecture_lines___1609.findings'),
    // we reconstruct the object if val is undefined.
    if (val === undefined) {
      val = {};
      let found = false;
      Object.keys(currentData).forEach(key => {
        if (key.startsWith(f.name + '.')) {
          const subKey = key.split('.')[1];
          val[subKey] = currentData[key];
          found = true;
        }
      });
      if (!found) return;
    }

    // Process existing lines: odoo_{lineField}___{id}
    const lineMatch = f.name.match(/^odoo_(.+)___(\d+)$/);
    if (lineMatch) {
      const lineField = lineMatch[1];
      const id = parseInt(lineMatch[2], 10);
      
      if (!payloadsByLineField[lineField]) {
        payloadsByLineField[lineField] = [];
      }
      
      const linePayload = { id };
      if (f.fields) {
        f.fields.forEach(sub => {
          if (sub.type === 'image-upload') {
            let imgData = val[sub.name]?.url || "";
            if (imgData.includes(',')) {
              imgData = imgData.split(',')[1];
            }
            linePayload[sub.name] = imgData;
          } else {
            linePayload[sub.name] = val[sub.name] || "";
          }
        });
      }
      
      payloadsByLineField[lineField].push(linePayload);
      return;
    }

    // Process custom questions: customQuestions___{lineField}
    const customMatch = f.name.match(/^customQuestions___(.+)$/);
    if (customMatch) {
      const lineField = customMatch[1];
      const customArray = val || [];
      
      if (!payloadsByLineField[lineField]) {
        payloadsByLineField[lineField] = [];
      }
      
      if (Array.isArray(customArray)) {
        customArray.forEach(item => {
          if (item.questionTitle || item.name) {
            const linePayload = {};
            if (f.fields) {
              f.fields.forEach(sub => {
                const subValName = sub.name === 'questionTitle' ? 'name' : sub.name;
                if (sub.type === 'image-upload') {
                  let imgData = item[sub.name]?.url || "";
                  if (imgData.includes(',')) {
                    imgData = imgData.split(',')[1];
                  }
                  linePayload[subValName] = imgData;
                } else {
                  linePayload[subValName] = item[sub.name] || "";
                }
              });
            }
            payloadsByLineField[lineField].push(linePayload);
          }
        });
      }
      return;
    }
  };

  schema.forEach(processField);

  console.warn("[DIAGNOSTICS] payloadsByLineField collected:", JSON.stringify(payloadsByLineField, null, 2));

  // Send PATCH request for each lineField collected
  Object.entries(payloadsByLineField).forEach(([lineField, lines]) => {
    if (lines.length > 0) {
      console.warn(`[DIAGNOSTICS] Dispatching patchAuditLines for ${lineField} with ${lines.length} lines`);
      promises.push(reportApiService.patchAuditLines(reportId, lineField, lines));
    }
  });

  console.warn(`[DIAGNOSTICS] Promises array size: ${promises.length}`);
  
  if (promises.length === 0) {
    console.warn("[DIAGNOSTICS] No promises to dispatch. Check if currentData had matching fields.");
  }

  try {
    await Promise.all(promises);
    console.warn("[DIAGNOSTICS] saveNetworkSection completed successfully");
  } catch (err) {
    console.error("[DIAGNOSTICS] Error during Promise.all:", err);
    throw err;
  }
};
