import express from "express";
import { verifyToken, verifyUser } from '../middleware/auth.js';
import { deleteUser, getUser, getUsers, login, signup, updateUser } from "../controllers/users.js";

const router = express.Router();

router.get("/all", verifyUser, getUsers);
router.get("/:id", verifyToken, getUser);
router.post("/login", login);
router.post("/signup", signup);
router.patch("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;