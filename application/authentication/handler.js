module.exports.handleRequest = async(req, res) => {
  if (!req.user) {
    res.status(400).send(req.error);
  }
  res.status(200).send(req.user);
};
