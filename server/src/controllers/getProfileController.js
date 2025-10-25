exports.getProfile = (req, res) => {
  const {
    userId,
    username,
    firstName,
    lastName,
    role,
    createdAt,
  } = req.user;

  res.status(200).json({
    message: 'Доступ к профилю разрешён',
    userId,
    username,
    firstName,
    lastName,
    role,
    createdAt,
  });
};