'use client'
import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { Button, TextField } from '@mui/material';
import { GenericToast } from '../(components)/GenericToast';

const JSONViewer = () => {
  const [jsonData, setJsonData] = useState<any>(null);
  const [fileName, setFileName] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [jsonError, setJsonError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  `;

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      setFileName(file.name);
      setJsonError('');
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result as string;
        try {
          const parsedJson = JSON.parse(content);
          setJsonData(parsedJson);
          GenericToast.showSuccess("Archivo cargado con éxito");
        } catch (error) {
          setJsonData(null);
          setJsonError(`Error en el archivo JSON: ${error}`);
          GenericToast.showError("Error al cargar el archivo JSON");
        }
      };
      reader.readAsText(file);
    } else {
      setJsonData(null);
      setJsonError("El archivo seleccionado no es un archivo JSON válido.");
      GenericToast.showError("Tipo de archivo no válido");
    }
  };

  const handleSaveJson = () => {
    if (!jsonData) {
      GenericToast.showError("No hay datos JSON para guardar");
      return;
    }

    try {
      const fileData = JSON.stringify(jsonData, null, 4);
      const blob = new Blob([fileData], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName ? `edited-${fileName}` : 'edited-json.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      GenericToast.showSuccess("Archivo JSON guardado con éxito");
    } catch (error) {
      GenericToast.showError("Error al guardar el archivo JSON");
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Container>
      <h2 style={{ textAlign: "center" }}>EDITOR JSON</h2>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <Button
        variant="contained"
        color="success"
        style={{ marginTop: '12px' }}
        onClick={() => fileInputRef.current && fileInputRef.current.click()}
      >
        Seleccionar Archivo
      </Button>
      {fileName && <p>Archivo seleccionado: {fileName}</p>}
      {jsonData ? (
        <>
          <div style={{ display: 'flex', width: '100%' }}>
            <Button variant="outlined" onClick={toggleCollapse} style={{ marginRight: '4px' }}>
              {isCollapsed ? "Expandir Todo" : "Colapsar Todo"}
            </Button>
            <Button variant="outlined" onClick={handleSaveJson}>Guardar JSON</Button>
          </div>
          <DynamicReactJson
            src={jsonData}
            style={{ width: '100%', marginTop: '30px', height: '100%', borderRadius: '12px', padding: '8px' }}
            theme="paraiso"
            iconStyle='circle'
            collapsed={isCollapsed ? 1 : false}
            enableClipboard={true}
            displayDataTypes={false}
            displayObjectSize={false}
            indentWidth={4}
            onEdit={(edit) => setJsonData(edit.updated_src)}
          />
        </>
      ) : jsonError && (
        <TextField
          error={true}
          label="Error de JSON"
          value={jsonError}
          multiline
          rows={6}
          fullWidth
          variant="outlined"
          margin="normal"
          disabled
        />
      )}
    </Container>
  );
};

const DynamicReactJson = dynamic(() => import('react-json-view'), { ssr: false });

export default JSONViewer;