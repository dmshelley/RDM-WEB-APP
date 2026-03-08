const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Appointment = sequelize.define('Appointment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    workOrderId: { type: DataTypes.INTEGER, allowNull: false },
    
    scheduledDate: { type: DataTypes.DATE, allowNull: true },
    
    status: { 
        type: DataTypes.ENUM('Proposed', 'Countered', 'Confirmed', 'Cancelled'), 
        defaultValue: 'Proposed' 
    },
    
    customerSuggestedDate: { type: DataTypes.DATE, allowNull: true },
    shopNotes: { type: DataTypes.TEXT, allowNull: true }
}, {
    tableName: 'appointments',
    timestamps: true
});

module.exports = Appointment;