const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, role, email, name) => {
  return jwt.sign(
    { id, role, email, name },
    process.env.JWT_SECRET || 'careermate_super_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

// Register User
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role, university, degree, companyName, industry, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'student',
      studentDetails: {
        university: university || 'Metropolitan University',
        degree: degree || 'B.Tech Computer Science',
        graduationYear: 2026,
        phone: phone || ''
      },
      companyDetails: {
        companyName: companyName || name,
        industry: industry || 'Technology',
        isVerified: true
      }
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentDetails: user.studentDetails,
        companyDetails: user.companyDetails,
        token: generateToken(user._id, user.role, user.email, user.name)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        studentDetails: user.studentDetails,
        companyDetails: user.companyDetails,
        token: generateToken(user._id, user.role, user.email, user.name)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Current User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      if (req.body.studentDetails) {
        user.studentDetails = { ...user.studentDetails, ...req.body.studentDetails };
      }
      if (req.body.companyDetails) {
        user.companyDetails = { ...user.companyDetails, ...req.body.companyDetails };
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        studentDetails: updatedUser.studentDetails,
        companyDetails: updatedUser.companyDetails,
        token: generateToken(updatedUser._id, updatedUser.role, updatedUser.email, updatedUser.name)
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
