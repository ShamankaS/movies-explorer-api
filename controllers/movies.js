const { mongoose } = require('mongoose');
const Movie = require('../models/movie');
const { SUCCESS_CREATED_CODE, MOVIE_NOT_FOUND, FORBIDDEN_DELETE_MOVIE } = require('../utils/constants');
const BadRequestError = require('../utils/errors/bad-request-err');
const NotFoundError = require('../utils/errors/not-found-err');
const ForbiddenError = require('../utils/errors/forbidden-err');

module.exports.getMovie = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user._id });
    res.send(movies);
  } catch (err) {
    next(err);
  }
};

module.exports.createMovie = async (req, res, next) => {
  try {
    const createdMovie = await Movie.create({ ...req.body, owner: req.user._id });
    res.status(SUCCESS_CREATED_CODE).send(createdMovie);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError(err.message));
    } else {
      next(err);
    }
  }
};

module.exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params._id).orFail();
    if (movie.owner.toString() === req.user._id) {
      await Movie.deleteOne(movie);
      res.send({
        message: 'Фильм удален',
      });
    } else {
      next(new ForbiddenError(FORBIDDEN_DELETE_MOVIE));
    }
  } catch (err) {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      next(new NotFoundError(MOVIE_NOT_FOUND));
    } else if (err instanceof mongoose.Error.CastError) {
      next(new BadRequestError(MOVIE_NOT_FOUND));
    } else {
      next(err);
    }
  }
};
