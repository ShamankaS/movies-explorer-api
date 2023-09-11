const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/unauthorized-err');
const { UNAUTHORIZED } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  let payload;
  try {
    const { token } = req.cookies;
    if (!token) {
      return next(new UnauthorizedError(UNAUTHORIZED));
    }
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return next(new UnauthorizedError(UNAUTHORIZED));
  }
  req.user = payload;
  next();
};
