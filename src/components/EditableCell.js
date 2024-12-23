import React, { useState } from "react";
import { TableCell, TextField, Snackbar } from "@mui/material";
import Alert from "./Alert";

const EditableCell = ({ content, handleUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(content || "");
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setEditValue(e.currentTarget.value);
  };
  const handleChildUpdate = async (e) => {
    const haveUpdated = await handleUpdate(e);
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

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleChildUpdate(e);
    }
  };

  return (
    <>
      <TableCell onClick={() => editing === false && setEditing(true)}>
        {editing ? (
          <TextField
            autoFocus={true}
            label="Type here"
            multiline
            maxRows={4}
            value={editValue}
            onChange={handleChange}
            onBlur={handleChildUpdate}
            onKeyPress={handleKeyPress}
            sx={{ width: "100%" }}
          />
        ) : (
          content
        )}
      </TableCell>
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

export default EditableCell;
