import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const getUser = async (req, res) => {
    const { id } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No user was found with that id!');

    const user = await User.findById(id);
    
    res.status(200).json(user);
}

export const login = async (req, res) => {
    const { username, password, isAdmin } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if (!existingUser) return res.status(404).json({ message: "User doesn't exist." });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) return res.status(404).json({ message: "Invalid credentials." });

        const token = jwt.sign({ id: existingUser._id, isAdmin: existingUser.isAdmin }, process.env.JWT_SALT);

        res.cookie("accessToken", token, { httpOnly: true }).status(200).json({ message: "Logged in successfully." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const signup = async (req, res) => {
    const { username, email, password, confirmPassword, isAdmin } = req.body;

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) return res.status(400).json({ message: 'User already exists.' });

        if (password!=confirmPassword) return res.status(400).json({ message: 'Passwords don\'t match.' });

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({ username, email, password: hashedPassword, isAdmin });
        
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SALT);
        
        res.cookie("accessToken", token, { httpOnly: true }).status(201).json({ message: 'User has been created successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong!' });
    }
}

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const user = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No user was found with that id!');
    
    const updatedUser = await User.findByIdAndUpdate(id, { ...user, id }, { new: true });

    res.json(updatedUser);
}

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No user was found with that id!');
    
    await User.findByIdAndRemove(id);

    res.json({ message: 'User deleted successfully!' });
}