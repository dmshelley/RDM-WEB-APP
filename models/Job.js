const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Job = sequelize.define('Job', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    workOrderId: { type: DataTypes.INTEGER, allowNull: false },
    jobTitle: { type: DataTypes.STRING, allowNull: false }, // e.g., "Front Brake Service"
    
    approvalStatus: { 
        type: DataTypes.ENUM('Pending', 'Approved', 'Declined'), 
        defaultValue: 'Pending' 
    },
    
    // Recovery Logic
    declineReason: { type: DataTypes.STRING, allowNull: true },
    followUpDate: { type: DataTypes.DATE, allowNull: true }, // For the 20-Day Loop
    isArchived: { type: DataTypes.BOOLEAN, defaultValue: false },

    estimatedHours: { type: DataTypes.DECIMAL(5, 2), defaultValue: 0.00 },
    sortOrder: { type: DataTypes.INTEGER, defaultValue: 0 }
}, {
    tableName: 'jobs',
    timestamps: true
});

module.exports = Job;