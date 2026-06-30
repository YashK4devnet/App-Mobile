import React from 'react';
import { 
  FormTextField, 
  FormTextArea, 
  FormYesNoSelector, 
  FormYesNoNaSelector, 
  FormQualitySelector,
  FormNodeCounts,
  FormDynamicList,
  FormNestedDynamicList,
  FormRating10Scale,
  FormImageUpload,
  FormPowerQuestion,
  FormPowerPhotoQuestion,
  FormDocumentList,
  FormNetworkQuestion,
  FormDevicePhotoList,
  FormNumberedTextList,
  FormSignature
} from './form-controls';

function renderField(field, formData, errors, onChange) {
  let customOnChange = onChange;

  if (field.type === 'phone') {
    customOnChange = (name, val) => {
      const digits = val.replace(/\D/g, '').slice(0, 10);
      onChange(name, digits);
    };
  } else if (field.type === 'pincode') {
    customOnChange = (name, val) => {
      const digits = val.replace(/\D/g, '').slice(0, 6);
      onChange(name, digits);
    };
  } else if (field.type === 'landline') {
    customOnChange = (name, val) => {
      const sanitized = val.replace(/[^\d\s-]/g, '').slice(0, 12);
      onChange(name, sanitized);
    };
  }

  const fieldKey = field.name || field.prefix || field.label;
  const commonProps = {
    label: field.label,
    name: field.name,
    value: field.name ? formData[field.name] : undefined,
    error: field.name ? errors[field.name] : undefined,
    onChange: customOnChange,
    required: field.required
  };

  switch (field.type) {
    case 'heading':
      return (
        <h4 
          className={`text-xs font-bold uppercase tracking-widest border-b pb-2 mb-4 pt-2 ${field.className || 'text-slate-400 border-slate-100'}`} 
          key={field.label}
        >
          {field.label}
        </h4>
      );
    case 'text':
    case 'phone':
    case 'pincode':
    case 'landline':
      return (
        <FormTextField 
          key={fieldKey}
          {...commonProps} 
          placeholder={field.placeholder} 
          disabled={field.disabled}
          readOnly={field.readOnly}
        />
      );
    case 'date':
      return (
        <FormTextField 
          key={fieldKey}
          {...commonProps} 
          type="date"
          disabled={field.disabled}
          readOnly={field.readOnly}
        />
      );
    case 'datetime-local':
      return (
        <FormTextField 
          key={fieldKey}
          {...commonProps} 
          type="datetime-local"
          disabled={field.disabled}
          readOnly={field.readOnly}
        />
      );
    case 'number':
      return (
        <FormTextField 
          key={fieldKey}
          {...commonProps} 
          placeholder={field.placeholder} 
          inputMode="numeric" 
          pattern="[0-9]*" 
          disabled={field.disabled}
          readOnly={field.readOnly}
        />
      );
    case 'textarea':
      return (
        <FormTextArea 
          key={fieldKey}
          {...commonProps} 
          placeholder={field.placeholder} 
          rows={field.rows} 
        />
      );
    case 'yes-no':
      return (
        <FormYesNoSelector 
          key={fieldKey}
          {...commonProps} 
          noColor={field.noColor || 'rose'} 
        />
      );
    case 'yes-no-na':
      return <FormYesNoNaSelector key={fieldKey} {...commonProps} />;
    case 'quality':
      return <FormQualitySelector key={fieldKey} {...commonProps} />;
    case 'node-counts':
      return (
        <FormNodeCounts 
          key={fieldKey}
          {...commonProps} 
          prefix={field.prefix} 
          formData={formData} 
          errors={errors} 
        />
      );
    case 'dynamic-list':
      return (
        <FormDynamicList 
          key={fieldKey}
          {...commonProps} 
          typePlaceholder={field.typePlaceholder} 
        />
      );
    case 'nested-list':
      return <FormNestedDynamicList key={fieldKey} {...commonProps} />;
    case 'rating-10':
      return <FormRating10Scale key={fieldKey} {...commonProps} />;
    case 'image-upload':
      return <FormImageUpload key={fieldKey} {...commonProps} />;
    case 'signature':
      return <FormSignature key={fieldKey} {...commonProps} />;
    case 'document-list':
      return <FormDocumentList key={fieldKey} {...commonProps} />;
    case 'power-photo-question':
      return (
        <FormPowerPhotoQuestion
          key={fieldKey}
          {...commonProps}
          evidence={field.evidence}
          findingsHint={field.findingsHint}
        />
      );
    case 'power-question':
      return (
        <FormPowerQuestion
          key={fieldKey}
          {...commonProps}
          evidence={field.evidence}
          findingsHint={field.findingsHint}
        />
      );
    case 'network-question':
      return (
        <FormNetworkQuestion
          key={fieldKey}
          {...commonProps}
          evidenceRecord={field.evidenceRecord}
          remarksHint={field.remarksHint}
        />
      );
    case 'device-photo-list':
      return <FormDevicePhotoList key={fieldKey} {...commonProps} />;
    case 'numbered-text-list':
      return <FormNumberedTextList key={fieldKey} {...commonProps} />;
    default:
      return null;
  }
}

function AccordionSection({ heading, fields, formData, errors, onChange, renderItem }) {
  const [isOpen, setIsOpen] = React.useState(true);

  // Check if any field inside this accordion has an error
  const hasErrors = React.useMemo(() => {
    let err = false;
    const check = (f) => {
      if (f.name && errors[f.name]) err = true;
      if (f.fields) f.fields.forEach(check);
    };
    fields.forEach(check);
    return err;
  }, [fields, errors]);

  // Optionally auto-open if there are errors (good UX)
  React.useEffect(() => {
    if (hasErrors) setIsOpen(true);
  }, [hasErrors]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm mb-4">
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-t-xl ${
          isOpen ? 'sticky top-0 z-10 border-b border-slate-200/80 shadow-sm' : 'rounded-b-xl'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`font-bold text-[14px] ${hasErrors ? 'text-rose-500' : (heading.className?.includes('text-[#F98A15]') ? 'text-[#F98A15]' : 'text-slate-800')}`}>
            {heading.label}
          </span>
          {hasErrors && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}
        </div>
        <svg className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {/* CSS Transition for height is tricky, so we conditionally render. Animate-slide-down can be used if available. */}
      {isOpen && (
        <div className="p-5 space-y-5 bg-white rounded-b-xl">
          {fields.map((subField, idx) => renderItem(subField, idx))}
        </div>
      )}
    </div>
  );
}

export default function FormRenderer({ schema, formData, errors, onChange, useAccordions = false }) {
  const groupedSchema = React.useMemo(() => {
    if (!useAccordions) return schema;
    
    const headingCount = schema.filter(f => f.type === 'heading').length;
    if (headingCount <= 1) return schema;
    
    const result = [];
    let currentGroup = null;
    let currentStandaloneFields = [];

    schema.forEach(field => {
      if (field.type === 'heading') {
        if (currentStandaloneFields.length > 0) {
          result.push({
            type: 'standalone-group',
            fields: currentStandaloneFields
          });
          currentStandaloneFields = [];
        }
        currentGroup = { ...field, type: 'accordion-group', fields: [] };
        result.push(currentGroup);
      } else {
        if (currentGroup) {
          currentGroup.fields.push(field);
        } else {
          currentStandaloneFields.push(field);
        }
      }
    });

    if (currentStandaloneFields.length > 0) {
      result.push({
        type: 'standalone-group',
        fields: currentStandaloneFields
      });
    }

    return result;
  }, [schema, useAccordions]);

  const renderItem = (field, idx) => {
    if (field.showIf && !field.showIf(formData)) {
      return null;
    }

    if (field.type === 'accordion-group') {
      return (
        <AccordionSection 
          key={`acc-${idx}`} 
          heading={field} 
          fields={field.fields}
          formData={formData}
          errors={errors}
          onChange={onChange}
          renderItem={renderItem}
        />
      );
    }

    if (field.type === 'standalone-group') {
      return (
        <div className="space-y-5 mb-5" key={`standalone-${idx}`}>
          {field.fields.map((subField, sIdx) => renderItem(subField, sIdx))}
        </div>
      );
    }

    if (field.type === 'row') {
      return (
        <div className="grid grid-cols-2 gap-4" key={`row-${idx}`}>
          {field.fields.map((subField, sIdx) => renderItem(subField, sIdx))}
        </div>
      );
    }

    if (field.type === 'group') {
      return (
        <div className={field.className || "space-y-4"} key={`group-${idx}`}>
          {field.fields.map((subField, sIdx) => renderItem(subField, sIdx))}
        </div>
      );
    }

    return renderField(field, formData, errors, onChange);
  };

  const isFlat = React.useMemo(() => {
    if (!useAccordions) return true;
    const headingCount = schema.filter(f => f.type === 'heading').length;
    return headingCount <= 1;
  }, [schema, useAccordions]);

  return (
    <div className={isFlat ? "space-y-5" : "space-y-0"}>
      {groupedSchema.map((field, idx) => renderItem(field, idx))}
    </div>
  );
}
