import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { storageService } from '../services/storageService';
import { reportApiService } from '../services/reportApiService';
import { decodeOdooImage } from '../utils/imageUtils';
import toast from 'react-hot-toast';

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
  saveSectionData,
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
  const params = useParams();
  const [currentSubsection, setCurrentSubsection] = useState(steps[0].id);
  const [submittedSections, setSubmittedSections] = useState([]);

  const venueId = initialVenue?.id || 'new';
  const typeId = auditName === 'Venue Audit Report' ? 'venue-audit' : auditName === 'Venue Power Audit Report' ? 'power-audit' : 'network-audit';
  const reportId = location.state?.odooData?.id || params.reportId;
  const storageKey = reportId 
    ? `audit_draft_report_${reportId}_${typeId}` 
    : `audit_draft_venue_${venueId}_${typeId}`;
  
  const reportState = location.state?.odooData?.state || 'draft';
  const isReadOnly = reportState === 'waiting_for_approval' || reportState === 'approved' || reportState === 'reject';
  const [isInitializing, setIsInitializing] = useState(true);
  
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
  const lastSavedDataRef = useRef(null);

  useEffect(() => {
    // If we just received fresh data from the API (via navigation state), 
    // we bypass the cache and start fresh to avoid stale drafts.
    if (location.state?.odooData) {
      storageService.saveDraft(storageKey, initialFormValues).catch(e => console.error(e));
      reset(initialFormValues);
      lastSavedDataRef.current = JSON.stringify(initialFormValues);
      
      // Auto-start audit if it's assigned
      if (location.state.odooData.state === 'assign_user' && reportId) {
         reportApiService.patchAuditSection(reportId, { state: 'in_progress' })
           .catch(err => console.error("Failed to update status to in_progress", err));
         location.state.odooData.state = 'in_progress'; // update locally
      }
      
      setIsInitializing(false);
      return;
    }

    storageService.getDraft(storageKey).then(draftData => {
      // Only reset with draftData if it actually exists, otherwise keep initialFormValues
      if (draftData && Object.keys(draftData).length > 0) {
        reset(draftData);
        lastSavedDataRef.current = JSON.stringify(draftData);
      } else {
        reset(initialFormValues);
        lastSavedDataRef.current = JSON.stringify(initialFormValues);
      }
    }).catch(err => {
      console.error("Failed to load draft from IndexedDB", err);
      reset(initialFormValues);
      lastSavedDataRef.current = JSON.stringify(initialFormValues);
    }).finally(() => {
      setIsInitializing(false);
    });
    // We only want to load draft once on mount or when storageKey changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, reset]);

  // Subscribe to changes for auto-save, using watch
  useEffect(() => {
    if (!isInitializing) {
      const subscription = watch((value) => {
        // Local IndexedDB Draft (Immediate)
        storageService.saveDraft(storageKey, value).catch(err => {
          console.error("Failed to save draft to IndexedDB", err);
        });
      });
      
      return () => {
        subscription.unsubscribe();
      };
    }
  }, [watch, storageKey, isInitializing]);

  const fetchingImages = useRef(new Set());

  // Lazy load images when subsection changes
  useEffect(() => {
    if (isInitializing || !reportId) return;

    const currentSchema = schemas[currentSubsection];
    if (!currentSchema) return;

    const fetchPromises = [];

    const processFieldForImages = (f) => {
      if (f.type === 'heading' || f.type === 'row' || f.type === 'group') {
        if (f.fields) f.fields.forEach(processFieldForImages);
        return;
      }
      if (!f.name) return;

      const fieldData = getValues(f.name);
      
      const fetchImage = (imgObj, path) => {
        if (imgObj && imgObj.pendingFetch && imgObj.odooId && imgObj.isFromServer && !fetchingImages.current.has(imgObj.odooId)) {
          fetchingImages.current.add(imgObj.odooId);
          const promise = reportApiService.fetchLineImage(imgObj.odooId).then(base64 => {
            if (base64) {
              setValue(path, {
                url: decodeOdooImage(base64),
                isFromServer: true
              }, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            } else {
              setValue(path, null, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            }
          }).catch(err => {
            console.error(`Error processing fetched image for ${imgObj.odooId}:`, err);
            setValue(path, null, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
          }).finally(() => {
            fetchingImages.current.delete(imgObj.odooId);
          });
          fetchPromises.push(promise);
        }
      };

      if (Array.isArray(fieldData)) {
        fieldData.forEach((item, index) => {
          if (item && typeof item === 'object') {
            if (item.deviceImage) fetchImage(item.deviceImage, `${f.name}[${index}].deviceImage`);
            if (item.doc_image) fetchImage(item.doc_image, `${f.name}[${index}].doc_image`);
            if (item.image) fetchImage(item.image, `${f.name}[${index}].image`);
          }
        });
      } else if (fieldData && typeof fieldData === 'object' && fieldData.image) {
        fetchImage(fieldData.image, `${f.name}.image`);
      }
    };

    if (Array.isArray(currentSchema)) {
      currentSchema.forEach(processFieldForImages);
    }
  }, [currentSubsection, isInitializing, reportId, schemas, getValues, setValue]);

  const getSectionStatus = (sectionId, currentData) => {
    const schema = schemas[sectionId];
    if (!schema) return 'empty';
    const sectionErrors = validateSchema(schema, currentData);
    if (Object.keys(sectionErrors).length > 0) return 'invalid';
    return isSchemaEmpty(schema, currentData) ? 'empty' : 'valid';
  };

  const handleSectionSelect = (sectionId) => {
    handleSaveCurrent();
    setCurrentSubsection(sectionId);
  };

  const handleSaveCurrent = (silent = false) => {
    const currentData = getValues();
    const currentDataStr = JSON.stringify(currentData);
    lastSavedDataRef.current = currentDataStr;
    storageService.saveDraft(storageKey, currentData).catch(err => console.error(err));
    if (!silent) toast.success('Saved locally', { duration: 1500, position: 'bottom-center' });
  };

  const handleSubmitSection = async (sectionIdToSubmit) => {
    const targetSection = sectionIdToSubmit || currentSubsection;
    if (isReadOnly || submittedSections.includes(targetSection)) return true;
    
    const currentData = getValues();
    if (reportId && saveSectionData) {
      const payloadKey = sectionToPayloadKey ? sectionToPayloadKey[targetSection] : null;
      const sectionSchema = schemas[targetSection];
      if (sectionSchema) {
        try {
          await saveSectionData(reportId, sectionSchema, currentData, payloadKey);
          
          setSubmittedSections(prev => {
            if (!prev.includes(targetSection)) return [...prev, targetSection];
            return prev;
          });
          
          lastSavedDataRef.current = JSON.stringify(currentData);
          toast.success('Section submitted', { duration: 2000, position: 'bottom-center' });
          return true;
        } catch (err) {
          if (err.isOffline) {
            toast('Offline mode: Saved locally. Will sync automatically.', {
              icon: '📶',
              style: { borderRadius: '10px', background: '#333', color: '#fff' },
            });
            return true;
          } else {
            console.error("Submission failed:", err);
            toast.error('Failed to submit section. Please try again.', {
              style: { borderRadius: '10px', background: '#ef4444', color: '#fff' }
            });
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleExitFormWithSave = async () => {
    if (!isReadOnly) {
      handleSaveCurrent(false);
    }
    if (onExitForm) onExitForm();
  };

  const handleNextClick = () => {
    const currentIndex = steps.findIndex(s => s.id === currentSubsection);
    if (currentIndex === -1) return;

    const currentData = getValues();

    handleSaveCurrent();

    const nextStep = steps[currentIndex + 1];
    if (nextStep) {
      setCurrentSubsection(nextStep.id);
      const container = document.getElementById('audit-form-container');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      if (isReadOnly) {
        if (onExitForm) onExitForm();
        return;
      }
      const submitFinal = async () => {
        try {
          if (reportId) {
            const syncTasks = await storageService.getSyncTasks();
            const hasPendingTasks = syncTasks.some(t => String(t.reportId) === String(reportId));
            
            if (hasPendingTasks) {
              const proceed = window.confirm("You have unsynced data queued from offline mode. Submitting now will lock the report and might cause data loss. Do you want to submit anyway?");
              if (!proceed) return;
            }

            await reportApiService.patchAuditSection(reportId, { state: 'waiting_for_approval' });
            if (location.state?.odooData) {
              location.state.odooData.state = 'waiting_for_approval';
            }
          }
        } catch (e) {
          console.error("Failed to update status to waiting_for_approval", e);
        } finally {
          storageService.deleteDraft(storageKey).catch(err => console.error(err));
          if (onComplete) onComplete();
        }
      };
      submitFinal();
    }
  };

  const handlePrevClick = () => {
    const currentIndex = steps.findIndex(s => s.id === currentSubsection);
    if (currentIndex > 0) {
      handleSaveCurrent();
      setCurrentSubsection(steps[currentIndex - 1].id);
      const container = document.getElementById('audit-form-container');
      if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      handleExitFormWithSave();
    }
  };

  // Provide everything needed for RHF integration
  return {
    currentSubsection, setCurrentSubsection,
    control, getValues, watch, setValue,
    errors: formErrors,
    isInitializing,
    formErrors,
    getSectionStatus,
    calculateGlobalProgress,
    handleSectionSelect,
    handleSaveCurrent,
    handleSubmitSection,
    handleExitFormWithSave,
    handleNextClick,
    handlePrevClick,
    isReadOnly,
    submittedSections,
    reportId
  };
}
