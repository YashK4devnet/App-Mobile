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
          name: 'remark', 
          label: `Remarks${remarksHint ? ` (${remarksHint})` : ''}`, 
          type: 'textarea', 
          placeholder: 'Enter remarks here...' 
        },
        { 
          name: 'findings', 
          label: 'Observation', 
          type: 'select', 
          options: ['S', 'NS', 'U', 'NA'] 
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
        { name: 'remark', label: 'Remarks', type: 'textarea', placeholder: 'Enter remarks here...' },
        { name: 'findings', label: 'Observation', type: 'select', options: ['S', 'NS', 'U', 'NA'] },
        { name: 'image', label: 'Evidence Image', type: 'image-upload' }
      ]
    });
  }

  return questions;
};

export const generatePowerQuestionsSchema = (apiLines, lineField) => {
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
      subType: 'power-question',
      fields: [
        { 
          name: 'findings', 
          label: `Findings${findingsHint ? ` (${findingsHint})` : ''}`, 
          type: 'textarea', 
          placeholder: 'Enter findings here...' 
        },
        { 
          name: 'score', 
          label: 'Score', 
          type: 'select', 
          options: ['S', 'NS', 'U', 'NA'] 
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
        { name: 'score', label: 'Score', type: 'select', options: ['S', 'NS', 'U', 'NA'] },
        { name: 'image', label: 'Evidence Image', type: 'image-upload' }
      ]
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
