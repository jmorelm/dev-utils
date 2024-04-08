'use client'
import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { Button } from '@mui/material';

const JSONViewer = () => {
  const [jsonData, setJsonData] = useState(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  `;

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result as string;
        const parsedJson = JSON.parse(content);
        setJsonData(parsedJson);
      };
      reader.readAsText(file);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleEdit = (edit: { updated_src: any }) => {
    setJsonData(edit.updated_src);
  };

  return (
    <Container>
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
        onClick={handleButtonClick}
      >
        Seleccionar Archivo
      </Button>
      {fileName && <p>Archivo seleccionado: {fileName}</p>}
      {jsonData && (
        <DynamicReactJson
          style={{ width: '100%', marginTop: '30px' }}
          src={jsonData}
          theme="paraiso"
          iconStyle='circle'
          collapsed={1}
          enableClipboard={true}
          displayDataTypes={false}
          displayObjectSize={false}
          indentWidth={4}
          onEdit={handleEdit}
        />
      )}
    </Container>
  );
};

const DynamicReactJson = dynamic(() => import('react-json-view'), { ssr: false });

export default JSONViewer;