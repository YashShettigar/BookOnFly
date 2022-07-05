import mongoose from "mongoose";
import Hotel from "../models/Hotel.js";

export const getHotels = async (req, res) => {
    const { min, max, ...others } = req.query;
    try {
        const hotels = await Hotel.find({ ...others, cheapestPrice: { $gte: min | 1, $lte: max || 999 } }).limit(req.query.limit);

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

export const countByCity = async (req, res) => {
    const cities = req.query.cities.split(",");

    try {
        const hotels = await Promise.all(cities.map(city => {
            return Hotel.countDocuments({ city: city });
        }));

        res.status(200).json(hotels);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const countByType = async (req, res) => {
    try {
        const hotelCount = await Hotel.countDocuments({ type: 'hotel' });
        const apartmentCount = await Hotel.countDocuments({ type: 'apartment' });
        const resortCount = await Hotel.countDocuments({ type: 'resort' });
        const villaCount = await Hotel.countDocuments({ type: 'villa' });
        const cabinCount = await Hotel.countDocuments({ type: 'cabin' });

        res.status(200).json([
            { type: "hotel", count: hotelCount },
            { type: "apartment", count: apartmentCount },
            { type: "resort", count: resortCount },
            { type: "villa", count: villaCount },
            { type: "cabin", count: cabinCount },
        ]);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}