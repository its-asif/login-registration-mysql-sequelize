const { User } = require('../models');


const getAllUsers = async(req, res) => {
    
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = { getAllUsers };