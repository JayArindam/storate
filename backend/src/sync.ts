import "dotenv/config";
import sequelize from "./utils/db";
import { User } from "./models/user.model";
import mysql from "mysql2/promise";

async function syncDatabase() {
  try {
    // 1. First connect to MySQL with no specific DB
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // 2. Create database if it doesn't exist
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
    );

    console.log(`Database "${process.env.DB_NAME}" ensured.`);
    await connection.end();

    // 3. Authenticate using Sequelize (now the DB definitely exists)
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // 4. Sync your models
    await User.sync({ alter: true });
    console.log("All models synchronized successfully.");
  } catch (err) {
    console.error("Unable to connect to the database:", err);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
