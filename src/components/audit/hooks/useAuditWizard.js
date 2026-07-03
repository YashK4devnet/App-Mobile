import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  sectionToPayloadKey
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
  const [viewMode, setViewMode] = useState('index');
  const [currentSubsection, setCurrentSubsection] = useState(steps[0].id);
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

  const venueId = initialVenue?.id || 'new';
  const typeId = auditName === 'Venue Audit Report' ? 'venue-audit' : auditName === 'Venue Power Audit Report' ? 'power-audit' : 'network-audit';
  const storageKey = `audit_draft_${venueId}_${typeId}`;
  
  const [isInitializing, setIsInitializing] = useState(!!location.state?.loadDraft);
  
  const [formData, setFormData] = useState(() => {
    const baseState = (initialVenue ? { ...initialStateGenerator(schemas), ...initialVenue } : initialStateGenerator(schemas));
    
    // Auto-generate default date and report number
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
  });
  
  const [errors, setErrors] = useState({});
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  const navigate = useNavigate();

  // Convert "new" drafts to "resumed" drafts in history state 
  // so browser back-buttons don't overwrite them with blank copies
  useEffect(() => {
    if (!location.state?.loadDraft) {
      navigate(location.pathname, {
        replace: true,
        state: { ...location.state, loadDraft: true }
      });
    }
  }, [location.pathname, location.state, navigate]);

  // Async initialization for draft
  useEffect(() => {
    if (location.state?.loadDraft) {
      storageService.getDraft(storageKey).then(draftData => {
        if (draftData) {
          setFormData(draftData);
        }
      }).catch(err => {
        console.error("Failed to load draft from IndexedDB", err);
      }).finally(() => {
        setIsInitializing(false);
      });
    }
  }, [location.state?.loadDraft, storageKey]);

  // Automatically save draft when formData changes (only after initialized)
  useEffect(() => {
    if (!isInitializing) {
      storageService.saveDraft(storageKey, formData).catch(err => {
        console.error("Failed to save draft to IndexedDB", err);
      });
    }
  }, [formData, storageKey, isInitializing]);

  // Remove draft upon successful completion
  useEffect(() => {
    if (showSuccessOverlay) {
      storageService.deleteDraft(storageKey).catch(err => console.error(err));
    }
  }, [showSuccessOverlay, storageKey]);

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => {
      const newState = { ...prev, [fieldName]: value };

      if (fieldName === 'auditDate' && value) {
        try {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            date.setMonth(date.getMonth() + nextAuditMonths);
            newState.nextAuditDate = date.toISOString().split('T')[0];
          }
        } catch (e) {
          console.error("Error calculating next audit date", e);
        }
      }

      return newState;
    });

    if (errors[fieldName]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[fieldName];
        return copy;
      });
    }
  };

  const getSectionStatus = (sectionId) => {
    const schema = schemas[sectionId];
    if (!schema) return 'empty';
    const sectionErrors = validateSchema(schema, formData);
    if (Object.keys(sectionErrors).length > 0) return 'invalid';
    return isSchemaEmpty(schema, formData) ? 'empty' : 'valid';
  };

  const progressPercent = calculateGlobalProgress(schemas, formData);

  const handleSectionSelect = (sectionId) => {
    setCurrentSubsection(sectionId);
    setErrors({});
    setViewMode('form');
  };

  const handleNextClick = () => {
    const currentIndex = steps.findIndex(s => s.id === currentSubsection);
    if (currentIndex === -1) return;

    setErrors({});

    // Auto-sync via PATCH API
    if (formData.reportNumber && apiSyncFunction && sectionToPayloadKey) {
      const patchPayload = {};
      Object.entries(sectionToPayloadKey).forEach(([sectionId, payloadKey]) => {
        if (!patchPayload[payloadKey]) patchPayload[payloadKey] = {};
        
        const sectionSchema = schemas[sectionId];
        if (sectionSchema) {
          extractKeysFromSchema(sectionSchema).forEach(key => {
            if (formData[key] !== undefined) {
              patchPayload[payloadKey][key] = formData[key];
            }
          });
        }
      });
      
      apiSyncFunction(formData.reportNumber, patchPayload)
        .catch(err => console.error("Background sync failed:", err));
    }

    const nextStep = steps[currentIndex + 1];
    if (nextStep) {
      setCurrentSubsection(nextStep.id);
      const container = document.getElementById('audit-form-container');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setShowSuccessOverlay(true);
    }
  };

  const handlePrevClick = () => {
    const currentIndex = steps.findIndex(s => s.id === currentSubsection);
    if (currentIndex > 0) {
      setCurrentSubsection(steps[currentIndex - 1].id);
      const container = document.getElementById('audit-form-container');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setViewMode('index');
    }
  };

  return {
    viewMode, setViewMode,
    currentSubsection, setCurrentSubsection,
    formData, setFormData,
    errors, setErrors,
    showSuccessOverlay, setShowSuccessOverlay,
    isInitializing,
    isAccordionOpen, setIsAccordionOpen,
    handleFieldChange, getSectionStatus,
    progressPercent, handleSectionSelect,
    handleNextClick, handlePrevClick
  };
}
