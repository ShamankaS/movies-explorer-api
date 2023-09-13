const movieRoutes = require('express').Router();
const { getMovie, createMovie, deleteMovie } = require('../controllers/movies');
const { validateMovie, validateMovieId } = require('../utils/validators/movieValidator');

movieRoutes.get('/movies', getMovie);
movieRoutes.post('/movies', validateMovie, createMovie);
movieRoutes.delete('/movies/:_id', validateMovieId, deleteMovie);

module.exports = movieRoutes;
