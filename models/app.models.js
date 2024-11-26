const db = require("../db/connection");

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

exports.fetchAllArticles = () => {
  return db
    .query(
      `SELECT CAST(COUNT(comments.article_id) AS INTEGER) AS comment_count, 
      articles.article_id,articles.title,articles.topic, articles.author,articles.created_at,articles.votes,articles.article_img_url 
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id 
      GROUP BY articles.article_id 
      ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};
