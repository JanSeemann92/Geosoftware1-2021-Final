import { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useMap } from "map";
import "./map.css";

const useStyles = makeStyles((theme) => ({
  map: {
    height: "100%",
    width: "100%",
  },
}));

export const Map = () => {
  const classes = useStyles();
  const { setMap, cleanupMap } = useMap();

  useEffect(() => {
    return () => cleanupMap();
  }, [cleanupMap]);

  return <div ref={setMap} className={classes.map}></div>;
};
