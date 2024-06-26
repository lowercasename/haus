import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box, Paper, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination,
    Autocomplete, Chip, Select, MenuItem, FormControl, InputLabel, Typography,
    Link, Grid
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';

const AutoLink = ({ text }) => {
    const delimiter = /((?:https?:\/\/)?(?:(?:[a-z0-9]?(?:[a-z0-9-]{1,61}[a-z0-9])?\.[^.|\s])+[a-z.]*[a-z]+|(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})(?::\d{1,5})*[a-z0-9.,_/~#&=;%+?\-\\(\\)]*)/gi;

    return (
        <>
            {text.split(delimiter).map(word => {
                const match = word.match(delimiter);
                if (match) {
                    const url = match[0];
                    return (
                        <Link href={url.startsWith('http') ? url : `http://${url}`} target="_blank" rel="noopener noreferrer">
                            {url}
                        </Link>
                    );
                }
                return word;
            })}
        </>
    );
};

const RecipeIdeas = () => {
    const [recipeIdeas, setRecipeIdeas] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(50);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [allTags, setAllTags] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showFilterBar, setShowFilterBar] = useState(false);

    useEffect(() => {
        fetchRecipeIdeas();
        fetchTags();
        fetchIngredients();
        fetchCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchRecipeIdeas = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URI}recipe-ideas`, {
                params: {
                    search: searchTerm,
                    tags: selectedTags.join(','),
                    ingredients: selectedIngredients.join(','),
                    category: selectedCategory
                }
            });
            console.log(response.data);
            setRecipeIdeas(response.data);
        } catch (error) {
            console.error('Error fetching recipe ideas:', error);
        }
    };

    const fetchTags = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URI}recipe-tags`);
            setAllTags(response.data.map(tag => tag.name));
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const fetchIngredients = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URI}main-ingredients`);
            setAllIngredients(response.data.map(ingredient => ingredient.name));
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URI}recipe-category`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSearch = () => {
        fetchRecipeIdeas();
    };

    const handleRowClick = (idea) => {
        setSelectedIdea(idea);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setEditMode(false);
        setSelectedIdea(null);
    };

    const handleSaveIdea = async () => {
        console.log(selectedIdea);
        try {
            if (selectedIdea.id) {
                await axios.put(`${process.env.REACT_APP_API_URI}recipe-ideas/${selectedIdea.id}`, selectedIdea);
            } else {
                await axios.post(`${process.env.REACT_APP_API_URI}recipe-ideas`, selectedIdea);
            }
            fetchRecipeIdeas();
            fetchTags();
            fetchIngredients();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving recipe idea:', error);
        }
    };

    const handleDeleteIdea = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_URI}recipe-ideas/${selectedIdea.id}`);
            fetchRecipeIdeas();
            fetchTags();
            fetchIngredients();
            handleCloseModal();
        } catch (error) {
            console.error('Error deleting recipe idea:', error);
        }
    };

    const handleNewIdea = () => {
        setSelectedIdea({
            name: '',
            body: '',
            RecipeTags: [],
            MainIngredients: [],
            RecipeCategoryId: ''
        });
        setEditMode(true);
        setOpenModal(true);
    };

    return (
        <Box component={Paper}>
            <Grid container spacing={2} sx={{ p: 2 }}>
                <Grid item xs={12} md={6}>
                    <Button variant="contained" color="primary" onClick={handleNewIdea} startIcon={<AddIcon />} sx={{ whiteSpace: 'nowrap', width: '100%' }}>
                        New Recipe Idea
                    </Button>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Button onClick={() => setShowFilterBar(!showFilterBar)} startIcon={<FilterListIcon />} variant="contained" color="primary" sx={{ whiteSpace: 'nowrap', width: '100%' }}>
                        {showFilterBar ? 'Hide Filters' : 'Show Filters'}
                    </Button>
                </Grid>
            </Grid>
            <Grid container spacing={2} sx={{ p: 2, display: showFilterBar ? 'flex' : 'none' }}>
                <Grid item xs={12} md={3}>
                    <TextField
                        fullWidth
                        label="Search"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Autocomplete
                        multiple
                        options={allTags}
                        limitTags={2}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Tags" placeholder="Tags" />
                        )}
                        value={selectedTags}
                        onChange={(event, newValue) => {
                            setSelectedTags(newValue);
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <Autocomplete
                        multiple
                        options={allIngredients}
                        limitTags={2}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField {...params} variant="outlined" label="Main Ingredients" placeholder="Ingredients" />
                        )}
                        value={selectedIngredients}
                        onChange={(event, newValue) => {
                            setSelectedIngredients(newValue);
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <FormControl variant="outlined" fullWidth>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            label="Category"
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            {categories?.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Button variant="contained" onClick={handleSearch} fullWidth>Search</Button>
                </Grid>
            </Grid>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Main Ingredients</TableCell>
                            <TableCell sx={{ fontWeight: 700 }}>Tags</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {recipeIdeas
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            ?.map((idea) => (
                                <TableRow key={idea.id} onClick={() => handleRowClick(idea)} hover>
                                    <TableCell>{idea.name}</TableCell>
                                    <TableCell>{idea.RecipeCategory ? idea.RecipeCategory.name : ''}</TableCell>
                                    <TableCell>{idea.MainIngredients?.map(i => i.name).join(', ')}</TableCell>
                                    <TableCell>{idea.RecipeTags?.map(t => t.name).join(', ')}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[25, 50, 100]}
                component="div"
                count={recipeIdeas.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Dialog open={openModal} onClose={handleCloseModal} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6" component="div">
                            {editMode ? (selectedIdea.id !== undefined ? 'Edit Recipe Idea' : 'Create Recipe Idea') : selectedIdea?.name}
                        </Typography>
                        {!editMode && selectedIdea?.RecipeCategoryId && (
                            <Chip
                                label={categories.find(c => c.id === selectedIdea.RecipeCategoryId)?.name || 'Uncategorized'}
                                color="primary"
                                variant="outlined"
                                sx={{
                                    textTransform: 'uppercase'
                                }}
                            />
                        )}
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedIdea && (
                        <Box>
                            {editMode ? (
                                // Edit Mode
                                <>
                                    <TextField
                                        label="Name"
                                        fullWidth
                                        value={selectedIdea.name}
                                        onChange={(e) => setSelectedIdea({ ...selectedIdea, name: e.target.value })}
                                        margin="normal"
                                    />
                                    <TextField
                                        label="Body"
                                        fullWidth
                                        multiline
                                        rows={4}
                                        value={selectedIdea.body}
                                        onChange={(e) => setSelectedIdea({ ...selectedIdea, body: e.target.value })}
                                        margin="normal"
                                    />
                                    <FormControl fullWidth margin="normal">
                                        <InputLabel>Category</InputLabel>
                                        <Select
                                            value={selectedIdea.RecipeCategoryId}
                                            onChange={(e) => setSelectedIdea({ ...selectedIdea, RecipeCategoryId: e.target.value })}
                                            label="Category"
                                        >
                                            {categories?.map((category) => (
                                                <MenuItem key={category.id} value={category.id}>
                                                    {category.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <Autocomplete
                                        multiple
                                        freeSolo
                                        options={allTags}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField {...params} label="Tags" placeholder="Tags" margin="normal" />
                                        )}
                                        value={selectedIdea.RecipeTags?.map(t => t.name)}
                                        onChange={(event, newValue) => {
                                            setSelectedIdea({ ...selectedIdea, RecipeTags: newValue.map(name => ({ name })) });
                                        }}
                                    />
                                    <Autocomplete
                                        multiple
                                        freeSolo
                                        options={allIngredients}
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => (
                                                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                                            ))
                                        }
                                        renderInput={(params) => (
                                            <TextField {...params} label="Main Ingredients" placeholder="Ingredients" margin="normal" />
                                        )}
                                        value={selectedIdea.MainIngredients?.map(i => i.name)}
                                        onChange={(event, newValue) => {
                                            setSelectedIdea({ ...selectedIdea, MainIngredients: newValue.map(name => ({ name })) });
                                        }}
                                    />
                                </>
                            ) : (
                                // View Mode
                                <>
                                    <Typography paragraph style={{ whiteSpace: 'pre-wrap' }}>
                                        <AutoLink text={selectedIdea.body} />
                                    </Typography>

                                    <Typography variant="h6" gutterBottom>Main Ingredients</Typography>
                                    <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                                        {selectedIdea.MainIngredients?.map((ingredient, index) => (
                                            <Chip key={index} label={ingredient.name} />
                                        ))}
                                    </Box>

                                    <Typography variant="h6" gutterBottom>Tags</Typography>
                                    <Box display="flex" flexWrap="wrap" gap={1}>
                                        {selectedIdea.RecipeTags?.map((tag, index) => (
                                            <Chip key={index} label={tag.name} />
                                        ))}
                                    </Box>
                                </>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    {editMode ? (
                        <>
                            <Button onClick={handleSaveIdea} color="primary">Save</Button>
                            <Button onClick={() => selectedIdea.id !== undefined ? setEditMode(false) : handleCloseModal()} color="secondary">Cancel</Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={() => setEditMode(true)} color="primary">Edit</Button>
                            <Button onClick={handleDeleteIdea} color="secondary">Delete</Button>
                            <Button onClick={handleCloseModal} color="primary">Close</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RecipeIdeas;