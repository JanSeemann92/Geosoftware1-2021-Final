import { useEffect } from "react";
import { Link } from "react-router-dom";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import { useApp } from "app";

export const CreateResource = () => {
  const { setShowMap } = useApp();

  useEffect(() => {
    setShowMap(false);
  }, [setShowMap]);

  return (
    <Box m={2} pb={12}>
      <Box mb={2}>
        <Typography variant="h6">Was möchtest du erstellen?</Typography>
      </Box>
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Box component={Paper}>
            <ButtonBase to={`/tours/create`} component={Link}>
              <Box p={1}>
                <Typography variant="h6">Tour</Typography>
                <Typography variant="body2">
                  Eine Tour enthält eine Zusammenstellung an Sehenswürdigkeiten.
                </Typography>
              </Box>
            </ButtonBase>
          </Box>
        </Grid>
        <Grid item>
          <Box component={Paper}>
            <ButtonBase to={`/sights/create`} component={Link}>
              <Box p={1}>
                <Typography variant="h6">Sehenswürdigkeit</Typography>
                <Typography variant="body2">
                  Eine Sehenswürdigkeit ist ein bedeutsamer oder wichtiger Ort.
                </Typography>
              </Box>
            </ButtonBase>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
