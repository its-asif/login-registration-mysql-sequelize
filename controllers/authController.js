const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { User } = require('../models'); // Import User from the models index file
require('dotenv').config();


const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


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
    const verificationToken = uuidv4();

    const user = await User.create({ name, email, password: hashedPassword, verificationToken});
    
    // Send verification email
    const verificationUrl = `${process.env.BASE_URL}api/auth/verify-email?token=${verificationToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification',
      html: `<p>Please verify your email by clicking the link: <a href="${verificationUrl}">Verify Email</a></p>`,
    });

    res.status(201).json({ message: 'User registered successfully. Please verify your email.', user });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Verify Email
const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ where: { verificationToken: token } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ message: 'Email verified successfully' });
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

    if (!user.isVerified) {
      return res.status(401).json({ message: 'Email not verified' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = { register, login, verifyEmail };
