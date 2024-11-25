const express = require("express");
const { getApiController } = require("./controllers/app.controllers");
const app = express();
app.use(express.json());

app.get("/api", getApiController);
module.exports = { app };
