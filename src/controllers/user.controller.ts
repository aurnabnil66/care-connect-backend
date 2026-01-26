import { Request, Response } from "express";
import * as userService from "@/modules/user/user.service";

export const createUser = async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
};

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.status(200).json(users);
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await userService.getUserById(Number(req.params.id));
  res.status(200).json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await userService.updateUser(Number(req.params.id), req.body);
  res.status(200).json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = await userService.deleteUser(Number(req.params.id));
  res.status(200).json(user);
};
