const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (correct) => validator.isEmail(correct),
      message: 'Почта пользователя введена неверно',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    default: 'Имя пользователя',
    required: true,
    minlength: 2,
    maxLength: 30,
  }
});

userSchema.index({ email: 1 }, { unique: true });
module.exports = mongoose.model('user', userSchema);