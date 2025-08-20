import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middlewares";
import { Store } from "../models/store.model";

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