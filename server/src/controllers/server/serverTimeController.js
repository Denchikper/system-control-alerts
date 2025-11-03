exports.serverTimeController = (req, res) => {
  res.status(200).json({
    serverTime: new Date(),
  });
};