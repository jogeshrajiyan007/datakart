import React, { useEffect, useState } from "react";
import {
  Box, Typography, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, CircularProgress, RadioGroup, FormControlLabel, Radio, Grid
} from "@mui/material";
import { motion } from "framer-motion";

import CreateDataProduct from "./ProductStudioComponents/CreateDataProduct";
import StepMotion from "./ProductStudioComponents/productUtils/StepMotion";
import {
  testConnection,
  handleDownloadConnector,
  saveConnection,
  handleConfirmDelete,
  handleUpdateConnection,
  handleToggleConnection
} from "./ProductStudioComponents/productUtils/productStudioHelpers";
import AxiosInstance from '@/utils/AxiosInstance';

import "@/styles/product-studio.css";

export default function ProductStudio() {
  const [activeStep, setActiveStep] = useState(0);
  const [view, setView] = useState("studio"); // studio | repository | pipelines

  // Connect / Upload
  const [selectedConnectors, setSelectedConnectors] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [connectorView, setConnectorView] = useState("new");

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Connection dialog
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [currentConnector, setCurrentConnector] = useState(null);
  const [currentConnectorId, setCurrentConnectorId] = useState(null);
  const [isLocal, setIsLocal] = useState("cloud"); // local | cloud
  const [connForm, setConnForm] = useState({
    host: "",
    port: "",
    username: "",
    password: "",
    database: "",
    url: "",
    token: ""
  });
  const [testingConn, setTestingConn] = useState(false);
  const [savingConn, setSavingConn] = useState(false);
  const [connSuccess, setConnSuccess] = useState(false);
  const [connStatusNew, setConnStatusNew] = useState({});
  const [connStatusExisting, setConnStatusExisting] = useState({});
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedConnectorForEdit, setSelectedConnectorForEdit] = useState(null);
  const [existingConnections, setExistingConnections] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [connectionToDelete, setConnectionToDelete] = useState(null);

  const [editExistingDialogOpen, setEditExistingDialogOpen] = useState(false);
  const [connectionToEdit, setConnectionToEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    host: "",
    port: "",
    username: "",
    password: "",
    database: "",
  });

  const [recentlyAddedConnections, setRecentlyAddedConnections] = useState([]);

  // UI
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await AxiosInstance.get("/api/product/source/connections/");
        if (res.status === 200) setExistingConnections(res.data);
      } catch (err) {
        console.error("Failed to fetch connections:", err);
      }
    };
    fetchConnections();
  }, []);

  return (
    <Box className="studio-page studio-container">
      {/* Sidebar */}
      <Box className="studio-sidebar">
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>Data Product Studio</Typography>
        <Box className={`nav-item ${view === "studio" ? "active" : ""}`} onClick={() => setView("studio")}>Create Data Product</Box>
        <Box className={`nav-item ${view === "repository" ? "active" : ""}`} onClick={() => setView("repository")}>Data Product Repository</Box>
        <Box className={`nav-item ${view === "pipelines" ? "active" : ""}`} onClick={() => setView("pipelines")}>Automated Pipelines</Box>
      </Box>

      {/* Main */}
      <Box className="studio-main" sx={{ p: 3 }}>
        {view === "studio" && (
          <CreateDataProduct
            // State
            activeStep={activeStep}
            selectedConnectors={selectedConnectors}
            uploadedFiles={uploadedFiles}
            connectorView={connectorView}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            existingConnections={existingConnections}
            connStatusNew={connStatusNew}
            connStatusExisting={connStatusExisting}
            recentlyAddedConnections={recentlyAddedConnections}
            
            // Setters
            setActiveStep={setActiveStep}
            setSelectedConnectors={setSelectedConnectors}
            setUploadedFiles={setUploadedFiles}
            setConnectorView={setConnectorView}
            setSearchTerm={setSearchTerm}
            setSelectedCategory={setSelectedCategory}
            setCurrentConnector={setCurrentConnector}
            setCurrentConnectorId={setCurrentConnectorId}
            setConnectDialogOpen={setConnectDialogOpen}
            setConnForm={setConnForm}
            setConnSuccess={setConnSuccess}
            setSelectedConnectorForEdit={setSelectedConnectorForEdit}
            setEditDialogOpen={setEditDialogOpen}
            setConnectionToEdit={setConnectionToEdit}
            setEditForm={setEditForm}
            setEditExistingDialogOpen={setEditExistingDialogOpen}
            setConnectionToDelete={setConnectionToDelete}
            setDeleteConfirmOpen={setDeleteConfirmOpen}
            setSnack={setSnack}
            setConnStatusExisting={setConnStatusExisting}
            
            // Handlers
            handleToggleConnection={handleToggleConnection}
          />
        )}

        {/* Repository and Pipelines rendering Goes Here ------> */}
        {view !== "studio" && (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4">
              {view === "repository" ? "Data Product Repository" : "Automated Pipelines"}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              This view is under development.
            </Typography>
          </Box>
        )}
      </Box>

      {/* ---------- Connection Dialog ---------- */}
      <Dialog open={connectDialogOpen} onClose={() => setConnectDialogOpen(false)}>
        <DialogTitle>Configure Connection ({currentConnector})</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: 600, height: "auto" }}>
          {currentConnector === "mysql" || currentConnector === "postgres" ? (
            <>
              <RadioGroup row value={isLocal} onChange={(e) => setIsLocal(e.target.value)} sx={{ mb: 2 }}>
                <FormControlLabel value="cloud" control={<Radio />} label="Cloud" />
                <FormControlLabel value="local" control={<Radio />} label="Local" />
              </RadioGroup>

              {isLocal === "local" ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={() => handleDownloadConnector(setTestingConn, setSnack)}
                    sx={{ mb: 2 }}
                  >
                    Download Local Connector
                  </Button>

                  <TextField
                    label="Local Connector URL"
                    size="small"
                    value={connForm.url}
                    onChange={(e) => setConnForm({ ...connForm, url: e.target.value })}
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="API Token"
                    size="small"
                    value={connForm.token}
                    onChange={(e) => setConnForm({ ...connForm, token: e.target.value })}
                    fullWidth
                  />
                </>
              ) : (
                ['Host', 'Port', 'Username', 'Password', 'Database'].map((field) => (
                  <TextField
                    key={field}
                    type={field === 'Password' ? 'password' : 'text'}
                    label={field}
                    value={connForm[field.toLowerCase()]}
                    onChange={(e) => setConnForm({ ...connForm, [field.toLowerCase()]: e.target.value })}
                    size="small"
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                ))
              )}
            </>
          ) : (
            ['Host', 'Port', 'Username', 'Password', 'Database'].map((field) => (
              <TextField
                key={field}
                type={field === 'Password' ? 'password' : 'text'}
                label={field}
                value={connForm[field.toLowerCase()]}
                onChange={(e) => setConnForm({ ...connForm, [field.toLowerCase()]: e.target.value })}
                size="small"
                fullWidth
                sx={{ mb: 1 }}
              />
            ))
          )}

          {connSuccess && <Typography color="success.main" sx={{ mt: 1 }}>Connection established successfully!</Typography>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => testConnection(
              currentConnector,
              connForm,
              isLocal,
              setTestingConn,
              setConnSuccess,
              setConnStatusNew,
              setSnack
            )}
            disabled={testingConn}
          >
            {testingConn ? <CircularProgress size={20} /> : "Test Connection"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => saveConnection(
              connSuccess,
              currentConnector,
              existingConnections,
              connForm,
              setSnack,
              setCurrentConnectorId,
              setConnStatusNew,
              setExistingConnections,
              setRecentlyAddedConnections,
              setConnStatusExisting,
              setConnectDialogOpen
            )}
            disabled={!connSuccess || savingConn}
          >
            {savingConn ? <CircularProgress size={20} /> : "Done"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---------- Edit/Disconnect Dialog ---------- */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
      >
        <DialogTitle>Manage Connection ({selectedConnectorForEdit})</DialogTitle>
        <DialogContent sx={{ width: 400, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body2">
            This connector is currently <strong>connected</strong>. What would you like to do?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setConnStatusNew((prev) => ({ ...prev, [selectedConnectorForEdit]: false }));
              setSelectedConnectors((prev) =>
                prev.filter((c) => c !== selectedConnectorForEdit)
              );

              if (currentConnectorId) {
                setRecentlyAddedConnections(prev =>
                  prev.filter(id => id !== currentConnectorId)
                );

                setConnStatusExisting(prev => ({
                  ...prev,
                  [currentConnectorId]: false
                }));

                setCurrentConnectorId(null);
              }

              setSnack({ open: true, message: `${selectedConnectorForEdit} disconnected`, severity: "info" });
              setEditDialogOpen(false);
            }}
          >
            Disconnect
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setCurrentConnector(selectedConnectorForEdit);
              setConnectDialogOpen(true);
              setConnForm({
                host: "",
                port: "",
                username: "",
                password: "",
                database: "",
                url: "",
                token: ""
              });
              setConnSuccess(false);
              setEditDialogOpen(false);
            }}
          >
            Edit Connection
          </Button>
        </DialogActions>
      </Dialog>

      {/* ---------- Delete Confirmation Dialog ---------- */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Delete Connection</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete connection <b>{connectionToDelete?.name}</b>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={() => handleConfirmDelete(
            connectionToDelete,
            setExistingConnections,
            setSnack,
            setDeleteConfirmOpen,
            setConnectionToDelete
          )}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editExistingDialogOpen}
        onClose={() => setEditExistingDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Connection</DialogTitle>

        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Host"
                value={editForm.host}
                onChange={(e) => setEditForm({ ...editForm, host: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Port"
                value={editForm.port}
                onChange={(e) => setEditForm({ ...editForm, port: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Username"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={editForm.password}
                onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Database"
                value={editForm.database}
                onChange={(e) => setEditForm({ ...editForm, database: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEditExistingDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => handleUpdateConnection(
            connectionToEdit,
            editForm,
            setExistingConnections,
            setSnack,
            setEditDialogOpen,
            setConnectionToEdit
          )}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}