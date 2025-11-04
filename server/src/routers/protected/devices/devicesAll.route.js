const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');
const { getAllDevices, createDevice, updateDevice, deleteDevice } = require('../../../controllers/devices/deviceController');

// GET /api/alarms
router.get('/', authMiddleware, getAllDevices);

// POST /api/alarms
router.post('/', authMiddleware, createDevice);

// PUT /api/alarms/:id
router.put('/:id', authMiddleware, updateDevice);

// DELETE /api/alarms/:id
router.delete('/:id', authMiddleware, deleteDevice);

module.exports = router;