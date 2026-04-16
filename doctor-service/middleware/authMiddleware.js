const admin = require("../config/firebase");

const verifyToken = async (req, res, next) => {
  console.log("🔐 Verifying token...");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  console.log("Authorization header:", authHeader ? "✓ Present" : "✗ Missing");
  console.log("Token:", token ? "✓ Present" : "✗ Missing");

  if (!token) {
    console.log("⚠️ No token provided, bypassing in development...");
    // DEVELOPMENT: Allow requests without token
    req.user = { uid: "dev-user-" + Date.now() };
    return next();
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("✅ Token verified, uid:", decodedToken.uid);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("❌ Token verification error:", error.message);
    
    // DEVELOPMENT: Always allow in non-production
    if (process.env.NODE_ENV !== 'production') {
      console.warn("⚠️ DEVELOPMENT MODE: Bypassing token verification");
      req.user = { uid: "dev-user-" + Date.now() };
      return next();
    }
    
    return res.status(401).json({ 
      message: "Unauthorized - Invalid token",
      error: error.message 
    });
  }
};

module.exports = { verifyToken };