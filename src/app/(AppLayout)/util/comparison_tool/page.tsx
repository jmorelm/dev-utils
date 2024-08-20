'use client';
import React, { useState } from 'react';
import PageContainer from '../../components/container/PageContainer';
import { DiffEditor } from '@monaco-editor/react';

const ComparePage = () => {
    const [file1Content, setFile1Content] = useState('// Contenido original...');
    const [file2Content, setFile2Content] = useState('// Contenido modificado...');

    return (
        <PageContainer title="Comparar texto" description="Utilidad para comparar texto">
            <div style={{ width: '100%' }}>
                <h2 style={{ textAlign: "center" }}>COMPARAR TEXTO</h2>
                <div style={{ height: '100vh', width: '100%' }}>
                    <DiffEditor
                        original={file1Content}
                        modified={file2Content}
                        height={700}
                        language='csharp'
                        options={{
                            automaticLayout: true,
                            renderSideBySide: true,
                            originalEditable: true,
                            cursorBlinking: 'expand',
                            diffAlgorithm: 'advanced',
                            dragAndDrop: true,
                            fontLigatures: true,
                            glyphMargin: true
                        }}
                    />
                </div>
            </div>
        </PageContainer>
    );
};

export default ComparePage;