import { DataTypes, Model } from "sequelize";
import sequelize from "../utils/db";

export class StoreReview extends Model {
  public id!: number;
  public storeId!: number;
  public userId!: number;     // 👈 add this
  public rating!: number;
  public review!: string;
}

StoreReview.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    storeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },
    review: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { sequelize, tableName: "store_reviews" }
);