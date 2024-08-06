const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI;


const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

const connectDB = async () => {
  try {
    await client.connect();
    db = client.db(); // Use the default database specified in the URI
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not connected');
  }
  return db;
};

module.exports = { connectDB, getDB };
