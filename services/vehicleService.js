const Vehicle = require('../models/Vehicle');
const Customer = require('../models/Customer');

class VehicleService {
    async getAllVehicles() {
        try {
            return await Vehicle.findAll({ include: [Customer] });
        } catch (error) {
            console.error("Error in getAllVehicles:", error);
            throw error;
        }
    }

    async getVehicleById(id) {
        try {
            return await Vehicle.findByPk(id, { include: [Customer] });
        } catch (error) {
            console.error("Error in getVehicleById:", error);
            throw error;
        }
    }

    async createVehicle(vehicleData) {
        try {
            return await Vehicle.create(vehicleData);
        } catch (error) {
            console.error("Error in createVehicle:", error);
            throw error;
        }
    }

    async updateVehicle(id, updatedData) {
        try {
            const vehicle = await Vehicle.findByPk(id);
            if (!vehicle) throw new Error('Vehicle not found');
            await vehicle.update(updatedData);
            return vehicle;
        } catch (error) {
            console.error("Error in updateVehicle:", error);
            throw error;
        }
    }

    async deleteVehicle(id) {
        try {
            const vehicle = await Vehicle.findByPk(id);
            if (vehicle) await vehicle.destroy();
        } catch (error) {
            console.error("Error in deleteVehicle:", error);
            throw error;
        }
    }
}

module.exports = new VehicleService();