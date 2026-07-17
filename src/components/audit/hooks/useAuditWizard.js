import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { storageService } from '../services/storageService';
import { reportApiService } from '../services/reportApiService';
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

  useEffect(() => {
    // If we just received fresh data from the API (via navigation state), 
    // we bypass the cache and start fresh to avoid stale drafts.
    if (location.state?.odooData) {
      storageService.saveDraft(storageKey, initialFormValues).catch(e => console.error(e));
      reset(initialFormValues);
      
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
      } else {
        reset(initialFormValues);
      }
    }).catch(err => {
      console.error("Failed to load draft from IndexedDB", err);
      reset(initialFormValues);
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
        storageService.saveDraft(storageKey, value).catch(err => {
          console.error("Failed to save draft to IndexedDB", err);
        });
      });
      return () => subscription.unsubscribe();
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
      
      // Check if it's a field with an image object
      if (fieldData && typeof fieldData === 'object' && fieldData.image) {
        const imgObj = fieldData.image;
        if (imgObj.pendingFetch && imgObj.odooId && imgObj.isFromServer && !fetchingImages.current.has(imgObj.odooId)) {
          // Mark as fetching
          fetchingImages.current.add(imgObj.odooId);
          
          const promise = reportApiService.fetchLineImage(imgObj.odooId).then(base64 => {
            if (base64) {
              setValue(`${f.name}.image`, {
                url: `data:image/jpeg;base64,${base64}`,
                isFromServer: true
              }, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            } else {
              setValue(`${f.name}.image`, null, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            }
          }).catch(err => {
            console.error(`Error processing fetched image for ${imgObj.odooId}:`, err);
            setValue(`${f.name}.image`, null, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
          }).finally(() => {
            fetchingImages.current.delete(imgObj.odooId);
          });
          fetchPromises.push(promise);
        }
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

  const handleSaveCurrent = () => {
    const currentData = getValues();
    if (reportId && saveSectionData && !isReadOnly) {
      const payloadKey = sectionToPayloadKey ? sectionToPayloadKey[currentSubsection] : null;
      const sectionSchema = schemas[currentSubsection];
      if (sectionSchema) {
        saveSectionData(reportId, sectionSchema, currentData, payloadKey)
          .then(() => {
            toast.success('Section saved', { duration: 2000, position: 'bottom-center' });
          })
          .catch(err => {
            if (err.isOffline) {
              toast('Offline mode: Section saved locally. Will sync automatically.', {
                icon: '📶',
                style: {
                  borderRadius: '10px',
                  background: '#333',
                  color: '#fff',
                },
              });
            } else {
              console.error("Background sync failed on section save:", err);
              toast.error('Failed to sync section to server. Please try again.', {
                style: {
                  borderRadius: '10px',
                  background: '#ef4444',
                  color: '#fff',
                }
              });
            }
          });
      }
    }
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
    isReadOnly,
    getSectionStatus,
    calculateGlobalProgress,
    handleSectionSelect,
    handleSaveCurrent,
    handleNextClick, handlePrevClick
  };
}
