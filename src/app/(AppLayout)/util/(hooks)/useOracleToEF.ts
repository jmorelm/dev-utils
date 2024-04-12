'use client'
import { useState, useEffect, useMemo, useRef } from 'react';
import { generateEFModel, generateEFQuery, generateJoinQuery } from '../(functions)/queryUtils';

export function useOracleToEF() {
    const [value, setValue] = useState(0);
    const [scripts, setScripts] = useState<string[]>(['']);
    const [parsedColumns, setParsedColumns] = useState<{ originalName: string; transformedName: string; cSharpType: string, isId: boolean }[]>([]);
    const [options, setOptions] = useState({ useAsNoTracking: false, useToList: false });
    const [error, setError] = useState<string>('');
    const [joinDialogOpen, setJoinDialogOpen] = useState(false);
    const [joins, setJoins] = useState<Array<{ leftTable: string; rightTable: string; onCondition: string }>>([]);
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        workerRef.current = new Worker(new URL('../(config)/oracleParserWorker.ts', import.meta.url) as any);
        workerRef.current.onmessage = (e: MessageEvent) => {
            setParsedColumns(e.data.result);
            setError('');
        };
        workerRef.current.onerror = (e: ErrorEvent) => {
            setError(`Error processing the Oracle script in the worker: ${e.message}`);
        };
        return () => {
            workerRef.current?.terminate();
        };
    }, []);

    const memoizedEFModel = useMemo(() => generateEFModel(parsedColumns), [parsedColumns]);
    const memoizedEFQuery = useMemo(() => generateEFQuery(parsedColumns, options), [parsedColumns, options]);

    const handleScriptChange = (index: number, newScript: string) => {
        const newScripts = [...scripts];
        newScripts[index] = newScript;
        setScripts(newScripts);

        workerRef.current?.postMessage({ script: newScript });
    };

    const handleAddJoin = (leftTable: string, rightTable: string, onCondition: string) => {
        setJoins([...joins, { leftTable, rightTable, onCondition }]);
    };

    const handleEditJoin = (index: number, leftTable: string, rightTable: string, onCondition: string) => {
        const updatedJoins = joins.map((join, idx) => idx === index ? { leftTable, rightTable, onCondition } : join);
        setJoins(updatedJoins);
    };

    const handleDeleteJoin = (index: number) => {
        const updatedJoins = joins.filter((_, idx) => idx !== index);
        setJoins(updatedJoins);
    };

    return {
        value, setValue,
        scripts, setScripts,
        parsedColumns,
        options, setOptions,
        error, setError,
        joinDialogOpen, setJoinDialogOpen,
        joins, setJoins,
        memoizedEFModel, memoizedEFQuery,
        handleScriptChange, handleAddJoin, handleEditJoin, handleDeleteJoin
    };
}