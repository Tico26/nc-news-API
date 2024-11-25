const endpointsJson = require("../endpoints.json");
exports.getApiController = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};
