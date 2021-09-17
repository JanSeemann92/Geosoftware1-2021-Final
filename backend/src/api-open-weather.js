const axios = require("axios");

require("dotenv").config();

const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY || "";

const openWeatherApi = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
});
openWeatherApi.defaults.params = {};
openWeatherApi.defaults.params["appid"] = OPENWEATHERMAP_API_KEY;
openWeatherApi.defaults.params["units"] = "metric";

const getWeatherByPoint = async (geoJson) => {
  const {
    geometry: { coordinates },
  } = geoJson;
  const [lng, lat] = coordinates;

  const { data: weather } = await openWeatherApi.get(
    `/weather?lat=${lat}&lon=${lng}`
  );

  return weather;
};

module.exports = { getWeatherByPoint };
