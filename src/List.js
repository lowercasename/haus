import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PersonIcon from "@mui/icons-material/Person";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Chip from "@mui/material/Chip";

import axios from "axios";
import { ButtonBase } from "@mui/material";
const apiUrl = "http://localhost:8088/api/v1/";

const ISODate = (date) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60 * 1000)
    .toISOString()
    .split("T")[0];
};

const PersonMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSelect = (e) => {
    console.log(e.target.textContent);
    const person = e.target.textContent;
    if (!person || person === "None") {
    }
    handleClose();
  };
  return (
    <div>
      <ButtonBase
        variant="text"
        sx={{ minHeight: 0, minWidth: 0, padding: 0 }}
        aria-label="select person"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Chip
          label="Chip Filled"
          icon={<PersonIcon />}
          sx={{ cursor: "pointer" }}
        />
      </ButtonBase>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleSelect}>None</MenuItem>
        <MenuItem onClick={handleSelect}>Raphael</MenuItem>
        <MenuItem onClick={handleSelect}>Harriet</MenuItem>
      </Menu>
    </div>
  );
};

export default function TodoList({ title, date, type }) {
  const [checked, setChecked] = useState([]);
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleToggle = (item) => () => {
    const currentIndex = checked.indexOf(item.id);
    const newChecked = [...checked];

    console.log(item);

    axios
      .put(apiUrl + type, { id: item.id, done: currentIndex === -1 })
      .then(({ data }) => {
        if (data.message) {
          console.log(data);
          if (currentIndex === -1) {
            newChecked.push(item.id);
          } else {
            newChecked.splice(currentIndex, 1);
          }

          console.log(newChecked);
          setChecked(newChecked);
        }
      })
      .catch((error) => console.log(error.response));
  };

  const isChecked = (item) => checked.indexOf(item.id) !== -1;

  useEffect(() => {
    axios
      .get(apiUrl + type, { params: { date: ISODate(date) } })
      .then(({ data }) => {
        setItems(data);
        setChecked(
          data.reduce((acc, o) => (o.done ? [...acc, o.id] : acc), [])
        );
      });
  }, [date]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      axios
        .post(apiUrl + type, {
          content: inputValue,
          done: false,
          date: ISODate(date),
        })
        .then(({ data }) => {
          if (data.message) {
            setInputValue("");
            setItems([
              ...items,
              { content: inputValue, done: false, id: data.id },
            ]);
          }
        })
        .catch((error) => console.log(error.response));
    }
  };

  const handleDelete = (item) => {
    axios
      .delete(apiUrl + type, { params: { id: item.id } })
      .then(({ data }) => {
        if (data.message) {
          setItems(items.filter((o) => o.id !== item.id));
          setChecked(checked.filter((i) => i !== item.id));
        }
      })
      .catch((error) => console.log(error.response));
  };

  return (
    <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
      <Typography sx={{ mb: 2 }} variant="h6" component="div">
        {title}
      </Typography>
      <TextField
        label="New item"
        variant="filled"
        sx={{ width: "100%" }}
        onKeyPress={handleKeyPress}
        onChange={(e) => setInputValue(e.currentTarget.value)}
        value={inputValue}
      />
      <List sx={{ width: "100%", bgcolor: "background.paper" }}>
        {items.map((item) => {
          const labelId = `checkbox-list-label-${item.id}`;
          return (
            <ListItem
              key={item.id}
              secondaryAction={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <PersonMenu />
                  <IconButton
                    edge="end"
                    aria-label="delete item"
                    onClick={() => handleDelete(item)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
              disablePadding
            >
              <ListItemButton
                role={undefined}
                onClick={handleToggle(item)}
                dense
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={isChecked(item)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={item.content}
                  sx={{
                    textDecoration: isChecked(item) ? "line-through" : "none",
                    color: isChecked(item) ? "text.disabled" : "text.primary",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
