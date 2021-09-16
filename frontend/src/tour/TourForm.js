import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import { useFormik } from "formik";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DeleteIcon from "@material-ui/icons/Delete";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Button from "@material-ui/core/Button";
import { api } from "common/api";
import { useSightsOnMap } from "map/hooks";

export const TourForm = () => {
  const { id: tourId } = useParams();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const { data: tourResponse, refetch } = useQuery(
    ["tours", tourId],
    () => api.get(`/tours/${tourId}`),
    { enabled: Boolean(tourId) }
  );

  const isEdit = Boolean(tourId);
  const tour = tourResponse?.data;

  const onSubmit = useCallback(
    async (values) => {
      setLoading(true);
      try {
        if (isEdit) {
          await api.put("/tours", values);
        } else {
          await api.post("/tours", values);
        }
        refetch();
        history.push("/");
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    },
    [setLoading, history, isEdit, refetch]
  );

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit,
  });

  useEffect(() => {
    if (tour && formik.values?.id !== tour?.id) {
      // set current charge point data
      formik.setValues(tour);
    }
  }, [formik, tour]);

  const onDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/tours/${tourId}`);
      history.push("/");
    } catch (err) {
      console.error("Unable to delete tour:", err);
    }
    setLoading(false);
  };

  const onChangeSights = useCallback(
    (sightIds = []) => {
      formik.setFieldValue("sights", sightIds);
    },
    [formik]
  );

  return (
    <Box m={2}>
      <Box mb={2}>
        <Typography variant="h6">
          Tour {isEdit ? "bearbeiten" : "erstellen"}
        </Typography>
      </Box>
      <form onSubmit={formik.handleSubmit}>
        <Grid container direction="column" spacing={2}>
          <Grid item xs={12}>
            <TextField
              name="name"
              label="Name"
              variant="outlined"
              fullWidth
              value={formik.values?.name || ""}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TourSightsManager
              sightIds={formik.values?.sights || []}
              onChange={onChangeSights}
            />
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

const SightSelection = memo(({ value = "", onChange = () => {} }) => {
  const [inputValue, setInputValue] = useState("");

  const { data: sightsResponse } = useQuery(["sights"], () =>
    api.get("/sights")
  );

  const options = useMemo(
    () =>
      (sightsResponse?.data || []).map(({ properties: { id, name } }) => ({
        id,
        name,
      })),
    [sightsResponse?.data]
  );

  return (
    <Autocomplete
      id="select-sights"
      value={value}
      onChange={(_, newValue) => {
        setInputValue("");
        onChange(newValue?.id || null);
      }}
      inputValue={inputValue}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      options={options}
      getOptionLabel={(option) => option.name}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Sehenswürdigkeit hinzufügen"
          variant="outlined"
        />
      )}
    />
  );
});

export const TourSightsManager = memo(
  ({ sightIds = [], onChange = () => {} }) => {
    const { highlightSightOnMap, resetHighlightSightOnMap, setSights } =
      useSightsOnMap();

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
      setSights(sightIds.map((id) => sightsMap[id]).filter(Boolean));
    }, [setSights, sightsMap, sightIds]);

    const addSightId = (id) => {
      // NOTE: If the id already exists, put it at the end of the list.
      onChange([...sightIds.filter((currId) => currId !== id), id]);
    };

    const moveUp = (id) => {
      const idIndex = sightIds.findIndex((currId) => currId === id);
      if (idIndex === 0) {
        return;
      }
      onChange([
        ...sightIds.slice(0, idIndex - 1),
        id,
        sightIds[idIndex - 1],
        ...sightIds.slice(idIndex + 1, sightIds.length),
      ]);
    };

    const moveDown = (id) => {
      const idIndex = sightIds.findIndex((currId) => currId === id);
      if (idIndex === sightIds.length - 1) {
        return;
      }
      onChange([
        ...sightIds.slice(0, idIndex),
        sightIds[idIndex + 1],
        id,
        ...sightIds.slice(idIndex + 2, sightIds.length),
      ]);
    };

    const deleteSightId = (id) => {
      onChange([...sightIds.filter((currId) => currId !== id)]);
    };

    return (
      <Grid container spacing={2}>
        {sightIds.map((sightId) =>
          sightsMap[sightId] ? (
            <Grid item xs={12}>
              <Box
                component={Paper}
                onMouseEnter={() =>
                  highlightSightOnMap(sightsMap[sightId].properties.id)
                }
                onMouseLeave={() =>
                  resetHighlightSightOnMap(sightsMap[sightId].properties.id)
                }
              >
                <Grid container direction="row">
                  <Grid item>
                    <Box p={1}>
                      <Typography variant="h6">
                        {sightsMap[sightId].properties.name}
                      </Typography>
                      <Typography variant="body2">
                        {sightsMap[sightId].properties.description?.slice(
                          0,
                          60
                        )}
                        ...
                      </Typography>
                    </Box>
                  </Grid>
                  <Box width="100%" p={1} pt={0}>
                    <Grid container>
                      <Box flex={1}>
                        <IconButton
                          aria-label="move up"
                          onClick={() => moveUp(sightId)}
                          color="inherit"
                        >
                          <KeyboardArrowUpIcon fontSize="small" />
                        </IconButton>
                        &nbsp;
                        <IconButton
                          aria-label="move down"
                          onClick={() => moveDown(sightId)}
                          color="inherit"
                        >
                          <KeyboardArrowDownIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box>
                        <IconButton
                          aria-label="remove sight from list"
                          onClick={() => deleteSightId(sightId)}
                          color="inherit"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Box>
                </Grid>
              </Box>
            </Grid>
          ) : null
        )}
        <Grid item xs={12}>
          <SightSelection onChange={addSightId} />
        </Grid>
      </Grid>
    );
  }
);
