const router = require('express').Router();

const {register, login, verifyEmail} = require('../controllers/authController');
// app.use('/', (req, res) => { res.send('its woorking') });

router.post('/register', register);

router.get('/verify-email', verifyEmail);

router.post('/login', login);

module.exports = router;