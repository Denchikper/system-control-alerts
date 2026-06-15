const express = require('express');
const router = express.Router();
const authMiddleware = require('../../../middleware/authMiddleware');
const { getAllDevices, createDevice, updateDevice, deleteDevice, regenerateDeviceToken } = require('../../../controllers/devices/deviceController');

// GET /api/device
router.get('/', authMiddleware, getAllDevices);

// POST /api/device
router.post('/', authMiddleware, createDevice);

// PUT /api/device/:id
router.put('/:id', authMiddleware, updateDevice);

// POST /api/device/:id/regenerate-token
router.post('/:id/regenerate-token', authMiddleware, regenerateDeviceToken);

// DELETE /api/device/:id
router.delete('/:id', authMiddleware, deleteDevice);

module.exports = router;