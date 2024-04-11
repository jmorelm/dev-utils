'use client'
import React, { useState } from 'react';
import { TextField, Button, Container, Paper, Typography } from '@mui/material';
import { RichTreeView, TreeItem } from '@mui/x-tree-view';

const PlsqlAnalyzerPage = () => {
    const [plsqlCode, setPlsqlCode] = useState('');
    const [analysisResult, setAnalysisResult] = useState([]);

    const handleAnalyzeCode = () => {
        let result = analyzePlsqlCode(plsqlCode);
        setAnalysisResult(transformAnalysisToTreeViewItems(result));
    };

    const transformAnalysisToTreeViewItems : any = (result: { header: any; body: any; }) => {
        let items = [];
        if (result.header) {
            items.push(createTreeItem('header', 'Cabecera', result.header));
        }
        if (result.body) {
            items.push(createTreeItem('body', 'Cuerpo', result.body));
        }
        return items;
    };

    const createTreeItem : any = (id: string, label: string, content: any) => {
        if (Array.isArray(content)) {
            return {
                id,
                label,
                children: content.map((item, index) => createTreeItem(`${id}-${index}`, item.label || `[${index}]`, item))
            };
        } else if (typeof content === 'object') {
            return {
                id,
                label,
                children: Object.entries(content).map(([key, value]) => createTreeItem(`${id}-${key}`, key, value))
            };
        } else {
            return { id, label: `${label}: ${content}` };
        }
    };

    const analyzePlsqlCode = (code: string) => {
        let procedureMatch = /create (or replace )?procedure (\w+)(\s*\((.*?)\))?/i.exec(code);
        let header = null;
        let body = null;
        if (procedureMatch) {
            header = {
                'Nombre del Procedimiento': procedureMatch[2],
                'Parámetros': procedureMatch[4] ? procedureMatch[4].split(',').map(param => param.trim()) : 'No se encontraron parámetros asociados al procedimiento.'
            };
            const bodyStartIndex = procedureMatch.index + procedureMatch[0].length;
            const bodyCode = code.substring(bodyStartIndex);
            body = analyzeBody(bodyCode);
        }
        return { header, body };
    };

    const analyzeBody = (code: string) => {
        let bodyAnalysis: any = { segmentos: [], controles: [], excepciones: [], bloquesAnidados: [] };
        const bodyStartRegex = /begin/i;
        const bodyEndRegex = /end;/i;
        let bodyStartMatch = bodyStartRegex.exec(code);
        let bodyEndMatch = bodyEndRegex.exec(code);
        let bodyContent = code;

        if (bodyStartMatch && bodyEndMatch) {
            bodyContent = code.substring(bodyStartMatch.index + bodyStartMatch[0].length, bodyEndMatch.index).trim();
        }
        const variableRegex = /(\w+)\s+([\w\.\%]+)\s*(?:\:=|\bdefault\b)?\s*([^;]*)/gi;
        let match;

        // mejorar variables

        // while ((match = variableRegex.exec(code)) !== null) {
        //     bodyAnalysis.variables.push({
        //         bloque: match[1],
        //         contenido: match[2],
        //         valor: match[3].trim()
        //     });
        // }

        const sqlRegex = /(?:select|update|delete|insert) [^;]+;/gi;
        while ((match = sqlRegex.exec(code)) !== null) {
            bodyAnalysis.segmentos.push({ tipo: 'sql', contenido: match[0] });
        }
        const controlRegex = /(?:if .+? then|for .+? loop|while .+? loop|case .+? end case).+?end (if|loop|case);/gis;
        while ((match = controlRegex.exec(code)) !== null) {
            bodyAnalysis.controles.push({ tipo: match[1], contenido: match[0] });
        }
        const exceptionRegex = /exception\s+when\s+([\w\s]+)\s+then\s+([^;]+;)/gi;
        while ((match = exceptionRegex.exec(code)) !== null) {
            bodyAnalysis.excepciones.push({
                cuando: match[1].trim(),
                entonces: match[2].trim()
            });
        }
        const nestedBlockRegex = /begin\s+(.*?)\send;/gis;
        while ((match = nestedBlockRegex.exec(code)) !== null) {
            bodyAnalysis.bloquesAnidados = bodyAnalysis.bloquesAnidados || [];
            bodyAnalysis.bloquesAnidados.push({ contenido: match[1] });
        }
        return bodyAnalysis;
    };

    return (
        <Container maxWidth="md">
            <Typography variant="h4" align="center" style={{ margin: '20px 0' }}>
                Analizador PL/SQL
            </Typography>
            <Paper style={{ padding: '20px' }}>
                <TextField
                    label="Pega tu código PL/SQL aquí"
                    multiline
                    fullWidth
                    rows={10}
                    value={plsqlCode}
                    onChange={(e) => setPlsqlCode(e.target.value)}
                    variant="outlined"
                    style={{ marginBottom: '20px' }}
                />
                <Button variant="contained" color="primary" onClick={handleAnalyzeCode}>
                    Analizar Código
                </Button>
                <div style={{ padding: '12px', marginTop: '12px' }}>
                    {analysisResult.length > 0 && <RichTreeView items={analysisResult} />}
                </div>
            </Paper>
        </Container>
    );
};

export default PlsqlAnalyzerPage;