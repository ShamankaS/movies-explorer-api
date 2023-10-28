const { mongoose } = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../utils/errors/not-found-err');
const BadRequestError = require('../utils/errors/bad-request-err');
const ConflictError = require('../utils/errors/conflict-err');
const {
  NOT_FOUND_USER, INCORRECT_DATA, SUCCESS_CREATED_CODE,
  CONFLICT_USER_REGISTERED, AUTHORIZATION_SUCCESS, LOGOUT_SUCCESS, COOKIE_AUTH,
} = require('../utils/constants');
const { getJWT } = require('../utils/getJWT');

module.exports.getMe = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id });
    res.send(user);
  } catch (err) {
    return next(err);
  }
};

module.exports.updateUserData = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email },
      { new: true, runValidators: true },
    ).orFail();
    res.send(user);
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError(CONFLICT_USER_REGISTERED));
    } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
      next(new NotFoundError(NOT_FOUND_USER));
    } else if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError(INCORRECT_DATA));
    } else {
      next(err);
    }
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const key = getJWT();
    const token = jwt.sign({ _id: user._id }, key, { expiresIn: '7d' });
    return res.cookie(COOKIE_AUTH, token, {
      maxAge: 3600000 * 24 * 7,
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    }).send({ message: AUTHORIZATION_SUCCESS });
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
};

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      name, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const createdUser = await User.create({ name, email, password: hash });
    // удаляем пароль созданного пользователя из ответа
    const user = createdUser.toObject();
    delete user.password;
    res.status(SUCCESS_CREATED_CODE).send(user);
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError(CONFLICT_USER_REGISTERED));
    } else if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError(INCORRECT_DATA));
    } else {
      next(err);
    }
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    return res.clearCookie(COOKIE_AUTH, {
      sameSite: 'None',
      secure: true,
    }).send({ message: LOGOUT_SUCCESS });
  } catch (err) {
    return next(err);
  }
};
