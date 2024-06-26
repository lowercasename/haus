import axios from "axios";
import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import AddCircleIcon from "@mui/icons-material/AddCircle";

import RecipeCard from "./RecipeCard";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      style={{ flex: 1 }}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <div>{children}</div>
        </Box>
      )}
    </div>
  );
}

const RecipeList = ({
  category,
  recipes,
  handleDeleteCategory,
  handleAddRecipe,
  handleDeleteRecipe,
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [recipeUrl, setRecipeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleChildAddRecipe = async () => {
    setLoading(true);
    const haveAdded = await handleAddRecipe(recipeUrl, category);
    if (haveAdded) {
      setRecipeUrl("");
      setLoading(false);
    } else {
      setLoading(false);
      console.log("Error!");
    }
  };

  return (
    <>
      <Typography variant="h6" component="div" sx={{ mb: 4 }}>
        {category.name}
      </Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        {" "}
        <TextField
          label="Recipe URL"
          variant="filled"
          sx={{ flex: 1 }}
          value={recipeUrl}
          onChange={(e) => setRecipeUrl(e.currentTarget.value)}
        />
        <Button
          variant="contained"
          onClick={handleChildAddRecipe}
          sx={{ whiteSpace: "nowrap" }}
          disabled={loading}
        >
          Add Recipe
          {loading && <CircularProgress />}
        </Button>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {recipes.map((recipe) => (
          <Grid item xs={12} md={6} lg={3} sx={{ display: "flex" }} key={recipe.id}>
            <RecipeCard recipe={recipe} handleDelete={handleDeleteRecipe} />
          </Grid>
        ))}
      </Grid>

      <Button variant="outlined" color="error" onClick={handleDialogOpen}>
        Delete Category
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Delete this category?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this category and all the recipes in
            it? This action is irreversible.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={() => handleDeleteCategory(category)} autoFocus>
            Delete Category
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [value, setValue] = useState(0);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    axios.get(process.env.REACT_APP_API_URI + "recipe").then(({ data }) => {
      console.log(data);
      setRecipes(data);
    });
    axios
      .get(process.env.REACT_APP_API_URI + "recipe-category")
      .then(({ data }) => {
        console.log(data);
        setCategories(data);
      });
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddCategory = () => {
    axios
      .post(process.env.REACT_APP_API_URI + "recipe-category", {
        name: newCategoryName.trim(),
      })
      .then(({ data }) => {
        setCategories([
          ...categories,
          { name: newCategoryName.trim(), id: data.id },
        ]);
        setNewCategoryName("");
      });
  };

  const handleDeleteCategory = (category) => {
    axios
      .delete(process.env.REACT_APP_API_URI + "recipe-category", {
        params: { id: category.id },
      })
      .then(({ data }) => {
        console.log(data);
        setCategories(categories.filter((o) => o.id !== category.id));
      });
  };

  const handleAddRecipe = async (url, category) => {
    return await axios
      .post(process.env.REACT_APP_API_URI + "recipe", {
        url,
        category: category.id,
      })
      .then(({ data }) => {
        console.log("Recipe added");
        console.log(data);
        if (data.message) {
          setRecipes([...recipes, data.record]);
          return true;
        }
        return false;
      })
      .catch((error) => false);
  };

  const handleDeleteRecipe = async (id) => {
    return await axios
      .delete(process.env.REACT_APP_API_URI + "recipe", {
        params: { id },
      })
      .then(({ data }) => {
        console.log("Recipe deleted");
        console.log(data);
        if (data.message) {
          setRecipes(recipes.filter((o) => o.id !== id));
          return true;
        }
        return false;
      })
      .catch((error) => false);
  }

  return (
    <Box component={Paper}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          orientation="horizontal"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          sx={{ borderRight: 1, borderColor: "divider" }}
        >
          {categories.map((category) => (
            <Tab label={category.name} key={category.id} />
          ))}
          <Tab icon={<AddCircleIcon />} iconPosition={"start"} label="New" />
        </Tabs>
      </Box>
      {categories.map((category, index) => (
        <TabPanel value={value} index={index} key={category.id}>
          <RecipeList
            category={category}
            recipes={recipes.filter((o) => o.RecipeCategoryId === category.id)}
            handleDeleteCategory={handleDeleteCategory}
            handleAddRecipe={handleAddRecipe}
            handleDeleteRecipe={handleDeleteRecipe}
          />
        </TabPanel>
      ))}
      <TabPanel value={value} index={categories.length}>
        <Typography variant="h6" component="div" sx={{ mb: 4 }}>
          Add New Category
        </Typography>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Category Name"
            variant="filled"
            sx={{ flex: 1 }}
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.currentTarget.value)}
          />
          <Button
            variant="contained"
            onClick={handleAddCategory}
            sx={{ whiteSpace: "nowrap" }}
          >
            Add Category
          </Button>
        </Stack>
      </TabPanel>
    </Box>
  );
}
