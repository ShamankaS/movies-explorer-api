const userRoutes = require('express').Router();
const { getMe, updateUserData } = require('../controllers/users');
const { validateUserData } = require('../utils/validators/userValidator');

userRoutes.get('/users/me', getMe);
userRoutes.patch('/users/me', validateUserData, updateUserData);

module.exports = userRoutes;
