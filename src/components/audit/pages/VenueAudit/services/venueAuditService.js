/**
 * Dynamically generates the initial state object by traversing the provided schemas.
 * Reduces the need for manual state initialization.
 */
export const generateInitialState = (schemas) => {
  const state = {};

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
      state[f.name] = [];
    } else {
      state[f.name] = f.value || '';
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
        if (!data[f.name] || data[f.name].length === 0) {
          errors[f.name] = "At least one item is required";
        }
      } else if (f.type === 'image-upload') {
        const val = data[f.name];
        const hasImg = typeof val === 'object' && val !== null ? !!val.url : !!val;
        if (!hasImg) errors[f.name] = "Image is required";
      } else {
        if (!data[f.name] && data[f.name] !== 0) {
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
        if (data[f.name] && data[f.name].length > 0) filled++;
      } else {
        const val = data[f.name];
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
