import { useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { api } from "common/api";
import { useSightsOnMap } from "map/hooks";
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
    <Box m={2} pt={1} pb={12}>
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
