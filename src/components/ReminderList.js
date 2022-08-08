import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Grid,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import axios from "axios";

const ReminderList = () => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URI + "reminder").then(({ data }) => {
      setItems(data);
    });
  }, []);

  return (
    <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
      <Typography sx={{ mb: 2 }} variant="h6" component="div">
        Reminders
      </Typography>
      <Grid container spacing={2}>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Label"
          />
          <FormControlLabel disabled control={<Checkbox />} label="Disabled" />
        </FormGroup>
      </Grid>
    </Paper>
  );
};

export default ReminderList;
