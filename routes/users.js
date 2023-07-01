const router = require('express').Router();
const userController = require('../controllers/users');
const {
  validationUpdateUser,
} = require('../utils/validation');

router.get('/me', userController.getMi);

router.patch('/me', validationUpdateUser, userController.updateUser);

module.exports = router;
