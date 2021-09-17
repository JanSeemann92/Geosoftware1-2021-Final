import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { api } from "common/api";
import { useMemo } from "react";
import { SightTile } from "sight/component";

export const TourDetails = () => {
  const { id: tourId } = useParams();

  const { data: tourResponse } = useQuery(["tours", tourId], () =>
    api.get(`/tours/${tourId}`)
  );
  const tour = tourResponse?.data;

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

  if (!tour) {
    return null;
  }
  console.log(tour);

  return (
    <Box m={2}>
      <Box mb={2}>
        <Typography variant="h6">{tour.name}</Typography>
      </Box>
      <Grid container spacing={2}>
        {tour.sights.map((sightId) =>
          sightsMap[sightId] ? (
            <Grid item>
              <SightTile sight={sightsMap[sightId]} showMagicOption />
            </Grid>
          ) : null
        )}
      </Grid>
    </Box>
  );
};
