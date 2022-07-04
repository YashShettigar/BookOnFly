import mongoose from "mongoose";
import Hotel from "../models/Hotel.js";

export const getHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find();

        res.status(200).json(hotels);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}


export const getHotel = async (req, res) => {
    const { hotelid } = req.params;

    if(!mongoose.Types.ObjectId.isValid(hotelid)) return res.status(404).send('No hotel was found with that id!');

    const hotel = await Hotel.findById(hotelid);
    
    res.status(200).json(hotel);
}

export const createHotel = async (req, res) => {
    const newHotel = new Hotel(req.body);
    
    try {
        const savedHotel = await newHotel.save();

        res.status(201).json(savedHotel);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


export const updateHotel = async (req, res) => {
    const { hotelid } = req.params;
    const hotel = req.body;

    if (!mongoose.Types.ObjectId.isValid(hotelid)) return res.status(404).send('No hotel was found with that id!');
    
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelid, { ...hotel, hotelid }, { new: true });

    res.json(updatedHotel);
}

export const deleteHotel = async (req, res) => {
    const { hotelid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(hotelid)) return res.status(404).send('No hotel was found with that id!');
    
    await Hotel.findByIdAndRemove(hotelid);

    res.status(200).json({ message: 'Hotel deleted successfully!' });
}