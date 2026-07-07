import React from 'react';
import { Controller } from 'react-hook-form';
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

function renderField(field, control) {
  const fieldKey = field.name || field.prefix || field.label;

  if (field.type === 'heading') {
    return (
      <h4 
        className={`text-xs font-medium uppercase tracking-widest border-b pb-2 mb-4 pt-2 ${field.className || 'text-white/50 border-white/10'}`} 
        key={field.label}
      >
        {field.label}
      </h4>
    );
  }

  // Use Controller for actual fields
  return (
    <Controller
      key={fieldKey}
      name={field.name || field.prefix || 'unnamed-field'}
      control={control}
      rules={{ required: field.required }}
      render={({ field: rhfField, fieldState: { error } }) => {
        let customOnChange = rhfField.onChange;

        if (field.type === 'phone') {
          customOnChange = (name, val) => {
            const digits = val.replace(/\D/g, '').slice(0, 10);
            rhfField.onChange(digits);
          };
        } else if (field.type === 'pincode') {
          customOnChange = (name, val) => {
            const digits = val.replace(/\D/g, '').slice(0, 6);
            rhfField.onChange(digits);
          };
        } else if (field.type === 'landline') {
          customOnChange = (name, val) => {
            const sanitized = val.replace(/[^\d\s-]/g, '').slice(0, 12);
            rhfField.onChange(sanitized);
          };
        } else {
          // Normal case, our custom components might call onChange(name, value) or onChange(value)
          customOnChange = (...args) => {
             if (args.length === 2) rhfField.onChange(args[1]);
             else rhfField.onChange(args[0]);
          };
        }

        const commonProps = {
          label: field.label,
          name: field.name,
          value: rhfField.value,
          error: error ? error.message : undefined,
          onChange: customOnChange,
          required: field.required
        };

        switch (field.type) {
          case 'text':
          case 'phone':
          case 'pincode':
          case 'landline':
            return (
              <FormTextField 
                {...commonProps} 
                placeholder={field.placeholder} 
                disabled={field.disabled}
                readOnly={field.readOnly}
              />
            );
          case 'date':
            return (
              <FormTextField 
                {...commonProps} 
                type="date"
                disabled={field.disabled}
                readOnly={field.readOnly}
              />
            );
          case 'datetime-local':
            return (
              <FormTextField 
                {...commonProps} 
                type="datetime-local"
                disabled={field.disabled}
                readOnly={field.readOnly}
              />
            );
          case 'number':
            return (
              <FormTextField 
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
                {...commonProps} 
                placeholder={field.placeholder} 
                rows={field.rows} 
              />
            );
          case 'yes-no':
            return (
              <FormYesNoSelector 
                {...commonProps} 
                noColor={field.noColor || 'rose'} 
              />
            );
          case 'yes-no-na':
            return <FormYesNoNaSelector {...commonProps} />;
          case 'quality':
            return <FormQualitySelector {...commonProps} />;
          case 'node-counts':
            return (
              <FormNodeCounts 
                {...commonProps} 
                prefix={field.prefix} 
                formData={rhfField.value || {}} // Node counts might need special handling depending on how it stores data
                errors={{}} // Handled inside
              />
            );
          case 'dynamic-list':
            return (
              <FormDynamicList 
                {...commonProps} 
                typePlaceholder={field.typePlaceholder} 
              />
            );
          case 'nested-list':
            return <FormNestedDynamicList {...commonProps} />;
          case 'rating-10':
            return <FormRating10Scale {...commonProps} />;
          case 'image-upload':
            return <FormImageUpload {...commonProps} />;
          case 'signature':
            return <FormSignature {...commonProps} />;
          case 'document-list':
            return <FormDocumentList {...commonProps} />;
          case 'power-photo-question':
            return (
              <FormPowerPhotoQuestion
                {...commonProps}
                evidence={field.evidence}
                findingsHint={field.findingsHint}
              />
            );
          case 'power-question':
            return (
              <FormPowerQuestion
                {...commonProps}
                evidence={field.evidence}
                findingsHint={field.findingsHint}
              />
            );
          case 'network-question':
            return (
              <FormNetworkQuestion
                {...commonProps}
                evidenceRecord={field.evidenceRecord}
                remarksHint={field.remarksHint}
              />
            );
          case 'device-photo-list':
            return <FormDevicePhotoList {...commonProps} />;
          case 'numbered-text-list':
            return <FormNumberedTextList {...commonProps} />;
          default:
            return null;
        }
      }}
    />
  );
}

function AccordionSection({ heading, fields, control, renderItem, errors = {} }) {
  const [isOpen, setIsOpen] = React.useState(true);

  const hasErrors = React.useMemo(() => {
    let err = false;
    const check = (f) => {
      if (f.name && errors[f.name]) err = true;
      if (f.fields) f.fields.forEach(check);
    };
    fields.forEach(check);
    return err;
  }, [fields, errors]);

  React.useEffect(() => {
    if (hasErrors) setIsOpen(true);
  }, [hasErrors]);

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-xl mb-4">
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center p-4 bg-white/10 hover:bg-white/20 transition-colors rounded-t-xl ${
          isOpen ? 'sticky top-0 z-10 border-b border-white/20' : 'rounded-b-xl'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className={`font-medium text-[14px] ${hasErrors ? 'text-[#ff6b6b]' : (heading.className?.includes('text-[#ff6b6b]') ? 'text-[#ff6b6b]' : 'text-white')}`}>
            {heading.label}
          </span>
          {hasErrors && (
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}
        </div>
        <svg className={`w-5 h-5 text-white/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="p-5 space-y-5 bg-transparent rounded-b-xl">
          {fields.map((subField, idx) => renderItem(subField, idx))}
        </div>
      )}
    </div>
  );
}

export default function FormRenderer({ schema, control, errors = {}, useAccordions = false, watch }) {
  const formData = watch ? watch() : {};

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
          control={control}
          errors={errors}
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

    return renderField(field, control);
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
