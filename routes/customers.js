const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const { requirePermission } = require('../middleware/rbac'); // 🚨 IMPORT THE GUARD

// View routes (Everyone can view)
router.get('/', customerController.list);
router.get('/:id', customerController.viewProfile);

// Create Customer routes (Protected)
router.get('/create', requirePermission('create:customer'), customerController.renderCreate);
router.post('/create', requirePermission('create:customer'), customerController.create);

// Edit Customer routes (Protected)
router.get('/:id/edit', requirePermission('edit:customer'), customerController.renderEdit);
router.post('/:id/edit', requirePermission('edit:customer'), customerController.update);

// Delete Customer route (Protected - Manager Only)
router.post('/:id/delete', requirePermission('delete:customer'), customerController.delete);

// Add Vehicle to existing customer (Protected)
router.get('/:id/vehicles/new', requirePermission('create:vehicle'), customerController.renderAddVehicle);
router.post('/:id/vehicles/new', requirePermission('create:vehicle'), customerController.saveNewVehicle);

module.exports = router;