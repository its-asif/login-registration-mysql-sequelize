const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // Import User from the models index file
require('dotenv').config();

// Register
const register = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {

      if(!user) return res.status(401).json({ message: 'User doesn\'t exists' });
      return res.status(401).json({ message: 'password doesn\'t match' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { register, login };
