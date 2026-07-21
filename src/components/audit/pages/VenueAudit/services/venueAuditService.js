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
      // The GET API returns flat snake_case for system details, but our schema/patch uses camelCase.
      const snakeToCamel = (s) => s.replace(/_([a-z0-9])/gi, (match, p1) => p1.toUpperCase());
      Object.keys(odooData.systemDetails).forEach(k => {
        flatOdooData[snakeToCamel(k)] = odooData.systemDetails[k];
      });
      
      // Keep support for nested structure if GET API ever returns nested objects
      if (odooData.systemDetails.nodeDetails) {
        Object.keys(odooData.systemDetails.nodeDetails).forEach(k => {
          flatOdooData[snakeToCamel(k)] = odooData.systemDetails.nodeDetails[k];
        });
      }
      if (odooData.systemDetails.softwareAndSecurity) {
        Object.keys(odooData.systemDetails.softwareAndSecurity).forEach(k => {
          flatOdooData[snakeToCamel(k)] = odooData.systemDetails.softwareAndSecurity[k];
        });
      }
    }
  }

  const processField = (f) => {
    if (f.type === 'heading') return;
    if (f.type === 'row' || f.type === 'group') {
      if (f.fields) f.fields.forEach(processField);
      return;
    }

    if (f.type === 'node-counts') {
      state[f.name] = {
        Available: flatOdooData[`${f.name}Available`] !== undefined ? flatOdooData[`${f.name}Available`] : '',
        Working: flatOdooData[`${f.name}Working`] !== undefined ? flatOdooData[`${f.name}Working`] : ''
      };
      return;
    }

    if (!f.name) return;

    if (f.type === 'bifurcation') {
      if (f.name === 'nodeBifurcation') {
        state[f.name] = flatOdooData.labBifurcation || [];
      } else {
        state[f.name] = flatOdooData[f.name] || [];
      }
      return;
    }

    if (f.type === 'dynamic-list' || f.type === 'nested-list') {
      state[f.name] = flatOdooData[f.name] || [];
    } else if (f.type === 'signature' || f.name === 'centerSeal') {
      let hasSig = false;
      let imgData = null;
      let timestamp = '';
      if (odooData?.signatures) {
        // The backend sends camelCase keys for signatures, e.g. hasAuditorSignature, auditorSignatureDate
        const sigKey = `has${f.name.charAt(0).toUpperCase() + f.name.slice(1)}`;
        hasSig = !!odooData.signatures[sigKey];
        
        const base64Data = odooData.signatures[f.name];
        
        if (base64Data) {
          // Since Odoo double-encodes base64 strings, decode it once if possible
          let finalBase64 = base64Data;
          try {
            const decoded = atob(base64Data);
            // If the decoded string looks like a valid base64 image or data URI, it was indeed double encoded
            if (decoded.startsWith('data:image') || /^[a-zA-Z0-9+/=\s]+$/.test(decoded)) {
              finalBase64 = decoded;
            }
          } catch (e) {}
          if (finalBase64.startsWith('data:')) {
            imgData = finalBase64;
          } else {
            imgData = `data:image/png;base64,${finalBase64}`;
          }
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
        if (!data[f.name]?.Available) errors[f.name] = "Available is required";
        else if (!data[f.name]?.Working) errors[f.name] = "Working is required";
      } else if (!f.name) {
        return;
      } else if (f.type === 'dynamic-list' || f.type === 'nested-list' || f.type === 'bifurcation') {
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
      if (data[f.name]?.Available || data[f.name]?.Working) empty = false;
    } else if (!f.name) {
      return;
    } else if (f.type === 'dynamic-list' || f.type === 'nested-list' || f.type === 'bifurcation') {
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
      if (data[f.name]?.Available) filled++;
      if (data[f.name]?.Working) filled++;
    } else if (!f.name) {
      return;
    } else {
      total++;
      if (f.type === 'dynamic-list' || f.type === 'nested-list' || f.type === 'bifurcation') {
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
      if (currentData[f.name]?.Available !== undefined) {
        const aVal = currentData[f.name].Available;
        flatData[`${f.name}Available`] = aVal !== '' && aVal !== null ? Number(aVal) : 0;
      }
      if (currentData[f.name]?.Working !== undefined) {
        const wVal = currentData[f.name].Working;
        flatData[`${f.name}Working`] = wVal !== '' && wVal !== null ? Number(wVal) : 0;
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
      } else if (f.type === 'number') {
        flatData[f.name] = val !== '' && val !== null && val !== undefined ? Number(val) : 0;
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
    const procObj = {};
    const osObj = {};
    const ramObj = {};
    const hddObj = {};
    const monitorObj = {};
    const swObj = {};
    
    // Software and Security keys
    const swKeys = ['osLicenseAvailable', 'systemFormatAllowed', 'antivirusAvailable', 'antivirusName', 'disableAntivirusPermitted', 'remoteSoftwareFound'];
    
    // Node details prefixes
    const nodePrefixes = ['testNodes', 'bufferNodes', 'registrationDeskNodes', 'aadhaarDeskNodes', 'videoRecordingMachines'];

    Object.keys(flatData).forEach(k => {
      if (swKeys.includes(k)) {
        swObj[k] = flatData[k];
      } else if (nodePrefixes.some(prefix => k.startsWith(prefix))) {
        nodeObj[k] = flatData[k];
      } else if (k.startsWith('i3') || k.startsWith('i5') || k.startsWith('i7')) {
        procObj[k] = flatData[k];
      } else if (k.startsWith('win') || k.startsWith('linux') || k.startsWith('otherOs') || k === 'ieVersion') {
        osObj[k] = flatData[k];
      } else if (k.startsWith('ram')) {
        ramObj[k] = flatData[k];
      } else if (k.startsWith('hdd')) {
        hddObj[k] = flatData[k];
      } else if (k.startsWith('monitor')) {
        monitorObj[k] = flatData[k];
      } else {
        sysObj[k] = flatData[k];
      }
    });

    if (Object.keys(nodeObj).length > 0) sysObj.nodeDetails = nodeObj;
    if (Object.keys(procObj).length > 0) sysObj.processorDetails = procObj;
    if (Object.keys(osObj).length > 0) sysObj.osDetails = osObj;
    if (Object.keys(ramObj).length > 0) sysObj.ramDetails = ramObj;
    if (Object.keys(hddObj).length > 0) sysObj.hddDetails = hddObj;
    if (Object.keys(monitorObj).length > 0) sysObj.monitorDetails = monitorObj;
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

  // Handle bifurcation updates separately
  if (flatData.nodeBifurcation) {
    const validLines = flatData.nodeBifurcation
      .filter(l => l.labId && l.floorId && l.count !== '')
      .map(l => ({
        ...l,
        labId: Number(l.labId),
        floorId: Number(l.floorId),
        count: Number(l.count)
      }));
    if (validLines.length > 0 || flatData.nodeBifurcation.length === 0) {
      await reportApiService.patchAuditBifurcation(reportId, {
        type: 'lab',
        lines: validLines
      });
    }
  }

  if (flatData.cctvBifurcation) {
    const validLines = flatData.cctvBifurcation
      .filter(l => l.labId && l.floorId && l.count !== '')
      .map(l => ({
        ...l,
        labId: Number(l.labId),
        floorId: Number(l.floorId),
        count: Number(l.count)
      }));
    if (validLines.length > 0 || flatData.cctvBifurcation.length === 0) {
      await reportApiService.patchAuditBifurcation(reportId, {
        type: 'cctv',
        lines: validLines
      });
    }
  }

  if (Object.keys(signatures).length > 0) {
    await reportApiService.patchAuditSection(reportId, signatures);
  }
};
