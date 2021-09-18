const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const { v4: uuidv4 } = require("uuid");
const { getNearestBusStop } = require("./api-busradar");
const { getWeatherByPoint } = require("./api-open-weather");

// loads environment variables from a .env
require("dotenv").config();

const EXPRESS_PORT = process.env.EXPRESS_PORT;

const app = express();
// Set file size limit to 5mb
app.use(bodyParser.json({ limit: "5mb", type: "application/json" }));
app.use(cors());

console.log(
  "process.env.MONGODB_CONNECTION_STRING",
  process.env.MONGODB_CONNECTION_STRING
);

let db;
const start = async () => {
  const mongo = await MongoClient.connect(
    process.env.MONGODB_CONNECTION_STRING
  );
  db = mongo.db("geo");

  app.listen(EXPRESS_PORT, () => {
    console.log("Server started on: " + EXPRESS_PORT);
  });
};

/**
 * Convert sight from db to a standardized GeoJSON.
 * NOTE: Saving the id on top level for performance reasons (!?)
 * @param {string} _id
 * @param {string} id
 * @param {object} properties
 * @param {object} geometry
 */
const convertDBToGeoJSON = ({ _id, id, ...geoJSON }) => ({
  ...geoJSON,
  properties: { ...geoJSON.properties, id },
});

/**
 * Convert sight from GeoJSON for db.
 * @param {object} properties
 * @param {string} properties.id
 * @param {object} geometry
 */
const convertGeoJSONForDB = ({
  properties: { id, ...properties },
  ...others
}) => ({
  ...others,
  id,
  properties,
});

/**
 * Remove Mongo DB _id.
 * @param {string} _id
 */
const removeMongoDBId = ({ _id, ...data }) => data;

app.post("/sights", async (req, res) => {
  const { body } = req;

  // TODO: Test GeoJSON

  const sight = { ...convertGeoJSONForDB(body), id: uuidv4() };

  await db.collection("sights").insertOne(sight);
  res.json(convertDBToGeoJSON(sight));
});

app.put("/sights", async (req, res) => {
  const { body } = req;

  // TODO: Test GeoJSON

  await db
    .collection("sights")
    .updateOne({ id: body.properties.id }, { $set: convertGeoJSONForDB(body) });
  res.json(body);
});

app.get("/sights", async (req, res) => {
  const { search } = req.query;

  const findObj = {};
  if (search && search.length > 0) {
    findObj["properties.name"] = new RegExp(`.*${search}.*`);
  }

  const result = await db.collection("sights").find(findObj).toArray();
  console.log(result);
  res.json(result.map((entry) => convertDBToGeoJSON(entry)));
});

app.get("/sights/:id", async (req, res) => {
  const { id } = req.params;
  const result = await db.collection("sights").findOne({ id });
  console.log(result);
  res.json(convertDBToGeoJSON(result));
});

app.delete("/sights/:id", async (req, res) => {
  const { id } = req.params;
  const result = await db.collection("sights").deleteOne({ id });
  console.log(result);
  res.json({ id });
});

app.get("/sights/:id/infos", async (req, res) => {
  const { id } = req.params;
  const result = await db.collection("sights").findOne({ id });
  console.log("sights infos for", result);

  const busStop = await getNearestBusStop(convertDBToGeoJSON(result));
  const weather = await getWeatherByPoint(busStop);

  res.json({ sightId: id, busStop, weather });
});

app.post("/tours", async (req, res) => {
  const { body } = req;

  // TODO: Check

  const tour = { ...body, id: uuidv4() };

  await db.collection("tours").insertOne(tour);
  res.json(removeMongoDBId(tour));
});

app.put("/tours", async (req, res) => {
  const { body } = req;

  // TODO: Check

  await db.collection("tours").updateOne({ id: body.id }, { $set: body });
  res.json(removeMongoDBId(body));
});

app.get("/tours", async (req, res) => {
  const { search } = req.query;

  const findObj = {};
  if (search && search.length > 0) {
    findObj["name"] = new RegExp(`.*${search}.*`);
  }

  const result = await db.collection("tours").find(findObj).toArray();
  console.log(result);
  res.json(result.map((entry) => removeMongoDBId(entry)));
});

app.get("/tours/:id", async (req, res) => {
  const { id } = req.params;
  const result = await db.collection("tours").findOne({ id });
  console.log(result);
  res.json(removeMongoDBId(result));
});

app.delete("/tours/:id", async (req, res) => {
  const { id } = req.params;
  const result = await db.collection("tours").deleteOne({ id });
  console.log(result);
  res.json({ id });
});

// Start server
start();
