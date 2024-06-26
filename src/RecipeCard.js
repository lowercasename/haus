import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from '@mui/material/Button';

export default function RecipeCard({ recipe, handleDelete }) {
  return (
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <CardActionArea href={recipe.url} target="_blank">
        <CardMedia component="img" height="140" image={recipe.image} />
        <CardContent>
          <Typography
            gutterBottom
            component="div"
            sx={{ fontWeight: 700, mb: 0 }}
          >
            {recipe.title}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontVariant: "small-caps",
              color: "text.secondary",
              fontSize: "smaller",
              mb: 1,
            }}
          >
            {recipe.domain}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {recipe.description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ marginTop: "auto" }}>
        <Button aria-label="delete" size="small" onClick={() => handleDelete(recipe.id)} >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
