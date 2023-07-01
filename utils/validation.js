const {
  celebrate,
  Joi,
} = require('celebrate');

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
