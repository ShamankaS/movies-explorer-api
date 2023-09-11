require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');

const router = require('./routes/index');
const { errorLogger, requestLogger } = require('./middlewares/logger');
const { limiter } = require('./middlewares/limiter');
const cors = require('./middlewares/cors');
const errorsHandler = require('./middlewares/error');
const { PORT_CONFIG, DB_CONFIG } = require('./utils/config');

const app = express();

mongoose.connect(DB_CONFIG);

app.use(requestLogger);
app.use(helmet());
app.use(bodyParser.json());
app.use(cors);
app.use(cookieParser());

app.use(router);

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);
app.use(limiter);

app.listen(PORT_CONFIG, () => {
  console.log(`App listening at port ${PORT_CONFIG}`);
});
