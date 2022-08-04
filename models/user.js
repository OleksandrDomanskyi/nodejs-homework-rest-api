const { Schema, model } = require('mongoose');
const Joi = require("joi");

const userSchema = Schema({
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    token: {
        type: String,
        default: null,
    },
    avatarURL: {
        type: String,
        required: true,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        required: [true, 'Verify token is required'],
    },
}, { versionKey: false, timestamps: true });

// const emailRegexp = /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/;

const userRegisterSchema = Joi.object({
    // email: Joi.string().pattern(emailRegexp).required(),
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string()
        .valid("starter", "pro", "business")
        .default('starter'),
    token: Joi.string(),
});

const userLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
});

const userUpdateSubscriptionSchema = Joi.object({
    subscription: Joi.string().valid("starter", "pro", "business"),
});

const verifyEmailSchema = Joi.object({
    email: Joi.string().required(),
});

const schemas = {
    signup: userRegisterSchema,
    login: userLoginSchema,
    updateSubscription: userUpdateSubscriptionSchema,
    verifyEmail: verifyEmailSchema,
}

const User = model('user', userSchema);

module.exports = {
    User,
    schemas,
};