import { useCallback, useEffect, useRef, useState } from "react";
import { useMap } from "map";

const FEATURE_COLOR_DEFAULT = "#008BB5";
const FEATURE_COLOR_ACTIVE = "#F50057";
const markerHtmlStyles = (bgColor) => `
  background-color: ${bgColor};
  width: 1.2rem;
  height: 1.2rem;
  display: block;
  left: -0.6rem;
  top: -0.6rem;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`;

const CUSTOM_MARKER_CLASSNAME = "leaflet-custom-marker-icon";

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
    if (map && Array.isArray(sights) && sights.length > 0 && mapLayer.current) {
      mapLayer.current.clearLayers();
      mapSights.current = {};

      sights.forEach((sight) => {
        const customMarkerIcon = window.L.divIcon({
          className: `${CUSTOM_MARKER_CLASSNAME}-${sight.properties.id}`,
          iconAnchor: [0, 24],
          labelAnchor: [-6, 0],
          popupAnchor: [0, -36],
          html: `<span style="${markerHtmlStyles(FEATURE_COLOR_DEFAULT)}" />`,
        });

        mapSights.current[sight.properties.id] = window.L.geoJson(sight, {
          pointToLayer: (feature, { lat, lng }) => {
            return window.L.marker([lat, lng], { icon: customMarkerIcon });
          },
          style: { color: FEATURE_COLOR_DEFAULT },
        });
        mapLayer.current.addLayer(mapSights.current[sight.properties.id]);
      });
      map.fitBounds(mapLayer.current.getBounds());
    }
  }, [sights, map]);

  const highlightSightOnMap = useCallback((id) => {
    if (mapSights.current[id]) {
      mapSights.current[id].setStyle({
        color: FEATURE_COLOR_ACTIVE,
      });
      const iconElem = document.querySelector(
        `.${CUSTOM_MARKER_CLASSNAME}-${id} span`
      );
      if (iconElem) {
        iconElem.style.background = FEATURE_COLOR_ACTIVE;
      }
    }
  }, []);

  const resetHighlightSightOnMap = useCallback((id) => {
    if (mapSights.current[id]) {
      mapSights.current[id].setStyle({
        color: FEATURE_COLOR_DEFAULT,
      });
      const iconElem = document.querySelector(
        `.${CUSTOM_MARKER_CLASSNAME}-${id} span`
      );
      if (iconElem) {
        iconElem.style.background = FEATURE_COLOR_DEFAULT;
      }
    }
  }, []);

  return { highlightSightOnMap, resetHighlightSightOnMap, setSights };
};
