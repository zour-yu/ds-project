const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  // ✅ TEMP BYPASS
  if (token === "FAKE_TOKEN") {
    req.user = { uid: "FAKE_USER_123" };
    return next();
  }

  return res.status(401).json({ message: "Unauthorized (no real token yet)" });
};

module.exports = { verifyToken };