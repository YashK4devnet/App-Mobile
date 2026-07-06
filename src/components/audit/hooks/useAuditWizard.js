import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { storageService } from '../services/storageService';

export function useAuditWizard({
  schemas,
  steps,
  initialStateGenerator,
  validateSchema,
  isSchemaEmpty,
  calculateGlobalProgress,
  initialVenue,
  auditName,
  nextAuditMonths = 3,
  apiSyncFunction,
  sectionToPayloadKey,
  onComplete,
  onExitForm
}) {
  const extractKeysFromSchema = (schema) => {
    const keys = [];
    const processField = (f) => {
      if (f.type === 'heading') return;
      if (f.type === 'row' || f.type === 'group') {
        if (f.fields) f.fields.forEach(processField);
        return;
      }
      if (f.type === 'node-counts') {
        keys.push(`${f.prefix}Available`, `${f.prefix}Working`);
        return;
      }
      if (f.name) keys.push(f.name);
    };
    if (schema && Array.isArray(schema)) {
      schema.forEach(processField);
    }
    return keys;
  };

  const location = useLocation();
  const [currentSubsection, setCurrentSubsection] = useState(steps[0].id);

  const venueId = initialVenue?.id || 'new';
  const typeId = auditName === 'Venue Audit Report' ? 'venue-audit' : auditName === 'Venue Power Audit Report' ? 'power-audit' : 'network-audit';
  const storageKey = `audit_draft_${venueId}_${typeId}`;
  
  const [isInitializing, setIsInitializing] = useState(!!location.state?.loadDraft);
  
  // Evaluate default values before passing to useForm, as RHF expects a Promise if a function is passed.
  const initialFormValues = (() => {
    const baseState = (initialVenue ? { ...initialStateGenerator(schemas), ...initialVenue } : initialStateGenerator(schemas));
    
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const todayStr = new Date(now - offset).toISOString().split('T')[0];
    const generatedReportNumber = baseState.reportNumber || String(Math.floor(2150000 + Math.random() * 10000));
    
    const auditDate = baseState.auditDate || todayStr;
    let nextAuditDate = baseState.nextAuditDate || '';
    if (!nextAuditDate && auditDate) {
      try {
        const d = new Date(auditDate);
        d.setMonth(d.getMonth() + nextAuditMonths);
        nextAuditDate = d.toISOString().split('T')[0];
      } catch (e) {}
    }

    return {
      systemAuditName: auditName,
      auditDate,
      nextAuditDate,
      reportNumber: generatedReportNumber,
      ...baseState,
      auditTypeId: typeId
    };
  })();

  const { control, getValues, setValue, watch, reset, formState: { errors: formErrors } } = useForm({
    defaultValues: initialFormValues,
    mode: 'onBlur'
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!location.state?.loadDraft) {
      navigate(location.pathname, {
        replace: true,
        state: { ...location.state, loadDraft: true }
      });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (location.state?.loadDraft) {
      storageService.getDraft(storageKey).then(draftData => {
        if (draftData) {
          reset(draftData); // Load draft into RHF
        }
      }).catch(err => {
        console.error("Failed to load draft from IndexedDB", err);
      }).finally(() => {
        setIsInitializing(false);
      });
    }
  }, [location.state?.loadDraft, storageKey, reset]);

  // Subscribe to changes for auto-save, using watch
  useEffect(() => {
    if (!isInitializing) {
      const subscription = watch((value) => {
        storageService.saveDraft(storageKey, value).catch(err => {
          console.error("Failed to save draft to IndexedDB", err);
        });
      });
      return () => subscription.unsubscribe();
    }
  }, [watch, storageKey, isInitializing]);

  const getSectionStatus = (sectionId, currentData) => {
    const schema = schemas[sectionId];
    if (!schema) return 'empty';
    const sectionErrors = validateSchema(schema, currentData);
    if (Object.keys(sectionErrors).length > 0) return 'invalid';
    return isSchemaEmpty(schema, currentData) ? 'empty' : 'valid';
  };

  const handleSectionSelect = (sectionId) => {
    setCurrentSubsection(sectionId);
  };

  const handleNextClick = () => {
    const currentIndex = steps.findIndex(s => s.id === currentSubsection);
    if (currentIndex === -1) return;

    const currentData = getValues();

    if (currentData.reportNumber && apiSyncFunction && sectionToPayloadKey) {
      const patchPayload = {};
      Object.entries(sectionToPayloadKey).forEach(([sectionId, payloadKey]) => {
        if (!patchPayload[payloadKey]) patchPayload[payloadKey] = {};
        
        const sectionSchema = schemas[sectionId];
        if (sectionSchema) {
          extractKeysFromSchema(sectionSchema).forEach(key => {
            if (currentData[key] !== undefined) {
              patchPayload[payloadKey][key] = currentData[key];
            }
          });
        }
      });
      
      apiSyncFunction(currentData.reportNumber, patchPayload)
        .catch(err => console.error("Background sync failed:", err));
    }

    const nextStep = steps[currentIndex + 1];
    if (nextStep) {
      setCurrentSubsection(nextStep.id);
      const container = document.getElementById('audit-form-container');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      storageService.deleteDraft(storageKey).catch(err => console.error(err));
      if (onComplete) onComplete();
    }
  };

  const handlePrevClick = () => {
    const currentIndex = steps.findIndex(s => s.id === currentSubsection);
    if (currentIndex > 0) {
      setCurrentSubsection(steps[currentIndex - 1].id);
      const container = document.getElementById('audit-form-container');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (onExitForm) onExitForm();
    }
  };

  // Provide everything needed for RHF integration
  return {
    currentSubsection, setCurrentSubsection,
    control, getValues, watch, setValue,
    errors: formErrors,
    isInitializing,
    getSectionStatus,
    calculateGlobalProgress,
    handleSectionSelect,
    handleNextClick, handlePrevClick
  };
}
