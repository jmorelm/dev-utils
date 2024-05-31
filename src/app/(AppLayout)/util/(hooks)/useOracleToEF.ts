'use client'
import { useState, useEffect } from 'react';
import { Table, Join } from '../(types)/types';  // Assuming you have defined these types
import { generateEFModel, generateEFQuery, generateJoinQueryAdapted } from '../(functions)/queryUtils';

export function useOracleToEF() {
    const [tables, setTables] = useState<Table[]>([]);
    const [joins, setJoins] = useState<Join[]>([]);
    const [memoizedEFModels, setMemoizedEFModels] = useState<string[]>([]);
    const [memoizedEFQueries, setMemoizedEFQueries] = useState<string[]>([]);
    const [joinDialogOpen, setJoinDialogOpen] = useState<boolean>(false);

    useEffect(() => {
        const models = tables.map(table => generateEFModel(table.columns));
        const queries = tables.map(table => generateEFQuery(table.columns, { useAsNoTracking: true, useToList: false }));
        setMemoizedEFModels(models);
        setMemoizedEFQueries(queries);
    }, [tables]);

    const addTable = (newTable: Table) => {
        setTables(prev => [...prev, newTable]);
    };

    const parseSQLScript = (script: string): { tableName: string; columns: any[] } => {
        // Implementation needs to correctly parse the script
        return { tableName: "ExtractedName", columns: [] }; // Simplified for the example
    };

    const handleDelete = (index: number) => {
        setTables(prev => prev.filter((_, idx) => idx !== index));
    };

    return {
        tables,
        memoizedEFModels,
        memoizedEFQueries,
        addTable,
        parseSQLScript,
        handleDelete,
        joins,
        setJoins,
        joinDialogOpen,
        setJoinDialogOpen
    };
}