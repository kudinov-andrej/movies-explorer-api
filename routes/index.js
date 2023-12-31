const router = require('express').Router();
const pageNotFound = require('../midlevare/pageNotFound');
const { login, crateUser } = require('../controllers/users');
const userRouter = require('./users');
const movieRouter = require('./movie');
const auth = require('../midlevare/auth');
const {
  validationUserRegister,
  validationUserAuth,
} = require('../utils/validation');

router.post('/signup', validationUserRegister, crateUser);

router.post('/signin', validationUserAuth, login);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);

router.use(pageNotFound);

module.exports = router;
