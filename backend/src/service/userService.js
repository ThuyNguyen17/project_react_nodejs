const User = require('../models/User');

const updateUser = async (id, userData) => {
    const existing = await User.findById(id);
    if (!existing) {
        throw new Error('User not found');
    }

    if (userData.username && userData.username.trim() !== '') {
        existing.username = userData.username;
    }

    if (userData.password && userData.password.trim() !== '') {
        existing.password = userData.password;
    }

    return await existing.save();
};

module.exports = {
    updateUser
};
