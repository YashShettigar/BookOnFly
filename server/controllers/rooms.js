import mongoose from "mongoose";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";

export const getRooms = async (req, res) => {
    const { hotelid } = req.params;

    try {
        const hotel = await Hotel.findById(hotelid);
        
        const rooms = await Room.find({
            _id: {
                $in: hotel.rooms
            }
        });
        
        res.status(200).json(rooms);
    } catch (error) {
        return res.status(404).json({ message: error.message });;
    }

    
}


export const getRoom = async (req, res) => {
    const { hotelid, roomid } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(hotelid)) return res.status(404).send('No hotel was found with that id!');
    
    if(!mongoose.Types.ObjectId.isValid(roomid)) return res.status(404).send('No room was found with that id!');

    const room = await Room.findById(roomid);
    
    res.status(200).json(room);
}

export const createRoom = async (req, res) => {
    const { hotelid } = req.params;
    const newRoom = new Room(req.body);
    
    if (!mongoose.Types.ObjectId.isValid(hotelid)) return res.status(404).send('No hotel was found with that id!');
    
    try {
        const savedRoom = await newRoom.save();
    
        await Hotel.findByIdAndUpdate(hotelid, { $push: { rooms: savedRoom._id } });

        res.status(201).json(savedRoom);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}


export const updateRoom = async (req, res) => {
    const { hotelid, roomid } = req.params;
    const room = req.body;

    if (!mongoose.Types.ObjectId.isValid(hotelid)) return res.status(404).json({ message: 'No hotel was found with that id!' });

    if (!mongoose.Types.ObjectId.isValid(roomid)) return res.status(404).json({ message: 'No Room was found with that id!' });
    
    try {
        const updatedRoom = await Room.findByIdAndUpdate(roomid, { ...room, roomid });

        res.status(200).json(updatedRoom);
    } catch (error) {
        res.status(404).json({ message: 'No Room was found with that id!' });
    }
}


export const updateRoomAvailability = async (req, res) => {
    const { hotelid, roomid } = req.params;
    const { dates } = req.body;

    if (!mongoose.Types.ObjectId.isValid(hotelid)) return res.status(404).json({ message: 'No hotel was found with that id!' });
    
    try {
        const updatedRoom = await Room.updateOne({ "roomNumbers._id": roomid }, {
            $push: {
                "roomNumbers.$.unavailableDates": dates
            }
        });

        res.status(200).json({ message: 'Room status has been updated.' });
    } catch (error) {
        res.status(404).json({ message: 'No Room was found with that id!' });
    }
}

export const deleteRoom = async (req, res) => {
    const { hotelid, roomid } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(hotelid)) return res.status(404).json({ message: 'No hotel was found with that id!' });

    if (!mongoose.Types.ObjectId.isValid(roomid)) return res.status(404).json({ message: 'No room was found with that id!' });
    
    await Room.findByIdAndRemove(roomid);
    
    await Hotel.findByIdAndUpdate(hotelid, { $pull: { rooms: roomid } });

    res.status(200).json({ message: 'Room deleted successfully!' });
}