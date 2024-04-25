require('dotenv').config();
const mongoose = require('mongoose');
const makeLogger = require('../logger').default;

const logger = makeLogger('MONGO');

let db = null;

const connectDB = async (dbUrl = process.env.DATABASE_URL) => {
  if (db) {
    return db;
  }
  logger.info('connecting');
  db = await mongoose.connect(dbUrl, {
    maxPoolSize: getMongooseMaxPoolSize()
  });
  logger.info('connected');
  return db;
};

const disconnectDB = async () => {
  logger.info('closing mongo connection');
  db.disconnect();
  db = null;
};


/** */
function getMongooseMaxPoolSize() {
  return parseInt(process.env.MAX_MONGOOSE_POOL_SIZE ?? '10');
}


module.exports = {
  connectDB,
  disconnectDB,
};
