import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import { useFormik } from "formik";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import { api } from "common/api";
import { useMap } from "map";

export const SightForm = () => {
  const { id: sightId } = useParams();
  const history = useHistory();
  const { map, drawControl } = useMap();

  const drawnItems = useRef(null);

  const [loading, setLoading] = useState(false);

  const { data: sightResponse, refetch } = useQuery(
    ["sights", sightId],
    () => api.get(`/sights/${sightId}`),
    { enabled: Boolean(sightId) }
  );

  const isEdit = Boolean(sightId);
  const sight = sightResponse?.data;

  const onSubmit = useCallback(
    async (values) => {
      setLoading(true);
      try {
        if (isEdit) {
          await api.put("/sights", values);
        } else {
          await api.post("/sights", values);
        }
        refetch();
        history.push("/sights");
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    },
    [setLoading, history, isEdit, refetch]
  );

  const formik = useFormik({
    initialValues: {
      type: "Feature",
      properties: {
        name: "",
        description: "",
      },
      geometry: null,
    },
    onSubmit,
  });

  useEffect(() => {
    if (!drawnItems.current && map) {
      drawnItems.current = new window.L.FeatureGroup();
      map.addLayer(drawnItems.current);
    }

    if (sight && formik.values.properties?.id !== sight.properties?.id) {
      // set current charge point data
      formik.setValues(sight);

      if (sight.geometry) {
        const geoJsonLayer = window.L.geoJson(sight.geometry);
        drawnItems.current.addLayer(geoJsonLayer);
        map.fitBounds(drawnItems.current.getBounds(), { maxZoom: 17 });
      }
    }
  }, [formik, sight, map]);

  const extractWikipediaSummary = async (e) => {
    const { value } = e.target;

    if (!value) {
      return;
    }
    const [, , title] = value.match(
      /https:\/\/(.*\.)?wikipedia\.org\/wiki\/(.*)/i
    );
    try {
      const { data: wikipediaResponse } = await axios.get(
        `https://de.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=0&origin=*&titles=${title}`
      );
      const pages = wikipediaResponse?.query?.pages;
      formik.setFieldValue(
        "properties.description",
        Object.values(pages)[0].extract
      );
    } catch (err) {
      console.error("Unable to load wikipedia summary for title=", title, err);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/sights/${sightId}`);
      history.push("/sights");
    } catch (err) {
      console.error("Unable to delete sight:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!map) {
      return;
    }
    map.on("draw:created", function (event) {
      const { layer } = event;
      const { geometry } = layer.toGeoJSON();

      // add to map
      drawnItems.current.addLayer(layer);
      // add to formik
      formik.setFieldValue("geometry", geometry);
    });
  }, [map, formik]);

  useEffect(() => {
    return () => {
      if (map) {
        map.removeLayer(drawnItems.current);
      }
    };
  }, [map]);

  const drawMarker = () => {
    if (!map) {
      return;
    }
    drawnItems.current.clearLayers();

    new window.L.Draw.Marker(map, drawControl.options.marker).enable();
  };

  const drawPolygon = () => {
    if (!map) {
      return;
    }
    drawnItems.current.clearLayers();

    new window.L.Draw.Polygon(map, drawControl.options.polygon).enable();
  };

  return (
    <Box m={2}>
      <Box mb={2}>
        <Typography variant="h6">
          Sehenswürdigkeit {isEdit ? "bearbeiten" : "erstellen"}
        </Typography>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Grid container direction="column" spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="properties.name"
              label="Name"
              variant="outlined"
              fullWidth
              value={formik.values?.properties?.name || ""}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="properties.url"
              placeholder="https://en.wikipedia.org/wiki/Prinzipalmarkt"
              multiline
              label="URL"
              variant="outlined"
              fullWidth
              value={formik.values?.properties?.url || ""}
              onChange={formik.handleChange}
              onBlur={extractWikipediaSummary}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              name="properties.description"
              multiline
              label="Beschreibung"
              variant="outlined"
              fullWidth
              maxRows={5}
              value={formik.values?.properties?.description || ""}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              onClick={drawMarker}
            >
              Marker
            </Button>
            <Button
              type="button"
              variant="contained"
              color="secondary"
              onClick={drawPolygon}
            >
              Polygon
            </Button>
          </Grid>
          <Grid item xs={12}>
            {isEdit ? (
              <Button
                disabled={loading}
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
                onClick={onDelete}
              >
                Delete
              </Button>
            ) : null}
            <Button
              disabled={loading}
              type="submit"
              variant="contained"
              color="primary"
            >
              Speichern
            </Button>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
