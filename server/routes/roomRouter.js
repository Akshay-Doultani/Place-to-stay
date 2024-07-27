// roomRouter.js
import { Router } from 'express';

import { createRoom, getRooms, deleteRoom } from '../controllers/room.js';
import auth from '../middleware/auth.js';

const roomRouter = Router();
roomRouter.post('/', auth, createRoom);
roomRouter.get('/', getRooms);
// roomRouter.patch('/:roomId', auth, updateRoom);
roomRouter.delete('/:roomId', auth, deleteRoom);
export default roomRouter;
