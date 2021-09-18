import { useLocation, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBarMui from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import HelpIcon from "@material-ui/icons/Help";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  appBar: {
    flex: "0 auto",
    position: "fixed",
    top: 0,
    [theme.breakpoints.down("md")]: {},
  },
  menu: {
    display: "flex",
    flex: 1,
    alignSelf: "center",
    justifyContent: "flex-start",
  },
  headline: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    textAlign: "left",
    [theme.breakpoints.down("md")]: {
      marginTop: theme.spacing(1),
    },
  },
  addResourcesMobile: {
    display: "none",
    flex: 1,
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      display: "block",
    },
  },
  addResources: {
    display: "inline-block",
    alignSelf: "center",
    marginLeft: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

export const AppBar = () => {
  const location = useLocation();
  const classes = useStyles();

  return (
    <AppBarMui position="sticky" className={classes.appBar}>
      <Grid container alignItems="center">
        <Grid item xs={12} md={12} lg="auto" style={{ textAlign: "right" }}>
          <Grid container>
            <Box
              width="130px"
              className={classes.headline}
              display="inline-block"
            >
              <Typography variant="h6">Geo Map</Typography>
            </Box>
            <div className={classes.addResourcesMobile}>
              <Button
                to="/about"
                component={Link}
                variant="outlined"
                style={{
                  paddingLeft: "12px",
                  paddingRight: "12px",
                  minWidth: "auto",
                  marginRight: "12px",
                }}
              >
                <HelpIcon />
              </Button>
              <AddResources />
            </div>
          </Grid>
        </Grid>

        <Grid item xs={12} md={12} lg="auto" className={classes.menu}>
          <Tabs value={location.pathname} aria-label="navigation">
            <Tab label="Stadttouren" value="/" component={Link} to="/" />
            <Tab
              label="Sehenswürdigkeiten"
              value="/sights"
              component={Link}
              to="/sights"
            />
          </Tabs>
          <div className={classes.addResources}>
            <AddResources />
            <Button
              to="/about"
              component={Link}
              variant="outlined"
              style={{
                paddingLeft: "12px",
                paddingRight: "12px",
                minWidth: "auto",
                marginLeft: "12px",
              }}
            >
              Impressum
            </Button>
          </div>
        </Grid>
      </Grid>
    </AppBarMui>
  );
};

const AddResources = () => {
  return (
    <Button
      to="/create"
      component={Link}
      variant="contained"
      color="secondary"
      style={{
        paddingLeft: "12px",
        paddingRight: "12px",
        minWidth: "auto",
      }}
    >
      <AddIcon />
    </Button>
  );
};
