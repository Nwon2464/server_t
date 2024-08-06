require('dotenv').config();
const app = require('./app');
const port = process.env.PORT || 5000;
const mongoose = require("mongoose");

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

// const uri = "mongodb+srv://wonn2464:gWRj8fiQYlKHuAJ3@twitchcluster.fsjs36k.mongodb.net/NodeAPI?retryWrites=true&w=majority&appName=TwitchCluster";
// const uri ="mongodb://wonn2464:gWRj8fiQYlKHuAJ3@twitchcluster-shard-00-00.fsjs36k.mongodb.net:27017,twitchcluster-shard-00-01.fsjs36k.mongodb.net:27017,twitchcluster-shard-00-02.fsjs36k.mongodb.net:27017/Twitch_clone?ssl=true&replicaSet=atlas-123-shard-0&authSource=admin&retryWrites=true&w=majority";
// const uri = "mongodb+srv://wonn2464:gWRj8fiQYlKHuAJ3@twitchcluster.fsjs36k.mongodb.net/?retryWrites=true&w=majority&appName=TwitchCluster";
const uri = "mongodb+srv://wonn2464:gWRj8fiQYlKHuAJ3@twitchcluster.fsjs36k.mongodb.net/Twitch_clone?retryWrites=true&w=majority&appName=TwitchCluster";

// mongoose.connect(uri).then(()=>{
//   console.log("connected");
// }).catch((err)=>{
//   console.log(err);
//   console.log("Not connected");
// })
// mongoose.connect(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
//   useCreateIndex: true,
// }).then(()=>{
//   console.log("Connected");
// }).catch(()=>{
//   console.log("FAILED");
// });


app.listen(port, () => {
  /* eslint-disable no-console */

  // console.log(process.env);
  console.log(`!Listening: http://localhost:${port}`);
  //
  /* eslint-enable no-console */
});
