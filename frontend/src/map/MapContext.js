import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useCallback,
  useState,
} from "react";

const HERE_API_KEY = "RbZLTMF6pE8HQM7sJeHHvulc9t1ZM92kgGTPb45Yhhs";
const HERE_STYLE = "reduced.night";
const HERE_TILE_URL = `https://2.base.maps.ls.hereapi.com/maptile/2.1/maptile/newest/${HERE_STYLE}/{z}/{x}/{y}/512/png8?apiKey=${HERE_API_KEY}&ppi=320`;

export const MapContext = createContext({
  map: null,
});
MapContext.displayName = "MapContext";

export const MapProvider = ({ children }) => {
  const [map, setMapRaw] = useState(null);
  const [drawControl, setDrawControlRaw] = useState(null);
  const drawnItems = useRef(null);
  const [popup, setPopupRaw] = useState(null);

  const setMap = useCallback((ref) => {
    if (!ref) {
      return;
    }

    const map = window.L.map(ref, {
      center: [52.677, 8.431297],
      zoom: 11,
      layers: [window.L.tileLayer(HERE_TILE_URL)],
    });
    map.attributionControl.addAttribution("&copy; HERE 2021");

    // Add draw feature
    drawnItems.current = new window.L.FeatureGroup();
    map.addLayer(drawnItems.current);
    const drawControl = new window.L.Control.Draw({
      draw: false,
      edit: {
        edit: false,
        featureGroup: drawnItems.current,
      },
    });
    map.addControl(drawControl);
    setMapRaw(map);
    setDrawControlRaw(drawControl);
    console.log("init map");
  }, []);

  const cleanupMap = useCallback(() => {
    return () => {
      // cleanup map
      map.remove();
    };
  }, [map]);

  const setPopup = useCallback(
    (data) => {
      setPopupRaw(data);
    },
    [setPopupRaw]
  );

  // memoize provider value to prevent unnecessary re-renderings
  const value = useMemo(
    () => ({
      setMap,
      cleanupMap,
      setPopup,
      map: map,
      drawControl: drawControl,
      popup,
    }),
    [setMap, cleanupMap, setPopup, map, drawControl, popup]
  );

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
};
