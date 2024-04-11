'use client'
import React, { useState } from 'react';
import { generateApiKey } from '@/lib/ApiKey';
import { TextField, Button, Grid, Icon } from '@mui/material';
import { FileCopy } from '@mui/icons-material';
import PageContainer from '../../components/container/PageContainer';
import { GenericToast } from '../(components)/GenericToast';

const GenerateApiKeyPage = () => {
    const [newApiKey, setNewApiKey] = useState('');

    const handleClick = async () => {
        try {
            const apiKey = await generateApiKey();
            if (apiKey) {
                setNewApiKey(apiKey);
                GenericToast.showSuccess("API Key generada con éxito");
            } else {
                GenericToast.showWarning("No se pudo generar la API Key");
            }
        } catch (error) {
            GenericToast.showError("Error al generar la API Key");
        }
    };

    const handleCopy = () => {
        if (newApiKey) {
            navigator.clipboard.writeText(newApiKey).then(() => {
                GenericToast.showSuccess("API Key copiada al portapapeles");
            }).catch(() => {
                GenericToast.showError("Error al copiar la API Key");
            });
        } else {
            GenericToast.showInfo("No hay API Key para copiar");
        }
    };

    return (
        <PageContainer title="Generar API Key" description="Utilidad para generar api key">
            <h2 style={{ textAlign: "center" }}>GENERAR API KEY</h2>
            <div>
                <Button type="submit" variant="contained" color="primary" onClick={handleClick}>
                    GENERAR
                </Button>
                <Button style={{ marginLeft: '4px' }} variant="contained" onClick={handleCopy} startIcon={<FileCopy />}>
                    Copiar al portapapeles
                </Button>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={6} style={{ marginTop: '30px' }}>
                        <TextField
                            fullWidth
                            disabled
                            multiline
                            label="ApiKey"
                            value={newApiKey}
                        />
                    </Grid>
                </Grid>
            </div>
        </PageContainer>
    );
};

export default GenerateApiKeyPage;