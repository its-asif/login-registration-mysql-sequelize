const router = require('express').Router();

const { getAllUsers, getUserById, deleteUser, deleteAllUsers } = require('../controllers/userController');

router.get('/', getAllUsers);

router.get('/:id', getUserById);

router.delete('/:id', deleteUser);

router.delete('/', deleteAllUsers);

module.exports = router;