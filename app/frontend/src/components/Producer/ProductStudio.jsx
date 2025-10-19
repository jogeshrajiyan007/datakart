import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Button, Card, CardContent, Grid, Typography, TextField, Select, MenuItem,
  Snackbar, Alert, Stepper, Step, StepLabel, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress, RadioGroup, FormControlLabel, Radio, Chip, LinearProgress
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FaFlask, FaBoxOpen, FaProjectDiagram } from "react-icons/fa";

import sqliteLogo from "../../assets/sqlite.png";
import mysqlLogo from "../../assets/mysql.png";
import mssqlLogo from "../../assets/mssql.png";
import postgresLogo from "../../assets/postgresql.png";
import bigqueryLogo from "../../assets/bigquery.png";
import redshiftLogo from "../../assets/redshift.png";
import oracleLogo from "../../assets/oracle.png";
import teradataLogo from "../../assets/teradata.png";
import snowflakeLogo from "../../assets/snowflake.png";
import AxiosInstance from '../../utils/AxiosInstance';

import "../../styles/product-studio.css";

/* Steps */
const STEPS = ["Connect / Upload", "Schema Validation", "Data Quality Checks", "Add to Repository"];

/* Connectors with category */
const ALL_CONNECTORS = [
  { id: "mysql", category: "sql", icon: <img src={mysqlLogo} alt="MySQL" style={{ width: 130, height: 100 }} /> },
  { id: "postgres", category: "sql", icon: <img src={postgresLogo} alt="PostgreSQL" style={{ width: 130, height: 100 }} /> },
  { id: "oracle", category: "sql", icon: <img src={oracleLogo} alt="Oracle" style={{ width: 130, height: 100 }} /> },
  { id: "mssql", category: "sql", icon: <img src={mssqlLogo} alt="MSSQL" style={{ width: 130, height: 100 }} /> },
  { id: "teradata", category: "sql", icon: <img src={teradataLogo} alt="Teradata" style={{ width: 130, height: 100 }} /> },
  { id: "redshift", category: "cloud", icon: <img src={redshiftLogo} alt="Redshift" style={{ width: 130, height: 100 }} /> },
  { id: "bigquery", category: "cloud", icon: <img src={bigqueryLogo} alt="BigQuery" style={{ width: 130, height: 100 }} /> },
  { id: "snowflake", category: "cloud", icon: <img src={snowflakeLogo} alt="Snowflake" style={{ width: 130, height: 100 }} /> },
];

/* Dummy Schema */
const INITIAL_SCHEMA = [
  { name: "customer_id", type: "INTEGER", include: true },
  { name: "name", type: "STRING", include: true },
  { name: "email", type: "STRING", include: true },
  { name: "purchase_amount", type: "FLOAT", include: true },
  { name: "purchase_date", type: "DATE", include: true },
];

/* Sample Repository */
const SAMPLE_PUBLISHED = [
  { id: 1, title: "Customer Purchases", summary: "Published: daily purchases", status: "published" },
  { id: 2, title: "Product Catalog", summary: "Published: product metadata", status: "published" },
];
const SAMPLE_PENDING = [
  { id: 101, title: "Internal Sales Enrichment", summary: "Pending: awaiting QA", status: "pending" },
];

/* ---------- StepMotion Component ---------- */
const StepMotion = ({ children }) => (
  <motion.div
    key={children?.key ?? "step"}
    initial={{ opacity: 0, y: 8 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.35 }}
  >
    {children}
  </motion.div>
);

export default function ProductStudio() {
  const [activeStep, setActiveStep] = useState(0);
  const [view, setView] = useState("studio"); // studio | repository | pipelines

  // Connect / Upload
  const [selectedConnector, setSelectedConnector] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({}); 

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Connection dialog
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
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
  const [connSuccess, setConnSuccess] = useState(false);

  // Schema
  const [schema, setSchema] = useState(INITIAL_SCHEMA);

  // Product form
  const [productForm, setProductForm] = useState({
    domain: "",
    name: "",
    summary: "",
    description: "",
    owningTeam: "",
    classification: "",
  });

  // Repository
  const [published, setPublished] = useState(SAMPLE_PUBLISHED);
  const [pending, setPending] = useState(SAMPLE_PENDING);

  // UI
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  /* ---------- Helpers ---------- */
  const selectable = (id) => selectedConnector === id ? "selected" : "";

  const onSelectConnector = (c) => {
    if (c === "upload") {
      setSelectedConnector("upload");
      setConnSuccess(false);
    } else {
      setSelectedConnector(c);
      setUploadedFiles([]);
      setConnSuccess(false);
      setIsLocal("cloud");
      setConnForm({ host: "", port: "", username: "", password: "", database: "", url: "", token: "" });
    }
  };

  const onFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []); 
    if (selectedFiles.length > 0) {
      setUploadedFiles((prev) => [...prev, ...selectedFiles]);
      setSelectedConnector("upload");
    }
  };

  const canNextStep = useMemo(() => {
    if (activeStep === 0) {
      if (selectedConnector === "upload") return !!uploadedFiles;
      if (selectedConnector && selectedConnector !== "upload") return connSuccess;
      return false;
    }
    return true;
  }, [activeStep, selectedConnector, uploadedFiles, connSuccess]);

  const onNext = () => setActiveStep((s) => s + 1);
  const onBack = () => setActiveStep((s) => Math.max(s - 1, 0));
  const resetFlow = () => {
    setActiveStep(0);
    setSelectedConnector(null);
    setUploadedFiles([]);
    setConnSuccess(false);
    setSchema(INITIAL_SCHEMA.map((c) => ({ ...c })));
    setProductForm({ domain: "", name: "", summary: "", description: "", owningTeam: "", classification: "" });
  };

  const onAddProduct = () => {
    const newProd = {
      id: Date.now(),
      title: productForm.name || "Untitled Product",
      summary: productForm.summary || `${productForm.domain} dataset`,
      status: "pending",
    };
    setPending((p) => [newProd, ...p]);
    setSnack({ open: true, message: "Product added to repository (Pending)", severity: "success" });
    resetFlow();
  };

  const filteredConnectors = ALL_CONNECTORS.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? c.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const testConnection = async () => {
    setTestingConn(true);
    setConnSuccess(false);
    try {
      if (isLocal === "cloud") {
        // Simulate cloud connection test
        await new Promise((r) => setTimeout(r, 1500));
        setConnSuccess(true);
      } else {
        const res = await AxiosInstance.post("/api/connector/health/", {
          url: connForm.url,
          token: connForm.token,
        });

        console.log("Health check response:", res.data);

        if (res.status === 200) {
          setConnSuccess(true);
          setSnack({ open: true, message: "Connection successful!", severity: "success" });
        } else {
          throw new Error("Non-200 response");
        }
      }
    } catch (err) {
      console.error("Connection test failed:", err);
      setConnSuccess(false);
      setSnack({ open: true, message: "Connection failed", severity: "error" });
    } finally {
      setTestingConn(false);
    }
  };

  const handleDownloadConnector = async () => {
    setTestingConn(true);
    try {
      // DEBUG: show what AxiosInstance has for baseURL
      console.log("AxiosInstance.baseURL =", AxiosInstance?.defaults?.baseURL);
      const endpoint = "/api/connector/download/";
      // If AxiosInstance has no baseURL, fall back to env var absolute URL
      const urlToCall =
        AxiosInstance?.defaults?.baseURL && AxiosInstance.defaults.baseURL.length
          ? endpoint
          : `${import.meta.env.VITE_API_URL?.replace(/\/$/, "")}${endpoint}`;

      console.log("Calling download URL:", urlToCall);

      const response = await AxiosInstance.get(urlToCall, {
        responseType: "blob",
        // withCredentials required if you rely on cookies/session auth
        withCredentials: true,
        // optional small timeout for visibility
        timeout: 20000,
      });

      console.log("Download response (axios):", response);

      // If server returned JSON error in blob form, try to detect it:
      // (some backends return JSON error with 200 - detect content-type)
      const contentType = response.headers["content-type"] || "";
      if (!contentType.includes("application/zip") && !contentType.includes("application/octet-stream")) {
        console.warn("Unexpected content-type:", contentType);
      }

      // Extract filename from Content-Disposition if present
      const disposition = response.headers["content-disposition"] || "";
      let filename = "local_connector.zip";
      if (disposition && disposition.includes("filename=")) {
        filename = disposition.split("filename=")[1].replace(/["']/g, "").trim();
      }

      // Trigger browser download
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setSnack({ open: true, message: "Connector downloaded", severity: "success" });
    } catch (err) {
      console.error("Download error (detailed):", err);
      // Axios error shapes: err.response (server reply), err.request (no reply), err.message
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Headers:", err.response.headers);
        // if server sent JSON error body, log text
        try {
          // attempt to read blob as text for diagnostics
          const reader = new FileReader();
          reader.onload = () => { console.error("Response body (text):", reader.result); };
          if (err.response.data) reader.readAsText(err.response.data);
        } catch (e) { /* ignore */ }
        setSnack({ open: true, message: `Download failed: ${err.response.status}`, severity: "error" });
      } else if (err.request) {
        console.error("No response received. Request:", err.request);
        setSnack({ open: true, message: "No response from server (network/CORS)", severity: "error" });
      } else {
        setSnack({ open: true, message: `Error: ${err.message}`, severity: "error" });
      }
    } finally {
      setTestingConn(false);
    }
  };
  const handleFirebaseUpload = async () => {
    if (!uploadedFiles.length) return;

    const formData = new FormData();
    uploadedFiles.forEach(file => formData.append("file", file));

    try {
      const res = await AxiosInstance.post("/api/product/uploadFile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Uploaded:", res.data);
      setSnack({ open: true, message: "Uploaded to Firebase!", severity: "success" });
    } catch (err) {
      console.error("Upload failed:", err);
      setSnack({ open: true, message: "Firebase upload failed", severity: "error" });
    }
  };




  /* ---------- Render ---------- */
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
          <>
            <Typography variant="h4" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <FaFlask /> Create your Data Product
            </Typography>
            <Typography variant="body1" sx={{ mb: 6}}>From raw data to actionable insights – build custom Data Products with just a few clicks.</Typography>
            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
              {STEPS.map((s) => (<Step key={s}><StepLabel>{s}</StepLabel></Step>))}
            </Stepper>

            <AnimatePresence mode="wait">
              {activeStep === 0 && (
                <StepMotion>
                  <Box component="form" onSubmit={(e) => e.preventDefault()}>

                    {/* File upload */}
                    <Box className="upload-block" sx={{ mb: 3 , p:3}} 
                    onDragOver={(e) => e.preventDefault()} 
                    onDrop={(e)=>{
                      e.preventDefault();
                      const droppedFiles = Array.from(e.dataTransfer.files);
                      if (droppedFiles.length > 0){
                        setUploadedFiles((prev) => [...prev, ...droppedFiles]);
                        setSelectedConnector("upload");
                      }
                    }}>
                      <label htmlFor="file-upload" className="upload-inner">
                        <CloudUploadIcon fontSize="large" />
                        <div>
                          <Typography variant="subtitle1">Upload local dataset</Typography>
                          <Typography variant="body2" color="text.secondary">Supported: .csv, .xlsx, .zip</Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                          </Typography>
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
                        style={{ display: "none" }} />
                      <Button variant="contained" color="primary" onClick={handleFirebaseUpload}>
                        Upload Files
                      </Button>

                    </Box>

                    {/* Connectors */}
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

                    <Grid container spacing={2}>
                      {filteredConnectors.map((c) => (
                        <Grid item xs={6} sm={3} key={c.id}>
                          <Card className={`connector-card ${selectable(c.id)}`} onClick={() => onSelectConnector(c.id)}
                                sx={{ cursor: 'pointer', transition: 'all 0.2s', '&:hover': { transform: 'scale(1.05)', boxShadow: 6 } }}>
                            <CardContent sx={{ display: "flex", flexDirection: 'column', alignItems: "center", gap: 1 }}>
                              <Box sx={{ fontSize: 28 }}>{c.icon}</Box>
                              <Typography variant="subtitle2">{c.id}</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    <Box className="step-actions" sx={{ mt: 3 }}>
                      <Button type="button" onClick={onBack} disabled>Back</Button>
                      <Box sx={{ flex: 1 }} />
                      <Button type="button" variant="outlined" onClick={resetFlow} sx={{ mr: 1 }}>Reset</Button>
                      {selectedConnector && selectedConnector !== "upload" && (
                        <Button type="button" variant="contained" color="secondary" sx={{ mr: 1 }} onClick={() => setConnectDialogOpen(true)}>Connect</Button>
                      )}
                      <Button type="button" variant="contained" onClick={onNext} disabled={!canNextStep}>Next</Button>
                    </Box>
                  </Box>
                </StepMotion>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Repository and Pipelines rendering Goes Here ------> */}
      </Box>

      {/* ---------- Connection Dialog ---------- */}
      <Dialog open={connectDialogOpen} onClose={() => setConnectDialogOpen(false)}>
        <DialogTitle>Configure Connection ({selectedConnector})</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: 600 , height: "auto" }}>
          {selectedConnector === "mysql" || selectedConnector === "postgres" ? (
            <>
              <RadioGroup row value={isLocal} onChange={(e) => setIsLocal(e.target.value)} sx={{ mb: 2 }}>
                <FormControlLabel value="cloud" control={<Radio />} label="Cloud" />
                <FormControlLabel value="local" control={<Radio />} label="Local" />
              </RadioGroup>

              {isLocal === "local" ? (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleDownloadConnector}
                    sx={{ mb: 2 }}
                  >
                    Download Local Connector
                  </Button>

                  <TextField
                    label="Local Connector URL"
                    size="small"
                    value={connForm.url}
                    onChange={(e)=>setConnForm({...connForm,url:e.target.value})}
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                  <TextField
                    label="API Token"
                    size="small"
                    value={connForm.token}
                    onChange={(e)=>setConnForm({...connForm,token:e.target.value})}
                    fullWidth
                  />
                </>
              ) : (
                ['Host','Port','Username','Password','Database'].map((field) => (
                  <TextField
                    key={field}
                    type={field==='Password'?'password':'text'}
                    label={field}
                    value={connForm[field.toLowerCase()]}
                    onChange={(e)=>setConnForm({...connForm,[field.toLowerCase()]:e.target.value})}
                    size="small"
                    fullWidth
                    sx={{ mb: 1 }}
                  />
                ))
              )}
            </>
          ) : (
            ['Host','Port','Username','Password','Database'].map((field) => (
              <TextField
                key={field}
                type={field==='Password'?'password':'text'}
                label={field}
                value={connForm[field.toLowerCase()]}
                onChange={(e)=>setConnForm({...connForm,[field.toLowerCase()]:e.target.value})}
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
            onClick={testConnection}
            disabled={testingConn}
          >
            {testingConn ? <CircularProgress size={20} /> : "Test Connection"}
          </Button>
          <Button variant="contained" onClick={() => setConnectDialogOpen(false)}>Done</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={() => setSnack({ ...snack, open: false })}>
        <Alert severity={snack.severity}>{snack.message}</Alert>
      </Snackbar>
    </Box>
  );
}
