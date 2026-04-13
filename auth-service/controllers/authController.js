const User = require('../models/User');
const admin = require('../config/firebase');

// @desc    Register a new user in MongoDB and set Firebase Custom Claims
// @route   POST /api/auth/register
// @access  Private (Requires Firebase Token)
const registerUser = async (req, res) => {
  try {
    // uid and email come from the verified Firebase token (via authMiddleware)
    const { uid: firebaseId, email } = req.user; 
    const { name, role, phoneNumber, address } = req.body;

    // 1. Validate the role
    const validRoles = ['patient', 'doctor', 'admin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided.' });
    }

    // 2. Check if the user already exists in our MongoDB
    let user = await User.findOne({ firebaseId });
    if (user) {
      return res.status(400).json({ message: 'User already registered in the system.', user });
    }

    // 3. Save the new user into MongoDB
    user = new User({
      firebaseId,
      email,
      name,
      role,
      phoneNumber,
      address
    });
    await user.save();

    // 4. Set Custom Claims in Firebase (Option A - Embed the role in the token)
    await admin.auth().setCustomUserClaims(firebaseId, { role: role });

    // Note: Once custom claims are set, the frontend needs to force a token refresh 
    // to get the new claims inside their token payload.
    res.status(201).json({
      message: 'User registered successfully and Firebase claims updated.',
      user
    });

  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Server Configuration Error', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found in MongoDB' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, phoneNumber, address } = req.body;
    
    const user = await User.findOne({ firebaseId: req.user.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name || user.name;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;
    user.updatedAt = Date.now();

    await user.save();
    res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = { registerUser, getUserProfile, updateUserProfile };
