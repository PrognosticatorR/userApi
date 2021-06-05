const express = require('express');
const authRouter = express.Router();
const { signup, signin, signout } = require('../controllers/auth');

const { authProtection } = require('../middlewares/authProtection');

const { runValidation } = require('../validators');
const { userSignupValidator, userSigninValidator } = require('../validators/authValidators');

authRouter.post('/api/signup', signup);
authRouter.post('/api/signin', userSigninValidator, runValidation, signin);
authRouter.post('/api/signout', authProtection, signout);

module.exports = authRouter;
