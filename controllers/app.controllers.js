const endpointsJson = require("../endpoints.json");
exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res) => {
  res
    .status(200)
    .send({ topics: endpointsJson["GET /api/topics"].exampleResponse.topics });
};
