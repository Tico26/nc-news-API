const endpointsJson = require("../endpoints.json");
const { app } = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const db = require("../db/connection");
const request = require("supertest");
/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  db.end();
});
describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with article object with a specific set of properties", () => {
    return request(app)
      .get("/api/articles/1", () => {})
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          body: expect.any(String),
          topic: expect.any(String),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
        });
      });
  });

  test("400: Responds with a bad request message if article ID does not exist", () => {
    return request(app)
      .get("/api/articles/not_an_id")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects with given properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles.length).toBe(13);
        expect(articles).toBeSortedBy("created_at", { descending: true });
        articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          });
        });
      });
  });
  test("200: Response should not have a body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).not.toHaveProperty("body");
      });
  });
  test("200: Articles should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("Get /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of objects with the correct properties on each", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(11);
        comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("404: Returns message when article does not exist", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("No article found with id of 999");
      });
  });
  test("400: Returns message when article ID is in incorrect format", () => {
    return request(app)
      .get("/api/articles/not_an_id/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:articles_id/comments", () => {
  test("204: Responds with the posted message on the specified ID", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .expect(201)
      .send({ username: "icellusedkars", body: "test_message" })
      .then(({ body: { comment } }) => {
        expect(comment).toMatchObject({
          body: "test_message",
          author: "icellusedkars",
          article_id: 1,
        });
      });
  });

  test("400: Returns Bad Request when body does not contain correct fields", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .expect(400)
      .send({ username: "invalid" })
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds with updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .expect(200)
      .send({ inc_votes: 1 })
      .then(({ body: { article } }) => {
        expect(article).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: 101,
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: Responds with Bad Request when wrong value type is inputted", () => {
    return request(app)
      .patch("/api/articles/:article_id")
      .expect(400)
      .send({ inc_votes: "invalid" })
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });

  test("400: Responds with Bad Request when incorrct field is passed in", () => {
    return request(app)
      .patch("/api/articles/:article_id")
      .expect(400)
      .send({ something_else: "invalid" })
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});
describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds status code for deleted item", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });

  test("400: Responds with Bad Request when wrong value type is inputted", () => {
    return request(app)
      .delete("/api/comments/not_an_id")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });

  // test("404: Responds with Not Found when ID doesn't exist", () => {
  //   return request(app)
  //     .delete("/api/comments/999")
  //     .expect(404)
  //     .then(({ body: { msg } }) => {
  //       expect(msg).toBe("Bad Request");
  //     });
  // });
});
