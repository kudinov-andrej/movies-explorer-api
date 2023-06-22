const {
  celebrate,
  Joi,
} = require('celebrate');

const regular = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/;

const validationUserRegister = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
  }),
});

const validationUserAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email()
      .required(),
    password: Joi.string()
      .required(),
  }),
});

const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email()
      .required(),
  }),
});

const validationCardId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
});

const validationUserId = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required(),
  }),
});

module.exports = {
  validationUserRegister,
  validationUserAuth,
  validationUpdateUser,
  validationCardId,
  validationUserId,
};
