"use client";
import React, { useState } from 'react';
import Editor from 'react-ace';
import 'ace-builds/src-noconflict/mode-csharp';
import 'ace-builds/src-noconflict/theme-monokai';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import { saveAs } from 'file-saver';
import { Button, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const SwaggerGenPage = () => {
    const [requestModel, setRequestModel] = useState<string>('');
    const [responseModel, setResponseModel] = useState<string>('');
    const [endpoint, setEndpoint] = useState<string>('');
    const [method, setMethod] = useState<string>('GET');
    const [referenceSwagger, setReferenceSwagger] = useState<any>(null); 

    const onChangeRequest = (value: string) => {
        setRequestModel(value);
    };

    const onChangeResponse = (value: string) => {
        setResponseModel(value);
    };

    const onChangeEndpoint = (value: string) => {
        setEndpoint(value);
    };

    const onChangeMethod = (value: string) => {
        setMethod(value);
    };

    const onChangeReferenceSwagger = (value: string) => {
        try {
            const parsedSwagger = JSON.parse(value);
            // Realizar algunas validaciones adicionales del Swagger de referencia, si es necesario
            setReferenceSwagger(parsedSwagger); 
        } catch (error) {
            console.error('Error al analizar el JSON del Swagger de referencia:', error);
            setReferenceSwagger(null);
        }
    };

    const generarArchivoSwagger = () => {
        if (!referenceSwagger) {
            alert("Por favor, ingresa un Swagger de referencia válido.");
            return;
        }

        const modifiedSwaggerJson = { ...referenceSwagger }; 

        const requestSwaggerModel = convertirAClaseSwagger(requestModel, 'RequestModel');
        const responseSwaggerModel = convertirAClaseSwagger(responseModel, 'ResponseModel');

        if (!modifiedSwaggerJson.paths[endpoint]) {
            modifiedSwaggerJson.paths[endpoint] = {};
        }

        modifiedSwaggerJson.paths[endpoint][method.toLowerCase()] = construirOperacionSwagger('RequestModel', 'ResponseModel');

        modifiedSwaggerJson.definitions['RequestModel'] = requestSwaggerModel;
        modifiedSwaggerJson.definitions['ResponseModel'] = responseSwaggerModel;

        const blob = new Blob([JSON.stringify(modifiedSwaggerJson)], { type: 'application/json' });
        saveAs(blob, 'swagger.json');
    };

    const convertirAClaseSwagger = (cSharpModel: string, modelName: string) => {
        const properties: Record<string, any> = {};
        const className = modelName; // Utilizamos el nombre del modelo proporcionado como parámetro
    
        const lines = cSharpModel.split('\n');
        for (const line of lines) {
            const match = line.trim().match(/public (\w+) (\w+) { get; set; }/);
            if (match && match.length === 3) {
                const type = match[1];
                const propName = match[2];
                properties[propName] = convertirTipoSwagger(type);
            }
        }
    
        return { type: 'object', properties }; // Devolvemos un objeto con las propiedades del modelo
    };
    

    const convertirTipoSwagger = (cSharpType: string) => {
        switch (cSharpType) {
            case 'int':
            case 'int?':
            case 'float':
            case 'double':
                return { type: 'number' };
            case 'bool':
                return { type: 'boolean' };
            case 'string':
            case 'string?':
                return { type: 'string' };
            default:
                return { type: 'object' };
        }
    };

    const construirOperacionSwagger = (requestModelName: string, responseModelName: string) => {
        return {
            description: "Descripción de la operación",
            responses: {
                200: {
                    description: "Respuesta exitosa",
                    schema: {
                        $ref: `#/definitions/${responseModelName}`
                    }
                },
                default: {
                    description: "Error"
                }
            }
        };
    };
    

    return (
        <PageContainer title="Swagger Generator" description="Utilidad para generar archivo Swagger v2.0">

            <h2 style={{ textAlign: "center" }}>GENERAR ARCHIVO SWAGGER</h2>

            <div>
                <h3>Datos del Endpoint</h3>
                <div style={{ marginBottom: "8px" }}>
                    <TextField
                        required
                        fullWidth
                        id="outlined-required"
                        label="URL Endpoint"
                        defaultValue="/api/usuarios/ejemplo"
                        value={endpoint} onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEndpoint(e.target.value)}
                    />
                </div>

                <div>
                    <InputLabel id="endpoint-methods">Metodos</InputLabel>
                    <Select
                        fullWidth
                        labelId="endpoint-methods"
                        label="Metodo del Endpoint"
                        id="method-select"
                        value={method}
                        onChange={(e) => setMethod(e.target.value)}
                    >
                        <MenuItem value={'GET'}>GET</MenuItem>
                        <MenuItem value={'POST'}>POST</MenuItem>
                        <MenuItem value={'PUT'}>PUT</MenuItem>
                        <MenuItem value={'DELETE'}>DELETE</MenuItem>
                    </Select>
                </div>
            </div>

            <div>
                <h3>Request</h3>
                <Editor
                    mode="csharp"
                    theme="monokai"
                    onChange={onChangeRequest}
                    width="100%"
                    height='200px'
                />

                <h3>Response</h3>
                <Editor
                    mode="csharp"
                    theme="monokai"
                    onChange={onChangeResponse}
                    width="100%"
                    height='200px'
                />

                <h3>Doc. Swagger de referencia</h3>
                <Editor
                    mode="json"
                    theme="monokai"
                    onChange={onChangeReferenceSwagger}
                    width="100%"
                    height='500px'
                />

                <div style={{ textAlign: "right" }}>
                    <Button onClick={generarArchivoSwagger} variant="contained" color="success" style={{ marginTop: "12px" }}>
                        Generar Archivo Swagger
                    </Button>
                </div>
            </div>
        </PageContainer>
    );
};

export default SwaggerGenPage;
