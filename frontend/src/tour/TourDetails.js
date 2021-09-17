import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { api } from "common/api";
import { useEffect, useMemo } from "react";
import { SightTile } from "sight/component";
import { useSightsOnMap } from "map";

export const TourDetails = () => {
  const { id: tourId } = useParams();

  const { highlightSightOnMap, resetHighlightSightOnMap, setSights } =
    useSightsOnMap();

  const { data: tourResponse } = useQuery(["tours", tourId], () =>
    api.get(`/tours/${tourId}`)
  );
  const tour = useMemo(() => tourResponse?.data, [tourResponse]);

  const { data: sightsResponse } = useQuery(["sights"], () =>
    api.get("/sights")
  );

  const sightsMap = useMemo(() => {
    const sights = sightsResponse?.data || [];
    const obj = {}; // { "1312-1312": { properties: { ... } } }
    sights.forEach((sight) => {
      obj[sight.properties.id] = sight;
    });
    return obj;
  }, [sightsResponse?.data]);

  useEffect(() => {
    if (tour?.sights) {
      setSights(
        tour.sights.map((sightId) => sightsMap[sightId]).filter(Boolean)
      );
    }
  }, [setSights, tour, sightsMap]);

  if (!tour) {
    return null;
  }

  return (
    <Box m={2}>
      <Box mb={2}>
        <Typography variant="h6">{tour.name}</Typography>
      </Box>
      <Grid container spacing={2}>
        {tour.sights.map((sightId) =>
          sightsMap[sightId] ? (
            <Grid
              item
              style={{ flex: 1 }}
              onMouseEnter={() =>
                highlightSightOnMap(sightsMap[sightId].properties.id)
              }
              onMouseLeave={() =>
                resetHighlightSightOnMap(sightsMap[sightId].properties.id)
              }
            >
              <SightTile sight={sightsMap[sightId]} showMagicOption />
            </Grid>
          ) : null
        )}
      </Grid>
    </Box>
  );
};
