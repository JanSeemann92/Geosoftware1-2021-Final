import { useCallback, useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useQuery } from "react-query";
import { useFormik } from "formik";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import { api } from "common/api";

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
