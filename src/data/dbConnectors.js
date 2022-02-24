const { APP_DB_URI, NODE_ENV } = process.env;
const mongoose = require("mongoose");
const { Logger } = require("../utilities/logger");

function connectToDatabase() {
  try {
    mongoose.connect(
      APP_DB_URI,
      {
        autoIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err, data) => {
        if (err) {
          if (NODE_ENV !== "development") {
            Logger.error(`[Database Connection Error] ${err}`);
          } else {
            console.log("🔴 Database connection failed.");
          }
          return;
        }
        if (data) console.log("🟢 Database connection successful");
      }
    );
  } catch (e) {
    if (verifyDevelopmentEnvironment) {
      console.log(`DB Error: ${e.message}`);
    } else {
      Logger.error(`[DB Error: ] ${e.message}`);
    }
  }
}

module.exports = connectToDatabase;
