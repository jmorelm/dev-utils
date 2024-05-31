// import React, { useEffect, useState } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import { JoinDialogProps } from '../(interface)/JoinCondition';
// import { Join } from '../(types)/types';

// const JoinDialog = ({ open, onClose, onSubmit, tables, setJoins }: JoinDialogProps) => {
//     const [leftTable, setLeftTable] = useState('');
//     const [rightTable, setRightTable] = useState('');
//     const [leftColumn, setLeftColumn] = useState('');
//     const [rightColumn, setRightColumn] = useState('');

//     useEffect(() => {
//         if (leftColumn && rightColumn) {
//             const condition = `${leftTable}.${leftColumn} = ${rightTable}.${rightColumn}`;
//             const newJoin: Join = { 
//                 leftTable, 
//                 leftColumn, 
//                 rightTable, 
//                 rightColumn, 
//                 onCondition: condition 
//             };
//             setJoins(prev => [...prev, newJoin]);
//             onClose();  // Optionally close the dialog after submitting
//         }
//     }, [leftColumn, rightColumn, leftTable, rightTable, setJoins, onClose]);

//     const updateColumns = (table: string, setColumn: React.Dispatch<React.SetStateAction<string>>) => {
//         const foundTable = tables.find(t => t.name === table);
//         if (foundTable && foundTable.columns.length > 0) {
//             setColumn(foundTable.columns[0].name); // Automatically select the first column if available
//         } else {
//             setColumn(''); // Reset if no columns or table is not found
//         }
//     };

//     useEffect(() => {
//         updateColumns(leftTable, setLeftColumn);
//         updateColumns(rightTable, setRightColumn);
//     }, [leftTable, rightTable, tables]);

//     return (
//         <Dialog open={open} onClose={onClose}>
//             <DialogTitle>Add/Edit Join Condition</DialogTitle>
//             <DialogContent>
//                 <FormControl fullWidth margin="normal">
//                     <InputLabel>Left Table</InputLabel>
//                     <Select value={leftTable} onChange={e => setLeftTable(e.target.value)}>
//                         {tables.map(table => (
//                             <MenuItem key={table.name} value={table.name}>{table.name}</MenuItem>
//                         ))}
//                     </Select>
//                 </FormControl>
//                 <FormControl fullWidth margin="normal" disabled={!leftTable}>
//                     <InputLabel>Left Column</InputLabel>
//                     <Select value={leftColumn} onChange={e => setLeftColumn(e.target.value)}>
//                         {tables.find(table => table.name === leftTable)?.columns.map(column => (
//                             <MenuItem key={column.name} value={column.name}>{column.name}</MenuItem>
//                         ))}
//                     </Select>
//                 </FormControl>
//                 <FormControl fullWidth margin="normal">
//                     <InputLabel>Right Table</InputLabel>
//                     <Select value={rightTable} onChange={e => setRightTable(e.target.value)}>
//                         {tables.map(table => (
//                             <MenuItem key={table.name} value={table.name}>{table.name}</MenuItem>
//                         ))}
//                     </Select>
//                 </FormControl>
//                 <FormControl fullWidth margin="normal" disabled={!rightTable}>
//                     <InputLabel>Right Column</InputLabel>
//                     <Select value={rightColumn} onChange={e => setRightColumn(e.target.value)}>
//                         {tables.find(table => table.name === rightTable)?.columns.map(column => (
//                             <MenuItem key={column.name} value={column.name}>{column.name}</MenuItem>
//                         ))}
//                     </Select>
//                 </FormControl>
//             </DialogContent>
//             <DialogActions>
//                 <Button onClick={onClose}>Cancel</Button>
//                 <Button onClick={() => onSubmit(leftTable, leftColumn, rightTable, onCondition, rightColumn)} disabled={!leftColumn || !rightColumn}>
//                     Submit
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// };

// export default JoinDialog;