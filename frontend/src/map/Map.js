import { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { makeStyles } from "@material-ui/core/styles";
import { useMap, SightPopup } from "map";
import "./map.css";

const useStyles = makeStyles((theme) => ({
  map: {
    height: "100%",
    width: "100%",
  },
}));

export const Map = () => {
  const classes = useStyles();
  const popupElem = useRef(document.createElement("div"));
  const { setMap, map, cleanupMap, popup } = useMap();

  useEffect(() => {
    return () => cleanupMap();
  }, [cleanupMap]);

  useEffect(() => {
    if (!map) {
      return;
    }
    if (!popup) {
      map.closePopup();
      return;
    }
    window.L.popup()
      .setLatLng(popup.latLng)
      .setContent(popupElem.current)
      .openOn(map);
    // cleanup
    return () => map.closePopup();
  }, [map, popup]);

  return (
    <>
      {ReactDOM.createPortal(
        popup?.sightId ? <SightPopup id={popup.sightId} /> : null,
        popupElem.current
      )}
      <div ref={setMap} className={classes.map}></div>
    </>
  );
};
