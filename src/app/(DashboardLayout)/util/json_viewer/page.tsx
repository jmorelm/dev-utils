"use client"
import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const JSONViewer = () => {
  const [jsonData, setJsonData] = useState(null);
  
  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const content = e.target?.result as string;
        const parsedJson = JSON.parse(content);
        setJsonData(parsedJson);
      };
      reader.readAsText(file);
    }
  };

  const handleEdit = (edit: { updated_src: any }) => {
    setJsonData(edit.updated_src);
  };

  return (
    <Container>
      <input type="file" accept=".json" onChange={handleFileChange} />
      {jsonData && (
        <ReactJson
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

export default JSONViewer;