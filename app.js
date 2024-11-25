const express = require("express");
const { getApi, getTopics } = require("./controllers/app.controllers");
const app = express();
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
module.exports = { app };
