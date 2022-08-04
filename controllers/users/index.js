const registerUser = require('./registerUser');
const loginUser = require('./loginUser');
const logOut = require('./logoutUser');
const getCurrentUser = require('./getCurrentUser');
const updateSubscriptionById = require('./updateSubscriptionById');
const uploadUserAvatar = require('./uploadUserAvatar');
const verifyUserEmailByToken = require('./verifyUserEmailByToken');
const sendUserVerificationEmail = require('./sendUserVerificationEmail');

module.exports = {
    registerUser,
    loginUser,
    logOut,
    getCurrentUser,
    updateSubscriptionById,
    uploadUserAvatar,
    verifyUserEmailByToken,
    sendUserVerificationEmail,
}