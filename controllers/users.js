const { mongoose } = require('mongoose');
const User = require('../models/user');
const NotFoundError = require('../utils/errors/not-found-err');
const BadRequestError = require('../utils/errors/bad-request-err');
const { NOT_FOUND_USER, INCORRECT_DATA } = require('../utils/constants');

module.exports.getMe = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id });
    res.send(user);
  } catch (err) {
    return next(err);
  }
};

module.exports.updateUserData = async (req, res, data, next) => {
  try {
    const { name, email } = req.body;
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      next(new NotFoundError(NOT_FOUND_USER));
    } else if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError(INCORRECT_DATA));
    } else {
      next(err);
    }
  }
};
