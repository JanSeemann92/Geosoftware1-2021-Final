import { useCallback, useEffect, useMemo, useRef } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { api } from "common/api";
import { useSightsOnMap } from "map/hooks";

export const SightList = () => {
  const { highlightSightOnMap, resetHighlightSightOnMap, setSights } =
    useSightsOnMap();

  const { data: sightsResponse } = useQuery(["sights"], () =>
    api.get("/sights")
  );

  const sights = useMemo(
    () => sightsResponse?.data || [],
    [sightsResponse?.data]
  );

  useEffect(() => {
    setSights(sights);
  }, [setSights, sights]);

  return (
    <Box m={2}>
      <Box mb={2} textAlign="right">
        <Button component={Link} to="/sights/create" variant="contained">
          Hinzufügen
        </Button>
      </Box>
      <Grid container direction="column" spacing={1}>
        {Array.isArray(sights) &&
          sights.map((sight, key) => (
            <Grid
              key={key}
              item
              onMouseEnter={() => highlightSightOnMap(sight.properties.id)}
              onMouseLeave={() => resetHighlightSightOnMap(sight.properties.id)}
            >
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
