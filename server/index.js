import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

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

mongoose.connection.on("disconnected", () => console.log("Database server is disconnected!"));
mongoose.connection.on("connected", () => console.log("Database server is connected!"));

app.get('/', (req, res) => {
    res.send('Backend server is ready!');
})

app.listen(PORT, () => {
    connect();
    console.log(`Server is running at port ${PORT}`);
});
