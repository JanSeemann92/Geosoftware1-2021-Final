import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

export const SightList = () => (
  <Box m={2}>
    <Grid container direction="column" spacing={2}>
      {Array(30)
        .fill("")
        .map((_, key) => (
          <Grid key={key} item>
            <Typography variant="h6">Test</Typography>
            <Typography variant="body2">Lorem ipsum dolor sit amet</Typography>
            <br />
            <Divider />
          </Grid>
        ))}
    </Grid>
  </Box>
);
