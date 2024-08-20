'use client'
import React, { useState } from 'react';
import { Tabs, Tab, TextField, Button, Switch, Typography } from '@mui/material';
import { PDFDocument } from 'pdf-lib';
import { GenericToast } from '../(components)/GenericToast';

const Base64Converter = () => {
    const [base64Text, setBase64Text] = useState('');
    const [encodedValue, setEncodedValue] = useState('');
    const [decodedValue, setDecodedValue] = useState('');
    const [tabIndex, setTabIndex] = useState(0);
    const [conversionType, setConversionType] = useState<'encode' | 'decode'>('encode');
    const [pdfSrc, setPdfSrc] = useState<string | undefined>(undefined);

    const handleTabChange = (event: any, newValue: React.SetStateAction<number>) => {
        setTabIndex(newValue);
        setEncodedValue('');
        setDecodedValue('');
        setBase64Text('');
        setPdfSrc(undefined);
    };

    const handleInputChange = (event: { target: { value: any; }; }) => {
        const newValue = event.target.value;
        setBase64Text(newValue);

        if (conversionType === 'encode') {
            try {
                setEncodedValue(btoa(newValue));
            } catch (error) {
                GenericToast.showError('El código ingresado no es válido.');
            }
        } else {
            try {
                setDecodedValue(atob(newValue));
            } catch (error) {
                GenericToast.showError('El código ingresado no es válido.');
            }
        }
    };

    const handleSwitchChange = () => {
        const newConversionType = conversionType === 'encode' ? 'decode' : 'encode';
        setConversionType(newConversionType);
        if (base64Text) {
            if (newConversionType === 'encode') {
                try {
                    setEncodedValue(btoa(base64Text));
                } catch (error) {
                    GenericToast.showError('El base64 ingresado no es válido.');
                }
            } else {
                try {
                    setDecodedValue(atob(base64Text));
                } catch (error) {
                    GenericToast.showError('El base64 ingresado no es válido.');
                }
            }
        }
    };

    const handleConvert = async () => {
        if (tabIndex === 0) {
            try {
                let base64Data = base64Text.startsWith('data:application/pdf;base64,')
                    ? base64Text
                    : `data:application/pdf;base64,${base64Text}`;
                const base64WithoutHeader = base64Data.replace('data:application/pdf;base64,', '');
                const uint8Array = Uint8Array.from(atob(base64WithoutHeader), c => c.charCodeAt(0));
                const pdfDoc = await PDFDocument.load(uint8Array);
                const pdfBytes = await pdfDoc.save();
                const pdfSrc = URL.createObjectURL(new Blob([pdfBytes], { type: 'application/pdf' }));
                setPdfSrc(pdfSrc);
            } catch (error) {
                GenericToast.showError('El base64 ingresado no es válido.');
            }
        }
    };

    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(conversionType === 'encode' ? encodedValue : decodedValue);
            GenericToast.showSuccess('Copiado al portapapeles.')
        } catch (error) {
            GenericToast.showError('Ocurrió un error al copiar el texto.');
        }
    };

    return (
        <div style={{ marginTop: '20px' }}>
            <h2 style={{ textAlign: "center" }}>HERRAMIENTAS BASE 64</h2>
            <Tabs value={tabIndex} onChange={handleTabChange}>
                <Tab label="Base64 a PDF" />
                <Tab label="Base64 Encoder/Decoder" />
            </Tabs>
            {tabIndex === 0 && (
                <div style={{ marginTop: '20px' }}>
                    <TextField
                        label="Texto Base64"
                        value={base64Text}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={6}
                    />
                    <Button onClick={handleConvert} style={{ marginTop: '10px' }}>Convertir a PDF</Button>
                    {pdfSrc && <iframe title="PDF Viewer" src={pdfSrc} style={{ marginTop: '20px', width: '100%', height: '800px' }} />}
                </div>
            )}
            {tabIndex === 1 && (
                <div style={{ marginTop: '20px' }}>
                    <TextField
                        label="Texto Base64"
                        value={base64Text}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={6}
                    />
                    <Typography variant="body2" style={{ marginTop: '10px' }}>
                        {`${conversionType === 'encode' ? 'Encode' : 'Decode'} Base64`}
                    </Typography>
                    <Switch
                        checked={conversionType === 'decode'}
                        onChange={handleSwitchChange}
                        inputProps={{ 'aria-label': 'Switch' }}
                    />
                    <TextField
                        label="Resultado"
                        value={conversionType === 'encode' ? encodedValue : decodedValue}
                        fullWidth
                        multiline
                        rows={6}
                        disabled
                        style={{ marginTop: '10px' }}
                    />
                    <Button onClick={handleCopyToClipboard} style={{ marginTop: '10px' }}>Copiar al portapapeles</Button>
                </div>
            )}
        </div>
    );
};

export default Base64Converter;