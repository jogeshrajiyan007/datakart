import React, { useMemo } from 'react';
import {
  Box, Button, Typography, Stepper, Step, StepLabel
} from "@mui/material";
import { AnimatePresence } from "framer-motion";
import { FaFlask } from "react-icons/fa";

import StepMotion from "./productUtils/StepMotion";
import DataSourceConnector from "./productUtils/DataSourceConnector";
import { STEPS, canNextStep } from "./productUtils/productStudioHelpers";

const CreateDataProduct = ({
  // State
  activeStep,
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
  setActiveStep,
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
  setConnStatusExisting,
  
  // Handlers
  handleToggleConnection
}) => {
  const handleNext = () => setActiveStep((s) => s + 1);
  const handleBack = () => setActiveStep((s) => Math.max(s - 1, 0));

  const canProceed = useMemo(() => 
    canNextStep(activeStep, selectedConnectors, uploadedFiles, connStatusNew),
    [activeStep, selectedConnectors, uploadedFiles, connStatusNew]
  );

  const onSelectConnector = (
    id,
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
  ) => {
    const isAlreadyConnected = connStatusNew[id];
    const isAlreadySelected = selectedConnectors.includes(id);

    if (isAlreadyConnected) {
      setSelectedConnectorForEdit(id);
      setEditDialogOpen(true);

      const recentConn = existingConnections.find(
        conn => conn.name === id && recentlyAddedConnections.includes(conn.connector_id)
      );
      if (recentConn) {
        setCurrentConnectorId(recentConn.connector_id);
      }
    } else if (isAlreadySelected) {
      setSelectedConnectors((prev) => prev.filter((c) => c !== id));
    } else {
      setCurrentConnector(id);
      setCurrentConnectorId(null);
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

      setSelectedConnectors((prev) => [...prev, id]);
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
        <FaFlask /> Create your Data Product
      </Typography>
      <Typography variant="body1" sx={{ mb: 6 }}>
        From raw data to actionable insights – build custom Data Products with just a few clicks.
      </Typography>
      
      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {STEPS.map((s) => (
          <Step key={s}>
            <StepLabel>{s}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <AnimatePresence mode="wait">
        {activeStep === 0 && (
          <StepMotion>
            <DataSourceConnector
              // State
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
              
              // Handlers
              handleToggleConnection={handleToggleConnection}
              onSelectConnector={onSelectConnector}
            />
          </StepMotion>
        )}

        {/* Add other steps here as needed */}
        {activeStep > 0 && activeStep < STEPS.length && (
          <StepMotion>
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h5">
                Step {activeStep + 1}: {STEPS[activeStep]}
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                This step is under development.
              </Typography>
            </Box>
          </StepMotion>
        )}
      </AnimatePresence>

      {/* Step Actions */}
      <Box className="step-actions" sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button type="button" onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>
        
        <Box sx={{ flex: 1 }} />
        
        {activeStep < STEPS.length - 1 ? (
          <Button type="button" variant="contained" onClick={handleNext} disabled={!canProceed}>
            Next
          </Button>
        ) : (
          <Button type="button" variant="contained" color="success">
            Finish
          </Button>
        )}
      </Box>
    </>
  );
};

export default CreateDataProduct;