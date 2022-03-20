import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';

import axios from 'axios';
const apiUrl = 'http://localhost:8080/api/v1/';

const ISODate = (date) => {
  const offset = date.getTimezoneOffset()
  return new Date(date.getTime() - (offset*60*1000)).toISOString().split('T')[0];
};

export default function TodoList({ title, date, type }) {
  const [checked, setChecked] = useState([]);
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleToggle = (item) => () => {
    const currentIndex = checked.indexOf(item.id);
    const newChecked = [...checked];

    console.log(item);

    axios.put(apiUrl + type, { id: item.id, done: currentIndex === -1 })
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
      .catch(error => console.log((error.response)));
  };

  const isChecked = (item) => checked.indexOf(item.id) !== -1;

  useEffect(() => {
    axios.get(apiUrl + type, { params: { date: ISODate(date) }})
      .then(( { data } ) => {
        setItems(data);
        setChecked(data.reduce((acc, o) => o.done ? [...acc, o.id] : acc, []));
      })
  }, [date]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      axios.post(apiUrl + type, { content: inputValue, done: false, date: ISODate(date) })
        .then(({ data }) => {
          if (data.message) {
            setInputValue('');
            setItems([ ...items, { content: inputValue, done: false, id: data.id }]);
          }
        })
        .catch(error => console.log((error.response)));
    }
  }

  const handleDelete = (item) => {
    axios.delete(apiUrl + type, { params: { id: item.id } })
      .then(({ data }) => {
        if (data.message) {
          setItems(items.filter(o => o.id !== item.id));
          setChecked(checked.filter(i => i !== item.id));
        }
      })
      .catch(error => console.log((error.response)));
  };

  return (
    <Paper sx={{ p: 2, mt: 2, mb: 2 }}>
      <Typography sx={{ mb: 2 }} variant="h6" component="div">
        {title}
      </Typography>
      <TextField
        label="New item"
        variant="filled"
        sx={{ width: '100%' }}
        onKeyPress={handleKeyPress}
        onChange={(e) => setInputValue(e.currentTarget.value)}
        value={inputValue}
      />
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {items.map((item) => {
          const labelId = `checkbox-list-label-${item.id}`;
          return (
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete item" onClick={() => handleDelete(item)}>
                  <DeleteIcon />
                </IconButton>
              }
              disablePadding
            >
              <ListItemButton role={undefined} onClick={handleToggle(item)} dense>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={isChecked(item)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={item.content}
                  sx={{
                    textDecoration : isChecked(item) ? 'line-through' : 'none',
                    color: isChecked(item) ? 'text.disabled' : 'text.primary',
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
