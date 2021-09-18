import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import { api } from "common/api";

export const TourList = () => {
  const { data: tourResponse } = useQuery("tours", () => api.get("/tours"));

  const tours = tourResponse?.data || [];

  return (
    <Box m={2} pt={1} pb={12}>
      <Grid container direction="column" spacing={2}>
        {Array.isArray(tours) &&
          tours.map((tour, key) => (
            <Grid key={key} item>
              <Box component={Paper}>
                <ButtonBase
                  to={`/tours/${tour.id}`}
                  component={Link}
                  style={{ width: "100%", justifyContent: "flex-start" }}
                >
                  <Box p={1}>
                    <Typography variant="h6">
                      {tour.name || "Unbekannt"}
                    </Typography>
                    <Box mt={1}>
                      <Typography variant="body2">
                        {tour?.sights?.length || "0"} Sehenswürdigkeit
                        {tour?.sights?.length > 1 ? "en" : ""}
                      </Typography>
                    </Box>
                  </Box>
                </ButtonBase>
              </Box>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
