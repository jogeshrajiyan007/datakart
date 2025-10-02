import React, { useEffect, useMemo, useState } from "react";
import {
  Box, Button, Card, CardContent, Grid, Typography, TextField, Select, MenuItem,
  Snackbar, Alert, Stepper, Step, StepLabel, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FaFlask,FaBoxOpen,FaProjectDiagram } from "react-icons/fa";

import sqliteLogo from "../../assets/sqlite.png";
import mysqlLogo from "../../assets/mysql.png";
import mssqlLogo from "../../assets/mssql.png";
import postgresLogo from "../../assets/postgresql.png";
import bigqueryLogo from "../../assets/bigquery.png";
import redshiftLogo from "../../assets/redshift.png";
import oracleLogo from "../../assets/oracle.png";
import teradataLogo from "../../assets/teradata.png";
import snowflakeLogo from "../../assets/snowflake.png";

import "../../styles/product-studio.css";

/* Steps */
const STEPS = ["Connect / Upload", "Schema Validation", "Data Quality Checks", "Add to Repository"];

/* Connectors with category */
const ALL_CONNECTORS = [
  { id: "mysql", category: "sql", icon: <img src={mysqlLogo} alt="MySQL" style={{ width: 130, height: 100 }} /> },
  { id: "postgres", category: "sql", icon: <img src={postgresLogo} alt="PostgreSQL" style={{ width: 130, height: 100 }} /> },
  { id: "sqlite", category: "sql", icon: <img src={sqliteLogo} alt="SQLite" style={{ width: 130, height: 100 }} /> },
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
  const [uploadedFile, setUploadedFile] = useState(null);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Connection dialog
  const [connectDialogOpen, setConnectDialogOpen] = useState(false);
  const [connForm, setConnForm] = useState({
    host: "localhost",
    port: "5432",
    username: "user",
    password: "password",
    database: "sample_db"
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
      setUploadedFile(null);
      setConnSuccess(false);
    }
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0] ?? null;
    setUploadedFile(file);
    if (file) setSelectedConnector("upload");
  };

  const canNextStep = useMemo(() => {
    if (activeStep === 0) {
      if (selectedConnector === "upload") return !!uploadedFile;
      if (selectedConnector && selectedConnector !== "upload") return connSuccess;
      return false;
    }
    return true;
  }, [activeStep, selectedConnector, uploadedFile, connSuccess]);

  const onNext = () => setActiveStep((s) => s + 1);
  const onBack = () => setActiveStep((s) => Math.max(s - 1, 0));
  const resetFlow = () => {
    setActiveStep(0);
    setSelectedConnector(null);
    setUploadedFile(null);
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
                    <Box className="upload-block" sx={{ mb: 3 }}>
                      <label htmlFor="file-upload" className="upload-inner">
                        <CloudUploadIcon fontSize="large" />
                        <div>
                          <Typography variant="subtitle1">Upload local dataset</Typography>
                          <Typography variant="body2" color="text.secondary">Supported: .csv, .json, .xlsx, .zip</Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {uploadedFile ? `Selected: ${uploadedFile.name}` : "Click to choose a file"}
                          </Typography>
                        </div>
                      </label>
                      <input id="file-upload" type="file" accept=".csv,.json,.xlsx,.zip" onChange={onFileChange} style={{ display: "none" }} />
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

        {/* ---------- Repository ---------- */}
        {view === "repository" && (
          <Box>
            <Typography variant="h4" sx={{ mb: 2 }}><FaBoxOpen/> Data Product Repository</Typography>
            <Typography variant="body1" sx={{ mb: 6}}>From draft to marketplace – manage pending Data Products with validations, and see all your published products live for others to use.</Typography>

            <Typography variant="h6" sx={{ mb: 4 }}>Published Products (Data Marketplace)</Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              {published.map(p => (
                <Grid item xs={12} sm={6} md={4} key={p.id}>
                  <Card className="repo-card published">
                    <CardContent>
                      <Typography variant="subtitle1">{p.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{p.summary}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" sx={{ mb: 4 }}>Pending Products</Typography>
            <Grid container spacing={2}>
              {pending.map(p => (
                <Grid item xs={12} sm={6} md={4} key={p.id}>
                  <Card className="repo-card pending">
                    <CardContent>
                      <Typography variant="subtitle1">{p.title}</Typography>
                      <Typography variant="body2" color="text.secondary">{p.summary}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* ---------- Pipelines ---------- */}
        {view === "pipelines" && (
          <Box>
            <Typography variant="h4" sx={{ mb: 2 }}><FaProjectDiagram/> Automated Pipelines</Typography>
            <Typography variant="body1">Here you can configure automated pipelines to update your data products in the backend warehouse.</Typography>
            <Card sx={{ p: 3, mt: 3 }}>
              <Typography variant="subtitle1">Pipeline Builder (Coming Soon)</Typography>
              <Typography variant="body2" color="text.secondary">You can schedule, monitor, and manage automated data pipelines here.</Typography>
            </Card>
          </Box>
        )}
      </Box>

      {/* ---------- Connection Dialog ---------- */}
      <Dialog open={connectDialogOpen} onClose={() => setConnectDialogOpen(false)}>
        <DialogTitle>Configure Connection ({selectedConnector})</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: 600 , height:400}}>
          {['Host','Port','Username','Password','Database'].map((field) => (
            <Box key={field} sx={{ display:'flex', flexDirection:'column' }}>
              <Typography variant="caption" sx={{ mb:0.5, fontWeight:500, color:'#555' }}>{field}</Typography>
              <TextField
                type={field==='Password'?'password':'text'}
                value={connForm[field.toLowerCase()]}
                onChange={(e)=>setConnForm({...connForm,[field.toLowerCase()]:e.target.value})}
                variant="outlined"
                size="small"
                fullWidth
              />
            </Box>
          ))}
          {connSuccess && <Typography color="success.main" sx={{ mt: 1 }}>Connection established successfully!</Typography>}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setTestingConn(true);
              setConnSuccess(false);
              setTimeout(() => { setTestingConn(false); setConnSuccess(true); }, 2000);
            }}
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
