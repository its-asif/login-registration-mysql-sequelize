const router = require('express').Router();

const {register, login} = require('../controllers/authController');
// app.use('/', (req, res) => { res.send('its woorking') });

router.post('/register', register);

router.post('/login', login);

module.exports = router;