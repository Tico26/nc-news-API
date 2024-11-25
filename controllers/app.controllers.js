const endpointsJson = require("../endpoints.json");
const data = require("../db/data/test-data/index");
const { fetchArticleById } = require("../models/app.models");
exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res) => {
  res
    .status(200)
    .send({ topics: endpointsJson["GET /api/topics"].exampleResponse.topics });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
