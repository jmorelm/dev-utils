'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Box, Button, TextField } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { RestartAlt } from '@mui/icons-material';

// Cargar MonacoEditor dinámicamente solo en el lado del cliente
const MonacoEditor = dynamic(() => import('react-monaco-editor'), { ssr: false });

function parsePLSQLScript(script: string) {
    const headerRegex = /^(.*?)(BEGIN)/is;
    const functionRegex = /(\bFUNCTION\b\s+\w+\s*\([\s\S]*?\)\s+RETURN\s+\w+\s+IS\b[\s\S]+?END\s+\w+;)/gi;
    // const exceptionBlockRegex = /EXCEPTION([\s\S]+?)END;/gi;
    const selectRegex = /(SELECT[\s\S]+?FROM[\s\S]+?(?=;|END|LOOP))/gi;
    const insertRegex = /(INSERT[\s\S]+?INTO[\s\S]+?(?=;|END))/gi;
    const updateRegex = /(UPDATE[\s\S]+?SET[\s\S]+?(?:;|.*?COMMIT\s*;|END))/gi;
    const deleteRegex = /(DELETE[\s\S]+?FROM[\s\S]+?(?=;|END))/gi;
    const loopRegex = /(FOR|WHILE)[\s\S]+?LOOP[\s\S]+?END\s+LOOP/gi;
    const openRegex = /(OPEN\s+\w+\s+FOR[\s\S]+?(?=;|END))/gi;
    const variableDeclarationRegex = /\b(v_\w+)\s+(\w+)(\s*:=\s*[\s\S]+?)?;/gi;
    const variableAssignmentRegex = /\b(v_\w+)\s*:=\s*([\s\S]+?);/gi;

    const headerMatch = script.match(headerRegex);
    const header = headerMatch ? headerMatch[0] : '';

    const functions = Array.from(script.matchAll(functionRegex), match => match[0]);

    // Declaraciones de variables
    const variableDeclarations = Array.from(script.matchAll(variableDeclarationRegex), match => {
        const variableName = match[1]; // Nombre de la variable
        const variableType = match[2]; // Tipo de la variable
        const variableValue = match[3] ? match[3].trim() : ''; // Valor asignado (opcional)
        return `${variableName} ${variableType}${variableValue ? ' ' + variableValue : ''};`;
    }).join('\n');

    // Asignaciones de valores a variables
    const variableAssignments = Array.from(script.matchAll(variableAssignmentRegex), match => {
        const variableName = match[1]; // Nombre de la variable
        const assignedValue = match[2]; // Valor asignado
        return `${variableName} := ${assignedValue};`;
    }).join('\n');

    // const nonOpenContent = script.replace(openRegex, ''); // Remover secciones OPEN FOR para evitar duplicación de SELECTs
    const selects = Array.from(script.matchAll(selectRegex), match => match[0]);
    const inserts = Array.from(script.matchAll(insertRegex), match => match[0]);
    const updates = Array.from(script.matchAll(updateRegex), match => match[0]);
    const deletes = Array.from(script.matchAll(deleteRegex), match => match[0]);
    const loops = Array.from(script.matchAll(loopRegex), match => match[0]);

    // Asegurarse de agregar las secciones OPEN FOR al árbol
    const opens = Array.from(script.matchAll(openRegex), match => match[0]);

    const sections = [
        { id: 'header', title: 'CABECERA', content: header },
        ...functions.map((content, i) => ({ id: `function-${i}`, title: `FUNCION ${i + 1}`, content })),
        { id: 'variable-declarations', title: 'DECLARACIONES DE VARIABLES', content: variableDeclarations },
        { id: 'variable-assignments', title: 'ASIGNACIONES A VARIABLES', content: variableAssignments },
        ...selects.map((content, i) => ({ id: `select-${i}`, title: `SELECT ${i + 1}`, content })),
        ...inserts.map((content, i) => ({ id: `insert-${i}`, title: `INSERT ${i + 1}`, content })),
        ...updates.map((content, i) => ({ id: `update-${i}`, title: `UPDATE ${i + 1}`, content })),
        ...deletes.map((content, i) => ({ id: `delete-${i}`, title: `DELETE ${i + 1}`, content })),
        ...loops.map((content, i) => ({ id: `loop-${i}`, title: `LOOP ${i + 1}`, content })),
        ...opens.map((content, i) => ({ id: `open-${i}`, title: `RETORNO PROCEDIMIENTO ${i + 1}`, content })),
    ];

    return sections;
}

const PLTreeView = ({ script }: { script: string }) => {
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [sections, setSections] = useState(parsePLSQLScript(script));

    useEffect(() => {
        setSections(parsePLSQLScript(script));
    }, [script]);

    const handleSelect = (nodeId: string) => {
        setSelectedNode(nodeId);
    };

    return (
        <><h3 style={{ textAlign: "center" }}>Analisis del procedimiento</h3><Box sx={{ display: 'flex', height: '100%' }}>
            <SimpleTreeView
                aria-label="Secciones del procedimiento"
                sx={{ flexGrow: 1, overflowY: 'auto', marginTop: '4px' }}
            >
                {sections.map(section => (
                    <TreeItem key={section.id} itemId={section.id} label={section.title} onClick={() => handleSelect(section.id)}>
                        <MonacoEditor
                            height="200"
                            language="sql"
                            theme="vs-dark"
                            value={section.content}
                            options={{
                                readOnly: true,
                                automaticLayout: true,
                                wordWrap: 'on',
                                wordWrapColumn: 80,
                                wrappingIndent: 'indent',
                                colorDecorators: true,
                                showFoldingControls: "mouseover",
                                renderLineHighlight: "all",
                                codeLens: true,
                                cursorBlinking: "expand",
                                folding: true,
                                fontLigatures: true,
                            }} />
                    </TreeItem>
                ))}
            </SimpleTreeView>
        </Box></>
    );
};

export default function PLPage() {
    const [script, setScript] = useState<string>('');

    const handleReset = () => {
        setScript('');
    };

    return (
        <Box sx={{ padding: 2 }}>
            <h2 style={{ textAlign: "center"}}>Analizar PL/SQL</h2>
            <TextField
                label="Pegar procedimiento almacenado PL/SQL aqui"
                multiline
                rows={10}
                value={script}
                onChange={(e) => setScript(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{ marginBottom: 2, marginTop: 2 }}
            />
            <Button variant="contained" startIcon={<RestartAlt/>} onClick={handleReset} sx={{ marginBottom: 2 }}>
                Reiniciar
            </Button>
            <PLTreeView script={script} />
        </Box>
    );
}