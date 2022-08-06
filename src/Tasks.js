import axios from "axios";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TaskList from "./List";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URI + "user")
      .then(({ data }) => {
        setUsers(data);
      });
  }, []);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URI + "task", { params: {
      type: "general",
    }}).then(({ data }) => {
      setTasks(data);
    });
  }, []);

  return (
    <Box component={Paper}>
      <TaskList type="general" tasks={tasks} users={users} title="Tasks" />
    </Box>
  );
}
