import { useCallback, useEffect, useRef, useState } from "react";
import { useMap } from "map";

export const useSightsOnMap = () => {
  const { map, setPopup } = useMap();
  const mapLayer = useRef(null);
  const mapSights = useRef({});
  const mapPopupLayer = useRef(null);

  const [sights, setSights] = useState();

  useEffect(() => {
    if (!mapLayer.current && !mapPopupLayer.current && map) {
      mapLayer.current = new window.L.FeatureGroup();
      map.addLayer(mapLayer.current);

      mapPopupLayer.current = new window.L.FeatureGroup();
      map.addLayer(mapPopupLayer.current);

      mapLayer.current.on("click", ({ layer }) => {
        if (layer?.feature?.properties?.id) {
          console.log(layer.feature.geometry.type);
          const { lat, lng } =
            layer.feature.geometry.type === "Point"
              ? layer.getLatLng()
              : layer.getBounds().getCenter();
          setPopup({
            sightId: layer.feature.properties.id,
            latLng: [lat, lng],
          });
        }
      });
    }
    return () => {
      if (map) {
        map.removeLayer(mapLayer.current);
      }
    };
  }, [map, setPopup]);

  useEffect(() => {
    return () => setPopup(null);
  }, [setPopup]);

  useEffect(() => {
    if (Array.isArray(sights) && sights.length > 0 && mapLayer.current) {
      mapLayer.current.clearLayers();
      mapSights.current = {};
      sights.forEach((sight) => {
        mapSights.current[sight.properties.id] = window.L.geoJson(sight, {
          style: { color: "blue" },
        });
        mapLayer.current.addLayer(mapSights.current[sight.properties.id]);
      });
      map.fitBounds(mapLayer.current.getBounds());
    }
  }, [sights, map]);

  const highlightSightOnMap = useCallback((id) => {
    if (mapSights.current[id]) {
      mapSights.current[id].setStyle({ color: "red" });
    }
  }, []);

  const resetHighlightSightOnMap = useCallback((id) => {
    if (mapSights.current[id]) {
      mapSights.current[id].setStyle({ color: "blue" });
    }
  }, []);

  return { highlightSightOnMap, resetHighlightSightOnMap, setSights };
};
