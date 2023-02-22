import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";

export default function RecipeCard({ recipe }) {
  return (
    <Card>
      <CardActionArea sx={{ height: "100%" }} href={recipe.url} target="_blank">
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
    </Card>
  );
}
