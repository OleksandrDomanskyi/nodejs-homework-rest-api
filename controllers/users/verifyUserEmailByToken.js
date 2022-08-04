const { User } = require('../../models/user');

const verifyUserEmailByToken = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw createError(404, 'User not found');
    }
    await User.findByIdAndUpdate(user._id, { verificationToken: '', verify: true });
    res.json({
        message: 'Verification successful',
    })
};

module.exports = verifyUserEmailByToken;