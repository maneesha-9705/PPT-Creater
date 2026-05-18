const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register
const register = async (req, res) => {
  const { name, email, password, collegeName, teamName } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Please fill all fields' });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already registered' });
  const user = await User.create({ name, email, password, collegeName, teamName });
  res.status(201).json({ _id: user._id, name: user.name, email: user.email, collegeName: user.collegeName, teamName: user.teamName, token: generateToken(user._id) });
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (!user) {
    return res.status(404).json({ 
      message: "You don't have any account. Please create one to sign in.",
      code: 'ACCOUNT_NOT_FOUND'
    });
  }

  if (await user.matchPassword(password)) {
    res.json({ 
      _id: user._id, 
      name: user.name, 
      email: user.email, 
      collegeName: user.collegeName, 
      teamName: user.teamName, 
      token: generateToken(user._id) 
    });
  } else {
    res.status(401).json({ message: 'Invalid password. Please try again.' });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

module.exports = { register, login, getMe };
