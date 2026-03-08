const vehicleService = require('../services/vehicleService');
const vinService = require('../services/vinService');
const imageService = require('../services/imageService');
const customerService = require('../services/customerService');

class VehicleController {
    async list(req, res) {
        try {
            const vehicles = await vehicleService.getAllVehicles();
            res.render('vehicles/list', { 
                title: 'Vehicles - The Red Deer Mechanic', 
                vehicles 
            });
        } catch (error) {
            console.error('Error fetching vehicles:', error);
            res.status(500).send('Server Error');
        }
    }

    async viewProfile(req, res) {
        try {
            const vehicle = await vehicleService.getVehicleById(req.params.id);
            if (!vehicle) {
                return res.status(404).send('Vehicle not found');
            }
            res.render('vehicles/profile', { 
                title: `${vehicle.year} ${vehicle.make} - The Red Deer Mechanic`, 
                vehicle 
            });
        } catch (error) {
            console.error('Error fetching vehicle profile:', error);
            res.status(500).send('Server Error');
        }
    }

    async renderEdit(req, res) {
        try {
            const vehicle = await vehicleService.getVehicleById(req.params.id);
            if (!vehicle) return res.status(404).send('Vehicle not found');
            res.render('vehicles/edit', { title: `Edit ${vehicle.year} ${vehicle.make}`, vehicle, error: null });
        } catch (error) {
            res.status(500).send('Server Error');
        }
    }

    async update(req, res) {
        try {
            const { 
                unitNumber, make, model, trim, year, productionDate, vin, licensePlate, color, 
                engineSize, transmission, drivetrain, fuelType, bodyStyle, weightClass, 
                notes, imageUrl 
            } = req.body;
            
            const cleanMileage = req.body.mileage ? parseInt(req.body.mileage.replace(/,/g, ''), 10) : null;
            const safeVin = vin ? vin.toUpperCase().trim() : null;

            const updatedData = { 
                unitNumber, make, model, trim, year, productionDate, vin: safeVin, licensePlate, 
                color, mileage: cleanMileage, engineSize, transmission, drivetrain, 
                fuelType, bodyStyle, weightClass, notes, imageUrl 
            };

            await vehicleService.updateVehicle(req.params.id, updatedData);
            res.redirect(`/vehicles/${req.params.id}`);
        } catch (error) {
            console.error('Error in vehicle update:', error);
            res.render('vehicles/edit', { title: 'Edit Vehicle', vehicle: { id: req.params.id, ...req.body }, error: 'An error occurred while saving the vehicle data.' });
        }
    }

    async delete(req, res) {
        try {
            const vehicle = await vehicleService.getVehicleById(req.params.id);
            const customerId = vehicle ? vehicle.customerId : null;
            
            await vehicleService.deleteVehicle(req.params.id);
            
            // Smart Redirect: Go back to the customer profile if we know it, otherwise go to vehicles list
            if (customerId) {
                res.redirect(`/customers/${customerId}`);
            } else {
                res.redirect('/vehicles');
            }
        } catch (error) {
            console.error('Error deleting vehicle:', error);
            res.status(500).send('Server Error while deleting');
        }
    }

    async decodeVin(req, res) {
        try {
            // Force upper case to ensure API stability
            const vin = req.params.vin.toUpperCase().trim();
            const vinData = await vinService.decode(vin);
            
            if (!vinData || !vinData.make) {
                return res.json({ success: false, message: 'Invalid VIN or no data found.' });
            }

            let imageUrl = await imageService.fetchVehicleImage(vinData.make, vinData.model, vinData.year);

            res.json({ success: true, data: { ...vinData, imageUrl } });
        } catch (error) {
            console.error('Decoding Controller Error:', error);
            res.status(500).json({ success: false, message: 'Server error during decoding.' });
        }
    }
}

module.exports = new VehicleController();