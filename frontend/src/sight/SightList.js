import { useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import LinkMUI from "@material-ui/core/Link";
import { api } from "common/api";
import { useSightsOnMap } from "map/hooks";
import { TruncateText } from "component";
import { SightTile } from "./component";

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
      <Grid container direction="column" spacing={2}>
        {Array.isArray(sights) &&
          sights.map((sight, key) => (
            <Grid
              key={key}
              item
              onMouseEnter={() => highlightSightOnMap(sight.properties.id)}
              onMouseLeave={() => resetHighlightSightOnMap(sight.properties.id)}
            >
              <SightTile sight={sight} />
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};
