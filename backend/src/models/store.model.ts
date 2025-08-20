import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/db";
import { User } from "./user.model";

export class Store extends Model {
  public id!: number;
  public name!: string;
  public address!: string;
  public type!: string;
  public reviewsCount!: number;
  public ownerId!: number;
}

Store.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reviewsCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: "stores",
  }
);
