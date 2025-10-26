import AxiosInstance from '@/utils/AxiosInstance';

/* Steps */
export const STEPS = ["Connect / Upload", "Data Exploration & Profiling", "Data Transformation", "Save & Export"];

/* Connectors with category */
export const ALL_CONNECTORS = [
  { id: "mysql", category: "sql", icon: "mysql" },
  { id: "postgres", category: "sql", icon: "postgres" },
  { id: "oracle", category: "sql", icon: "oracle" },
  { id: "mssql", category: "sql", icon: "mssql" },
  { id: "teradata", category: "sql", icon: "teradata" },
  { id: "redshift", category: "cloud", icon: "redshift" },
  { id: "bigquery", category: "cloud", icon: "bigquery" },
  { id: "snowflake", category: "cloud", icon: "snowflake" },
];

/* Dummy Schema */
export const INITIAL_SCHEMA = [
  { name: "customer_id", type: "INTEGER", include: true },
  { name: "name", type: "STRING", include: true },
  { name: "email", type: "STRING", include: true },
  { name: "purchase_amount", type: "FLOAT", include: true },
  { name: "purchase_date", type: "DATE", include: true },
];

/* Sample Repository */
export const SAMPLE_PUBLISHED = [
  { id: 1, title: "Customer Purchases", summary: "Published: daily purchases", status: "published" },
  { id: 2, title: "Product Catalog", summary: "Published: product metadata", status: "published" },
];

export const SAMPLE_PENDING = [
  { id: 101, title: "Internal Sales Enrichment", summary: "Pending: awaiting QA", status: "pending" },
];

/* Connection Management Functions */
export const testConnection = async (currentConnector, connForm, isLocal, setTestingConn, setConnSuccess, setConnStatusNew, setSnack) => {
  setTestingConn(true);
  setConnSuccess(false);

  try {
    if (isLocal === "cloud") {
      // Simulate cloud connection test
      await new Promise((r) => setTimeout(r, 1500));
      setConnSuccess(true);
      setConnStatusNew((prev) => ({
        ...prev,
        [currentConnector]: true,
      }));
      setSnack({ open: true, message: "Cloud connection successful!", severity: "success" });
    } else {
      const res = await AxiosInstance.post("/api/connector/health/", {
        url: connForm.url,
        token: connForm.token,
      });

      if (res.status === 200) {
        setConnSuccess(true);
        setConnStatusNew((prev) => ({
          ...prev,
          [currentConnector]: true,
        }));
        setSnack({ open: true, message: "Local connection successful!", severity: "success" });
      } else {
        throw new Error("Non-200 response");
      }
    }
  } catch (err) {
    console.error("Connection test failed:", err);
    setConnSuccess(false);
    setConnStatusNew((prev) => ({
      ...prev,
      [currentConnector]: false,
    }));
    setSnack({ open: true, message: "Connection failed", severity: "error" });
  } finally {
    setTestingConn(false);
  }
};

export const handleDownloadConnector = async (setTestingConn, setSnack) => {
  setTestingConn(true);
  try {
    console.log("AxiosInstance.baseURL =", AxiosInstance?.defaults?.baseURL);
    const endpoint = "/api/connector/download/";
    const urlToCall =
      AxiosInstance?.defaults?.baseURL && AxiosInstance.defaults.baseURL.length
        ? endpoint
        : `${import.meta.env.VITE_API_URL?.replace(/\/$/, "")}${endpoint}`;

    console.log("Calling download URL:", urlToCall);

    const response = await AxiosInstance.get(urlToCall, {
      responseType: "blob",
      withCredentials: true,
      timeout: 20000,
    });

    console.log("Download response (axios):", response);

    const contentType = response.headers["content-type"] || "";
    if (!contentType.includes("application/zip") && !contentType.includes("application/octet-stream")) {
      console.warn("Unexpected content-type:", contentType);
    }

    const disposition = response.headers["content-disposition"] || "";
    let filename = "local_connector.zip";
    if (disposition && disposition.includes("filename=")) {
      filename = disposition.split("filename=")[1].replace(/["']/g, "").trim();
    }

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
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Headers:", err.response.headers);
      try {
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

export const handleFirebaseUpload = async (uploadedFiles, setSnack) => {
  if (!uploadedFiles.length) return;

  const formData = new FormData();
  uploadedFiles.forEach(file => formData.append("file", file));

  try {
    const res = await AxiosInstance.post("/api/product/source/uploadFile/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Uploaded:", res.data);
    setSnack({ open: true, message: "Upload completed successfully!", severity: "success" });
  } catch (err) {
    console.error("Upload failed:", err);
    setSnack({ open: true, message: "Upload Failed!", severity: "error" });
  }
};

export const saveConnection = async (
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
) => {
  try {
    if (!connSuccess || !currentConnector) {
      setSnack({ open: true, message: "Please test the connection before saving", severity: "warning" });
      return;
    }

    const exists = existingConnections.some(conn =>
      conn.host === connForm.host &&
      conn.name === currentConnector &&
      conn.username === connForm.username &&
      conn.database === connForm.database &&
      conn.port === connForm.port
    );
    if (exists) {
      setSnack({ open: true, message: "Connection already exists", severity: "warning" });
      return;
    }

    const payload = {
      name: currentConnector,
      host: connForm.host,
      port: connForm.port,
      username: connForm.username,
      password: connForm.password,
      database: connForm.database,
    };

    const res = await AxiosInstance.post("/api/product/source/connections/", payload);

    if (res.status === 201 || res.status === 200) {
      setSnack({ open: true, message: "Connection saved successfully!", severity: "success" });
      const savedConn = res.data;

      setCurrentConnectorId(savedConn.connector_id);
      setConnStatusNew((prev) => ({ ...prev, [currentConnector]: true }));
      setExistingConnections((prev) => [...prev, savedConn]);
      setRecentlyAddedConnections(prev => [...prev, savedConn.connector_id]);
      setConnStatusExisting((prev) => ({ ...prev, [savedConn.connector_id]: true }));
      setConnectDialogOpen(false);
    } else {
      throw new Error("Failed to save connection");
    }
  } catch (err) {
    console.error("Error saving connection:", err);
    setSnack({ open: true, message: "Failed to save connection", severity: "error" });
  }
};

export const handleConfirmDelete = async (connectionToDelete, setExistingConnections, setSnack, setDeleteConfirmOpen, setConnectionToDelete) => {
  if (!connectionToDelete || !connectionToDelete.connector_id) {
    console.error("No connection selected for deletion", connectionToDelete);
    setSnack({ open: true, message: "Delete failed: no connection selected", severity: "error" });
    return;
  }

  try {
    const { connector_id } = connectionToDelete;
    const res = await AxiosInstance.delete(`/api/product/source/connections/${connector_id}/`);

    if (res.status === 204) {
      setExistingConnections(prev =>
        prev.filter(conn => conn.connector_id !== connector_id)
      );
      setSnack({ open: true, message: "Connection deleted successfully", severity: "success" });
    } else {
      setSnack({ open: true, message: "Failed to delete connection", severity: "error" });
    }
  } catch (err) {
    console.error("Delete failed:", err);
    setSnack({ open: true, message: "Error deleting connection", severity: "error" });
  } finally {
    setDeleteConfirmOpen(false);
    setConnectionToDelete(null);
  }
};

export const handleUpdateConnection = async (connectionToEdit, editForm, setExistingConnections, setSnack, setEditDialogOpen, setConnectionToEdit) => {
  if (!connectionToEdit || !connectionToEdit.connector_id) {
    console.error("No connection selected for update", connectionToEdit);
    setSnack({ open: true, message: "Update failed: no connection selected", severity: "error" });
    return;
  }

  try {
    const { connector_id } = connectionToEdit;
    const res = await AxiosInstance.patch(`/api/product/source/connections/${connector_id}/`, editForm);

    if (res.status === 200) {
      setExistingConnections(prev =>
        prev.map(conn =>
          conn.connector_id === connector_id ? res.data : conn
        )
      );
      setSnack({ open: true, message: "Connection updated successfully", severity: "success" });
      setEditDialogOpen(false);
      setConnectionToEdit(null);
    } else {
      setSnack({ open: true, message: "Failed to update connection", severity: "error" });
    }
  } catch (err) {
    console.error("Update failed:", err);
    setSnack({ open: true, message: "Error updating connection", severity: "error" });
  }
};

export const handleToggleConnection = async (conn, connStatusExisting, setSnack, setConnStatusExisting) => {
  const isConnected = connStatusExisting[conn.connector_id];

  if (!isConnected) {
    setSnack({ open: true, message: `Connecting to ${conn.name}...`, severity: "info" });
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setConnStatusExisting((prev) => ({ ...prev, [conn.connector_id]: true }));
      setSnack({ open: true, message: `${conn.name} is now in use!`, severity: "success" });
    } catch (err) {
      setSnack({ open: true, message: `Failed to connect ${conn.name}`, severity: "error" });
    }
  } else {
    setSnack({ open: true, message: `Disconnecting ${conn.name}...`, severity: "info" });
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setConnStatusExisting((prev) => ({ ...prev, [conn.connector_id]: false }));
      setSnack({ open: true, message: `${conn.name} disconnected`, severity: "info" });
    } catch (err) {
      setSnack({ open: true, message: `Failed to disconnect ${conn.name}`, severity: "error" });
    }
  }
};

export const canNextStep = (activeStep, selectedConnectors, uploadedFiles, connStatusNew) => {
  if (activeStep === 0) {
    const anyUpload = uploadedFiles.length > 0;
    const anySelected = selectedConnectors.length > 0;
    const allConnectionsOk = anySelected && selectedConnectors.every(c => connStatusNew[c]);
    return anyUpload || allConnectionsOk;
  }
  return true;
};

