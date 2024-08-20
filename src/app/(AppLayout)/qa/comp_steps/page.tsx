'use client'
import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, Typography, Paper, CssBaseline, IconButton, Collapse, TextField, Button } from '@mui/material';
import { ExpandLess, ExpandMore, Delete } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import ArticleIcon from '@mui/icons-material/Article';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: Readonly<TabPanelProps>) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const HomePage = () => {
  const [mainTab, setMainTab] = useState(0);
  const [subTab, setSubTab] = useState(0);
  const [files, setFiles] = useState<{ [key: string]: { id: string, name: string, type: 'file' | 'grant', content?: string }[] }>({});
  const [tabOrder, setTabOrder] = useState<string[]>([]);
  const [collapsedTabs, setCollapsedTabs] = useState<{ [key: string]: boolean }>({});

  const handleMainTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setMainTab(newValue);
    setSubTab(0); // Reset subTab when switching main tabs
  };

  const handleSubTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSubTab(newValue);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, isGrant: boolean = false) => {
    if (event.target.files) {
      const uploadedFiles = Array.from(event.target.files).map(file => ({
        id: uuidv4(),
        name: file.name,
        type: isGrant ? 'grant' : 'file',
        content: isGrant ? '' : undefined,
      }));
      const tabKey = `${mainTab}-${subTab}`;

      if (isGrant) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          uploadedFiles[0].content = content;
          setFiles((prevFiles: any) => ({
            ...prevFiles,
            [tabKey]: [...(prevFiles[tabKey] || []).filter((f: any) => f.type !== 'grant'), ...uploadedFiles],
          }));
        };
        reader.readAsText(event.target.files[0]);
      } else {
        setFiles((prevFiles: any) => ({
          ...prevFiles,
          [tabKey]: [...(prevFiles[tabKey] || []), ...uploadedFiles],
        }));
      }

      if (!tabOrder.includes(tabKey)) {
        setTabOrder([...tabOrder, tabKey]);
      }
      event.target.value = '';
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceTabKey = source.droppableId;
    const destinationTabKey = destination.droppableId;

    if (sourceTabKey === 'tabs' && destinationTabKey === 'tabs') {
      const reorderedTabs = Array.from(tabOrder);
      const [movedTab] = reorderedTabs.splice(source.index, 1);
      reorderedTabs.splice(destination.index, 0, movedTab);
      setTabOrder(reorderedTabs);
    } else if (sourceTabKey !== destinationTabKey) {
      const sourceItems = Array.from(files[sourceTabKey]);
      const destinationItems = Array.from(files[destinationTabKey]);
      const [movedItem] = sourceItems.splice(source.index, 1);
      destinationItems.splice(destination.index, 0, movedItem);

      setFiles((prevFiles: any) => ({
        ...prevFiles,
        [sourceTabKey]: sourceItems,
        [destinationTabKey]: destinationItems,
      }));
    } else {
      const items = Array.from(files[sourceTabKey]);
      const [movedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, movedItem);
      setFiles((prevFiles: any) => ({
        ...prevFiles,
        [sourceTabKey]: items,
      }));
    }
  };

  const toggleCollapse = (tabKey: string) => {
    setCollapsedTabs(prevState => ({
      ...prevState,
      [tabKey]: !prevState[tabKey]
    }));
  };

  const handleDelete = (tabKey: string, fileId?: string) => {
    if (fileId) {
      setFiles(prevFiles => ({
        ...prevFiles,
        [tabKey]: prevFiles[tabKey].filter(file => file.id !== fileId)
      }));
    } else {
      setFiles(prevFiles => {
        const newFiles = { ...prevFiles };
        delete newFiles[tabKey];
        return newFiles;
      });
      setTabOrder(prevOrder => prevOrder.filter(key => key !== tabKey));
    }
  };

  const handleGrantEdit = (event: React.ChangeEvent<HTMLInputElement>, tabKey: string, grantId: string) => {
    const newContent = event.target.value;
    setFiles(prevFiles => ({
      ...prevFiles,
      [tabKey]: prevFiles[tabKey].map(file => file.id === grantId ? { ...file, content: newContent } : file),
    }));
  };

  const handleGenerateFile = () => {
    let fileContent = '';
    tabOrder.forEach(tabKey => {
      const [main, sub] = tabKey.split('-');
      const tabName = getTabName(parseInt(main), parseInt(sub));
      fileContent += `------------ ${tabName.toUpperCase()} ------------\n`;
      (files[tabKey] || []).forEach(file => {
        if (file.type === 'grant') {
          fileContent += `${file.content}\n`;
        } else {
          fileContent += `${file.name}\n`;
        }
      });
      fileContent += '\n';
    });

    const element = document.createElement('a');
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'pasos_de_compilacion.txt';
    document.body.appendChild(element);
    element.click();
  };

  const handleReset = () => {
    setMainTab(0);
    setSubTab(0);
    setFiles({});
    setTabOrder([]);
    setCollapsedTabs({});
  };

  const getTabName = (main: number, sub: number) => {
    const mainTabs = ["Tablas", "Indices", "Procedimientos", "Funciones", "Paquetes", "Granteos"];
    const subTabs = ["Alter", "Create"];
    if (main === 0) {
      return `${mainTabs[main]} - ${subTabs[sub]}`;
    }
    return mainTabs[main];
  };

  const renderTree = () => {
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tabs" type="tabs">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {tabOrder.map((tabKey, index) => {
                const [main, sub] = tabKey.split('-');
                const tabName = getTabName(parseInt(main), parseInt(sub));
                const isCollapsed = collapsedTabs[tabKey];

                return (
                  <Draggable key={tabKey} draggableId={tabKey} index={index}>
                    {(provided, snapshot) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          margin: '8px 0',
                          padding: '8px',
                          ...provided.draggableProps.style,
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ paddingLeft: '12px' }}>
                          <Typography variant="h6">{tabName}</Typography>
                          <Box>
                            <IconButton onClick={() => toggleCollapse(tabKey)}>
                              {isCollapsed ? <ExpandMore /> : <ExpandLess />}
                            </IconButton>
                            <IconButton onClick={() => handleDelete(tabKey)}>
                              <Delete />
                            </IconButton>
                          </Box>
                        </Box>
                        <Collapse in={!isCollapsed} style={{ marginLeft: '20px' }}>
                          <Droppable droppableId={tabKey} type="items">
                            {(provided) => (
                              <div ref={provided.innerRef} {...provided.droppableProps}>
                                {(files[tabKey] || []).map((file, index) =>
                                  file.type === 'grant' ? (
                                    <Box key={file.id} mb={1}>
                                      <TextField
                                        label={file.name}
                                        variant="outlined"
                                        multiline
                                        fullWidth
                                        value={file.content}
                                        onChange={(e: any) => handleGrantEdit(e, tabKey, file.id)}
                                      />
                                      <IconButton onClick={() => handleDelete(tabKey, file.id)}>
                                        <Delete />
                                      </IconButton>
                                    </Box>
                                  ) : (
                                    <Draggable key={file.id} draggableId={file.id} index={index}>
                                      {(provided) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={{
                                            margin: '4px 0',
                                            padding: '4px',
                                            paddingLeft: '15px',
                                            border: '1px solid grey',
                                            borderRadius: '12px',
                                            ...provided.draggableProps.style,
                                          }}
                                        >
                                          <Box display="flex" alignItems="center" justifyContent="space-between">
                                            <Box display="flex">
                                              <ArticleIcon style={{ marginRight: '8px' }}></ArticleIcon>
                                              <Typography>{file.name}</Typography>
                                            </Box>
                                            <IconButton onClick={() => handleDelete(tabKey, file.id)}>
                                              <Delete />
                                            </IconButton>
                                          </Box>
                                        </div>
                                      )}
                                    </Draggable>
                                  )
                                )}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </Collapse>
                      </Paper>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  };

  const isDataLoaded = tabOrder.length > 0;

  return (
    <>
      <h2 style={{ textAlign: "center" }}>GENERAR PASOS DE COMPILACION</h2>
      <CssBaseline />
      <Box mt={2} mb={2} display="flex" justifyContent="space-between">
        <Button
          variant="contained"
          color="secondary"
          onClick={handleReset}
          disabled={!isDataLoaded}
        >
          Reiniciar
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleGenerateFile}
          disabled={!isDataLoaded}
        >
          Generar Archivo
        </Button>
      </Box>
      <AppBar position="static">
        <Tabs value={mainTab} onChange={handleMainTabChange} aria-label="main tabs">
          <Tab label="Tablas" id="main-tab-0" />
          <Tab label="Indices" id="main-tab-1" />
          <Tab label="Procedimientos" id="main-tab-2" />
          <Tab label="Funciones" id="main-tab-3" />
          <Tab label="Paquetes" id="main-tab-4" />
          <Tab label="Granteos" id="main-tab-5" />
        </Tabs>
      </AppBar>
      <Box display="flex">
        <Box flexGrow={1}>
          <TabPanel value={mainTab} index={0}>
            <Tabs value={subTab} onChange={handleSubTabChange} aria-label="sub tabs">
              <Tab label="Alter" id="sub-tab-0" />
              <Tab label="Create" id="sub-tab-1" />
            </Tabs>
            <TabPanel value={subTab} index={0}>
              <Typography>Contenido de Alter</Typography>
              <input type="file" onChange={(e) => handleFileUpload(e)} multiple />
            </TabPanel>
            <TabPanel value={subTab} index={1}>
              <Typography>Contenido de Create</Typography>
              <input type="file" onChange={(e) => handleFileUpload(e)} multiple />
            </TabPanel>
          </TabPanel>
          <TabPanel value={mainTab} index={1}>
            <Typography>Contenido de Indices</Typography>
            <input type="file" onChange={(e) => handleFileUpload(e)} multiple />
          </TabPanel>
          <TabPanel value={mainTab} index={2}>
            <Typography>Contenido de Procedimientos</Typography>
            <input type="file" onChange={(e) => handleFileUpload(e)} multiple />
          </TabPanel>
          <TabPanel value={mainTab} index={3}>
            <Typography>Contenido de Funciones</Typography>
            <input type="file" onChange={(e) => handleFileUpload(e)} multiple />
          </TabPanel>
          <TabPanel value={mainTab} index={4}>
            <Typography>Contenido de Paquetes</Typography>
            <input type="file" onChange={(e) => handleFileUpload(e)} multiple />
          </TabPanel>
          <TabPanel value={mainTab} index={5}>
            <Typography>Granteos</Typography>
            <input type="file" onChange={(e) => handleFileUpload(e, true)} />
          </TabPanel>
        </Box>
      </Box>
      <Box style={{ textAlign: 'center' }}>
        <Typography variant="h6">Archivos y Granteos Cargados</Typography>
        {renderTree()}
      </Box>
    </>
  );
};

export default HomePage;