const mongoose = require('mongoose');

const http2 = require('http2');

const { ValidationError } = mongoose.Error;
const moviesModel = require('../models/movie');

const {
  // eslint-disable-next-line max-len
  HTTP_STATUS_CREATED,
  HTTP_STATUS_OK,
} = http2.constants;

const BedRequest = require('../utils/errors/BedRequest'); // 400
const DeletionError = require('../utils/errors/DeletionError'); // 403
const DocumentNotFoundError = require('../utils/errors/DocumentNotFoundError'); // 404

const getMovies = (req, res, next) => {
  moviesModel
    .find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch((err) => {
      next(err);
    });
};

const createMovies = (req, res, next) => {
  moviesModel
    .create({
      owner: req.user._id,
      ...req.body,
    })
    .then((card) => {
      res.status(HTTP_STATUS_CREATED).send(card);
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BedRequest('Данные для создания карточки переданы не корректно'));
      } else { next(err); }
    });
};

const deleteMovies = (req, res, next) => {
  moviesModel
    .findById(req.params.cardId)
    .orFail(() => {
      throw new DocumentNotFoundError('Запрашиваемая карточка не найдена');
    })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (req.user._id.toString() === card.owner.toString()) {
        return moviesModel.findByIdAndRemove(req.params.cardId);
      }
      throw new DeletionError('Нет прав для удаления карточки');
    })
    .then((removedCard) => {
      if (removedCard) {
        res.send(removedCard);
      } else {
        throw new DocumentNotFoundError('Запрашиваемая карточка не найдена');
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.CastError) {
        next(new BedRequest('Данные для создания карточки переданы не корректно'));
      } else { next(err); }
    });
};


module.exports = {
  getMovies,
  createMovies,
  deleteMovies,
};
