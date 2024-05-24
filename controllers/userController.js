const { User } = require('../models');


const getAllUsers = async(req, res) => {
    
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getUserById = async(req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteUser = async(req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.destroy();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const deleteAllUsers = async(req, res) => {
    try {
        await User.destroy({ where: {} });
        res.json({ message: 'All users deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = { getAllUsers, getUserById, deleteUser, deleteAllUsers};