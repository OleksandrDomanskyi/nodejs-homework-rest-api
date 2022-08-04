const express = require('express');

const { authorize, validationBody, upload } = require('../../middlewares');
const ctrl = require('../../controllers/users');
const { ctrlWrapper } = require('../../helpers');
const { schemas } = require('../../models/user');

const router = express.Router();

router.post('/signup', validationBody(schemas.signup), ctrlWrapper(ctrl.registerUser));
router.get('/verify/:verificationToken', ctrlWrapper(ctrl.verifyUserEmailByToken));
router.post('/verify', validationBody(schemas.verifyEmail), ctrlWrapper(ctrl.sendUserVerificationEmail));
router.post('/login', validationBody(schemas.login), ctrlWrapper(ctrl.loginUser));
router.get('/logout', authorize, ctrlWrapper(ctrl.logOut));
router.get('/current', authorize, ctrl.getCurrentUser);
router.patch('/subscription', authorize, validationBody(schemas.updateSubscription), ctrlWrapper(ctrl.updateSubscriptionById));
router.patch('/avatars', authorize, upload.single('avatar'), ctrlWrapper(ctrl.uploadUserAvatar));

module.exports = router;