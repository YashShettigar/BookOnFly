import express from "express";

import { createHotel, getHotels, updateHotel, getHotel, deleteHotel } from "../controllers/hotels.js";

import { verifyUser } from "../middleware/auth.js";

const router = express.Router();

router.post("/", verifyUser, createHotel);
router.get("/all", getHotels);
router.get("/:hotelid", getHotel);
router.patch("/:hotelid", verifyUser, updateHotel);
router.delete("/:hotelid", verifyUser, deleteHotel);

export default router;