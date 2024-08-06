require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
<<<<<<< Updated upstream
const mongoose = require("mongoose");
const axios = require('axios');
=======
>>>>>>> Stashed changes
const passport = require("passport");
const cookieSession = require("cookie-session");
const authRoutes = require("./auth");
require("./config");
<<<<<<< Updated upstream
=======
const mongoose = require("mongoose");
>>>>>>> Stashed changes

const middlewares = require('./middlewares');
const api = require('./api');

// const { connectDB } = require('./config/MongoClient');
// const { createUser, findUserByGoogleId } = require('./models/user');


const app = express();

<<<<<<< Updated upstream
app.use(cookieSession({
    maxAge : 24 * 60 * 60 * 1000, // 1day for authorized cookie
    keys : [ process.env.COOKIE_KEY ],
}));
=======


// connectDB();

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, //1day for authorized cookie
    keys: [process.env.COOKIE_KEY],
  })
);
>>>>>>> Stashed changes

const uri = process.env.MONGO_URI;
mongoose.connect(uri, {
    // useNewUrlParser : true,
    useUnifiedTopology : true,
    // useFindAndModify : false,
    // useCreateIndex : true,
});

const db = mongoose.connection;
db.once("open", () => { console.log("Mongo DB Atlas has been connected!!"); });
app.use(passport.initialize());
app.use(passport.session());


// let db;

// const connectDB = async () => {
//   try {
//     await client.connect();
//     db = client.db(); // Use the default database specified in the URI
//     console.log('MongoDB connected...');
//   } catch (err) {
//     console.error('Error connecting to MongoDB:', err.message);
//     process.exit(1);
//   }
// };

// const getDB = () => {
//   if (!db) {
//     throw new Error('Database not connected');
//   }
//   return db;
// };

// MongoClient.connect(uri, function(err, client) {
//   // const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   // console.log(collection);
//   const c=client.db("TwitchCluster");
//   console.log(c);


//   console.log("👏👏👏👏👏👏 Mongo DB Atlas has been connected! 👏👏👏👏👏👏");
//   // client.close();
// });

// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
// });

// const db = mongoose.connection;
// db.once("open", () => {
//   console.log("👏👏👏👏👏👏 Mongo DB Atlas has been connected! 👏👏👏👏👏👏");
// });


app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({
        message : '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
    });
});

app.use("/auth", authRoutes);
app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
