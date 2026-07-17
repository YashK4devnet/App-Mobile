import { reportApiService } from '../../../services/reportApiService';

/**
 * Dynamically generates the initial state object by traversing the provided schemas.
 * Reduces the need for manual state initialization.
 */
export const generateInitialState = (schemas, odooData = null) => {
  const state = {};

  const flatOdooData = {};
  if (odooData) {
    // Top-level assignments
    Object.assign(flatOdooData, odooData);
    
    // Common Info mapping overrides
    flatOdooData.reportName = odooData.reportName || odooData.systemAuditName;
    flatOdooData.systemAuditName = odooData.systemAuditName;
    flatOdooData.reportNumber = odooData.reference || odooData.id?.toString();
    flatOdooData.auditDate = odooData.auditDate ? String(odooData.auditDate).split(' ')[0] : '';
    flatOdooData.auditorName = odooData.auditorName || (odooData.auditors && odooData.auditors[0] ? odooData.auditors[0].auditor : '');
    flatOdooData.auditManager = odooData.auditManager || '';
    
    if (odooData.venue) {
      flatOdooData.state = odooData.venue.state;
      flatOdooData.city = odooData.venue.city;
      flatOdooData.name = odooData.venue.name;
      flatOdooData.completeAddress = [odooData.venue.city, odooData.venue.state].filter(Boolean).join(', ') || odooData.venue.completeAddress;
      Object.assign(flatOdooData, odooData.venue);
    }
    
    if (odooData.accessibility) Object.assign(flatOdooData, odooData.accessibility);
    if (odooData.administrative) Object.assign(flatOdooData, odooData.administrative);
    if (odooData.labDetails) Object.assign(flatOdooData, odooData.labDetails);
    if (odooData.cctvDetails) Object.assign(flatOdooData, odooData.cctvDetails);
    if (odooData.conclusion) Object.assign(flatOdooData, odooData.conclusion);
    
    if (odooData.systemDetails) {
      Object.assign(flatOdooData, odooData.systemDetails);
      if (odooData.systemDetails.nodeDetails) Object.assign(flatOdooData, odooData.systemDetails.nodeDetails);
      if (odooData.systemDetails.softwareAndSecurity) Object.assign(flatOdooData, odooData.systemDetails.softwareAndSecurity);
    }
  }

  const processField = (f) => {
    if (f.type === 'heading') return;
    if (f.type === 'row' || f.type === 'group') {
      if (f.fields) f.fields.forEach(processField);
      return;
    }

    if (f.type === 'node-counts') {
      state[`${f.prefix}Available`] = '';
      state[`${f.prefix}Working`] = '';
      return;
    }

    if (!f.name) return;

    if (f.type === 'dynamic-list' || f.type === 'nested-list') {
      state[f.name] = flatOdooData[f.name] || [];
    } else if (f.type === 'signature' || f.name === 'centerSeal') {
      let hasSig = false;
      let imgData = null;
      if (odooData?.signatures) {
        const sigKey = `has${f.name.charAt(0).toUpperCase() + f.name.slice(1)}`;
        hasSig = !!odooData.signatures[sigKey];
        if (odooData.signatures[f.name]) {
          imgData = `data:image/jpeg;base64,${odooData.signatures[f.name]}`;
        } else if (hasSig) {
          imgData = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
        }
      }
      state[f.name] = imgData ? { url: imgData } : null;
    } else if (f.type === 'image-upload') {
      let val = null;
      if (flatOdooData[f.name]) {
         val = { url: `data:image/jpeg;base64,${flatOdooData[f.name]}` };
      }
      state[f.name] = val;
    } else {
      let mappedValue = flatOdooData[f.name];
      if (mappedValue === undefined || mappedValue === null) {
        mappedValue = f.value || '';
      }
      state[f.name] = mappedValue;
    }
  };

  Object.values(schemas).forEach(schema => schema.forEach(processField));

  // Specific defaults handled automatically by schema mapping, 
  // but we ensure these are empty strings initially to trigger empty checks.
  state.isMapAccurate = '';

  // Auto-generate default datetime to now
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  state.auditDateTime = (new Date(now - offset)).toISOString().slice(0, 16);

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
    if (f.type === 'heading') return;
    if (f.type === 'row' || f.type === 'group') {
      if (f.fields) f.fields.forEach(processField);
      return;
    }

    if (f.showIf && !f.showIf(data)) return;

    if (f.required) {
      if (f.type === 'node-counts') {
        if (!data[`${f.prefix}Available`]) errors[`${f.prefix}Available`] = "Required";
        if (!data[`${f.prefix}Working`]) errors[`${f.prefix}Working`] = "Required";
      } else if (!f.name) {
        return;
      } else if (f.type === 'dynamic-list' || f.type === 'nested-list') {
        if (!getFieldValue(data, f.name) || getFieldValue(data, f.name).length === 0) {
          errors[f.name] = "At least one item is required";
        }
      } else if (f.type === 'image-upload') {
        const val = getFieldValue(data, f.name);
        const hasImg = typeof val === 'object' && val !== null ? !!val.url : !!val;
        if (!hasImg) errors[f.name] = "Image is required";
      } else {
        if (!getFieldValue(data, f.name) && getFieldValue(data, f.name) !== 0) {
          errors[f.name] = `${f.label || 'Field'} is required`;
        }
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
    if (f.type === 'heading') return;
    if (f.type === 'row' || f.type === 'group') {
      if (f.fields) f.fields.forEach(processField);
      return;
    }

    if (f.showIf && !f.showIf(data)) return;
    if (f.disabled) return;

    if (f.type === 'node-counts') {
      if (data[`${f.prefix}Available`] || data[`${f.prefix}Working`]) empty = false;
    } else if (!f.name) {
      return;
    } else if (f.type === 'dynamic-list' || f.type === 'nested-list') {
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
    if (f.type === 'heading') return;
    if (f.type === 'row' || f.type === 'group') {
      if (f.fields) f.fields.forEach(processField);
      return;
    }

    if (f.showIf && !f.showIf(data)) return;

    if (f.type === 'node-counts') {
      total += 2; // available + working
      if (data[`${f.prefix}Available`]) filled++;
      if (data[`${f.prefix}Working`]) filled++;
    } else if (!f.name) {
      return;
    } else {
      total++;
      if (f.type === 'dynamic-list' || f.type === 'nested-list') {
        if (getFieldValue(data, f.name) && getFieldValue(data, f.name).length > 0) filled++;
      } else {
        const val = getFieldValue(data, f.name);
        const hasVal = typeof val === 'object' && val !== null ? !!val.url : (val || val === 0);
        if (hasVal) filled++;
      }
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
 * Parses the current section data and saves it to the backend via the PATCH API.
 */
export const saveVenueSection = async (reportId, schema, currentData, payloadKey) => {
  if (!reportId || !schema || !payloadKey) return;

  const flatData = {};
  const signatures = {};

  const processField = (f) => {
    if (f.type === 'heading') return;
    if (f.type === 'row' || f.type === 'group') {
      if (f.fields) f.fields.forEach(processField);
      return;
    }

    if (f.type === 'node-counts') {
      if (currentData[`${f.prefix}Available`] !== undefined) {
        flatData[`${f.prefix}Available`] = currentData[`${f.prefix}Available`];
      }
      if (currentData[`${f.prefix}Working`] !== undefined) {
        flatData[`${f.prefix}Working`] = currentData[`${f.prefix}Working`];
      }
      return;
    }

    if (!f.name) return;

    if (currentData[f.name] !== undefined) {
      const val = currentData[f.name];
      if (f.type === 'signature' || f.name === 'centerSeal') {
        let imgData = val?.url || "";
        if (imgData.includes(',')) imgData = imgData.split(',')[1];
        signatures[f.name] = imgData;
        
        const timestamp = val?.timestamp;
        if (timestamp) {
           signatures[`${f.name}Date`] = timestamp;
        }
      } else if (f.name.toLowerCase().includes('signaturedate')) {
        signatures[f.name] = val || "";
      } else if (f.type === 'image-upload') {
        flatData[f.name] = val?.url || "";
      } else {
        flatData[f.name] = val;
      }
    }
  };

  schema.forEach(processField);

  // Reshape flatData into the exact nested JSON structure required by Venue API
  const finalPayload = {};

  // 1. Flat top-level fields
  const topLevelKeys = [
    'reportName', 'version', 'auditDate', 'previousAuditDate', 'nextAuditDate', 'auditManager', 
    'region', 'googleMapLocationStatus',
    'venueOwnerName', 'venueOwnerContact', 'venueOwnerEmail', 'venueAdministratorName', 
    'venueAdministratorContact', 'systemItAdminName', 'systemItAdminContact', 
    'venueLandlineNo', 'otherCorrespondenceEmail', 'alternateContactNo',
    'strongPoints', 'toImprovePoints', 'state'
  ];

  topLevelKeys.forEach(k => {
    if (flatData[k] !== undefined) {
      finalPayload[k] = flatData[k];
      delete flatData[k];
    }
  });

  // 2. Venue nested object
  const venueKeys = ['name', 'state', 'city', 'email', 'completeAddress', 'totalNodes', 'pinCode', 'contactNo'];
  const venueObj = {};
  venueKeys.forEach(k => {
    if (flatData[k] !== undefined) {
      venueObj[k] = flatData[k];
      delete flatData[k];
    }
  });
  if (Object.keys(venueObj).length > 0) {
    finalPayload.venue = venueObj;
  }

  // 3. Section specific nesting based on payloadKey
  if (payloadKey === 'accessibility') {
    finalPayload.accessibility = { ...flatData };
  } else if (payloadKey === 'administrativeDetails') {
    finalPayload.administrative = { ...flatData };
  } else if (payloadKey === 'labDetails') {
    finalPayload.labDetails = { ...flatData };
  } else if (payloadKey === 'cctvDetails') {
    finalPayload.cctvDetails = { ...flatData };
  } else if (payloadKey === 'conclusion') {
    finalPayload.conclusion = { ...flatData };
  } else if (payloadKey === 'systemDetails') {
    const sysObj = {};
    const nodeObj = {};
    const swObj = {};
    
    // Software and Security keys
    const swKeys = ['osLicenseAvailable', 'systemFormatAllowed', 'antivirusAvailable', 'antivirusName', 'disableAntivirusPermitted', 'remoteSoftwareFound'];
    
    // Node details keys (derived from prefix Available/Working)
    const actualNodeKeys = Object.keys(flatData).filter(k => 
      (k.endsWith('Available') || k.endsWith('Working')) && !swKeys.includes(k) && k !== 'totalSystemsAvailable'
    );

    Object.keys(flatData).forEach(k => {
      if (swKeys.includes(k)) {
        swObj[k] = flatData[k];
      } else if (actualNodeKeys.includes(k)) {
        nodeObj[k] = flatData[k];
      } else {
        sysObj[k] = flatData[k];
      }
    });

    if (Object.keys(nodeObj).length > 0) sysObj.nodeDetails = nodeObj;
    if (Object.keys(swObj).length > 0) sysObj.softwareAndSecurity = swObj;
    
    finalPayload.systemDetails = sysObj;
  } else if (payloadKey === 'auditeeAuditor' || payloadKey === 'report' || payloadKey === 'venue') {
    // Top-level mappings were already handled above. Any left-over fields can just be dumped flat.
    Object.keys(flatData).forEach(k => {
      finalPayload[k] = flatData[k];
    });
  }

  if (Object.keys(finalPayload).length > 0) {
    await reportApiService.patchAuditSection(reportId, finalPayload);
  }

  if (Object.keys(signatures).length > 0) {
    await reportApiService.patchAuditSection(reportId, signatures);
  }
};
