import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { api } from "common/api";

const useStyles = makeStyles((theme) =>
  createStyles({
    popupWrapper: {
      width: "300px",
    },
  })
);

export const SightPopup = ({ id = "" }) => {
  const classes = useStyles();

  const { data: sightResponse } = useQuery(
    ["sights", id],
    () => api.get(`/sights/${id}`),
    { enabled: Boolean(id) }
  );

  const sight = sightResponse?.data;

  if (!sight) {
    return <div className={classes.popupWrapper}>Lade...</div>;
  }

  return (
    <div className={classes.popupWrapper}>
      <Typography variant="h6">{sight.properties.name}</Typography>
      <Box mt={1}>
        <Typography variant="body2">
          {(sight.properties?.description || "").slice(0, 120)}...
        </Typography>
      </Box>
      <Box mt={1}>
        <Button
          variant="outlined"
          color="secondary"
          component={Link}
          to={`/sights/${sight.properties?.id}`}
        >
          Details
        </Button>
      </Box>
    </div>
  );
};
