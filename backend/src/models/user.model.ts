import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/db";

export class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public address!: string;
  public password!: string;
  public role!: "admin" | "user" | "store owner";
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("admin", "user", "store owner"),
      allowNull: false,
      defaultValue: "user"
    }
  },
  {
    sequelize,
    tableName: "users",
  }
);
