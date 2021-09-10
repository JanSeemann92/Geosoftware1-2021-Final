import { useCallback, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";

const HERE_API_KEY = "RbZLTMF6pE8HQM7sJeHHvulc9t1ZM92kgGTPb45Yhhs";
const HERE_STYLE = "reduced.night";
const HERE_TILE_URL = `https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/${HERE_STYLE}/{z}/{x}/{y}/512/png8?apiKey=${HERE_API_KEY}&ppi=320`;

const useStyles = makeStyles((theme) => ({
  map: {
    height: "100%",
    width: "100%",
  },
}));

export const Map = () => {
  const classes = useStyles();
  const map = useRef(null);

  const setMap = useCallback((ref) => {
    if (!ref || map.current) {
      return;
    }

    map.current = window.L.map(ref, {
      center: [52.677, 8.431297],
      zoom: 11,
      layers: [window.L.tileLayer(HERE_TILE_URL)],
    });
    map.current.attributionControl.addAttribution("&copy; HERE 2021");
  }, []);

  return <div ref={setMap} className={classes.map}></div>;
};
