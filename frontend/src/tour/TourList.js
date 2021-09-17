import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { api } from "common/api";

export const TourList = () => {
  const { data: tourResponse } = useQuery("tours", () => api.get("/tours"));

  const tours = tourResponse?.data || [];

  return (
    <Box m={2}>
      <Box mb={2} textAlign="right">
        <Button component={Link} to="/tours/create" variant="contained">
          Hinzufügen
        </Button>
      </Box>
      <Grid container direction="column" spacing={2}>
        {Array.isArray(tours) &&
          tours.map((tour, key) => (
            <Grid key={key} item>
              <Box p={1} component={Paper}>
                <Typography variant="h6">{tour.name || "..."}</Typography>
                <Grid container alignItems="baseline">
                  <Grid
                    item
                    component={Typography}
                    variant="body2"
                    style={{
                      flex: 1,
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {tour?.sights?.length || "0"} Sehenswürdigkeit
                    {tour?.sights?.length > 1 ? "en" : ""}
                  </Grid>
                  <Grid item>
                    <Box width="100%" mt={1} textAlign="right">
                      <Grid container spacing={1}>
                        <Grid item>
                          <Link
                            component={Button}
                            to={`/tours/${tour.id}/edit`}
                            aria-label="edit sight"
                            variant="outlined"
                          >
                            Bearbeiten
                          </Link>
                        </Grid>
                        <Grid item>
                          <Link
                            component={Button}
                            to={`/tours/${tour.id}`}
                            aria-label="show tour details"
                            variant="contained"
                            color="secondary"
                          >
                            Details
                          </Link>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
