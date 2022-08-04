const express = require('express');

const { authorize, validationBody, isValidId } = require('../../middlewares');
const ctrl = require('../../controllers/contacts');
const { ctrlWrapper } = require('../../helpers');
const { schemas } = require('../../models/contact');

const router = express.Router();

router.get('/', authorize, ctrlWrapper(ctrl.getAll));
router.get('/:contactId', authorize, isValidId, ctrlWrapper(ctrl.getById));
router.post('/', authorize, validationBody(schemas.add), ctrlWrapper(ctrl.add));
router.delete('/:contactId', authorize, isValidId, ctrlWrapper(ctrl.removeById));
router.put('/:contactId', authorize, isValidId, validationBody(schemas.add), ctrlWrapper(ctrl.updateById));
router.patch('/:contactId/favorite', authorize, isValidId, validationBody(schemas.updateFavorite), ctrlWrapper(ctrl.updateFavorite));

module.exports = router;
