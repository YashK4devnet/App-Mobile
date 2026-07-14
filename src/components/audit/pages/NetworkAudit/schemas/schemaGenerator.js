export const generateNetworkQuestionsSchema = (apiLines, sectionKey) => {
  if (!apiLines || !Array.isArray(apiLines)) {
    apiLines = [];
  }
  
  // Map Odoo API lines to form schema
  const questions = apiLines.map(line => {
    const remarksHint = line.evidence || '';
    
    return {
      name: `odoo_${line.id}`,
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
  if (sectionKey) {
    questions.push({
      name: `customQuestions_${sectionKey}`,
      label: 'Additional Custom Questions',
      type: 'array',
      subType: 'custom-questions',
      itemLabel: 'Custom Question',
      fields: [
        { name: 'questionTitle', label: 'Custom Question Title', type: 'text', required: true, placeholder: 'Enter question' },
        { name: 'remarks', label: 'Remarks', type: 'textarea', placeholder: 'Enter remarks here...' },
        { name: 'observation', label: 'Observation', type: 'select', options: ['S', 'NS', 'U', 'NA'] },
        { name: 'image', label: 'Evidence Image', type: 'image-upload' }
      ]
    });
  }

  return questions;
};

export const generatePowerQuestionsSchema = (apiLines, sectionKey) => {
  if (!apiLines || !Array.isArray(apiLines)) {
    apiLines = [];
  }
  
  const questions = apiLines.map(line => {
    const findingsHint = line.evidence || '';
    
    return {
      name: `odoo_${line.id}`,
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

  if (sectionKey) {
    questions.push({
      name: `customQuestions_${sectionKey}`,
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

export const generatePowerPhotoQuestionsSchema = (apiLines, sectionKey) => {
  if (!apiLines || !Array.isArray(apiLines)) {
    apiLines = [];
  }
  
  const questions = apiLines.map(line => {
    const findingsHint = line.evidence || '';
    
    return {
      name: `odoo_${line.id}`,
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

  if (sectionKey) {
    questions.push({
      name: `customQuestions_${sectionKey}`,
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
