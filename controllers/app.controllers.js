const comments = require("../db/data/test-data/comments");
const endpointsJson = require("../endpoints.json");
const {
  fetchTopics,
  fetchArticleById,
  fetchAllArticles,
  fetchComments,
} = require("../models/app.models");
exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res) => {
  fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
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

exports.getArticles = (req, res) => {
  fetchAllArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getComments = (req, res, next) => {
  const { article_id } = req.params;
  const promises = [fetchComments(article_id)];
  if (article_id) {
    promises.push(fetchArticleById(article_id));
  }
  Promise.all(promises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
