import { reportApiService } from '../../../services/reportApiService';
import { decodeOdooImage } from '../../../utils/imageUtils';

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
      let imgObj = null;
      if (lineData?.id) {
        // We will fetch this lazily
        imgObj = { pendingFetch: true, odooId: lineData.id, isFromServer: true };
      }

      state[f.name] = { 
        observation: lineData?.score || lineData?.findings || '', 
        remarks: [lineData?.remark, lineData?.remarks].filter(Boolean).join(' - ') || '', 
        image: imgObj 
      };
    } else if (fieldType === 'network-security-question') {
      const lineData = getOdooLine(f.name);
      let imgObj = null;
      if (lineData?.id) {
        imgObj = { pendingFetch: true, odooId: lineData.id, isFromServer: true };
      }
      state[f.name] = { image: imgObj };
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
          imgData = decodeOdooImage(base64Data);
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
    } else if (fieldType === 'image-upload') {
      let val = null;
      if (odooData && odooData[f.name]) {
         val = { url: decodeOdooImage(odooData[f.name]) };
      }
      state[f.name] = val;
    } else if (f.name === 'devicePhotos') {
      let list = [];
      if (odooData && Array.isArray(odooData.imageOfEquipment)) {
        list = odooData.imageOfEquipment.map(item => ({
          deviceName: item.doc_name || item.docName || '',
          deviceImage: item.doc_image || item.docImage ? { url: decodeOdooImage(item.doc_image || item.docImage) } : (item.id ? { pendingFetch: true, odooId: item.id, isFromServer: true } : null)
        }));
      }
      state[f.name] = list;
    } else if (fieldType === 'device-photo-list' || fieldType === 'custom-questions') {
      state[f.name] = [];
    } else if (f.name === 'obs_list') {
      let list = [];
      if (odooData && Array.isArray(odooData.observationLines)) {
        list = odooData.observationLines.map(item => ({
          observation: item.name || item.observation || item.comment || ''
        }));
      }
      state[f.name] = list;
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
        else if (f.name === 'name') odooVal = odooData.venue?.name;
        else if (f.name === 'completeAddress') odooVal = [odooData.venue?.city, odooData.venue?.state].filter(Boolean).join(', ') || odooData.venue?.completeAddress;
        else if (f.name === 'totalNoNetwork') odooVal = odooData.totalNoNetwork;
        else if (f.name === 'auditScope' || f.name === 'audit_scope') odooVal = odooData.auditScope || odooData.audit_scope;
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
      if (fieldType === 'network-question') {
        const err = {};
        if (!getFieldValue(data, f.name)?.observation) err.observation = "Observation is required";
        
        const imgVal = getFieldValue(data, f.name)?.image;
        const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
        if (!hasImg) err.image = "Evidence image is required";
        
        if (Object.keys(err).length > 0) errors[f.name] = err;
      } else if (fieldType === 'network-security-question') {
        const err = {};
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
    } else if (fieldType === 'network-security-question') {
      const qVal = getFieldValue(data, f.name);
      const imgVal = qVal?.image;
      const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
      hasVal = !!hasImg;
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
    } else if (fieldType === 'network-security-question') {
      const qVal = getFieldValue(data, f.name);
      const imgVal = qVal?.image;
      const hasImg = typeof imgVal === 'object' && imgVal !== null ? !!imgVal.url : !!imgVal;
      if (hasImg) filled++;
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

  // Removed hardcoded Signatures block

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

    if (f.name === 'devicePhotos') {
      const lineField = 'nameplate_document_equipment_lines';
      if (!payloadsByLineField[lineField]) payloadsByLineField[lineField] = [];
      const docsArray = val || [];
      if (Array.isArray(docsArray)) {
        docsArray.forEach(item => {
          if (item.deviceName) {
            let imgData = item.deviceImage?.url || "";
            if (imgData.includes(',')) imgData = imgData.split(',')[1];
            payloadsByLineField[lineField].push({
              doc_name: item.deviceName,
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
              // Image came from server and hasn't been modified, omit from payload to save bandwidth
            } else {
              let imgData = imgObj?.url || "";
              if (imgData.includes(',')) {
                imgData = imgData.split(',')[1];
              }
              // Backend expects 'image' for network-question images, mapping it here.
              linePayload['image'] = imgData;
            }
          } else {
            // Map frontend schema names to backend expected names
            const backendFieldName = sub.name === 'observation' ? 'findings' : (sub.name === 'remarks' ? 'remark' : sub.name);
            linePayload[backendFieldName] = val[sub.name] || "";
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

  // Send standard flat fields in a separate patch if available
  const standardFields = {};
  const signatures = {};

  schema.forEach(f => {
    if (f.type === 'heading' || f.type === 'row' || f.type === 'group' || !f.name) return;
    if (f.name === 'obs_list' || f.name === 'devicePhotos') return;

    const lineMatch = f.name.match(/^odoo_(.+)___(\d+)$/);
    const customMatch = f.name.match(/^customQuestions___(.+)$/);
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

  if (Object.keys(standardFields).length > 0 && payloadKey && payloadKey !== 'Signatures' && payloadKey !== 'report' && payloadKey !== 'venue' && payloadKey !== 'auditeeAuditor') {
    if (payloadKey === 'observations') {
      promises.push(reportApiService.patchAuditSection(reportId, standardFields));
    } else {
      promises.push(reportApiService.patchAuditSection(reportId, { [payloadKey]: standardFields }));
    }
  }

  if (Object.keys(signatures).length > 0) {
    promises.push(reportApiService.patchAuditSection(reportId, signatures));
  }

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
