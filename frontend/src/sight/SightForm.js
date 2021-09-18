import { useCallback, useEffect, useState, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import { useFormik } from "formik";
import axios from "axios";
import geoJsonValidation from "geojson-validation";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { api } from "common/api";
import { useMap } from "map";
import { useApp } from "app";

const sightInitialValues = {
  type: "Feature",
  properties: {
    name: "",
    description: "",
  },
  geometry: null,
};

export const SightForm = () => {
  const { id: sightId } = useParams();
  const history = useHistory();

  const { map, drawControl } = useMap();
  const { setShowMap } = useApp(false);

  const [error, setError] = useState("");
  const [showGeometryInput, setShowGeometryInput] = useState(false);
  const [geometryTextInput, setGeometryTextInput] = useState("");
  const [showConfirmDeletion, setShowConfirmDeletion] = useState(false);

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
    initialValues: sightInitialValues,
    onSubmit,
  });

  const drawGeometryOnMap = useCallback(
    (geometry) => {
      drawnItems.current.clearLayers();
      const geoJsonLayer = window.L.geoJson(geometry);
      drawnItems.current.addLayer(geoJsonLayer);
      map.fitBounds(drawnItems.current.getBounds(), { maxZoom: 17 });
    },
    [map]
  );

  useEffect(() => {
    if (!drawnItems.current && map) {
      drawnItems.current = new window.L.FeatureGroup();
      map.addLayer(drawnItems.current);
    }

    if (sight && formik.values.properties?.id !== sight.properties?.id) {
      // set current charge point data
      formik.setValues(sight);

      if (sight.geometry) {
        drawGeometryOnMap(sight.geometry);
      }
    }
  }, [formik, sight, map, drawGeometryOnMap]);

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

  const formikSetFieldValue = formik.setFieldValue;

  useEffect(() => {
    if (!map) {
      return;
    }
    console.log("draw:created init");
    map.on("draw:created", function (event) {
      console.log("draw:created call");
      const { layer } = event;
      const { geometry } = layer.toGeoJSON();

      // add to map
      drawnItems.current.addLayer(layer);
      setShowMap(false);
      // add to formik
      formikSetFieldValue("geometry", geometry);
    });
  }, [map, formikSetFieldValue, setShowMap]);

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
    setShowMap(true);
  };

  const drawPolygon = () => {
    if (!map) {
      return;
    }
    drawnItems.current.clearLayers();

    new window.L.Draw.Polygon(map, drawControl.options.polygon).enable();
    setShowMap(true);
  };

  const onUploadGeoJson = (e) => {
    const [file] = e.target.files;
    const reader = new FileReader();
    reader.onload = function (event) {
      const { result } = event.target;

      let feature;
      try {
        // just check if it's a valid JSON
        feature = JSON.parse(result);
      } catch (err) {
        setError("INVALID_JSON");
        console.error(err);
        return;
      }

      if (!feature) {
        setError("UNKNOWN");
      }

      if (!geoJsonValidation.isFeature(feature)) {
        setError("INVALID_GEOJSON");
        return;
      }

      // make sure no id is defined
      delete feature?.properties?.id;

      // check geometry and draw it on map:
      const { geometry } = feature;
      if (
        geoJsonValidation.isPoint(geometry) ||
        geoJsonValidation.isPolygon(geometry)
      ) {
        drawGeometryOnMap(geometry);
      } else {
        setError("INVALID_GEOJSON_GEOMETRY");
        return;
      }

      // merge with initial values to prevent issues with formik
      formik.setValues({
        ...sightInitialValues,
        ...feature,
        properties: {
          ...sightInitialValues.properties,
          ...(feature.properties || null),
        },
      });
    };
    reader.readAsText(file);
  };

  const saveGeometryInput = (e) => {
    let geometry;
    try {
      // just check if it's a valid JSON
      geometry = JSON.parse(geometryTextInput);
    } catch (err) {
      setError("INVALID_JSON");
      console.error(err);
    }
    console.log(geometry);
    if (
      geometry &&
      (geoJsonValidation.isPoint(geometry) ||
        geoJsonValidation.isPolygon(geometry))
    ) {
      drawGeometryOnMap(geometry);
      formik.setFieldValue("geometry", geometry);
      setShowGeometryInput(false);
    } else {
      setError("INVALID_GEOJSON_GEOMETRY");
    }
    setGeometryTextInput("");
  };

  console.log("rerender?");

  return (
    <Box m={2} pb={12}>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        open={Boolean(error)}
        autoHideDuration={10000}
        onClose={() => setError("")}
      >
        <Alert onClose={() => setError("")} severity="error">
          {{
            INVALID_JSON: "Fehlerhaftes JSON-Format, bitte prüfen.",
            INVALID_GEOJSON: "Dies ist kein GeoJSON Feature.",
            INVALID_GEOJSON_GEOMETRY: "Nur Point, Polygon zulässig.",
          }[error] || "Unbekannter Fehler"}
        </Alert>
      </Snackbar>
      <Box mb={2}>
        <Typography variant="h6">
          Sehenswürdigkeit {isEdit ? "bearbeiten" : "erstellen"}
        </Typography>
      </Box>
      {!isEdit ? (
        <Box mb={2}>
          <Button
            type="button"
            component="label"
            variant="outlined"
            onChange={onUploadGeoJson}
          >
            Als GeoJSON importieren
            <input type="file" hidden accept="text/plain,application/json" />
          </Button>
        </Box>
      ) : null}
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
            <Box mb={1}>
              <Typography variant="body1">
                {showGeometryInput
                  ? "Geometrie als Text laden:"
                  : "Geometrie auf der Karte zeichnen:"}
              </Typography>
            </Box>
            {showGeometryInput && (
              <Box mb={1}>
                <TextField
                  multiline
                  label="Geometrie"
                  placeholder={`{ "type": "Point", "coordinates": [8.2, 52.1] }`}
                  variant="outlined"
                  fullWidth
                  maxRows={5}
                  value={geometryTextInput}
                  onChange={(e) => setGeometryTextInput(e.target.value)}
                />
              </Box>
            )}
            <Grid container spacing={1}>
              {showGeometryInput ? (
                <>
                  <Grid item>
                    <Button
                      type="button"
                      variant="contained"
                      onClick={saveGeometryInput}
                    >
                      Übernehmen
                    </Button>
                  </Grid>
                  <Grid item style={{ flex: 1, textAlign: "right" }}>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => setShowGeometryInput(false)}
                    >
                      Karteneingabe
                    </Button>
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item>
                    <ButtonGroup>
                      <Button
                        type="button"
                        variant={
                          geoJsonValidation.isPoint(formik.values?.geometry)
                            ? "contained"
                            : "outlined"
                        }
                        onClick={drawMarker}
                      >
                        Marker
                      </Button>
                      <Button
                        type="button"
                        variant={
                          geoJsonValidation.isPolygon(formik.values?.geometry)
                            ? "contained"
                            : "outlined"
                        }
                        onClick={drawPolygon}
                      >
                        Polygon
                      </Button>
                    </ButtonGroup>
                  </Grid>
                  <Grid item style={{ flex: 1, textAlign: "right" }}>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => setShowGeometryInput(true)}
                    >
                      Texteingabe
                    </Button>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Box mt={2}>
              <Grid container spacing={1}>
                {showConfirmDeletion ? (
                  <>
                    <Grid item>
                      <Button
                        variant="contained"
                        onClick={() => setShowConfirmDeletion(false)}
                      >
                        Abbrechen
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<DeleteIcon />}
                        onClick={onDelete}
                      >
                        Löschen
                      </Button>
                    </Grid>
                  </>
                ) : (
                  <>
                    {isEdit ? (
                      <Grid item>
                        <Button
                          disabled={loading}
                          variant="contained"
                          onClick={() => setShowConfirmDeletion(true)}
                        >
                          <DeleteIcon />
                        </Button>
                      </Grid>
                    ) : null}
                    <Grid item>
                      <Button
                        disabled={loading}
                        type="submit"
                        variant="contained"
                        color="primary"
                      >
                        Speichern
                      </Button>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Box>
  );
};
