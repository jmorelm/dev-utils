'use client'
import React, { useState } from 'react';
import DiffViewer from 'react-diff-viewer';
import PageContainer from '../../components/container/PageContainer';

const ComparePage = () => {
    const [file1Content, setFile1Content] = useState('');
    const [file2Content, setFile2Content] = useState('');

    return (
        <PageContainer title="Comparar texto" description="Utilidad para comparar texto">
            <div style={{ width: '100%' }}>
                <h2 style={{ textAlign: "center" }}>COMPARAR TEXTO</h2>
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ flex: '1' }}>
                        <textarea
                            value={file1Content}
                            onChange={(e) => setFile1Content(e.target.value)}
                            placeholder="Contenido del archivo 1"
                            rows={10}
                            cols={50}
                            style={{ height: '400px', width: '100%', borderRadius: '12px', padding: '8px' }}
                        />
                    </div>
                    <div style={{ flex: '1' }}>
                        <textarea
                            value={file2Content}
                            onChange={(e) => setFile2Content(e.target.value)}
                            placeholder="Contenido del archivo 2"
                            rows={10}
                            cols={50}
                            style={{ height: '400px', width: '100%', borderRadius: '12px', padding: '8px' }}
                        />
                    </div>
                </div>
                <div style={{ marginTop: '15px', borderRadius: '12px', overflow: 'hidden' }}>
                    <DiffViewer
                        oldValue={file1Content}
                        newValue={file2Content}
                        splitView={true}
                        styles={{
                            diffContainer: {
                                height: '400px',
                                padding: '8px',
                                backgroundColor: '#2e303c',
                                color: '#FFF',
                                borderRadius: '12px'
                            },
                            variables: {
                                dark: {
                                    diffViewerBackground: '#2e303c',
                                    diffViewerColor: '#FFF',
                                    addedBackground: '#044B53',
                                    addedColor: 'white',
                                    removedBackground: '#632F34',
                                    removedColor: 'white',
                                    wordAddedBackground: '#055d67',
                                    wordRemovedBackground: '#7d383f',
                                    addedGutterBackground: '#034148',
                                    removedGutterBackground: '#632b30',
                                    gutterBackground: '#2c2f3a',
                                    gutterBackgroundDark: '#262933',
                                    highlightBackground: '#2a3967',
                                    highlightGutterBackground: '#2d4077',
                                    codeFoldGutterBackground: '#21232b',
                                    codeFoldBackground: '#262831',
                                    emptyLineBackground: '#363946',
                                    gutterColor: '#464c67',
                                    addedGutterColor: '#8c8c8c',
                                    removedGutterColor: '#8c8c8c',
                                    codeFoldContentColor: '#555a7b',
                                    diffViewerTitleBackground: '#2f323e',
                                    diffViewerTitleColor: '#555a7b',
                                    diffViewerTitleBorderColor: '#353846',
                                }
                            }
                        }}
                    />
                </div>
            </div>
        </PageContainer>
    );
};

export default ComparePage;