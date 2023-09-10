require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const { commonRoutes, protectedRoutes } = require('./routes/index');

const { PORT = 3000 } = process.env;

const app = express();
mongoose.connect('mongodb://127.0.0.1:27017/bitfilmsdb');

app.use(helmet());

app.use(bodyParser.json());

app.use(cookieParser());

app.use('/', commonRoutes);

app.use('/', protectedRoutes);

app.use(errors());

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
