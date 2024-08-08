require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require("mongoose");
const axios = require('axios');
const passport = require("passport");
const cookieSession = require("cookie-session");
const authRoutes = require("./auth");
require("./config");
const path = require("path");
const keys =require("./config/keys");
const middlewares = require('./middlewares');
const api = require('./api');
const port = process.env.PORT || 5000;

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());


app.use(cookieSession({
    maxAge : 24 * 60 * 60 * 1000, // 1day for authorized cookie
    keys : [ keys.COOKIE_KEY ],
}));


const uri = keys.MONGO_URI;
mongoose.connect(uri, {
    // useNewUrlParser : true,
    useUnifiedTopology : true,
    // useFindAndModify : false,
    // useCreateIndex : true,
});

const db = mongoose.connection;
db.once("open", () => { console.log("Mongo DB Atlas has been connected!!!"); });

app.use(passport.initialize());
app.use(passport.session());

// app.get('/', (req, res) => {
//     res.json({
//         message : '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
//     });
// });


app.use("/auth", authRoutes);
app.use('/api/v1', api);


app.use(middlewares.notFound);
app.use(middlewares.errorHandler);
// if(process.env.NODE_ENV === "production"){
    // app.use(express.static('client/build'));

app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});
// }

app.listen(port, () => {
  console.log(`Listening: http://localhost:${port}`);
});
