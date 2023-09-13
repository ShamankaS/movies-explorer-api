const router = require('express').Router();
const movieRoutes = require('./movies');
const userRoutes = require('./users');
const { login, createUser, logout } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { NOT_FOUND } = require('../utils/constants');
const NotFoundError = require('../utils/errors/not-found-err');
const { validateLogin, validateCreateUser } = require('../utils/validators/userValidator');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

router.use(auth);

router.use(userRoutes);
router.use(movieRoutes);
router.get('/signout', logout);

router.use('*', () => {
  throw new NotFoundError(NOT_FOUND);
});

module.exports = router;
