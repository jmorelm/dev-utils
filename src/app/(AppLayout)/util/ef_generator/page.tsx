'use client';
import { useState } from 'react';
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid, Tabs, Tab, Box } from '@mui/material';
import dynamic from 'next/dynamic';

// Cargar MonacoEditor dinámicamente solo en el lado del cliente
const MonacoEditor = dynamic(() => import('react-monaco-editor'), { ssr: false });

function toPascalCase(str: string) {
    return str
        .toLowerCase()
        .replace(/(?:^|_)(\w)/g, (_, c) => (c ? c.toUpperCase() : ''));
}

function parseSQLScript(script: string) {
    const tableRegex = /CREATE TABLE\s+(\w+)\.(\w+)\s*\(([\s\S]+?)\);/g;
    const columnRegex = /(\w+)\s+\w+(\([\d,]+\))?(\s+NOT NULL|\s+DEFAULT\s+\w+|\s+PRIMARY KEY)?/g;

    let match;
    const tables = [];

    while ((match = tableRegex.exec(script)) !== null) {
        const schemaName = match[1];
        const tableName = match[2];
        const columns: string[] = [];
        let columnMatch;
        while ((columnMatch = columnRegex.exec(match[3])) !== null) {
            columns.push(columnMatch[1]);
        }
        tables.push({ schema: schemaName, name: tableName, columns });
    }

    return tables;
}

function OracleScriptLoader({ setTables, resetAll }: { setTables: (tables: any[]) => void, resetAll: () => void }) {
    const [script, setScript] = useState('');

    const handleScriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setScript(e.target.value);
    };

    const parseScript = () => {
        const parsedTables = parseSQLScript(script);
        resetAll();
        setTables(parsedTables);
    };

    return (
        <div>
            <TextField
                label="Pegar aquí los scripts de creacion de tabla - SQL"
                multiline
                rows={10}
                value={script}
                onChange={handleScriptChange}
                fullWidth
                variant="outlined"
            />
            <Button variant="contained" color="primary" onClick={parseScript} style={{ marginTop: '20px' }}>
                Cargar Tablas
            </Button>
        </div>
    );
}

function TableRelationshipManager({ tables, setRelationships }: { tables: any[], setRelationships: (relationships: any[]) => void }) {
    const [relations, setRelations] = useState([{ tables: [{ table: '', column: '' }] }]);

    const addRelationField = () => {
        setRelations([...relations, { tables: [{ table: '', column: '' }] }]);
    };

    const updateRelation = (relIndex: number, tableIndex: number, field: string, value: string) => {
        const newRelations = [...relations];
        newRelations[relIndex].tables[tableIndex] = { ...newRelations[relIndex].tables[tableIndex], [field]: value };
        setRelations(newRelations);
    };

    const addTableToRelation = (relIndex: number) => {
        const newRelations = [...relations];
        newRelations[relIndex].tables.push({ table: '', column: '' });
        setRelations(newRelations);
    };

    const removeRelation = (relIndex: number) => {
        const newRelations = relations.filter((_, index) => index !== relIndex);
        setRelations(newRelations);
    };

    const handleSaveRelations = () => {
        const validRelations = relations.filter(rel =>
            rel.tables.every(tableRel => tableRel.table && tableRel.column)
        );
        setRelationships(validRelations);
    };

    return (
        <div>
            <h3>Relacionar columnas entre tablas</h3>
            {relations.map((rel, relIndex) => (
                <div key={relIndex} style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                    <h4>Relación {relIndex + 1}</h4>
                    {rel.tables.map((tableRel, tableIndex) => (
                        <Grid container spacing={2} marginTop={1} marginBottom={1} key={tableIndex}>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Tabla</InputLabel>
                                    <Select
                                        value={tableRel.table}
                                        onChange={(e) => updateRelation(relIndex, tableIndex, 'table', e.target.value as string)}
                                    >
                                        <MenuItem value=""><em>Seleccionar tabla</em></MenuItem>
                                        {tables.map((table, i) => (
                                            <MenuItem key={i} value={table.name}>{table.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                {tableRel.table && (
                                    <FormControl fullWidth>
                                        <InputLabel>Columna</InputLabel>
                                        <Select
                                            value={tableRel.column}
                                            onChange={(e) => updateRelation(relIndex, tableIndex, 'column', e.target.value as string)}
                                        >
                                            <MenuItem value=""><em>Seleccionar columna</em></MenuItem>
                                            {tables.find(table => table.name === tableRel.table)?.columns.map((column: any, i: any) => (
                                                <MenuItem key={i} value={column}>{column}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            </Grid>
                        </Grid>
                    ))}
                    <Button onClick={() => addTableToRelation(relIndex)} variant="contained" style={{ marginTop: '10px', marginRight: '10px' }}>Añadir Tabla a Relación</Button>
                    <Button onClick={() => removeRelation(relIndex)} variant="contained" color="secondary" style={{ marginTop: '10px' }}>Eliminar Relación</Button>
                </div>
            ))}
            <h3>Mas opciones</h3>
            <Button onClick={addRelationField} variant="contained" color="secondary" style={{ marginRight: '10px' }}>Añadir Nueva Relación</Button>
            <Button onClick={handleSaveRelations} variant="contained" color="primary">Guardar / generar query</Button>
        </div>
    );
}

function generateOracleQuery(relationships: any[], tables: any) {
    if (relationships.length === 0) return '';

    const baseTableSchema = tables[0].schema;
    const baseTable = relationships[0].tables[0].table;
    let query = `SELECT * FROM ${baseTableSchema}.${baseTable}`;

    for (let i = 0; i < relationships.length; i++) {
        for (let j = 1; j < relationships[i].tables.length; j++) {
            const currentTableSchema = tables[j].schema;
            const currentTable = relationships[i].tables[j].table;
            const baseColumn = relationships[i].tables[j - 1].column;
            const currentColumn = relationships[i].tables[j].column;

            query += `\nJOIN ${currentTableSchema}.${currentTable} ON ${baseTableSchema}.${baseTable}.${baseColumn} = ${currentTableSchema}.${currentTable}.${currentColumn}`;
        }
    }

    return query + ';';
}

function EFQueryGenerator({ tables, relationships }: { tables: any[], relationships: any[] }) {
    const [tabIndex, setTabIndex] = useState(0);

    const generateQueries = () => {
        return relationships.map((rel, i) => {
            let baseTable = rel.tables[0].table;
            let baseAlias = baseTable.toLowerCase();

            let query = `context.${baseTable}`;

            for (let j = 1; j < rel.tables.length; j++) {
                const currentTable = rel.tables[j].table;
                const currentAlias = currentTable.toLowerCase();

                const combinedAlias = `combined_${j}`;

                query += `.Join(\n\tcontext.${currentTable},\n\t${baseAlias} => ${baseAlias}.${rel.tables[j - 1].column},\n\t${currentAlias} => ${currentAlias}.${rel.tables[j].column},\n\t(${baseAlias}, ${currentAlias}) => new { ${baseAlias}, ${currentAlias} }\n)`;

                baseAlias = combinedAlias;

                query = query.replace(
                    `new { ${baseTable.toLowerCase()}, ${currentAlias} }`,
                    `new { ${combinedAlias} = new { ${baseAlias}, ${currentAlias} } }`
                );
            }

            return query + ';';
        }).join('\n\n');
    };

    const generateMappings = (table: any) => {
        const pascalCaseColumns = table.columns.map((column: any) => ({
            original: column,
            pascalCase: toPascalCase(column)
        }));

        return `public class ${toPascalCase(table.name)}Map : IEntityTypeConfiguration<${toPascalCase(table.name)}>\n{\n\tpublic void Configure(EntityTypeBuilder<${toPascalCase(table.name)}> builder)\n\t{\n\t\tbuilder.ToTable("${table.name}","${table.schema.toUpperCase()}");\n${pascalCaseColumns.map((col: any) => `\t\tbuilder.Property(t => t.${col.pascalCase}).HasColumnName("${col.original}");`).join('\n')}\n\t}\n}`;
    };

    const queries = generateQueries();
    const oracleQuery = generateOracleQuery(relationships, tables);

    return (
        <div>
            <h3>Resultado generado</h3>
            <Tabs value={tabIndex} onChange={(e, newIndex) => setTabIndex(newIndex)} aria-label="EF Query and Mappings Tabs">
                <Tab label="Query EF Generado" />
                <Tab label="Query Oracle" />
                {tables.map((table, index) => (
                    <Tab key={index} label={`Mapear: ${table.name}`} />
                ))}
            </Tabs>
            <Box sx={{ padding: 2 }}>
                {tabIndex === 0 && (
                    <MonacoEditor
                        height="400"
                        language="csharp"
                        theme="vs-dark"
                        value={queries}
                        options={{
                            readOnly: false,
                            automaticLayout: true,
                            wordWrap: 'on',
                            wordWrapColumn: 80,
                            wrappingIndent: 'indent',
                            colorDecorators: true,
                            wordWrapBreakAfterCharacters: "\t})]?|&,;",
                            showFoldingControls: "mouseover",
                            renderLineHighlight: "all",
                            codeLens: true,
                            cursorBlinking: "expand",
                            folding: true,
                            fontLigatures: true,
                        }}
                    />
                )}
                {tabIndex === 1 && (
                    <MonacoEditor
                        height="400"
                        language="sql"
                        theme="vs-dark"
                        value={oracleQuery}
                        options={{
                            readOnly: false,
                            automaticLayout: true,
                            wordWrap: 'on',
                            wordWrapColumn: 80,
                            wrappingIndent: 'indent',
                            colorDecorators: true,
                            wordWrapBreakAfterCharacters: "\t})]?|&,;",
                            showFoldingControls: "mouseover",
                            renderLineHighlight: "all",
                            codeLens: true,
                            cursorBlinking: "expand",
                            folding: true,
                            fontLigatures: true,
                        }}
                    />
                )}
                {tables.map((table, index) => (
                    tabIndex === index + 2 && (
                        <MonacoEditor
                            key={index}
                            height="400"
                            language="csharp"
                            theme="vs-dark"
                            value={generateMappings(table)}
                            options={{
                                readOnly: false,
                                automaticLayout: true,
                                wordWrap: 'on',
                                wordWrapColumn: 80,
                                wrappingIndent: 'indent',
                                colorDecorators: true,
                                wordWrapBreakAfterCharacters: "\t})]?|&,;",
                                showFoldingControls: "mouseover",
                                renderLineHighlight: "all",
                                codeLens: true,
                                cursorBlinking: "expand",
                                folding: true,
                                fontLigatures: true,
                            }}
                        />
                    )
                ))}
            </Box>
        </div>
    );
}

export default function HomePage() {
    const [tables, setTables] = useState<any[]>([]);
    const [relationships, setRelationships] = useState<any[]>([]);

    const resetAll = () => {
        setTables([]);
        setRelationships([]);
    };

    return (
        <div>
            <h2 style={{ textAlign: "center" }}>GENERAR CONSULTAS DE EF DESDE ORACLE</h2>
            <OracleScriptLoader setTables={setTables} resetAll={resetAll} />
            {tables.length > 0 && (
                <TableRelationshipManager
                    tables={tables}
                    setRelationships={setRelationships}
                />
            )}
            {tables.length > 0 && relationships.length > 0 && (
                <EFQueryGenerator tables={tables} relationships={relationships} />
            )}
            <Button variant="contained" color="secondary" onClick={resetAll} style={{ marginTop: '20px' }}>
                Reiniciar Todo
            </Button>
        </div>
    );
}