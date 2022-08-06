import axios from "axios";
import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import RestaurantIcon from "@mui/icons-material/RestaurantRounded";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import AccountBoxIcon from "@mui/icons-material/AccountBox";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Button from "@mui/material/Button";

import Grid from "@mui/material/Grid";

import { grey, pink, purple, indigo } from "@mui/material/colors";

import TaskList from "./List";
import Recipes from "./Recipes";
import Tasks from "./Tasks";
import Profile from "./Profile";
import { Auth0Provider } from "@auth0/auth0-react";
import ProtectedRoute from "./ProtectedRoute";
import EditableCell from "./components/EditableCell";
import EditableMarkdownField from "./components/EditableMarkdownField";
import AuthenticationButton from "./components/AuthenticationButton";
import { Divider } from "@mui/material";

const formatDate = (date) =>
  new Date(date).toLocaleString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

const ISODate = (date) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000)
    .toISOString()
    .split("T")[0];
};

const addDays = (date, days) => {
  const dateClone = new Date(date);
  return new Date(dateClone.setDate(dateClone.getDate() + days));
};

const getSunday = (date = new Date()) => {
  const previousSunday = new Date();
  previousSunday.setDate(date.getDate() - date.getDay());
  return previousSunday;
};

const FoodPlanTable = () => {
  const [weekStart, setWeekStart] = useState(getSunday());
  const [data, setData] = useState([]);
  const [notes, setNotes] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URI + "user").then(({ data }) => {
      setUsers(data);
    });
  }, []);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URI + "food-plan", {
        params: { date: ISODate(weekStart) },
      })
      .then(({ data }) => {
        // API only sends those days that have data attached to them, so we need
        // to fill out the week
        console.log(data);
        const fullWeek = [...Array(7)].map((a, i) => {
          const ISODateValue = ISODate(addDays(weekStart, i));
          if (!data.some(({ date }) => date?.split("T")[0] === ISODateValue)) {
            return {
              date: ISODateValue,
              breakfast: null,
              lunch: null,
              dinner: null,
            };
          } else {
            return data.find(
              ({ date }) => date?.split("T")[0] === ISODateValue
            );
          }
        });
        setData(fullWeek);
      });
  }, [weekStart]);

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URI + "note", {
        params: { date: ISODate(weekStart) },
      })
      .then(({ data }) => setNotes(data ? data.content : ""));
  }, [weekStart]);

  const handleUpdate = async (e, rowData, key) => {
    const newValue = e.target.value.trim();
    if (newValue === rowData[key]) return true;
    return await axios
      .post(process.env.REACT_APP_API_URI + "food-plan", {
        date: rowData.date,
        [key]: newValue,
      })
      .then((response) => {
        if (response.data.message) {
          const newData = data.map((o) =>
            o.date === rowData.date ? { ...o, [key]: newValue } : o
          );
          setData(newData);
          return true;
        }
        return false;
      })
      .catch((error) => false);
  };

  const handleNotesUpdate = async (newValue) => {
    if (newValue === notes) return true;
    return await axios
      .post(process.env.REACT_APP_API_URI + "note", {
        date: ISODate(weekStart),
        content: newValue,
      })
      .then((response) => {
        if (response.data.message) {
          setNotes(newValue);
          return true;
        }
        return false;
      })
      .catch((error) => false);
  };

  const navigateWeek = (offset) => {
    const newWeekStart = new Date(
      weekStart.setDate(weekStart.getDate() + offset * 7)
    );
    console.log(newWeekStart);
    setWeekStart(newWeekStart);
  };

  return (
    <>
      <TableContainer component={Paper} sx={{ overflowY: "auto" }}>
        <Table
          sx={{ minWidth: 800, tableLayout: "fixed" }}
          aria-label="simple table"
        >
          <colgroup>
            <col />
            <col style={{ backgroundColor: pink[50] }} />
            <col style={{ backgroundColor: purple[50] }} />
            <col style={{ backgroundColor: indigo[50] }} />
          </colgroup>

          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "15%", fontWeight: 700 }}>Day</TableCell>
              <TableCell sx={{ backgroundColor: pink[100], fontWeight: 700 }}>
                🍳 Breakfast
              </TableCell>
              <TableCell sx={{ backgroundColor: purple[100], fontWeight: 700 }}>
                🥗 Lunch
              </TableCell>
              <TableCell sx={{ backgroundColor: indigo[100], fontWeight: 700 }}>
                🍝 Dinner
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.date}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" sx={{ fontWeight: 700 }}>
                  {formatDate(row.date)}
                </TableCell>
                <EditableCell
                  handleUpdate={(e) => handleUpdate(e, row, "breakfast")}
                  content={row.breakfast}
                />
                <EditableCell
                  handleUpdate={(e) => handleUpdate(e, row, "lunch")}
                  content={row.lunch}
                />
                <EditableCell
                  handleUpdate={(e) => handleUpdate(e, row, "dinner")}
                  content={row.dinner}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="contained"
          startIcon={<ChevronLeftIcon />}
          onClick={() => navigateWeek(-1)}
        >
          Previous week
        </Button>
        <Button
          variant="contained"
          endIcon={<ChevronRightIcon />}
          onClick={() => navigateWeek(1)}
        >
          Next week
        </Button>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper sx={{ mt: 2, p: 2 }}>
            <EditableMarkdownField
              content={notes}
              handleUpdate={handleNotesUpdate}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <TaskList
            type="food-task"
            title="To Do List"
            date={weekStart}
            users={users}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TaskList type="shopping" title="Shopping List" date={weekStart} />
        </Grid>
      </Grid>
    </>
  );
};

const drawerWidth = 240;

const theme = createTheme({
  typography: {
    fontFamily: ["Lato", "sans-serif"].join(","),
  },
});

export default function App(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <ListItemButton to="/food-plan" component={Link}>
          <ListItemIcon>
            <RestaurantIcon />
          </ListItemIcon>
          <ListItemText primary={"Food Plan"} />
        </ListItemButton>
        <ListItemButton to="/recipes" component={Link}>
          <ListItemIcon>
            <MenuBookIcon />
          </ListItemIcon>
          <ListItemText primary={"Recipes"} />
        </ListItemButton>
        <ListItemButton to="/tasks" component={Link}>
          <ListItemIcon>
            <TaskAltIcon />
          </ListItemIcon>
          <ListItemText primary={"Tasks"} />
        </ListItemButton>
        <Divider />
        <ListItemButton to="/profile" component={Link}>
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          <ListItemText primary={"Profile"} />
        </ListItemButton>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Auth0Provider
      domain="dev-7udhnrqd.us.auth0.com"
      clientId="eAdu2nUzmlaZ5lAXcWjVp5ztDzQEK8KZ"
      redirectUri={process.env.REACT_APP_AUTH0_REDIRECT_URI}
      cacheLocation="localstorage"
    >
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              backgroundColor: "#9f3c1e",
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              <img
                alt="Icon of a cottage"
                src="/house.png"
                style={{ width: 40, marginRight: "1rem" }}
              />
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1 }}
              >
                Haus
              </Typography>
              <AuthenticationButton />
            </Toolbar>
          </AppBar>
          <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          >
            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
            <Drawer
              container={container}
              variant="temporary"
              open={mobileOpen}
              onClose={handleDrawerToggle}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
              sx={{
                display: { xs: "block", sm: "none" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
            >
              {drawer}
            </Drawer>
            <Drawer
              variant="permanent"
              sx={{
                display: { xs: "none", sm: "block" },
                "& .MuiDrawer-paper": {
                  boxSizing: "border-box",
                  width: drawerWidth,
                },
              }}
              open
            >
              {drawer}
            </Drawer>
          </Box>
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              minHeight: "100vh",
              backgroundColor: grey[100],
              width: "100%",
            }}
          >
            <Toolbar />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <h1>Welcome to Haus!</h1>
                  </>
                }
              />
              <Route path="/food-plan" element={<ProtectedRoute />}>
                <Route path="/food-plan" element={<FoodPlanTable />} />
              </Route>
              <Route path="/recipes" element={<ProtectedRoute />}>
                <Route path="/recipes" element={<Recipes />} />
              </Route>
              <Route path="/tasks" element={<ProtectedRoute />}>
                <Route path="/tasks" element={<Tasks />} />
              </Route>
              <Route path="/profile" element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
              </Route>
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </Auth0Provider>
  );
}
