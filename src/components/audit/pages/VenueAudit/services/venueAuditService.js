import { reportApiService } from '../../../services/reportApiService';

/**
 * Dynamically generates the initial state object by traversing the provided schemas.
 * Reduces the need for manual state initialization.
 */
export const generateInitialState = (schemas, odooData = null) => {
  const state = {};

  const flatOdooData = {};
  if (odooData) {
    flatOdooData.region = odooData.region;
    flatOdooData.venueOwnerName = odooData.venueOwnerName;
    flatOdooData.venueOwnerContact = odooData.venueOwnerContact;
    flatOdooData.venueAdministratorName = odooData.venueAdministratorName;
    
    // Common Info mapping
    flatOdooData.reportName = odooData.reportName || odooData.systemAuditName;
    flatOdooData.systemAuditName = odooData.systemAuditName;
    flatOdooData.reportNumber = odooData.reference || odooData.id?.toString();
    flatOdooData.auditDate = odooData.auditDate ? String(odooData.auditDate).split(' ')[0] : '';
    flatOdooData.auditorName = odooData.auditorName || (odooData.auditors && odooData.auditors[0] ? odooData.auditors[0].auditor : '');
    flatOdooData.auditManager = odooData.auditManager || '';
    flatOdooData.state = odooData.venue?.state;
    flatOdooData.city = odooData.venue?.city;
    flatOdooData.name = odooData.venue?.name;
    flatOdooData.completeAddress = [odooData.venue?.city, odooData.venue?.state].filter(Boolean).join(', ') || odooData.venue?.completeAddress;
    
    if (odooData.accessibility) {
       flatOdooData.distanceFromCity = odooData.accessibility.distanceFromCity;
       flatOdooData.distanceFromAir = odooData.accessibility.distanceFromAir;
       flatOdooData.distanceFromRail = odooData.accessibility.distanceFromRail;
       flatOdooData.distanceFromBus = odooData.accessibility.distanceFromBus;
       flatOdooData.roadQuality = odooData.accessibility.roadQuality;
    }
    
    if (odooData.administrative) {
       flatOdooData.washroomFacilityAvailable = odooData.administrative.washroomFacilityAvailable;
       flatOdooData.safeDrinkingWaterAvailable = odooData.administrative.safeDrinkingWaterAvailable;
       flatOdooData.parkingSpaceAvailable = odooData.administrative.parkingSpaceAvailable;
       flatOdooData.venueManpowerCount = odooData.administrative.venueManpowerCount;
       flatOdooData.staffType = odooData.administrative.staffType;
    }
    
    if (odooData.systemDetails) {
       flatOdooData.totalSystemsAvailable = odooData.systemDetails.totalSystemsAvailable;
       flatOdooData.antivirusAvailable = odooData.systemDetails.antivirusAvailable;
    }
    
    if (odooData.labDetails) {
       flatOdooData.totalLabsAvailable = odooData.labDetails.totalLabsAvailable;
       flatOdooData.totalLabsAllocatedExam = odooData.labDetails.totalLabsAllocatedExam;
    }
    
    if (odooData.conclusion) {
       flatOdooData.auditDuration = odooData.conclusion.auditDuration;
       flatOdooData.overallVenueRating = odooData.conclusion.overallVenueRating;
       flatOdooData.recommendedExamConduct = odooData.conclusion.recommendedExamConduct;
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
      if (odooData?.signatures) {
        const sigKey = `has${f.name.charAt(0).toUpperCase() + f.name.slice(1)}`;
        hasSig = !!odooData.signatures[sigKey];
      }
      state[f.name] = hasSig ? { url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=' } : null;
    } else if (f.type === 'image-upload') {
      state[f.name] = null;
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

  const payloadData = {};
  const signatures = {};

  const processField = (f) => {
    if (f.type === 'heading') return;
    if (f.type === 'row' || f.type === 'group') {
      if (f.fields) f.fields.forEach(processField);
      return;
    }

    if (f.type === 'node-counts') {
      if (currentData[`${f.prefix}Available`] !== undefined) {
        payloadData[`${f.prefix}Available`] = currentData[`${f.prefix}Available`];
      }
      if (currentData[`${f.prefix}Working`] !== undefined) {
        payloadData[`${f.prefix}Working`] = currentData[`${f.prefix}Working`];
      }
      return;
    }

    if (!f.name) return;

    if (currentData[f.name] !== undefined) {
      const val = currentData[f.name];
      const fieldName = f.name;
      // Extract URL for image uploads if necessary
      if (f.type === 'signature' || f.name === 'centerSeal') {
        let imgData = val?.url || "";
        if (imgData.includes(',')) imgData = imgData.split(',')[1];
        signatures[fieldName] = imgData;
      } else if (f.name.toLowerCase().includes('signaturedate')) {
        signatures[fieldName] = val || "";
      } else if (f.type === 'image-upload') {
        payloadData[fieldName] = val?.url || "";
      } else {
        payloadData[fieldName] = val;
      }
    }
  };

  schema.forEach(processField);

  // Parse SystemDetails into Odoo One2many structures
  if (payloadKey === 'systemDetails') {
    const processorLines = [];
    if (currentData.i3available || currentData.i3working || currentData.i3speed) {
       processorLines.push([0, 0, { processor_type: 'I3', processor_available_count: currentData.i3available || 0, processor_working_count: currentData.i3working || 0, processor_speed: currentData.i3speed || 0 }]);
    }
    if (currentData.i5available || currentData.i5working || currentData.i5speed) {
       processorLines.push([0, 0, { processor_type: 'I5', processor_available_count: currentData.i5available || 0, processor_working_count: currentData.i5working || 0, processor_speed: currentData.i5speed || 0 }]);
    }
    if (currentData.i7available || currentData.i7working || currentData.i7speed) {
       processorLines.push([0, 0, { processor_type: 'I7', processor_available_count: currentData.i7available || 0, processor_working_count: currentData.i7working || 0, processor_speed: currentData.i7speed || 0 }]);
    }
    if (processorLines.length > 0) payloadData.processor_lines = processorLines;

    const osLines = [];
    if (currentData.win7available || currentData.win7working) osLines.push([0, 0, { os_type: 'Windows 7', os_available_count: currentData.win7available || 0, os_working_count: currentData.win7working || 0 }]);
    if (currentData.win8available || currentData.win8working) osLines.push([0, 0, { os_type: 'Windows 8', os_available_count: currentData.win8available || 0, os_working_count: currentData.win8working || 0 }]);
    if (currentData.win10available || currentData.win10working) osLines.push([0, 0, { os_type: 'Windows 10', os_available_count: currentData.win10available || 0, os_working_count: currentData.win10working || 0 }]);
    if (currentData.win11available || currentData.win11working) osLines.push([0, 0, { os_type: 'Windows 11', os_available_count: currentData.win11available || 0, os_working_count: currentData.win11working || 0 }]);
    if (currentData.linuxavailable || currentData.linuxworking) osLines.push([0, 0, { os_type: 'Linux', os_available_count: currentData.linuxavailable || 0, os_working_count: currentData.linuxworking || 0 }]);
    if (currentData.otheravailable || currentData.otherworking) osLines.push([0, 0, { os_type: 'Other', os_available_count: currentData.otheravailable || 0, os_working_count: currentData.otherworking || 0, ie_version: currentData.ieVersion || '' }]);
    if (osLines.length > 0) payloadData.os_lines = osLines;

    const ramLines = [];
    if (currentData.twoGBramAvail || currentData.twoGBramWork) ramLines.push([0, 0, { ram_size: '2GB', ram_available_count: currentData.twoGBramAvail || 0, ram_working_count: currentData.twoGBramWork || 0 }]);
    if (currentData.fourGBramAvail || currentData.fourGBramWork) ramLines.push([0, 0, { ram_size: '4GB', ram_available_count: currentData.fourGBramAvail || 0, ram_working_count: currentData.fourGBramWork || 0 }]);
    if (currentData.eightGBramAvail || currentData.eightGBramWork) ramLines.push([0, 0, { ram_size: '8GB', ram_available_count: currentData.eightGBramAvail || 0, ram_working_count: currentData.eightGBramWork || 0 }]);
    if (ramLines.length > 0) payloadData.ram_lines = ramLines;

    const hddLines = [];
    if (currentData.hddAvail256 || currentData.hddwork256) hddLines.push([0, 0, { hdd_size: '256GB', hdd_available_count: currentData.hddAvail256 || 0, hdd_working_count: currentData.hddwork256 || 0 }]);
    if (currentData.hddAvail512 || currentData.hddwork512) hddLines.push([0, 0, { hdd_size: '512GB', hdd_available_count: currentData.hddAvail512 || 0, hdd_working_count: currentData.hddwork512 || 0 }]);
    if (currentData.hddAvail1 || currentData.hddwork1) hddLines.push([0, 0, { hdd_size: '1TB', hdd_available_count: currentData.hddAvail1 || 0, hdd_working_count: currentData.hddwork1 || 0 }]);
    if (hddLines.length > 0) payloadData.hdd_lines = hddLines;

    const monitorLines = [];
    if (currentData.monitorAvail15 || currentData.monitorwork15) monitorLines.push([0, 0, { monitor_type: '15 Inch', monitor_available_count: currentData.monitorAvail15 || 0, monitor_working_count: currentData.monitorwork15 || 0 }]);
    if (currentData.monitorAvail17 || currentData.monitorwork17) monitorLines.push([0, 0, { monitor_type: '17 Inch', monitor_available_count: currentData.monitorAvail17 || 0, monitor_working_count: currentData.monitorwork17 || 0 }]);
    if (currentData.monitorAvail19 || currentData.monitorwork19) monitorLines.push([0, 0, { monitor_type: '19 Inch', monitor_available_count: currentData.monitorAvail19 || 0, monitor_working_count: currentData.monitorwork19 || 0 }]);
    if (monitorLines.length > 0) payloadData.monitor_lines = monitorLines;

    // Clean up flat fields
    const flatFields = ['i3available', 'i3working', 'i3speed', 'i5available', 'i5working', 'i5speed', 'i7available', 'i7working', 'i7speed', 'win7available', 'win7working', 'win8available', 'win8working', 'win10available', 'win10working', 'win11available', 'win11working', 'linuxavailable', 'linuxworking', 'otheravailable', 'otherworking', 'ieVersion', 'twoGBramAvail', 'twoGBramWork', 'fourGBramAvail', 'fourGBramWork', 'eightGBramAvail', 'eightGBramWork', 'hddAvail256', 'hddwork256', 'hddAvail512', 'hddwork512', 'hddAvail1', 'hddwork1', 'monitorAvail15', 'monitorwork15', 'monitorAvail17', 'monitorwork17', 'monitorAvail19', 'monitorwork19'];
    flatFields.forEach(f => delete payloadData[f]);
  }

  if (Object.keys(payloadData).length > 0) {
    const patchPayload = {
      [payloadKey]: payloadData
    };
    await reportApiService.patchAuditSection(reportId, patchPayload);
  }

  if (Object.keys(signatures).length > 0) {
    await reportApiService.patchAuditSection(reportId, { signatures });
  }
};
