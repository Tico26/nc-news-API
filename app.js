const express = require("express");
const {
  getApi,
  getTopics,
  getArticleById,
} = require("./controllers/app.controllers");
const app = express();
app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
module.exports = { app };
