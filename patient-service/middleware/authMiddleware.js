const admin = require('../config/firebase');

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided, authorization denied' });
        }

        const token = authHeader.split(' ')[1];

        // Verify token with Firebase
        const decodedToken = await admin.auth().verifyIdToken(token);
        
        // Attach the user's firebaseId and role to the request object
        req.user = {
            firebaseId: decodedToken.uid,
            role: decodedToken.role // if role was set as a custom claim
        };
        
        next(); // Move to the next function (the controller)
    } catch (error) {
        console.error('Error verifying token:', error.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = { verifyToken };
