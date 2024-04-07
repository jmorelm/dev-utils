"use client"
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

import styled from 'styled-components';

const JSONViewer = () => {
  const [jsonData, setJsonData] = useState(null);

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
  `;
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      return;
    }
  }, []);

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