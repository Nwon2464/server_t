const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    // _id: String,
    googleId : String,
    googleImage : String,
    displayName : String,
    googleEmail : String,
});

const Users = mongoose.model("users", userSchema);

<<<<<<< Updated upstream
module.exports = Users;
=======
// module.exports = Users;
const { getDB } = require('../config/MongoClient.js');

const userCollection = () => getDB().collection('users');

const createUser = async (user) => {
  try {
    const result = await userCollection().insertOne(user);
    return result.ops[0]; // Return the created user
  } catch (err) {
    console.error('Error creating user:', err.message);
    throw err;
  }
};

const findUserByGoogleId = async (googleId) => {
  try {
    const user = await userCollection().findOne({ googleId });
    return user;
  } catch (err) {
    console.error('Error finding user:', err.message);
    throw err;
  }
};

module.exports = { createUser, findUserByGoogleId };
>>>>>>> Stashed changes
