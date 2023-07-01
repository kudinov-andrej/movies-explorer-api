const router = require('express').Router();
const moviesController = require('../controllers/movies');
const {
  validationCardId,
} = require('../utils/validation');

router.get('/', moviesController.getMovies);
router.delete('/:movieId', validationCardId, moviesController.deleteMovies);
router.post('/', moviesController.createMovies);
module.exports = router;
