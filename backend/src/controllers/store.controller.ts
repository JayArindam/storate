import { Request, Response } from "express";
import { Store } from "../models/store.model";
import { StoreReview } from "../models/storeReview.model";
import { User } from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middlewares";
import { Op } from "sequelize";
import sequelize from "../utils/db";

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

export const getStoreListings = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const stores = await Store.findAll();

    const result = await Promise.all(
      stores.map(async (store) => {
        // overall average rating
        const avg = (await StoreReview.findAll({
          where: { storeId: store.id },
          attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avgRating"]],
          raw: true,
        })) as any[];

        const overallRating = Number(avg[0].avgRating || 0).toFixed(2);

        // check whether THIS user has a review for this store
        const userReview = await StoreReview.findOne({
          where: {
            storeId: store.id,
            userId: req.userId,
          },
        });

        return {
          name: store.name,
          address: store.address,
          overallRating,
          userRating: userReview ? userReview.rating : null,
          canSubmit: !userReview,
          canModify: !!userReview,
        };
      })
    );

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};


export const storeOwnerDash = async (req: AuthRequest, res: Response) => {
  try {
    // find the store that belongs to the logged in owner
    const store = await Store.findOne({ where: { ownerId: req.userId } });

    if (!store) {
      return res.status(404).json({ message: "Store not found" });
    }

    // get users that submitted reviews for this store
    const reviews = await StoreReview.findAll({
      where: { storeId: store.id },
      include: [{ model: User, attributes: ["name", "email"] }],
    });

    // calculate average
    const avg = (await StoreReview.findAll({
      where: { storeId: store.id },
      attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avgRating"]],
      raw: true,
    })) as any[];

    const averageRating = Number(avg[0].avgRating || 0).toFixed(2);

    // List of users who submitted
    const users = reviews.map((r) => ({
      name: (r as any).User.name,
      email: (r as any).User.email,
      rating: r.rating,
      review: r.review,
    }));

    return res.status(200).json({ users, averageRating });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};