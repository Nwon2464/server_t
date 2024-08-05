require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const axios = require('axios');
const passport = require("passport");
const cookieSession = require("cookie-session");
const authRoutes = require("./auth");
require("./config");


const middlewares = require('./middlewares');
const api = require('./api');

const app = express();

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, //1day for authorized cookie
    keys: [process.env.COOKIE_KEY],
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use("/auth", authRoutes);
app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
