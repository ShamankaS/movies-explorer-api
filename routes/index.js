const router = require('express').Router();
const movieRoutes = require('./movies');
const userRoutes = require('./users');
const auth = require('../middlewares/auth');
const { NOT_FOUND } = require('../utils/constants');
const NotFoundError = require('../utils/errors/not-found-err');

router.use(auth);
router.use(userRoutes);
router.use(movieRoutes);

router.use('*', () => {
  throw new NotFoundError(NOT_FOUND);
});

module.exports = router;
