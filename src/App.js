import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
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
import HomeIcon from "@mui/icons-material/HomeRounded";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EditIcon from "@mui/icons-material/EditRounded";
import DoneIcon from "@mui/icons-material/DoneRounded";
import MenuBookIcon from "@mui/icons-material/MenuBook";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import TextField from "@mui/material/TextField";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

import Button from "@mui/material/Button";

import Grid from "@mui/material/Grid";

import { grey, pink, purple, deepPurple, indigo } from "@mui/material/colors";

import TodoList from "./List";
import Recipes from "./Recipes";
import Tasks from "./Tasks";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const apiUrl = "http://localhost:8088/api/v1/";

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

const getMonday = (date) => {
  const day = date.getDay() || 7; // Get current day number, converting Sun. to 7
  if (day !== 1)
    // Only manipulate the date if it isn't Mon.
    date.setHours(-24 * (day - 1));
  return date;
};

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

const FoodPlanTable = () => {
  const [weekStart, setWeekStart] = useState(getMonday(new Date()));
  const [data, setData] = useState([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    axios
      .get(apiUrl + "week", { params: { date: ISODate(weekStart) } })
      .then(({ data }) => {
        // API only sends those days that have data attached to them, so we need
        // to fill out the week
        const fullWeek = [...Array(7)].map((a, i) => {
          const ISODateValue = ISODate(addDays(weekStart, i));
          console.log(ISODateValue);
          if (!data.some(({ date }) => date === ISODateValue)) {
            return {
              date: ISODateValue,
              breakfast: null,
              lunch: null,
              dinner: null,
            };
          } else {
            return data.find(({ date }) => date === ISODateValue);
          }
        });
        setData(fullWeek);
      });
  }, [weekStart]);

  useEffect(() => {
    axios
      .get(apiUrl + "notes", { params: { date: ISODate(weekStart) } })
      .then(({ data }) => setNotes(data ? data.content : ""));
  }, [weekStart]);

  const handleUpdate = async (e, rowData, key) => {
    const newValue = e.currentTarget.value.trim();
    if (newValue === rowData[key]) return true;
    return await axios
      .post(apiUrl + "day", { date: rowData.date, [key]: newValue })
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
      .post(apiUrl + "notes", { date: ISODate(weekStart), content: newValue })
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

  // const StyledTableRow = styled(TableRow)(({ theme }) => ({
  //   '&:nth-of-type(odd)': {
  //     backgroundColor: theme.palette.action.hover,
  //   },
  //   // hide last border
  //   '&:last-child td, &:last-child th': {
  //     border: 0,
  //   },
  // }));

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
          <TodoList type="todo" title="To Do List" date={weekStart} />
        </Grid>
        <Grid item xs={12} md={6}>
          <TodoList type="shopping" title="Shopping List" date={weekStart} />
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
        {/* {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => ( */}
        {/*   <ListItem button key={text}> */}
        {/*     <ListItemIcon> */}
        {/*       {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
        {/*     </ListItemIcon> */}
        {/*     <ListItemText primary={text} /> */}
        {/*   </ListItem> */}
        {/* ))} */}
        {/* </List> */}
        {/* <Divider /> */}
        {/* <List> */}
        {/* {['All mail', 'Trash', 'Spam'].map((text, index) => ( */}
        {/*   <ListItem button key={text}> */}
        {/*     <ListItemIcon> */}
        {/*       {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
        {/*     </ListItemIcon> */}
        {/*     <ListItemText primary={text} /> */}
        {/*   </ListItem> */}
        {/* ))} */}
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const LoginButton = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();

    return (
      isAuthenticated === false && (
        <button onClick={() => loginWithRedirect()}>Log In</button>
      )
    );
  };

  const LogoutButton = () => {
    const { logout, isAuthenticated } = useAuth0();

    return (
      isAuthenticated && (
        <button onClick={() => logout({ returnTo: window.location.origin })}>
          Log Out
        </button>
      )
    );
  };

  const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
      return <div>Loading ...</div>;
    }

    return (
      isAuthenticated && (
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )
    );
  };

  return (
    <Auth0Provider
      domain="dev-7udhnrqd.us.auth0.com"
      clientId="eAdu2nUzmlaZ5lAXcWjVp5ztDzQEK8KZ"
      redirectUri={"http://localhost:3000"}
    >
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
              <HomeIcon sx={{ mr: 1 }} />
              <Typography variant="h6" noWrap component="div">
                Haus
              </Typography>
              <LoginButton />
              <LogoutButton />
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
              width: { sm: `calc(100% - ${drawerWidth}px)` },
              minHeight: "100vh",
              backgroundColor: grey[100],
              width: "100%",
            }}
          >
            <Toolbar />
            <Routes>
              <Route path="/" element={<Profile />} />
              <Route path="/food-plan" element={<FoodPlanTable />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/tasks" element={<Tasks />} />
            </Routes>
          </Box>
        </Box>
      </ThemeProvider>
    </Auth0Provider>
  );
}
