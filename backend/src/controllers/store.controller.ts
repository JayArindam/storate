import { Request, Response } from "express";
import { Store } from "../models/store.model";
import { StoreReview } from "../models/storeReview.model";
import { User } from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middlewares";
import { Op } from "sequelize";

export const createStoreReview = async (req: AuthRequest, res: Response) => {
  try {
    // ✅ Ensure user is authenticated
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const { storeName, rating, review } = req.body;

    // Get store (by name)
    const store = await Store.findOne({ where: { name: storeName } });
    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // Get the user (we need name for frontend purposes)
    const user = await User.findByPk(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create review using userId in DB
    const newReview = await StoreReview.create({
      storeId: store.id,
      userId: user.id,
      rating,
      review,
    });

    // Increment review count for store
    store.reviewsCount += 1;
    await store.save();

    return res.status(201).json({
      message: "Review added successfully",
      review: {
        id: newReview.id,
        storeName,
        rating,
        review,
        userName: user.name,    // 👈 this will be used on frontend directly
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const searchStores = async (req: Request, res: Response) => {
  try {
    const { query } = req.query; // e.g. /api/store/search?query=dan

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const stores = await Store.findAll({
      where: {
        name: {
          // case-insensitive match / LIKE %query%
          [Op.like]: `%${query}%`,
        },
      },
    });

    return res.status(200).json(stores);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};
