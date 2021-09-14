import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { api } from "common/api";

export const SightList = () => {
  const { data: sightsResponse } = useQuery("sights", () => api.get("/sights"));

  const sights = sightsResponse?.data || [];

  return (
    <Box m={2}>
      <Grid container direction="column" spacing={1}>
        {Array.isArray(sights) &&
          sights.map((sight, key) => (
            <Grid key={key} item>
              <Box p={1} component={Paper}>
                <Typography variant="h6">
                  {sight.properties.name || "..."}
                </Typography>
                <Typography variant="body2">
                  {sight.properties?.url || ""}
                </Typography>
                <Typography variant="body2">
                  {sight.properties?.description || ""}
                </Typography>
                <Link to={`/sights/${sight.properties.id}/edit`}>Edit</Link>
              </Box>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
