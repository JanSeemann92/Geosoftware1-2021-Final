import { useHistory } from "react-router";
import { makeStyles } from "@material-ui/core/styles";
import AppBarMui from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  appBar: {
    flex: "0 auto",
  },
  menu: {
    display: "flex",
    flex: 1,
    alignSelf: "center",
    justifyContent: "flex-start",
  },
  logo: {
    marginRight: theme.spacing(1),
    width: "12rem",
    "& img": {
      width: "100%",
    },
  },
}));

const headerImage = `${process.env.PUBLIC_URL}/images/ampcontrol-white.png`;

export const AppBar = () => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <AppBarMui position="sticky" className={classes.appBar}>
      <Grid container alignItems="center">
        <Grid>
          <Box width="150px" mx={2}>
            <Typography variant="h6">Geo Map</Typography>
          </Box>
        </Grid>
        <Grid item className={classes.menu}>
          <Tabs value={0} aria-label="simple tabs example">
            <Tab label="Stadttouren" />
            <Tab label="Sehenswürdigkeiten" />
          </Tabs>
        </Grid>
      </Grid>
    </AppBarMui>
  );
};
