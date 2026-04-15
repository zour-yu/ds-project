const User = require('../models/User');
const admin = require('../config/firebase');

// @desc    Register a new user (Creates in MongoDB + Custom Claims)
// @route   POST /api/auth/register
// @access  Private (Frontend calls this AFTER Firebase registration)
const registerUser = async (req, res) => {
  try {
    const { email, name, role, phoneNumber, address } = req.body;
    const firebaseId = req.user.uid;

    const user = new User({
      firebaseId,
      email,
      name,
      role: role || 'patient',
      phoneNumber,
      address
    });
    await user.save();

    // 2. Add Custom Claims for RBAC
    await admin.auth().setCustomUserClaims(firebaseId, { role: role || 'patient' });

    res.status(201).json({
      message: 'User registered in MongoDB with custom claims.',
      user
    });

  } catch (error) {
    console.error('Error in registerUser:', error);
    res.status(500).json({ message: 'Registration Error', error: error.message });
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
