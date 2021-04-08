require('dotenv').config();
module.exports = {
  databaseName: process.env.DATABASE_NAME,
  databseUrl: process.env.MONGODB_URL,
  mongoURI: `${ process.env.MONGODB_URL}${ process.env.DATABASE_NAME}`,
  port: process.env.PORT,
  sessionSECRET: process.env.SESSION_SECRET,
  SENGRID_API_KEY: process.env.SENGRID_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  BASE_URL: process.env.BASE_URL
};