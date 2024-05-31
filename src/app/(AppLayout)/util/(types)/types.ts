export interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
}
export interface Column {
    name: string;
    originalName: string;
    transformedName: string;
    cSharpType: string;
    isId: boolean;
}

export interface Table {
    name: string;
    script: string;
    columns: Column[];
}

export interface Join {
    leftTable: string;
    rightTable: string;
    onCondition: string;
    rightColumn: string;
}

export interface Options {
    useAsNoTracking: boolean;
    useToList: boolean;
}
export interface TypeMapping {
    [key: string]: string;
    VARCHAR2: string;
    CHAR: string;
    CLOB: string;
    NCLOB: string;
    NCHAR: string;
    NVARCHAR2: string;
    NUMBER: string;
    DECIMAL: string;
    NUMERIC: string;
    FLOAT: string;
    REAL: string;
    INTEGER: string;
    INT: string;
    SMALLINT: string;
    DATE: string;
    TIMESTAMP: string;
    BLOB: string;
    RAW: string;
    LONGRAW: string;
    BOOLEAN: string;
}