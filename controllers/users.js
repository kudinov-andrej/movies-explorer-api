const mongoose = require('mongoose');
const http2 = require('http2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const usersModel = require('../models/user');
const BedRequest = require('../utils/errors/BedRequest'); // 400
const ConflictingRequest = require('../utils/errors/ConflictingRequest'); // 409
const DocumentNotFoundError = require('../utils/errors/DocumentNotFoundError'); // 404
const Unauthorized = require('../utils/errors/Unauthorized'); // 401
const JWT_SECRET = require('../config');

const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = http2.constants;

const getMi = (req, res, next) => {
  usersModel
    .findById(req.user._id)
    .orFail(() => {
      throw new DocumentNotFoundError('Запрашиваемый пользователь не найден');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.CastError) {
        next(new BedRequest('Данные для создания пользователя переданы не корректно'));
      } else { next(err); }
    });
};

const crateUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  const passwordHash = bcrypt.hash(password, 10);
  usersModel.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictingRequest('Пользователь с такой почтой уже существует');
      }
      return passwordHash.then((hash) => usersModel.create({
        name, email, password: hash,
      }));
    })
    .then((user) => res.status(HTTP_STATUS_CREATED).send({
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BedRequest('Данные для создания карточки переданы не корректно'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { name, email } = req.body;
  usersModel.findOne({ email })
    .then((existingUser) => {
      if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
        throw new ConflictingRequest('Пользователь с такой почтой уже существует');
      }
      return usersModel
        .findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
        .then((user) => {
          if (!user) {
            throw new DocumentNotFoundError('Запрашиваемый пользователь не найден');
          }
          res.status(HTTP_STATUS_OK).send({
            id: user.id,
            name,
            email,
          });
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BedRequest('Данные для создания карточки переданы некорректно'));
      } else {
        next(err);
      }
    });
};


const login = (req, res, next) => {
  const { email, password } = req.body;
  let user;
  usersModel.findOne({ email }).select('+password')
    .then((foundUser) => {
      if (!foundUser) { return Promise.reject(new Unauthorized('Неправильные почта или пароль')); }
      user = foundUser;
      return bcrypt.compare(password, user.password);
    })
    // eslint-disable-next-line consistent-return
    .then((matched) => {
      if (!matched) { return Promise.reject(new Unauthorized('Неправильные почта или пароль')); }
      const token = jwt.sign({ _id: user._id }, process.env.NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => next(err));
};

module.exports = {
  crateUser,
  getMi,
  updateUser,
  login,
};
