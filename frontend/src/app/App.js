import { HashRouter as Router, Switch, Route } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { SightList } from "../sight";
import { AppBar } from "./AppBar";
import { Map } from "map";

const useStyles = makeStyles((theme) => ({
  main: {
    position: "absolute",
    top: "48px",
    right: 0,
    bottom: 0,
    left: 0,
    display: "flex",
    flexDirection: "row",
  },
  scroll: {
    position: "relative",
    height: "100%",
    overflowY: "scroll",
  },
}));

export const App = () => {
  const classes = useStyles();

  return (
    <Router>
      <AppBar />
      <main className={classes.main}>
        <Grid item xs={4}>
          <div className={classes.scroll}>
            <Switch>
              <Route path="/">
                <SightList />
              </Route>
            </Switch>
          </div>
        </Grid>
        <Grid item xs={8}>
          <Map />
        </Grid>
      </main>
    </Router>
  );
};
