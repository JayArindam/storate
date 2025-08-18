import { Request, Response } from "express";

export const testHello = (req: Request, res: Response) => {
  return res.send("hello from storate");
};