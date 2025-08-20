import "dotenv/config";
import sequelize from "./utils/db";
import { User } from "./models/user.model";
import { Store } from "./models/store.model";
import { StoreReview } from "./models/storeReview.model";
import "./associations";
import mysql from "mysql2/promise";

async function syncDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
    await connection.end();

    await sequelize.authenticate();

    // Sync models
    await User.sync({ alter: true });
    await Store.sync({ alter: true });
    await StoreReview.sync({ alter: true });

    console.log("All models synchronized successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
