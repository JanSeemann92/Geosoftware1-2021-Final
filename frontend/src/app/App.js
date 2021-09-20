import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import MapIcon from "@material-ui/icons/Map";
import CloseIcon from "@material-ui/icons/Close";
import { TourRoutes } from "../tour";
import { SightRoutes } from "../sight";
import { AppBar } from "./AppBar";
import { Map } from "map";
import { CreateResource } from "./CreateResource";
import { useApp } from "app";
import { About } from "./About";

const useStyles = makeStyles((theme) => ({
  main: {
    display: "flex",
    width: "100%",
    height: "100vh",
  },
  content: {
    flex: 1,
    position: "relative",
    overflowY: "auto",
    // AppBar height
    marginTop: "47px",
    [theme.breakpoints.down("md")]: {
      flex: "none",
      position: "static",
      overflowY: "visible",
      width: "100%",
      // AppBar height
      marginTop: "87px",
    },
  },
  contentHide: {
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  map: {
    flex: 2,
    position: "relative",
    // AppBar height
    marginTop: "47px",
    [theme.breakpoints.down("md")]: {
      flex: 1,
      marginTop: "87px",
    },
  },
  mapInner: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
  },
  actionButton: {
    display: "none",
    position: "fixed",
    bottom: theme.spacing(1),
    left: theme.spacing(2),
    [theme.breakpoints.down("md")]: {
      display: "block",
    },
  },
}));

export const App = () => {
  const classes = useStyles();
  const { showMap, setShowMap } = useApp(false);

  return (
    <Router>
      <AppBar />
      <main className={classes.main}>
        <div
          className={`${classes.content}${
            showMap ? ` ${classes.contentHide}` : ""
          }`}
        >
          <Switch>
            <Route path="/about">
              <About />
            </Route>
            <Route path="/create">
              <CreateResource />
            </Route>
            <Route path="/sights">
              <SightRoutes />
            </Route>
            <Route path="/">
              <TourRoutes />
            </Route>
          </Switch>
        </div>
        <div className={classes.map}>
          <div className={classes.mapInner}>
            <Map />
          </div>
        </div>
        <div className={classes.actionButton}>
          <Fab
            variant="extended"
            size="large"
            aria-label="show map"
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? (
              <>
                <CloseIcon />
                &nbsp;&nbsp;Karte ausblenden
              </>
            ) : (
              <>
                <MapIcon />
                &nbsp;&nbsp;Karte einblenden
              </>
            )}
          </Fab>
        </div>
      </main>
    </Router>
  );
};
