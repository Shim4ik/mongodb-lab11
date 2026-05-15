const express = require('express');
const router = express.Router();
const protect = require('../middlewares/protect');
const restrictTo = require('../middlewares/restrictTo');
const validate = require('../middlewares/validate');
const { createRoomSchema } = require('../validators/roomValidator');
const {
    getAllRooms,
    getRoom,
    createRoom,
    updateRoom,
    deleteRoom
} = require('../controllers/roomController');

router.get('/', getAllRooms);
router.get('/:id', getRoom);
router.post('/', protect, validate(createRoomSchema), createRoom);
router.put('/:id', protect, updateRoom);
router.delete('/:id', protect, restrictTo('admin'), deleteRoom);

module.exports = router;