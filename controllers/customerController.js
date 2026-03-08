const customerService = require('../services/customerService');
const vehicleService = require('../services/vehicleService');

class CustomerController {
    async list(req, res) {
        try {
            const customers = await customerService.getAllCustomers();
            res.render('customers/list', { title: 'Customers - The Red Deer Mechanic', customers });
        } catch (error) {
            console.error('Error fetching customers:', error);
            res.status(500).send('Server Error');
        }
    }

    renderCreate(req, res) {
        res.render('customers/create', { title: 'Add Intake - The Red Deer Mechanic', error: null });
    }

    async create(req, res) {
        try {
            const { 
                firstName, lastName, companyName, phone, email, contactPreference,
                address, city, province, postalCode, customerNotes,
                make, model, year, vin, licensePlate, color, mileage, 
                transmission, drivetrain, engineSize, fuelType, bodyStyle, weightClass, 
                vehicleNotes, imageUrl, contactType, contactLabel, contactValue 
            } = req.body;
            
            if (!firstName || !lastName || !phone) {
                return res.render('customers/create', { title: 'Add Intake', error: 'Customer name and primary phone are required.' });
            }

            // AUDIT FIX: Force inputs to arrays to prevent "string iteration" bug
            let additionalContacts = [];
            if (contactValue) {
                const types = Array.isArray(contactType) ? contactType : [contactType];
                const labels = Array.isArray(contactLabel) ? contactLabel : [contactLabel];
                const values = Array.isArray(contactValue) ? contactValue : [contactValue];

                for (let i = 0; i < values.length; i++) {
                    if (values[i] && values[i].trim() !== '') {
                        additionalContacts.push({ 
                            type: types[i] || 'Phone', 
                            label: labels[i] || 'Other', 
                            value: values[i] 
                        });
                    }
                }
            }

            const customerData = { 
                firstName, lastName, companyName, phone, email, contactPreference, 
                additionalContacts, address, city, province, postalCode, notes: customerNotes 
            };
            
            const cleanMileage = mileage ? parseInt(mileage.replace(/,/g, ''), 10) : null;
            
            const vehicleData = { 
                make, model, year, vin, licensePlate, color, mileage: cleanMileage, 
                transmission, drivetrain, engineSize, fuelType, bodyStyle, weightClass, 
                notes: vehicleNotes, imageUrl 
            };

            const newCustomer = await customerService.createCustomerWithVehicle(customerData, vehicleData);
            res.redirect(`/customers/${newCustomer.id}`);
        } catch (error) {
            console.error('Error in intake:', error);
            res.render('customers/create', { title: 'Add Intake', error: 'An error occurred while saving the intake data.' });
        }
    }

    async viewProfile(req, res) {
        try {
            const customer = await customerService.getCustomerById(req.params.id);
            if (!customer) return res.status(404).send('Customer not found');
            res.render('customers/profile', { title: `${customer.firstName} ${customer.lastName} - Profile`, customer });
        } catch (error) {
            res.status(500).send('Server Error');
        }
    }

    async renderEdit(req, res) {
        try {
            const customer = await customerService.getCustomerById(req.params.id);
            if (!customer) return res.status(404).send('Customer not found');
            res.render('customers/edit', { title: `Edit ${customer.firstName} - The Red Deer Mechanic`, customer, error: null });
        } catch (error) {
            res.status(500).send('Server Error');
        }
    }

    async update(req, res) {
        try {
            const { 
                firstName, lastName, companyName, phone, email, contactPreference,
                address, city, province, postalCode, notes,
                contactType, contactLabel, contactValue 
            } = req.body;

            let additionalContacts = [];
            if (contactValue) {
                const types = Array.isArray(contactType) ? contactType : [contactType];
                const labels = Array.isArray(contactLabel) ? contactLabel : [contactLabel];
                const values = Array.isArray(contactValue) ? contactValue : [contactValue];

                for (let i = 0; i < values.length; i++) {
                    if (values[i] && values[i].trim() !== '') {
                        additionalContacts.push({ 
                            type: types[i] || 'Phone', 
                            label: labels[i] || 'Other', 
                            value: values[i] 
                        });
                    }
                }
            }

            const updatedData = { 
                firstName, lastName, companyName, phone, email, contactPreference, 
                additionalContacts, address, city, province, postalCode, notes 
            };

            await customerService.updateCustomer(req.params.id, updatedData);
            res.redirect(`/customers/${req.params.id}`);
        } catch (error) {
            console.error('Error updating customer:', error);
            res.status(500).send('Server Error');
        }
    }

    async delete(req, res) {
        try {
            await customerService.deleteCustomer(req.params.id);
            res.redirect('/customers');
        } catch (error) {
            res.status(500).send('Server Error');
        }
    }

    async renderAddVehicle(req, res) {
        try {
            const customer = await customerService.getCustomerById(req.params.id);
            if (!customer) return res.status(404).send('Customer not found');
            res.render('customers/add-vehicle', { title: `Add Vehicle for ${customer.firstName}`, customer, error: null });
        } catch (error) {
            res.status(500).send('Server Error');
        }
    }

    async saveNewVehicle(req, res) {
        try {
            const { 
                make, model, year, vin, licensePlate, color, mileage, 
                transmission, drivetrain, engineSize, fuelType, bodyStyle, weightClass, 
                vehicleNotes, imageUrl 
            } = req.body;
            
            const cleanMileage = mileage ? parseInt(mileage.replace(/,/g, ''), 10) : null;

            const vehicleData = { 
                customerId: req.params.id,
                make, model, year, vin, licensePlate, color, mileage: cleanMileage, 
                transmission, drivetrain, engineSize, fuelType, bodyStyle, weightClass, 
                notes: vehicleNotes, imageUrl 
            };

            await vehicleService.createVehicle(vehicleData);
            res.redirect(`/customers/${req.params.id}`);
        } catch (error) {
            console.error('Error adding vehicle:', error);
            res.status(500).send('Server Error');
        }
    }
}

module.exports = new CustomerController();