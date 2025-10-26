import React from 'react';
import {
  Box, Button, Card, CardContent, Grid, Typography, TextField, Select, MenuItem,
  Chip, ToggleButton, ToggleButtonGroup, IconButton, Switch
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import sqliteLogo from "@/assets/sqlite.png";
import mysqlLogo from "@/assets/mysql.png";
import mssqlLogo from "@/assets/mssql.png";
import postgresLogo from "@/assets/postgresql.png";
import bigqueryLogo from "@/assets/bigquery.png";
import redshiftLogo from "@/assets/redshift.png";
import oracleLogo from "@/assets/oracle.png";
import teradataLogo from "@/assets/teradata.png";
import snowflakeLogo from "@/assets/snowflake.png";

import { ALL_CONNECTORS, handleFirebaseUpload } from "./productStudioHelpers";

const getConnectorIcon = (connectorId) => {
  const logos = {
    mysql: mysqlLogo,
    postgres: postgresLogo,
    oracle: oracleLogo,
    mssql: mssqlLogo,
    teradata: teradataLogo,
    redshift: redshiftLogo,
    bigquery: bigqueryLogo,
    snowflake: snowflakeLogo,
  };
  return logos[connectorId] || sqliteLogo;
};

const DataSourceConnector = ({
  // State
  selectedConnectors,
  uploadedFiles,
  connectorView,
  searchTerm,
  selectedCategory,
  existingConnections,
  connStatusNew,
  connStatusExisting,
  recentlyAddedConnections,
  
  // Setters
  setSelectedConnectors,
  setUploadedFiles,
  setConnectorView,
  setSearchTerm,
  setSelectedCategory,
  setCurrentConnector,
  setCurrentConnectorId,
  setConnectDialogOpen,
  setConnForm,
  setConnSuccess,
  setSelectedConnectorForEdit,
  setEditDialogOpen,
  setConnectionToEdit,
  setEditForm,
  setEditExistingDialogOpen,
  setConnectionToDelete,
  setDeleteConfirmOpen,
  setSnack,
  
  // Handlers
  handleToggleConnection,
  onSelectConnector
}) => {
  const onFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...selectedFiles]);
      setSelectedConnectors((prev) =>
        prev.includes("upload") ? prev : [...prev, "upload"]
      );
    }
  };

  const filteredConnectors = ALL_CONNECTORS.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? c.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <Box component="form" onSubmit={(e) => e.preventDefault()}>
      {/* File upload */}
      <Box 
        className="upload-block" 
        sx={{ mb: 3, p: 3 }} 
        onDragOver={(e) => e.preventDefault()} 
        onDrop={(e) => {
          e.preventDefault();
          const droppedFiles = Array.from(e.dataTransfer.files);
          if (droppedFiles.length > 0) {
            setUploadedFiles((prev) => [...prev, ...droppedFiles]);
            setSelectedConnectors((prev) =>
              prev.includes("upload") ? prev : [...prev, "upload"]
            );
          }
        }}
      >
        <label htmlFor="file-upload" className="upload-inner">
          <CloudUploadIcon fontSize="large" />
          <div>
            <Typography variant="subtitle1">Upload local dataset</Typography>
            <Typography variant="body2" color="text.secondary">Supported: .csv, .xlsx, .zip</Typography>
          </div>
        </label>
        
        {/* File Upload Chips */}
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
          {uploadedFiles.map((file) => (
            <Chip
              key={file.name}
              label={file.name}
              onDelete={() =>
                setUploadedFiles((prev) => prev.filter((f) => f.name !== file.name))
              }
            />
          ))}
        </Box>
        
        <input 
          id="file-upload" 
          type="file" 
          accept=".csv,.xlsx,.zip" 
          multiple
          onChange={onFileChange} 
          style={{ display: "none" }} 
        />
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleFirebaseUpload(uploadedFiles, setSnack)}
          disabled={!uploadedFiles.length}
        >
          Upload Files
        </Button>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          placeholder="Search connectors..."
          size="small"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }}
        />
        <Select
          size="small"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          displayEmpty
          sx={{ width: 160 }}
        >
          <MenuItem value="">All Categories</MenuItem>
          <MenuItem value="sql">SQL</MenuItem>
          <MenuItem value="cloud">Cloud</MenuItem>
        </Select>
      </Box>

      {/* Switch between new and Existing connections */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <ToggleButtonGroup
          value={connectorView}
          exclusive
          onChange={(e, newView) => {
            if (newView !== null) setConnectorView(newView);
          }}
          sx={{ mb: 3, borderRadius: 2, overflow: "hidden" }}
        >
          <ToggleButton value="new" sx={{ px: 3 }}>
            New Connection
          </ToggleButton>
          <ToggleButton value="existing" sx={{ px: 3 }}>
            Existing Connections
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <AnimatePresence mode="wait">
        {connectorView === "new" && (
          <motion.div
            key="new"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* New Connector grid */}
            <Grid container spacing={2}>
              {filteredConnectors.map((c) => {
                const isConnected = connStatusNew[c.id];
                const isSelected = selectedConnectors.includes(c.id);
                const iconSrc = getConnectorIcon(c.id);

                return (
                  <Grid item xs={6} sm={3} key={c.id}>
                    <Card
                      className={`connector-card ${isSelected ? "selected" : ""}`}
                      onClick={() => onSelectConnector(
                        c.id,
                        selectedConnectors,
                        connStatusNew,
                        setSelectedConnectors,
                        setSelectedConnectorForEdit,
                        setEditDialogOpen,
                        existingConnections,
                        recentlyAddedConnections,
                        setCurrentConnectorId,
                        setCurrentConnector,
                        setConnectDialogOpen,
                        setConnForm,
                        setConnSuccess
                      )}
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        position: 'relative',
                        '&:hover': { transform: 'scale(1.05)', boxShadow: 6 },
                        border: isConnected ? '2px solid #4caf50' : '1px solid rgba(255,255,255,0.12)',
                      }}
                    >
                      <CardContent sx={{ display: "flex", flexDirection: 'column', alignItems: "center", gap: 1 }}>
                        <Box sx={{ fontSize: 28 }}>
                          <img src={iconSrc} alt={c.id} style={{ width: 130, height: 100 }} />
                        </Box>
                        <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                          {c.id}
                        </Typography>

                        {/* Show status label */}
                        {isConnected && (
                          <Chip
                            label="Connected"
                            size="small"
                            color="success"
                            sx={{ position: "absolute", top: 8, right: 8, fontSize: 10 }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          </motion.div>
        )}
        
        {connectorView === "existing" && (
          <motion.div
            key="existing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {existingConnections.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
                No Saved Connections!
              </Typography>
            ) : (
              <Box
                sx={{
                  maxHeight: 400,
                  overflowY: "auto",
                  border: "1px solid rgba(0,0,0,0.12)",
                  borderRadius: 2,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {existingConnections.map(conn => {
                  const isConnected = connStatusExisting[conn.connector_id];

                  return (
                    <Card className="existing-connector-card" key={conn.connector_id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 1 }}>
                      <Box>
                        <Typography variant="h5">{conn.name.charAt(0).toUpperCase() + conn.name.slice(1)}</Typography>
                        <Typography variant="subtitle2">{conn.username} | {conn.database}</Typography>
                        <Typography variant="caption">{conn.host}:{conn.port}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                        {/* Use button */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Switch
                            checked={connStatusExisting[conn.connector_id] || false}
                            onChange={() => handleToggleConnection(conn, connStatusExisting, setSnack, setConnStatusExisting)}
                            disabled={recentlyAddedConnections.includes(conn.connector_id) && connStatusExisting[conn.connector_id]}
                            color="success"
                          />

                          <Typography variant="body2">
                            {connStatusExisting[conn.connector_id] ? "In Use" : "Use"}
                          </Typography>

                          {recentlyAddedConnections.includes(conn.connector_id) && (
                            <Chip label="Already in use" size="small" color="warning" />
                          )}
                        </Box>

                        {/* Edit button */}
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => {
                            setConnectionToEdit(conn);
                            setEditForm({
                              name: conn.name || "",
                              host: conn.host || "",
                              port: conn.port || "",
                              username: conn.username || "",
                              password: "", // don't prefill password
                              database: conn.database || "",
                            });
                            setEditExistingDialogOpen(true);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>

                        {/* Delete button */}
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => {
                            setConnectionToDelete(conn);
                            setDeleteConfirmOpen(true);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Card>
                  );
                })}
              </Box>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default DataSourceConnector;