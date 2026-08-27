const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HustleHub+ API is running over HTTPS'
  });
};

module.exports = { getHealth };
