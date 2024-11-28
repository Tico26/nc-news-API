const db = require("../db/connection");
const { sort } = require("../db/data/development-data/articles");

exports.fetchTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (!rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `No article found with id of ${article_id}`,
        });
      }

      return rows[0];
    });
};

exports.fetchAllArticles = (sort_by = "created_at", order = "DESC") => {
  const acceptedSortByInputs = [
    "article_id",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
  ];
  const acceptedOrderInputs = ["ASC", "DESC"];

  if (sort_by && !acceptedSortByInputs.includes(sort_by)) {
    return Promise.reject({
      status: 400,
      msg: "Sort By not inputted correctly",
    });
  }
  if (order && !acceptedOrderInputs.includes(order)) {
    return Promise.reject({ status: 400, msg: "Order not inputted correctly" });
  }
  return db
    .query(
      `SELECT CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count, 
      articles.article_id,articles.title,articles.topic, articles.author,articles.created_at,articles.votes,articles.article_img_url 
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id 
      GROUP BY articles.article_id 
      ORDER BY articles.${sort_by} ${order}`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchComments = (article_id) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      return rows;
    });
};

exports.createComment = (article_id, username, body) => {
  return db
    .query(
      `INSERT INTO comments (body, author, article_id) VALUES ($1,$2,$3) RETURNING *`,
      [body, username, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
    SET votes = votes + $1
    WHERE article_id= $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.deleteCommentById = (comment_id) => {
  return db.query(`DELETE FROM comments WHERE comment_id=$1`, [comment_id]);
};

exports.fetchUsers = () => {
  return db.query(`SELECT * FROM users`).then(({ rows }) => {
    return rows;
  });
};
