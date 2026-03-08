const Customer = require('../models/Customer');
const Vehicle = require('../models/Vehicle');
const sequelize = require('../config/database');

class CustomerService {
    async getAllCustomers() {
        return await Customer.findAll({
            order: [['created_at', 'DESC']]
        });
    }

    async getCustomerById(id) {
        return await Customer.findByPk(id, {
            include: [{ model: Vehicle }]
        });
    }

    async createCustomerWithVehicle(customerData, vehicleData) {
        const transaction = await sequelize.transaction();
        try {
            const customer = await Customer.create(customerData, { transaction });
            
            // Only create vehicle if minimum data is present
            if (vehicleData.make || vehicleData.vin) {
                await Vehicle.create({
                    ...vehicleData,
                    customerId: customer.id
                }, { transaction });
            }
            
            await transaction.commit();
            return customer;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async updateCustomer(id, data) {
        return await Customer.update(data, {
            where: { id }
        });
    }

    async deleteCustomer(id) {
        return await Customer.destroy({
            where: { id }
        });
    }
}

module.exports = new CustomerService();