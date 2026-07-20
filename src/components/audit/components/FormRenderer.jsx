import React from 'react';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import { PlusIcon, TrashIcon } from './Icons';
import { Label } from './form-controls/Label';
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
  FormNetworkSecurityQuestion,
  FormDevicePhotoList,
  FormNumberedTextList,
  FormSignature,
  FormSelectWithCounts,
  FormSelect,
  FormBifurcation
} from './form-controls';

function renderField(field, control, globalDisabled = false) {
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
          onChange: globalDisabled ? () => {} : customOnChange,
          required: field.required,
          disabled: field.disabled || globalDisabled,
          readOnly: field.readOnly || globalDisabled
        };

        const isImageField = ['image-upload', 'signature', 'power-photo', 'device-photo-list', 'document-list'].includes(field.type);
        const wrapperClass = (globalDisabled && !isImageField) ? 'pointer-events-none opacity-80' : '';

        const renderComponent = () => {

        switch (field.type) {
          case 'text':
          case 'phone':
          case 'pincode':
          case 'landline':
            return (
              <FormTextField 
                {...commonProps} 
                placeholder={field.placeholder} 
                disabled={field.disabled || globalDisabled}
                readOnly={field.readOnly || globalDisabled}
              />
            );
          case 'date':
            return (
              <FormTextField 
                {...commonProps} 
                type="date"
                disabled={field.disabled || globalDisabled}
                readOnly={field.readOnly || globalDisabled}
              />
            );
          case 'datetime-local':
            return (
              <FormTextField 
                {...commonProps} 
                type="datetime-local"
                disabled={field.disabled || globalDisabled}
                readOnly={field.readOnly || globalDisabled}
              />
            );
          case 'number':
            return (
              <FormTextField 
                {...commonProps} 
                placeholder={field.placeholder} 
                inputMode="numeric" 
                pattern="[0-9]*" 
                disabled={field.disabled || globalDisabled}
                readOnly={field.readOnly || globalDisabled}
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
            return <FormNodeCounts {...commonProps} />;
          case 'dynamic-list':
            return (
              <FormDynamicList 
                {...commonProps} 
                typePlaceholder={field.typePlaceholder} 
              />
            );
          case 'nested-list':
            return <FormNestedDynamicList {...commonProps} />;
          case 'select-with-counts':
            return <FormSelectWithCounts {...commonProps} options={field.options} />;
          case 'select':
            return <FormSelect {...commonProps} options={field.options} />;
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
                hideScore={field.hideScore}
                showPhase={field.showPhase}
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
          case 'network-security-question':
            return (
              <FormNetworkSecurityQuestion
                {...commonProps}
                header={field.header}
                remarks={field.remarks}
              />
            );
          case 'device-photo-list':
            return <FormDevicePhotoList {...commonProps} />;
          case 'numbered-text-list':
            return <FormNumberedTextList {...commonProps} />;
          case 'bifurcation':
            return <FormBifurcation {...commonProps} />;
          default:
            return null;
        }
        };

        return (
          <div className={wrapperClass}>
            {renderComponent()}
          </div>
        );
      }}
    />
  );
}

function ConditionalWrapper({ field, control, renderItem, idx, itemContext }) {
  const formData = useWatch({ control });
  if (!field.showIf(formData, itemContext)) {
    return null;
  }
  
  const fieldWithoutShowIf = { ...field };
  delete fieldWithoutShowIf.showIf;
  
  return renderItem(fieldWithoutShowIf, idx, itemContext);
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
        className={`w-full flex justify-between items-center p-4 hover:bg-white/20 transition-colors rounded-t-xl ${
          isOpen ? 'sticky top-0 z-10 border-b border-white/20 bg-[#0F0F23]/95 backdrop-blur-xl shadow-sm' : 'bg-white/10 rounded-b-xl'
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

function ObjectSection({ field, control, renderItem }) {
  return (
    <div className={`space-y-4 p-4 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl select-none ${field.className || ''}`}>
      {field.label && <Label text={field.label} required={field.required} />}
      <div className="space-y-4">
        {field.fields.map((subField, sIdx) => {
          const prefixedField = {
            ...subField,
            name: `${field.name}.${subField.name}`
          };
          return renderItem(prefixedField, sIdx);
        })}
      </div>
    </div>
  );
}

function ArraySection({ field, control, renderItem, globalDisabled = false }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: field.name
  });

  return (
    <div className={`space-y-4 p-4 bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl select-none ${field.className || ''}`}>
      <div className="flex justify-between items-center mb-1">
        <Label text={field.label} required={field.required} />
        {!globalDisabled && (
          <button
            type="button"
            onClick={() => append({})}
            className="flex items-center gap-1 text-[12px] font-medium text-[#ff6b6b] hover:text-white bg-[#ff6b6b]/10 hover:bg-[#ff6b6b]/20 active:scale-[0.98] transition-all px-3 py-1.5 rounded-lg cursor-pointer"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            Add {field.itemLabel || 'Item'}
          </button>
        )}
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-6 bg-white/5 rounded-xl border border-dashed border-white/20">
          <p className="text-[13px] text-white/50 font-light">No {field.itemLabel?.toLowerCase() || 'items'} added yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {fields.map((item, index) => (
            <div key={item.id} className="relative p-4 bg-white/10 border border-white/10 rounded-xl animate-fade-in shadow-sm">
              {!globalDisabled && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute -top-3 -right-3 w-7 h-7 bg-[#ff6b6b] border border-white/10 text-white hover:bg-rose-600 hover:border-rose-200 rounded-full flex items-center justify-center shadow-sm cursor-pointer z-10 transition-colors"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              )}
              
              <div className="space-y-4">
                {field.fields.map((subField, sIdx) => {
                  const prefixedField = {
                    ...subField,
                    name: `${field.name}.${index}.${subField.name}`
                  };
                  return renderItem(prefixedField, sIdx, item);
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FormRenderer({ schema, control, errors = {}, useAccordions = false, globalDisabled = false }) {
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

  const renderItem = (field, idx, itemContext = null) => {
    if (field.showIf) {
      return (
        <ConditionalWrapper 
          key={`cond-${field.name || idx}`} 
          field={field} 
          control={control} 
          renderItem={renderItem} 
          idx={idx} 
          itemContext={itemContext} 
        />
      );
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

    if (field.type === 'object') {
      return <ObjectSection key={`obj-${idx}`} field={field} control={control} renderItem={renderItem} />;
    }

    if (field.type === 'array') {
      return <ArraySection key={`arr-${idx}`} field={field} control={control} renderItem={renderItem} globalDisabled={globalDisabled} />;
    }

    return renderField(field, control, globalDisabled);
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
