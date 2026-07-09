import { formatForOdoo } from '../utils/dateUtils';
import { prepareBase64ForOdoo } from '../utils/imageUtils';

/**
 * Maps the flat, clean React Hook Form payload into Odoo's exact expected payload structure.
 * 
 * @param {string} auditType - e.g. 'power-audit', 'network-audit'
 * @param {object} formData - The raw state from react-hook-form
 * @returns {object} The formatted Odoo API payload
 */
export const mapAuditPayloadToOdoo = (auditType, formData) => {
  const odooPayload = {};
  
  // NOTE: This is a scaffold. You will map exact Odoo field names here.
  // Example: 
  // odooPayload.x_studio_report_name = formData.reportName;
  // odooPayload.x_studio_audit_date = formatForOdoo(formData.auditDate);
  
  if (auditType === 'power-audit') {
    // Implement Power Audit mapping logic here
  }
  
  if (auditType === 'network-audit') {
    // Implement Network Audit mapping logic here
  }
  
  // Example for handling images for Odoo binary fields:
  // if (formData.section1_image?.url) {
  //   odooPayload.x_studio_section1_image = prepareBase64ForOdoo(formData.section1_image.url);
  // }
  
  return odooPayload;
};

/**
 * Example function showing how you might transform custom questions for Odoo One2many fields.
 * Odoo expects: [(0, 0, { values })] to create new records.
 */
export const formatCustomQuestionsForOdoo = (customQuestionsArray) => {
  if (!customQuestionsArray || !Array.isArray(customQuestionsArray)) return [];
  
  return customQuestionsArray.map(q => [0, 0, {
    name: q.questionTitle || '',
    findings: q.findings || '',
    score: q.score || '',
    // image: prepareBase64ForOdoo(q.image?.url)
  }]);
};
