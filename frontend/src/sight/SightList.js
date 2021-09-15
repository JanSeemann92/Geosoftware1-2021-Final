import { useCallback, useEffect, useMemo, useRef } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { api } from "common/api";
import { useMap } from "map";

export const SightList = () => {
  const { map } = useMap();
  const mapLayer = useRef(null);
  const mapSights = useRef({});

  const { data: sightsResponse } = useQuery("sights", () => api.get("/sights"));

  const sights = useMemo(
    () => sightsResponse?.data || [],
    [sightsResponse?.data]
  );

  useEffect(() => {
    if (!mapLayer.current && map) {
      mapLayer.current = new window.L.FeatureGroup();
      map.addLayer(mapLayer.current);
    }
    return () => {
      if (map) {
        map.removeLayer(mapLayer.current);
      }
    };
  }, [map]);

  useEffect(() => {
    if (Array.isArray(sights) && sights.length > 0 && mapLayer.current) {
      mapLayer.current.clearLayers();
      mapSights.current = {};
      sights.forEach((sight) => {
        mapSights.current[sight.properties.id] = window.L.geoJson(
          sight.geometry,
          { style: { color: "blue" } }
        );
        mapLayer.current.addLayer(mapSights.current[sight.properties.id]);
      });
      map.fitBounds(mapLayer.current.getBounds());
    }
  }, [sights, map]);

  const highlightSightOnMap = useCallback((id) => {
    if (mapSights.current[id]) {
      mapSights.current[id].setStyle({ color: "red" });
    }
  }, []);

  const resetHighlightSightOnMap = useCallback((id) => {
    if (mapSights.current[id]) {
      mapSights.current[id].setStyle({ color: "blue" });
    }
  }, []);

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
