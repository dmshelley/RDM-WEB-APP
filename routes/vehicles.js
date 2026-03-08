const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { requirePermission } = require('../middleware/rbac'); // 🚨 Import the Guard

// 1. VEHICLE DATA GRID (LIST) - Everyone can view
router.get('/', vehicleController.list);

// 2. VIN DECODER API - Everyone can use
router.get('/api/decode/:vin', vehicleController.decodeVin);

// 3. VEHICLE PROFILE (View) - Everyone can view
router.get('/:id', vehicleController.viewProfile);

// 4. VEHICLE EDIT - Only roles with "edit:vehicle" can access
router.get('/:id/edit', requirePermission('edit:vehicle'), vehicleController.renderEdit);
router.post('/:id/edit', requirePermission('edit:vehicle'), vehicleController.update);

// 5. VEHICLE DELETE - Only roles with "delete:vehicle" (Manager) can access
router.post('/:id/delete', requirePermission('delete:vehicle'), vehicleController.delete);

module.exports = router;