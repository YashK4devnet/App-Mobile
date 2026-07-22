const camelToSnake = (str) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

export const generateNetworkQuestionsSchema = (apiLines, lineField) => {
  if (!apiLines || !Array.isArray(apiLines)) {
    apiLines = [];
  }
  
  const snakeField = lineField ? camelToSnake(lineField) : 'unknown';

  // Map Odoo API lines to form schema
  const questions = apiLines.map(line => {
    const remarksHint = line.evidence || '';
    
    return {
      name: `odoo_${snakeField}___${line.id}`,
      label: line.name,
      type: 'object',
      subType: 'network-question',
      fields: [
        { 
          name: 'remarks', 
          label: `Remarks${remarksHint ? ` (${remarksHint})` : ''}`, 
          type: 'textarea', 
          placeholder: 'Enter remarks here...' 
        },
        { 
          name: 'observation', 
          label: 'Observation', 
          type: 'textarea',
          placeholder: 'Enter observation here...'
        },
        { 
          name: 'image', 
          label: 'Evidence Image', 
          type: 'image-upload' 
        }
      ]
    };
  });

  // Append the custom questions array block to allow adding new custom questions
  if (lineField) {
    questions.push({
      name: `customQuestions___${snakeField}`,
      label: 'Additional Custom Questions',
      type: 'array',
      subType: 'custom-questions',
      itemLabel: 'Custom Question',
      fields: [
        { name: 'questionTitle', label: 'Custom Question Title', type: 'text', required: true, placeholder: 'Enter question' },
        { name: 'records', label: 'Records', type: 'textarea', placeholder: 'Enter records here...' },
        { name: 'remarks', label: 'Remarks', type: 'textarea', placeholder: 'Enter remarks here...' },
        { name: 'observation', label: 'Observation', type: 'textarea', placeholder: 'Enter observation here...' },
        { name: 'image', label: 'Evidence Image', type: 'image-upload' }
      ]
    });
  }

  return questions;
};

export const generateNetworkSecuritySchema = (apiLines, lineField) => {
  if (!apiLines || !Array.isArray(apiLines)) {
    apiLines = [];
  }
  
  const snakeField = lineField ? camelToSnake(lineField) : 'unknown';

  const questions = apiLines.map(line => {
    return {
      name: `odoo_${snakeField}___${line.id}`,
      label: line.name,
      header: line.header,
      remarks: line.remarks || line.remark || line.remakes,
      type: 'object',
      subType: 'network-security-question',
      fields: [
        { 
          name: 'image', 
          label: 'Evidence Image', 
          type: 'image-upload' 
        }
      ]
    };
  });

  return questions;
};

export const generatePowerQuestionsSchema = (apiLines, lineField) => {
  if (!apiLines || !Array.isArray(apiLines)) {
    apiLines = [];
  }
  
  const snakeField = lineField ? camelToSnake(lineField) : 'unknown';
  const isFirstSection = ['supply_trasnfer_lines', 'disel_generator_lines', 'ups_lines', 'ups_batteries_lines'].includes(lineField);
  const showPhase = lineField === 'supply_trasnfer_lines';

  const questions = apiLines.map(line => {
    const findingsHint = line.evidence || '';
    
    return {
      name: `odoo_${snakeField}___${line.id}`,
      label: line.name,
      type: 'object',
      subType: 'power-question',
      hideScore: isFirstSection,
      showPhase,
      fields: [
        { 
          name: 'findings', 
          label: `Findings${findingsHint ? ` (${findingsHint})` : ''}`, 
          type: 'textarea', 
          placeholder: 'Enter findings here...' 
        },
        showPhase ? {
          name: 'phase',
          label: 'Phase',
          type: 'text',
          placeholder: 'e.g. 3-phase or Single phase'
        } : (isFirstSection ? null : { 
          name: 'score', 
          label: 'Score', 
          type: 'select', 
          options: [{label: 'S', value: 's'}, {label: 'NS', value: 'ns'}, {label: 'U', value: 'u'}, {label: 'NA', value: 'na'}] 
        }),
        { 
          name: 'image', 
          label: 'Evidence Image', 
          type: 'image-upload' 
        }
      ].filter(Boolean)
    };
  });

  if (lineField) {
    questions.push({
      name: `customQuestions___${snakeField}`,
      label: 'Additional Custom Questions',
      type: 'array',
      subType: 'custom-questions',
      itemLabel: 'Custom Question',
      fields: [
        { name: 'questionTitle', label: 'Custom Question Title', type: 'text', required: true, placeholder: 'Enter question' },
        { name: 'evidence', label: 'Evidence', type: 'textarea', placeholder: 'Enter evidence here...' },
        { name: 'findings', label: 'Findings', type: 'textarea', placeholder: 'Enter findings here...' },
        showPhase ? { name: 'phase', label: 'Phase', type: 'select', options: [{label: 'Single Phase', value: 'single'}, {label: 'Three Phase', value: 'three'}] } : null,
        !isFirstSection ? { name: 'score', label: 'Score', type: 'select', options: [{label: 'S', value: 's'}, {label: 'NS', value: 'ns'}, {label: 'U', value: 'u'}, {label: 'NA', value: 'na'}] } : null,
        { name: 'image', label: 'Evidence Image', type: 'image-upload' }
      ].filter(Boolean)
    });
  }

  return questions;
};

export const generatePowerPhotoQuestionsSchema = (apiLines, lineField) => {
  if (!apiLines || !Array.isArray(apiLines)) {
    apiLines = [];
  }
  
  const snakeField = lineField ? camelToSnake(lineField) : 'unknown';

  const questions = apiLines.map(line => {
    const findingsHint = line.evidence || '';
    
    return {
      name: `odoo_${snakeField}___${line.id}`,
      label: line.name,
      type: 'object',
      subType: 'power-photo-question',
      fields: [
        { 
          name: 'findings', 
          label: `Findings${findingsHint ? ` (${findingsHint})` : ''}`, 
          type: 'textarea', 
          placeholder: 'Enter findings here...' 
        },
        { 
          name: 'image', 
          label: 'Evidence Image', 
          type: 'image-upload' 
        }
      ]
    };
  });

  if (lineField) {
    questions.push({
      name: `customQuestions___${snakeField}`,
      label: 'Additional Custom Questions',
      type: 'array',
      subType: 'custom-questions',
      itemLabel: 'Custom Question',
      fields: [
        { name: 'questionTitle', label: 'Custom Question Title', type: 'text', required: true, placeholder: 'Enter question' },
        { name: 'findings', label: 'Findings', type: 'textarea', placeholder: 'Enter findings here...' },
        { name: 'image', label: 'Evidence Image', type: 'image-upload' }
      ]
    });
  }

  return questions;
};
