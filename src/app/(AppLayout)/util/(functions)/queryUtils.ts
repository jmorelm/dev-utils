import { TypeMapping } from "../(types)/types";

export function generateEFModel(columns: { originalName: string; transformedName: string; cSharpType: string, isId: boolean }[]): string {
    let classContent = 'public class OracleTable {\n';
    columns.forEach(column => {
        classContent += `    public ${column.cSharpType} ${column.transformedName} { get; set; }\n`;
    });
    classContent += '}';
    return classContent;
}

export function generateEFQuery(columns: { transformedName: string }[], options: { useAsNoTracking: boolean, useToList: boolean }): string {
    let query = 'var query = context.OracleTables';
    if (options.useAsNoTracking) {
        query += '.AsNoTracking()';
    }
    query += '\n    .Select(x => new {\n';
    columns.forEach(column => {
        query += `        x.${column.transformedName},\n`;
    });
    query = query.slice(0, -2) + '\n    })';
    if (options.useToList) {
        query += '.ToList();';
    } else {
        query += ';';
    }
    return query;
}

export function generateJoinQuery(tables: { tableName: string, columns: { transformedName: string }[] }[], joins: { leftTable: string, rightTable: string, onCondition: string }[], options: { useAsNoTracking: boolean, useToList: boolean }): string {
    let query = `var query = context.${tables[0].tableName}`;
    joins.forEach(join => {
        query += `\n    .Join(context.${join.rightTable},`;
        query += ` ${join.leftTable} => ${join.leftTable}.${join.onCondition},`;
        query += ` ${join.rightTable} => ${join.rightTable}.${join.onCondition},`;
        query += ` (${join.leftTable}, ${join.rightTable}) => new { ${join.leftTable}, ${join.rightTable} })`;
    });
    if (options.useAsNoTracking) {
        query += '.AsNoTracking()';
    }
    query += '\n    .Select(x => new {\n';
    tables.forEach(table => {
        table.columns.forEach(column => {
            query += `        x.${table.tableName}.${column.transformedName},\n`;
        });
    });
    query = query.slice(0, -2) + '\n    })';
    if (options.useToList) {
        query += '.ToList();';
    } else {
        query += ';';
    }
    return query;
}

export function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export function mapOracleToCSharp(oracleType: string): string {
    const typeMapping: TypeMapping = {
        VARCHAR2: "string",
        CHAR: "string",
        CLOB: "string",
        NCLOB: "string",
        NCHAR: "string",
        NVARCHAR2: "string",
        NUMBER: "int",
        DECIMAL: "decimal",
        NUMERIC: "decimal",
        FLOAT: "double",
        REAL: "double",
        INTEGER: "int",
        INT: "int",
        SMALLINT: "int",
        DATE: "DateTime",
        TIMESTAMP: "DateTime",
        BLOB: "byte[]",
        RAW: "byte[]",
        LONGRAW: "byte[]",
        BOOLEAN: "bool"
    };

    return typeMapping[oracleType.toUpperCase()] || "object";
}