import React from "react";
import { useQuery } from "react-query";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
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
      <Typography variant="body2">{sight.properties?.url || ""}</Typography>
      <Typography variant="body2">
        {(sight.properties?.description || "").slice(0, 120)}...
      </Typography>
    </div>
  );
};
