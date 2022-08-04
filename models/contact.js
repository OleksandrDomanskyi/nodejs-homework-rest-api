const { Schema, model } = require('mongoose');
const Joi = require("joi");

const contactSchema = Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
    },
}, { versionKey: false, timestamps: true });

const contactAddSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    favorite: Joi.boolean(),
});

const contactUpdateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required()
});

const schemas = {
    add: contactAddSchema,
    updateFavorite: contactUpdateFavoriteSchema,
};

const Contact = model('contact', contactSchema);

module.exports = {
    Contact,
    schemas,
};