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
app.use(cors());

const PORT = process.env.PORT || PORT;

const connect = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_URL);
    } catch (error) {
        throw error;
    }
}

app.use(express.json());
app.use(cookieParser());

app.get('/api', (req, res) => {
    res.send('Hello! This is the BookOnFly API server.');
});

app.use("/api/users", userRoutes);
app.use("/api/hotels", hotelsRoutes, roomsRoutes);


app.listen(PORT, () => {
    connect();
    console.log(`Server is running at port ${PORT}`);
});
