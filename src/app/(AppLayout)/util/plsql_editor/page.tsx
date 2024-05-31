// 'use client'
// import React, { useEffect, useState } from 'react';
// import { TextField, Button, Container, Paper, Typography } from '@mui/material';
// import { RichTreeView } from '@mui/x-tree-view';
// import AceEditor from 'react-ace';
// import 'ace-builds/src-noconflict/mode-sql';
// import 'ace-builds/src-noconflict/theme-github';

// const PlsqlAnalyzerPage = () => {
//     const [plsqlCode, setPlsqlCode] = useState('');
//     const [analysisResult, setAnalysisResult] = useState<any>([]);
//     const [editors, setEditors] = useState<string[]>([]);

//     useEffect(() => {
//         handleAnalyzeCode();
//     }, []);

//     const handleAnalyzeCode = () => {
//         const result = analyzePlsqlCode(plsqlCode);
//         const treeViewItems = transformAnalysisToTreeViewItems(result);
//         setAnalysisResult(treeViewItems);

//         const sqlSegments: string[] = [];
//         treeViewItems.forEach((item: any) => {
//             if (item.id === 'body' && item.children) {
//                 const bodySegment = item.children.find((child: any) => child.id === 'body-segmentos');
//                 if (bodySegment?.children) {
//                     bodySegment.children.forEach((segment: any) => {
//                         if (segment?.id?.startsWith('body-segmentos-')) {
//                             const contentSegment = segment.children.find((child: any) => child?.id === `${segment?.id}-contenido`);
//                             if (contentSegment?.label?.startsWith('contenido: ')) {
//                                 const sqlWithComments = contentSegment.label.replace('contenido: ', '');
//                                 const sqlWithoutComments = removeCommentsFromSql(sqlWithComments);
//                                 sqlSegments.push(sqlWithoutComments);
//                             }
//                         }
//                     });
//                 }
//             }
//         });

//         setEditors(sqlSegments);
//     };


//     const removeCommentsFromSql = (sql: string) => {
//         const singleLineCommentRegex = /--.*$/gm;
//         const multiLineCommentRegex = /\/\*[\s\S]*?\*\//gm;
//         sql = sql.replace(singleLineCommentRegex, '');
//         sql = sql.replace(multiLineCommentRegex, '');
//         return sql.trim();
//     };


//     const transformAnalysisToTreeViewItems = (result: { header: any; body: any }) => {
//         const items = [];
//         if (result.header) {
//             items.push(createTreeItem('header', 'Cabecera', result.header));
//         }
//         if (result.body) {
//             items.push(createTreeItem('body', 'Cuerpo', result.body));
//         }
//         return items;
//     };

//     const createTreeItem: any = (id: string, label: string, content: any) => {
//         if (Array.isArray(content)) {
//             return {
//                 id,
//                 label,
//                 children: content.map((item: any, index: number) =>
//                     createTreeItem(`${id}-${index}`, item.label || `[${index}]`, item)
//                 ),
//             };
//         } else if (typeof content === 'object') {
//             return {
//                 id,
//                 label,
//                 children: Object.entries(content).map(([key, value]) =>
//                     createTreeItem(`${id}-${key}`, key, value)
//                 ),
//             };
//         } else {
//             return { id, label: `${label}: ${content}` };
//         }
//     };

//     const analyzePlsqlCode = (code: string) => {
//         let procedureMatch = /create (or replace )?procedure (\w+)(\s*\((.*?)\))?/i.exec(code);
//         let header = null;
//         let body = null;
//         if (procedureMatch) {
//             header = {
//                 'Nombre del Procedimiento': procedureMatch[2],
//                 'Parámetros': procedureMatch[4] ? procedureMatch[4].split(',').map(param => param.trim()) : 'No se encontraron parámetros asociados al procedimiento.'
//             };
//             const bodyStartIndex = procedureMatch.index + procedureMatch[0].length;
//             const bodyCode = code.substring(bodyStartIndex);
//             body = analyzeBody(bodyCode);
//         }
//         return { header, body };
//     };

//     const analyzeBody = (code: string) => {
//         let bodyAnalysis: any = { segmentos: [], controles: [], excepciones: [], bloquesAnidados: [] };
//         const bodyStartRegex = /begin(?:\s*--.*)?/i;
//         const bodyEndRegex = /end;/i;
//         let bodyStartMatch = bodyStartRegex.exec(code);
//         let bodyEndMatch = bodyEndRegex.exec(code);
//         let bodyContent = code;

//         if (bodyStartMatch && bodyEndMatch) {
//             bodyContent = code.substring(bodyStartMatch.index + bodyStartMatch[0].length, bodyEndMatch.index).trim();
//         }
//         const sqlRegex = /(?:select|update|delete|insert) [^;]+;/gi;
//         let match;
//         while ((match = sqlRegex.exec(code)) !== null) {
//             bodyAnalysis.segmentos.push({ tipo: 'sql', contenido: match[0] });
//         }
//         return bodyAnalysis;
//     };

//     const handleEditorChange = (index: number, newValue: string) => {
//         const newEditors = [...editors];
//         newEditors[index] = newValue;
//         setEditors(newEditors);
//     };

//     return (
//         <Container maxWidth="md">
//             <Typography variant="h4" align="center" style={{ margin: '20px 0' }}>
//                 Analizador PL/SQL
//             </Typography>
//             <Paper style={{ padding: '20px' }}>
//                 <TextField
//                     label="Pegar código PL/SQL aquí"
//                     multiline
//                     fullWidth
//                     rows={10}
//                     value={plsqlCode}
//                     onChange={(e) => setPlsqlCode(e.target.value)}
//                     variant="outlined"
//                     style={{ marginBottom: '20px' }}
//                 />
//                 <Button variant="contained" color="primary" onClick={handleAnalyzeCode}>
//                     Analizar Código
//                 </Button>
//                 <div style={{ padding: '12px', marginTop: '12px' }}>
//                     {analysisResult.length > 0 && <RichTreeView items={analysisResult} />}
//                 </div>

//                 {editors.map((content, index) => (
//                     <AceEditor
//                         key={index}
//                         mode="sql"
//                         theme="github"
//                         value={content}
//                         width="100%"
//                         height="200px"
//                         style={{ borderRadius: '8px', marginTop: '12px' }}
//                         readOnly={false}
//                         onChange={(newValue) => handleEditorChange(index, newValue)}
//                     />
//                 ))}
//             </Paper>
//         </Container>
//     );
// };

// export default PlsqlAnalyzerPage;
