const { User } = require('../../models/user');

const logOut = async (req, res) => {
    const { _id } = req.user
    await User.findByIdAndUpdate(_id, { token: '' })
    res.status(204).json({})
};

module.exports = logOut;