const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const UnauthorizedError = require('../utils/errors/unauthorized-err');
const { INCORRECT_EMAIL_OR_PASS, EMAIL_ERROR } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: EMAIL_ERROR,
    },
  },
  password: {
    type: String,
    require: true,
    select: false,
  },
  name: {
    type: String,
    require: true,
    minlength: [2, 'Минимальная длина поля 2 символа'],
    maxlength: [30, 'Максимальная длина поля 30 символов'],
  },
});

userSchema.statics.findUserByCredentials = async function (email, password) {
  try {
    const user = await this.findOne({ email }).select('+password');
    if (!user) {
      return Promise.reject(new UnauthorizedError(INCORRECT_EMAIL_OR_PASS));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return Promise.reject(new UnauthorizedError(INCORRECT_EMAIL_OR_PASS));
    }
    return user;
  } catch (err) {
    console.log(err);
  }
};

module.exports = mongoose.model('user', userSchema);
