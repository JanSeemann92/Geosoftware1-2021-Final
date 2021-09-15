import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { api } from "common/api";

export const TourList = () => {
  const { data: tourResponse } = useQuery("tours", () => api.get("/tours"));

  const tours = tourResponse?.data || [];

  return (
    <Box m={2}>
      <Grid container direction="column" spacing={1}>
        {Array.isArray(tours) &&
          tours.map((tour, key) => (
            <Grid key={key} item>
              <Box p={1} component={Paper}>
                <Typography variant="h6">{tour.name || "..."}</Typography>
                <Link to={`/tours/${tour.id}/edit`}>Edit</Link>
              </Box>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
