import { reportApiService } from '../../../services/reportApiService';

/**
 * Dynamically generates the initial state object by traversing the provided schemas.
 * Reduces the need for manual state initialization.
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
    
    if (fieldType === 'power-question' || fieldType === 'power-photo-question') {
      const lineData = getOdooLine(f.name);
      let imgObj = null;
      if (lineData?.id) {
        // We will fetch this lazily
        imgObj = { pendingFetch: true, odooId: lineData.id, isFromServer: true };
      }

      state[f.name] = { 
        findings: [lineData?.findings, lineData?.remark].filter(Boolean).join(' - ') || '', 
        score: lineData?.score || '', 
        image: imgObj 
      };
    } else if (fieldType === 'document-list' || fieldType === 'custom-questions' || fieldType === 'numbered-text-list') {
      state[f.name] = [];
    } else if (fieldType === 'signature' || f.name === 'centerSeal') {
      let hasSig = false;
      let imgData = null;
      let timestamp = '';
      if (odooData?.signatures) {
        // The backend sends camelCase keys for signatures, e.g. hasAuditorSignature, auditorSignatureDate
        const sigKey = `has${f.name.charAt(0).toUpperCase() + f.name.slice(1)}`;
        hasSig = !!odooData.signatures[sigKey];
        
        const base64Data = odooData.signatures[f.name];
        
        if (base64Data) {
          // Check for Odoo double encoding pattern often seen in images
          let finalBase64 = base64Data;
          if (finalBase64.startsWith('Lzlq')) {
             try { finalBase64 = atob(finalBase64); } catch (e) {}
          }
          imgData = `data:image/png;base64,${finalBase64}`;
        } else if (hasSig) {
          // Fallback to a 1x1 transparent PNG if the backend says there is a signature but didn't send the data
          imgData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        }
        
        // Fetch the associated date (e.g. auditorSignatureDate)
        let rawDate = odooData.signatures[`${f.name}Date`];
        if (rawDate) {
          // datetime-local inputs require YYYY-MM-DDTHH:mm format. 
          // If the backend only sends YYYY-MM-DD, append T00:00.
          if (rawDate.length === 10) {
            timestamp = `${rawDate}T00:00`;
          } else {
            timestamp = rawDate;
          }
        }
      }
      state[f.name] = imgData ? { url: imgData, timestamp } : null;
    } else if (f.type === 'image-upload') {
      let val = null;
      if (odooData && odooData[f.name]) {
         val = { url: `data:image/jpeg;base64,${odooData[f.name]}` };
      }
      state[f.name] = val;
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
        else if (f.name === 'name') odooVal = odooData.venue?.name;
        else if (f.name === 'completeAddress') odooVal = [odooData.venue?.city, odooData.venue?.state].filter(Boolean).join(', ') || odooData.venue?.completeAddress;
        else if (f.name === 'auditScope') odooVal = odooData.auditScope;
        else if (f.name === 'activity') odooVal = odooData.activity;
        else if (f.name === 'location') odooVal = odooData.location;
      }
      state[f.name] = odooVal || f.value || ''; 
    }
  };

  Object.values(schemas).forEach(schema => schema.forEach(processField));
  
  // Hardcoded default map selection since it's a radio group that defaults empty
  state.googleMapLocationStatus = '';
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
      if (fieldType === 'power-question') {
        const err = {};
        if (!getFieldValue(data, f.name)?.score) err.score = "Score is required";
        
        const imgVal = getFieldValue(data, f.name)?.image;
        const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
        if (!hasImg) err.image = "Evidence image is required";
        
        if (Object.keys(err).length > 0) errors[f.name] = err;
      } else if (fieldType === 'power-photo-question') {
        const err = {};
        const imgVal = getFieldValue(data, f.name)?.image;
        const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
        if (!hasImg) err.image = "Evidence image is required";
        
        if (Object.keys(err).length > 0) errors[f.name] = err;
      } else if (fieldType === 'image-upload') {
        const val = getFieldValue(data, f.name);
        const hasImg = typeof val === 'object' && val !== null ? !!val.url : !!val;
        if (!hasImg) errors[f.name] = "Image is required";
      } else {
        if (!getFieldValue(data, f.name)) errors[f.name] = `${f.label || 'Field'} is required`;
      }
    }

    // Dynamic list validation: if rows are added, validate they are completely filled
    if (fieldType === 'document-list') {
      const rows = getFieldValue(data, f.name) || [];
      const incomplete = rows.some(row => {
        const hasImg = typeof row.doc_image === 'object' && row.doc_image !== null 
          ? !!row.doc_image.url 
          : !!row.doc_image;
        return !row.doc_name || !hasImg;
      });
      if (incomplete) {
        errors[f.name] = "Please provide both a name and an image for all added documents";
      }
    } else if (fieldType === 'numbered-text-list') {
        const list = getFieldValue(data, f.name) || [];
        if (list.length === 0 && f.required) {
          errors[f.name] = "At least one entry is required";
        } else if (list.length > 0) {
          const hasEmpty = list.some(item => {
            const val = typeof item === 'object' && item !== null ? item.observation : item;
            return !val || typeof val.trim !== 'function' || !val.trim();
          });
          if (hasEmpty) errors[f.name] = "Entries cannot be empty";
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
      const val = getFieldValue(data, f.name);
      const hasImg = typeof val?.image === 'object' && val?.image !== null ? !!val.image.url : !!val?.image;
      if (val?.score || val?.findings || hasImg) empty = false;
    } else if (fieldType === 'power-photo-question') {
      const val = getFieldValue(data, f.name);
      const hasImg = typeof val?.image === 'object' && val?.image !== null ? !!val.image.url : !!val?.image;
      if (hasImg || val?.findings) empty = false;
    } else if (fieldType === 'document-list' || fieldType === 'custom-questions' || fieldType === 'numbered-text-list') {
      if (getFieldValue(data, f.name) && getFieldValue(data, f.name).length > 0) empty = false;
    } else {
      const val = getFieldValue(data, f.name);
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
      const val = getFieldValue(data, f.name);
      const hasImg = typeof val?.image === 'object' && val?.image !== null ? !!val.image.url : !!val?.image;
      if (val?.score && hasImg) filled++;
    } else if (fieldType === 'power-photo-question') {
      const val = getFieldValue(data, f.name);
      const hasImg = typeof val?.image === 'object' && val?.image !== null ? !!val.image.url : !!val?.image;
      if (hasImg) filled++;
    } else if (fieldType === 'document-list' || fieldType === 'custom-questions') {
      const list = getFieldValue(data, f.name) || [];
      // count any entries at all
      if (list.length > 0) filled++;
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
export const savePowerSection = async (reportId, schema, currentData, payloadKey) => {
  if (!reportId || !schema) return;

  const payloadsByLineField = {};

  const processField = (f) => {
    if (f.type === 'heading' || f.type === 'row' || f.type === 'group') {
      if (f.fields) f.fields.forEach(processField);
      return;
    }
    if (!f.name) return;

    let val = currentData[f.name];
    
    // In case react-hook-form flattened the values (e.g., 'odoo_some_lines___1609.findings'),
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
            const imgObj = val[sub.name];
            if (imgObj && imgObj.isFromServer) {
              // Image came from server and hasn't been modified, omit to save bandwidth
            } else {
              let imgData = imgObj?.url || "";
              if (imgData.includes(',')) {
                imgData = imgData.split(',')[1];
              }
              linePayload['evidence'] = imgData;
              linePayload['evidenceType'] = imgData ? 'image' : '';
            }
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

    if (f.name === 'equipmentDocuments') {
      const lineField = 'nameplate_document_equipment_lines';
      if (!payloadsByLineField[lineField]) payloadsByLineField[lineField] = [];
      const docsArray = val || [];
      if (Array.isArray(docsArray)) {
        docsArray.forEach(item => {
          if (item.doc_name) {
            let imgData = item.doc_image?.url || "";
            if (imgData.includes(',')) imgData = imgData.split(',')[1];
            payloadsByLineField[lineField].push({
              doc_name: item.doc_name,
              doc_image: imgData
            });
          }
        });
      }
      return;
    }

    if (f.name === 'obs_list') {
      const lineField = 'observation_lines';
      if (!payloadsByLineField[lineField]) payloadsByLineField[lineField] = [];
      const obsArray = val || [];
      if (Array.isArray(obsArray)) {
        let seq = 1;
        obsArray.forEach(item => {
          const obsVal = typeof item === 'object' && item !== null ? item.observation : item;
          if (obsVal) {
            payloadsByLineField[lineField].push({
              seq_no: seq++,
              comment: obsVal
            });
          }
        });
      }
      return;
    }
  };

  schema.forEach(processField);

  if (!schema || schema.length === 0) {
    console.warn("[DIAGNOSTICS] Schema is empty. Exiting.");
    return;
  }

  const promises = [];

  // Removed hardcoded Signatures block

  // Send standard flat fields in a separate patch if available
  const standardFields = {};
  const signatures = {};

  schema.forEach(f => {
    if (f.type === 'heading' || f.type === 'row' || f.type === 'group' || !f.name) return;
    const lineMatch = f.name.match(/^odoo_(.+)___(\d+)$/);
    const customMatch = f.name.match(/^customQuestions___(.+)$/);
    if (f.name === 'equipmentDocuments' || f.name === 'obs_list') return;
    if (!lineMatch && !customMatch && currentData[f.name] !== undefined) {
      if (f.type === 'signature' || f.name === 'centerSeal' || f.name === 'obs_venue_seal') {
        let imgData = currentData[f.name]?.url || "";
        if (imgData.includes(',')) imgData = imgData.split(',')[1];
        signatures[f.name] = imgData;
        
        const timestamp = currentData[f.name]?.timestamp;
        if (timestamp) {
           signatures[`${f.name}Date`] = timestamp;
        }
      } else if (f.name.toLowerCase().includes('signaturedate')) {
        signatures[f.name] = currentData[f.name] || "";
      } else if (f.type === 'image-upload') {
        let imgData = currentData[f.name]?.url || "";
        if (imgData.includes(',')) imgData = imgData.split(',')[1];
        standardFields[f.name] = imgData;
      } else {
        standardFields[f.name] = currentData[f.name];
      }
    }
  });

  if (Object.keys(standardFields).length > 0 && payloadKey && payloadKey !== 'Signatures' && payloadKey !== 'report' && payloadKey !== 'venue') {
    promises.push(reportApiService.patchAuditSection(reportId, { [payloadKey]: standardFields }));
  }

  if (Object.keys(signatures).length > 0) {
    promises.push(reportApiService.patchAuditSection(reportId, signatures));
  }

  // Send PATCH request for each lineField collected
  Object.entries(payloadsByLineField).forEach(([lineField, lines]) => {
    if (lines.length > 0) {
      promises.push(reportApiService.patchAuditLines(reportId, lineField, lines));
    }
  });

  await Promise.all(promises);
};
