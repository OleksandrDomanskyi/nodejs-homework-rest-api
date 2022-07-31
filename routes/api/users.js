const express = require('express');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp')

const User = require('../../models/user');

const { createError } = require("../../helpers")

const { authorize, upload } = require('../../middlewares')

const router = express.Router();

// const emailRegexp = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

const userRegisterSchema = Joi.object({
    // email: Joi.string().pattern(emailRegexp).required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string()
        .valid("starter", "pro", "business")
        .default('starter'),
    token: Joi.string(),
})

const userLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
})

const userUpdateSubscriptionSchema = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business"),
})

const { SECRET_KEY } = process.env;

router.post('/signup', async (req, res, next) => {
    try {
        const { error } = userRegisterSchema.validate(req.body);
        if (error) {
            throw createError(400)
        }
        const { email, password, subscription } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            throw createError(409, 'Email in use')
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const avatarURL = gravatar.url(email);
        const result = await User.create({ email, password: hashPassword, subscription, avatarURL });
        res.status(201).json({
            email: result.email,
            subscription: result.subscription,
        })
    } catch (error) {
        next(error)
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const { error } = userLoginSchema.validate(req.body);
        if (error) {
            throw createError(400)
        }
        const { email, password } = req.body;
        // const user = await User.findOne({ email });
        // const passwordCompare = await bcrypt.compare(password, user?.password);
        // if (!user || !passwordCompare) {
        //     throw createError(401, 'Email or password is wrong')
        // }
        const user = await User.findOne({ email });
        if (!user) {
            throw createError(401, 'Email or password is wrong')
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            throw createError(401, 'Email or password is wrong')
        }
        const payload = {
            id: user._id
        }
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
        await User.findByIdAndUpdate(user._id, {token})
        res.json({
            token
        })
    } catch (error) {
        next(error)
    }
})

router.get('/logout', authorize, async (req, res, next) => {
    try {
        const { _id } = req.user
        await User.findByIdAndUpdate(_id, { token: '' })
        res.status(204).json({})
    } catch (error) {
        next(error)
    }
})

router.get('/current', authorize, async (req, res) => {
    const { email, subscription } = req.user
    res.status(200).json({
        email,
        subscription,
    })
})

router.patch('/subscription', authorize, async (req, res, next) => {
    try {
        const { _id } = req.user
        const { error } = userUpdateSubscriptionSchema.validate(req.body)
        if (error) {
            throw createError(400)
        }
        const result = await User.findByIdAndUpdate(_id, req.body, { new: true })
        res.json('Subscription updated')
        if (!result) {
            throw createError(404, "Not found")
        }
        res.json(result)
    } catch (error) {
        next(error)
    }
})

const avatarDir = path.join(__dirname, '../../', 'public', 'avatars')

router.patch('/avatars', authorize, upload.single('avatar'), async (req, res, next) => {
    try {
        const {_id} = req.user
        const { path: tempDir, originalname } = req.file
        const [extention] = originalname.split('.').reverse()
        const newAvatar = `${_id}.${extention}`
        const uploadDir = path.join(avatarDir, newAvatar)
        await fs.rename(tempDir, uploadDir)
        const avatarURL = path.join('avatars', newAvatar)
        Jimp.read(uploadDir, (err, lenna) => {
            if (err) throw err;
            lenna
                .resize(250, 250)
                .write(uploadDir)
        })
        await User.findByIdAndUpdate(req.user._id, { avatarURL })
        res.json({avatarURL})
    } catch (error) {
        await fs.unlink(req.file.path)
        next(error)
    }
})

module.exports = router;