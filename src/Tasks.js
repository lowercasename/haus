import axios from "axios";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TaskList from "./List";
import ReminderList from "./components/ReminderList";

export default function Tasks() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URI + "user").then(({ data }) => {
      setUsers(data);
    });
  }, []);

  return (
    <>
      <Box component={Paper}>
        <TaskList type="general" users={users} title="Tasks" />
      </Box>
    </>
  );
}
