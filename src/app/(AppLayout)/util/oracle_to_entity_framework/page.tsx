// 'use client'
// import React, { useState } from 'react';
// import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab } from '@mui/material';
// import AceEditor from 'react-ace';
// import "ace-builds/src-noconflict/mode-sql";
// import "ace-builds/src-noconflict/theme-monokai";
// import { useOracleToEF } from '../(hooks)/useOracleToEF';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
// import JoinDialog from '../(components)/JoinDialog';
// import { Join } from '../(types)/types';

// const OracleToEF = () => {
//     const {
//         tables,
//         memoizedEFModels,
//         memoizedEFQueries,
//         addTable,
//         parseSQLScript,
//         handleDelete,
//         joinDialogOpen,
//         setJoinDialogOpen
//     } = useOracleToEF();
//     const [open, setOpen] = useState<boolean>(false);
//     const [script, setScript] = useState<string>('');
//     const [activeTab, setActiveTab] = useState<number>(0);

//     const handleOpen = () => {
//         setOpen(true);
//         setScript('');
//     };

//     const handleClose = () => {
//         setOpen(false);
//     };

//     const handleAddScript = () => {
//         const { tableName, columns } = parseSQLScript(script);
//         if (tables.some(t => t.name === tableName)) {
//             alert('This table has already been added.');
//             return;
//         }
//         const newTable = { name: tableName, script, columns };
//         addTable(newTable);
//         handleClose();
//     };

//     const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//         setActiveTab(newValue);
//     };

//     function setJoins(arg0: (prev: any) => any[]) {
//         throw new Error('Function not implemented.');
//     }

//     return (
//         <Box sx={{ width: '100%' }}>
//             <Button onClick={handleOpen}>Add Script</Button>
//             <Dialog open={open} onClose={handleClose} fullWidth>
//                 <DialogTitle>Add SQL Script</DialogTitle>
//                 <DialogContent>
//                     <AceEditor
//                         mode="sql"
//                         theme="monokai"
//                         value={script}
//                         onChange={e => setScript(e.target.value)}
//                         style={{ width: '100%', height: '200px' }}
//                     />
//                 </DialogContent>
//                 <DialogActions>
//                     <Button onClick={handleClose}>Cancel</Button>
//                     <Button onClick={handleAddScript}>Add</Button>
//                 </DialogActions>
//             </Dialog>

//             {tables.length > 0 && (
//                 <>
//                     <Tabs value={activeTab} onChange={handleTabChange} aria-label="table tabs">
//                         {tables.map((table, index) => (
//                             <Tab label={table.name} key={index} />
//                         ))}
//                     </Tabs>
//                     <Box sx={{ p: 3 }}>
//                         <SyntaxHighlighter language='csharp' style={oneDark}>{memoizedEFModels[activeTab]}</SyntaxHighlighter>
//                         <SyntaxHighlighter language='csharp' style={oneDark}>{memoizedEFQueries[activeTab]}</SyntaxHighlighter>
//                     </Box>
//                 </>
//             )}

//         <JoinDialog
//                 open={joinDialogOpen}
//                 onClose={() => setJoinDialogOpen(false)}
//                 tables={tables}
//                 onSubmit={(leftTable, rightTable, onCondition) => {
//                     if (!leftTable || !rightTable || !onCondition) {
//                         alert("All fields must be filled out to submit the join condition.");
//                         return;
//                     }
//                     // Assuming `setJoins` is available via props or context and is used to update the join conditions
//                     setJoins(prev => [...prev, { leftTable, rightTable, onCondition }]);
//                     setJoinDialogOpen(false); // Close the dialog after submitting
//                 } } setJoins={function (value: React.SetStateAction<Join[]>): void {
//                     throw new Error('Function not implemented.');
//                 } }        />

//         </Box>
//     );
// };

// export default OracleToEF;