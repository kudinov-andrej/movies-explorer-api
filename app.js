require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const {
  errors,
} = require('celebrate');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const router = require('./routes');
const ErrorHandler = require('./midlevare/ErrorHandler');

mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

const app = express();
app.use(cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 минут
  max: 350, // 100 запросов с одного IP
});

app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(router);
app.use(errors());
app.use(ErrorHandler);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Приложение слушает на 3000 порту');
});
