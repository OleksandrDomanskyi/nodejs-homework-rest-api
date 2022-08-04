const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const { v4: uuidv4 } = require('uuid');

const { User } = require('../../models/user');
const { createError, sendMail } = require("../../helpers");

const registerUser = async (req, res) => {
    const { email, password, subscription } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw createError(409, 'Email in use')
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = uuidv4();
    const result = await User.create({ email, password: hashPassword, subscription, avatarURL, verificationToken });
    const mail = {
        to: email,
        subject: "Подтверждение регистрации на Rest API",
        html: `<a terget="_blank" href="http://localhost:3000/api/users/verify/${verificationToken}>Нажмите для подтверждения регистрации"</a>`,
    }
    await sendMail(mail);
    res.status(201).json({
        email: result.email,
        subscription: result.subscription,
    })
};

module.exports = registerUser;