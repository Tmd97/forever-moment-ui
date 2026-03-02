import { useState, useEffect, useMemo, useCallback, useRef } from 'react';

interface Change {
    field: string;
    original: any;
    current: any;
}

interface UseUnsavedChangesOptions<T> {
    originalData: T;
    fieldMapping: Partial<Record<keyof T, string>>;
    onDirtyChange?: (isDirty: boolean, changes: Change[]) => void;
}

export function useUnsavedChanges<T>({
    originalData,
    fieldMapping,
    onDirtyChange
}: UseUnsavedChangesOptions<T>) {
    const [localData, setLocalData] = useState<T>(originalData);

    // Store onDirtyChange in a ref so the effect below never depends on it as a
    // reactive value. This prevents an infinite loop when the parent re-renders
    // and produces a new function reference on every render.
    const onDirtyChangeRef = useRef(onDirtyChange);
    useEffect(() => {
        onDirtyChangeRef.current = onDirtyChange;
    });

    // Sync local state when originalData prop changes (from outside), but only
    // when the value actually changes — not just the reference.
    const originalDataJsonRef = useRef(JSON.stringify(originalData));
    useEffect(() => {
        const nextJson = JSON.stringify(originalData);
        if (originalDataJsonRef.current !== nextJson) {
            originalDataJsonRef.current = nextJson;
            setLocalData(originalData);
        }
    }, [originalData]);

    const changes = useMemo(() => {
        const changesList: Change[] = [];

        (Object.entries(fieldMapping) as [keyof T, string][]).forEach(([key, label]) => {
            const originalVal = originalData[key];
            const currentVal = localData[key];

            if (JSON.stringify(currentVal) !== JSON.stringify(originalVal)) {
                changesList.push({
                    field: label,
                    original: originalVal,
                    current: currentVal
                });
            }
        });

        return changesList;
    }, [originalData, localData, fieldMapping]);

    const isDirty = changes.length > 0;

    // Notify parent of dirty state changes. We deliberately do NOT include
    // onDirtyChange or `changes` in the dependency array. We use a ref for the
    // callback (updated each render above) and read `changes` at call-time to
    // avoid stale data. This prevents the infinite setState loop.
    const prevIsDirtyRef = useRef(isDirty);
    // Capture latest changes in a ref so the effect callback can read them
    const latestChangesRef = useRef(changes);
    useEffect(() => {
        latestChangesRef.current = changes;
    });
    useEffect(() => {
        if (prevIsDirtyRef.current !== isDirty) {
            prevIsDirtyRef.current = isDirty;
            onDirtyChangeRef.current?.(isDirty, latestChangesRef.current);
        }
    }, [isDirty]); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle browser reload/close
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    const handleDiscard = useCallback(() => {
        setLocalData(() => {
            const original = JSON.parse(originalDataJsonRef.current);
            // Notify parent that dirty state is gone
            onDirtyChangeRef.current?.(false, []);
            return original as T;
        });
    }, []);

    const updateField = useCallback((field: keyof T, value: any) => {
        setLocalData(prev => ({
            ...prev,
            [field]: value
        }));
    }, []);

    return {
        localData,
        setLocalData,
        updateField,
        changes,
        isDirty,
        handleDiscard
    };
}
