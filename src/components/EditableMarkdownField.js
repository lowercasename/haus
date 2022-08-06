import React, { useState } from "react";
import {
  Stack,
  Typography,
  IconButton,
  TextField,
  Snackbar,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import EditIcon from "@mui/icons-material/EditRounded";
import DoneIcon from "@mui/icons-material/DoneRounded";
import Alert from "./Alert";

const EditableMarkdownField = ({ content, handleUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(content || "");
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setEditValue(e.currentTarget.value);
  };
  const handleChildUpdate = async (e) => {
    const haveUpdated = await handleUpdate(editValue);
    if (haveUpdated) {
      setEditing(false);
    } else {
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
      setEditing(false);
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
        sx={{ mb: 2 }}
      >
        <Typography variant="h6" component="div">
          Notes
        </Typography>
        <IconButton
          color="primary"
          aria-label="edit"
          onClick={handleToggleEdit}
        >
          {editing ? <DoneIcon /> : <EditIcon />}
        </IconButton>
      </Stack>
      {editing ? (
        <TextField
          autoFocus={true}
          label="Add notes"
          multiline
          value={editValue}
          onChange={handleChange}
          sx={{ width: "100%" }}
        />
      ) : (
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
          {content}
        </ReactMarkdown>
      )}
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

export default EditableMarkdownField;
