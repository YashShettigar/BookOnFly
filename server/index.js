import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import cookieParser from "cookie-parser";

import userRoutes from "./routes/users.js";
import hotelsRoutes from "./routes/hotels.js";
import roomsRoutes from "./routes/rooms.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || PORT;

app.get('/api', (req, res) => {
    res.send('Hello! This is the BookOnFly API server.');
});

app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelsRoutes, roomsRoutes);

mongoose.connect(process.env.CONNECTION_URL, { useNewURLParser: true, useUnifiedTopology: true })
    .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
    .catch((err) => console.log(err.message));
