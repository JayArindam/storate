import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middlewares";
import { Store } from "../models/store.model";
import { StoreReview } from "../models/storeReview.model";

export const createUserByAdmin = async (req: AuthRequest, res: Response) => {
  const { name, email, password, address, role } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    address,
    password: hashedPassword,
    role: role || "user",
  });

  return res.status(201).json(newUser);
};

export const getUserStatistics = async (req: Request, res: Response) => {
  const allUsers = await User.findAll();

  const adminCount = allUsers.filter((u) => u.role === "admin").length;
  const userCount = allUsers.filter((u) => u.role === "user").length;

  return res.status(200).json({
    adminCount,
    userCount,
    users: allUsers,
  });
};

export const createStore = async (req: Request, res: Response) => {
  try {
    // expect the following in req.body as raw JSON:
    // { name, email, password, address, storeName, storeAddress, storeType }

    const { name, email, password, address, storeName, storeAddress, storeType } =
      req.body;

    // console.log("BODY:", req.body);


    // create user with role "store owner"
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      address,
      password: hashedPassword,
      role: "store owner",
    });

    // create associated store
    // console.log("creating store…");  // debug

    const newStore = await Store.create({
      name: storeName,
      address: storeAddress,
      type: storeType,
      ownerId: newUser.id,
      reviewsCount: 0,
    });

    return res.status(201).json({
      user: newUser,
      store: newStore,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const adminDash = async (req: Request, res: Response) => {
  try {
    // Total users
    const userCount = await User.count();

    // Total stores
    const storeCount = await Store.count();

    // Total submitted ratings
    const totalRatings = await StoreReview.count();

    return res.status(200).json({
      userCount,
      storeCount,
      totalRatings,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

import sequelize from "../utils/db";

export const getAllStoresForAdmin = async (req: Request, res: Response) => {
  try {
    const stores = await Store.findAll({ include: [{ model: User }] });

    const result = await Promise.all(
      stores.map(async (store) => {
        const avg = (await StoreReview.findAll({
          where: { storeId: store.id },
          attributes: [[sequelize.fn("AVG", sequelize.col("rating")), "avgRating"]],
          raw: true,
        })) as any[];

        return {
          name: store.name,
          email: (store as any).User.email,
          address: store.address,
          averageRating: Number(avg[0].avgRating || 0).toFixed(2),
        };
      })
    );

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

export const getAllUsersForAdmin = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll();

    const result = await Promise.all(
      users.map(async (user) => {
        // default payload
        const userData: any = {
          name: user.name,
          email: user.email,
          address: user.address,
          role: user.role,
        };

        // If the user is a store owner, get average store rating
        if (user.role === "store owner") {
          const store = await Store.findOne({ where: { ownerId: user.id } });

          if (store) {
            const avg = (await StoreReview.findAll({
              where: { storeId: store.id },
              attributes: [
                [sequelize.fn("AVG", sequelize.col("rating")), "avgRating"],
              ],
              raw: true,
            })) as any[];

            userData.rating = Number(avg[0].avgRating || 0).toFixed(2);
          } else {
            userData.rating = "0.00";
          }
        }

        return userData;
      })
    );

    return res.status(200).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong." });
  }
};