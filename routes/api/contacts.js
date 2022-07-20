const express = require('express')
const Joi = require("joi")

const Contact = require('../../models/contact')

const {createError} = require("../../helpers")

const router = express.Router()

const contactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean(),
})
const contactFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required()
})

router.get('/', async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.json(result)
  } catch (error) {
    next(error);
    // res.status(500).json({
    //   message: "Server error"
    // })
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    if (!result) {
      throw createError(404, "Not found")
      // res.status(404).json({
      //   message: "Not found"
      // });
      // return;
    }
    res.json(result)
  } catch (error) {
    next(error);
  }
})

router.post('/', async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      throw createError(400, error.message)
    }
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
      throw createError(404, "Not found")
    }
    res.json({message: "contact deleted"})
  } catch (error) {
    next(error);
  }
})

router.put('/:contactId', async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      throw createError(400, error.message)
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
      throw createError(404, "Not found")
    }
    res.json(result)
  } catch (error) {
    next(error);
  }
})

router.patch('/:contactId/favorite', async (req, res, next) => {
  try {
    const { error } = contactFavoriteSchema.validate(req.body);
    if (error) {
      throw createError(400, "missing field favorite")
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if (!result) {
      throw createError(404, "Not found")
    }
    res.json(result)
  } catch (error) {
    next(error);
  }
})

module.exports = router
