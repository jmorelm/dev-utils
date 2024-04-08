'use client'
import React, { useState } from 'react';
import { generateApiKey } from '@/lib/ApiKey';
import { TextField, Button, Grid, IconButton, Icon } from '@mui/material';
import { FileCopy } from '@mui/icons-material';
import PageContainer from '../../components/container/PageContainer';

const GenerateApiKeyPage = () => {
    const [newApiKey, setNewApiKey] = useState('');

    const handleClick = async () => {
        const apiKey = await generateApiKey();
        if (apiKey) {
            setNewApiKey(apiKey);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(newApiKey);
    };

    return (
        <PageContainer title="Generar API Key" description="Utilidad para generar api key">
            <h2 style={{ textAlign: "center" }}>GENERAR API KEY</h2>
            <div>
                <Button type="submit" variant="contained" color="primary" onClick={handleClick}>
                    GENERAR
                </Button>
                <Button style={{ marginLeft: '4px' }} variant="contained" onClick={handleCopy} startIcon={
                    <Icon>
                        <FileCopy />
                    </Icon>
                }>
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