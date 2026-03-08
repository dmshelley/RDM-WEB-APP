const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Customer = sequelize.define('Customer', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    companyName: { type: DataTypes.STRING, allowNull: true },
    phone: { type: DataTypes.STRING, allowNull: false }, // Primary Phone
    email: { type: DataTypes.STRING, allowNull: true },  // Primary Email
    additionalContacts: { 
        type: DataTypes.JSON, 
        allowNull: true,
        defaultValue: [] 
    },
    contactPreference: { type: DataTypes.STRING, defaultValue: 'Call' },
    address: { type: DataTypes.STRING, allowNull: true },
    city: { type: DataTypes.STRING, allowNull: true, defaultValue: 'Red Deer' },
    province: { type: DataTypes.STRING, allowNull: true, defaultValue: 'AB' },
    postalCode: { type: DataTypes.STRING, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true }
}, {
    tableName: 'customers',
    timestamps: true,
    createdAt: 'created_at',
    updated_at: 'updated_at'
});

module.exports = Customer;