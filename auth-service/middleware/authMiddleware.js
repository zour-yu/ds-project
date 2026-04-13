const admin = require('../config/firebase');

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    
    // Attach the decoded user info to the request object
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token', error: error.message });
  }
};

module.exports = { verifyToken };
