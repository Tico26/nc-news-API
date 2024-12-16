const cors = require("cors");
const express = require("express");
const {
  getApi,
  getTopics,
  getArticleById,
  getArticles,
  getComments,
  postComment,
  patchVotes,
  deleteComment,
  getUsers,
} = require("./controllers/app.controllers");
const app = express();
app.use(cors());
//GET
app.use(express.json());

//api
app.get("/api", getApi);

//topics
app.get("/api/topics", getTopics);

//article
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);

//comments
app.get("/api/articles/:article_id/comments", getComments);

//users
app.get("/api/users", getUsers);

app.post("/api/articles/:article_id/comments", postComment);

app.patch("/api/articles/:article_id", patchVotes);

app.delete("/api/comments/:comment_id", deleteComment);

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
});
module.exports = { app };
