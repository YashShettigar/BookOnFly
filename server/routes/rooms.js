import express from "express";

import { createRoom, getRooms, updateRoom, getRoom, deleteRoom, updateRoomAvailability } from "../controllers/rooms.js";

import { verifyUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/:hotelid", verifyUser, createRoom);
router.get("/:hotelid/rooms/all", getRooms);
router.get("/:hotelid/rooms/:roomid", getRoom);
router.patch("/:hotelid/rooms/:roomid", verifyUser, updateRoom);
router.delete("/:hotelid/rooms/:roomid", verifyUser, deleteRoom);

router.patch("/:hotelid/rooms/availability/:roomid", updateRoomAvailability);

export default router;