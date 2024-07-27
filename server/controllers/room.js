import Room from '../models/Room.js';
import tryCatch from './utils/tryCatch.js';
import mongoose from 'mongoose'; // Ensure mongoose is imported

export const createRoom = tryCatch(async (req, res) => {
  const { id: uid, name: uName, photoURL: uPhoto } = req.user;
  const newRoom = new Room({ ...req.body, uid, uName, uPhoto });
  await newRoom.save();
  res.status(201).json({ success: true, result: newRoom });
});

export const getRooms = tryCatch(async (req, res) => {
  const rooms = await Room.find().sort({ _id: -1 });
  res.status(200).json({ success: true, result: rooms });
});



export const deleteRoom = tryCatch(async (req, res) => {
  const { roomId } = req.params;
  console.log('Attempting to delete room with ID:', roomId);

  // Ensure roomId is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(roomId)) {
    return res.status(400).json({ error: 'Invalid Room ID' });
  }

  // Try to delete the room
  const deletedRoom = await Room.findByIdAndDelete(roomId);

  if (!deletedRoom) {
    // Room was not found
    return res.status(404).json({ error: 'Room not found with ID: ' + roomId });
  }

  // Successfully deleted
  res.status(200).json({ message: 'Room deleted successfully' });
});