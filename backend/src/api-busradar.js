const axios = require("axios");
const nearestPoint = require("@turf/nearest-point");
const centroid = require("@turf/centroid");

const busRadarApi = axios.create({
  baseURL: "https://rest.busradar.conterra.de/prod/",
});

const getNearestBusStop = async (geoJson) => {
  const { data: busStops } = await busRadarApi.get("/haltestellen");

  const isPolygon = geoJson.geometry.type === "Polygon";
  const point = isPolygon ? centroid.default(geoJson) : geoJson;

  const nearestBusStop = nearestPoint.default(point, busStops);

  return nearestBusStop;
};

module.exports = { getNearestBusStop };
