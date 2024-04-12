'use client'
import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, Alert, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import AceEditor from 'react-ace';
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-monokai";
import JoinDialog from '../(components)/JoinDialog';
import { useOracleToEF } from '../(hooks)/useOracleToEF';
import { a11yProps } from '../(functions)/queryUtils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import DeleteIcon from '@mui/icons-material/Delete';
import { GenericToast } from '../(components)/GenericToast';

const OracleToEF = () => {
    const {
        value, setValue,
        scripts,
        error,
        joinDialogOpen, setJoinDialogOpen,
        joins,
        memoizedEFModel, memoizedEFQuery,
        handleScriptChange, handleAddJoin, handleEditJoin, handleDeleteJoin
    } = useOracleToEF();

    const [open, setOpen] = useState(false);
    const [script, setScript] = useState('');
    const [tables, setTables] = useState<any>([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [openJoinConfig, setOpenJoinConfig] = useState(false);
    const [selectedColumns, setSelectedColumns] = useState({ left: '', right: '' });

    const handleOpen = () => {
        setOpen(true);
        setScript('');
    };
    const handleClose = () => setOpen(false);

    const extractColumns = (script: string) => {
        // Este es un ejemplo básico, debes ajustar la lógica de extracción según tu sintaxis SQL específica
        let columns: any = [];
        const lines = script.split('\n');
        lines.forEach((line: string) => {
            if (line.toLowerCase().includes('create table')) {
                let columnPart = line.split('(')[1].split(')')[0];
                columns = columnPart.split(',').map((column: string) => column.trim().split(' ')[0]);
            }
        });
        return columns;
    };
    
    const handleAddScript = () => {
        const tableName = parseTableName(script);
        const columns = extractColumns(script);
        if (tables.find((t: { script: string; }) => t.script === script)) {
            GenericToast.showError('El script ya fue agregado.');
            return;
        }
        
        if (tables.length > 0) {
            setOpenJoinConfig(true);
        } else {
            setTables([...tables, { name: 'registro', script, columns }]);
            setValue(tables.length);
            handleScriptChange(value, script);
            handleClose();
        }
    };


    const parseTableName = (script: string) => {
        const match = RegExp(/create table (\w+)/i).exec(script);
        return match ? match[1] : "Unknown";
    };

    const handleDelete = (index: any) => {
        const updatedTables = tables.filter((_: any, i: any) => i !== index);
        setTables(updatedTables);
    };

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {

    };

    const handleConfirmJoin = () => {
        const joinQuery = `var result = from a in context.${tables[0].name}
                          join b in context.${tables[1].name}
                          on a.${selectedColumns.left} equals b.${selectedColumns.right}
                          select new { a, b };`;
        console.log(joinQuery);  // Aquí deberías manejar la consulta generada de manera adecuada
        setTables([...tables, { name: `registro_${tables.length++}`, script }]);
        setOpenJoinConfig(false);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
                    <Tab label="Oracle to EF Converter" {...a11yProps(0)} />
                </Tabs>
            </AppBar>

            <div>
                <Dialog open={openJoinConfig} onClose={() => setOpenJoinConfig(false)} fullWidth
                    maxWidth="md">
                    <DialogTitle>Configure Join</DialogTitle>
                    <DialogContent>
                        <div style={{ display: 'flex' }}>
                        <FormControl style={{ flex: 1 }} disabled={!tables[0]?.columns}>
                            <InputLabel id="left-table-column">Columnas de tabla 1</InputLabel>
                            <Select
                                labelId="left-table-column"
                                value={selectedColumns.left}
                                onChange={e => setSelectedColumns({ ...selectedColumns, left: e.target.value })}
                                disabled={ tables.length > 2 && !tables[0]?.columns}  // Asegura que hay suficientes tablas y que la primera tiene columnas
                            >
                                {tables[0]?.columns?.map((col:any) => (
                                    <MenuItem>{col}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl style={{ flex: 1}} disabled={tables.length < 2 || !tables[1]?.columns}>
                            <InputLabel id="right-table-column">Columnas de tabla 2</InputLabel>
                            <Select
                                labelId="right-table-column"
                                value={selectedColumns.right}
                                onChange={e => setSelectedColumns({ ...selectedColumns, right: e.target.value })}
                                disabled={ tables.length > 2 && !tables[1]?.columns}
                                fullWidth
                            >
                                {tables.length > 1 && tables[1]?.columns?.map((col: any) => (
                                    <MenuItem>{col}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenJoinConfig(false)}>Cancel</Button>
                        <Button
                            onClick={handleConfirmJoin}
                            disabled={!selectedColumns.left || !selectedColumns.right || tables.length < 2 || !tables[0].columns || !tables[1].columns}
                        >
                            Confirm
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
            <div>
                <Button onClick={handleOpen}>Add Script</Button>
                <Dialog open={open} onClose={handleClose} fullWidth
                    maxWidth="md">
                    <DialogTitle>Add SQL Script</DialogTitle>
                    <DialogContent>
                        <AceEditor
                            mode="sql"
                            theme="monokai"
                            value={script}
                            onChange={(newScript) => setScript(newScript)}  // Updated to handle new scripts
                            editorProps={{ $blockScrolling: true }}
                            setOptions={{
                                enableBasicAutocompletion: true,
                                enableLiveAutocompletion: true,
                                enableSnippets: true
                            }}
                            style={{ width: '100%', height: '200px' }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={handleAddScript}>Add</Button>
                    </DialogActions>
                </Dialog>

                <List>
                    {tables.map((table: { name: any; }, index: any) => (
                        <ListItem key={index}>
                            <ListItemText primary={`Table: ${table.name}`} />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => handleDelete(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </div>

            {/* Render each script editor and its controls */}
            {/* {scripts.map((script, index) => (
                <Box key={index} sx={{ marginBottom: 2 }}>
                    <AceEditor
                        mode="sql"
                        theme="monokai"
                        value={script}
                        onChange={(newScript) => handleScriptChange(index, newScript)}
                        editorProps={{ $blockScrolling: true }}
                        setOptions={{
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true
                        }}
                        style={{ width: '100%', maxHeight: '350px' }}
                    />
                    {error && <Alert severity="error">{error}</Alert>}
                </Box>
            ))} */}

            {/* Join management section */}
            {/* {joins.map((join, index) => (
                <div key={index}>
                    Join {index + 1}: {join.leftTable} joins {join.rightTable} on {join.onCondition}
                    <Button onClick={() => handleEditJoin(index, 'NewLeft', 'NewRight', 'NewCondition')}>Edit</Button>
                    <Button onClick={() => handleDeleteJoin(index)}>Delete</Button>
                </div>
            ))} */}

            {/* Display EF Model and Query */}
            <SyntaxHighlighter language='csharp' style={oneDark} showLineNumbers>{memoizedEFModel}</SyntaxHighlighter>
            <SyntaxHighlighter language='csharp' style={oneDark} showLineNumbers>{memoizedEFQuery}</SyntaxHighlighter>

            <JoinDialog
                open={joinDialogOpen}
                onClose={() => setJoinDialogOpen(false)}
                onSubmit={(leftTable, rightTable, onCondition) => handleAddJoin(leftTable, rightTable, onCondition)}
            />
        </Box>
    );
}

export default OracleToEF;