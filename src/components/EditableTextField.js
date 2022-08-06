import React, { useState } from "react";
import {
  Stack,
  IconButton,
  TextField,
  Snackbar,
  Typography,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/EditRounded";
import DoneIcon from "@mui/icons-material/DoneRounded";
import Alert from "./Alert";

const EditableTextField = ({ label, content, handleUpdate, fieldName }) => {
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editValue, setEditValue] = useState(content || "");
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setEditValue(e.currentTarget.value);
  };
  const handleChildUpdate = async (e) => {
    setUpdating(true);
    const haveUpdated = await handleUpdate(fieldName, editValue);
    if (haveUpdated) {
      setUpdating(false);
      setEditing(false);
    } else {
      setUpdating(false);
      setError("There has been an error saving your changes.");
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setError(false);
  };

  const handleToggleEdit = (e) => {
    if (editing) {
      handleChildUpdate(e);
    } else {
      setEditValue(content);
      setEditing(true);
    }
  };

  return (
    <>
      <Stack
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ maxWidth: 800 }}
      >
        {editing ? (
          <TextField
            autoFocus={true}
            label={label}
            value={editValue}
            onChange={handleChange}
            sx={{ flex: 1 }}
            variant="outlined"
          />
        ) : (
          <Typography>
            <strong>{label}:</strong>{" "}
            {content || <span style={{color: 'grey'}}>Edit to set</span>}
          </Typography>
        )}
        {updating ? (
          <CircularProgress size={32}/>
        ) : (
          <IconButton
            color="primary"
            aria-label="edit"
            onClick={handleToggleEdit}
            sx={{ flex: "none" }}
          >
            {editing ? <DoneIcon /> : <EditIcon />}
          </IconButton>
        )}
      </Stack>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditableTextField;
