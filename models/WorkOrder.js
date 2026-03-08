const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const WorkOrder = sequelize.define('WorkOrder', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orderNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
    customerId: { type: DataTypes.INTEGER, allowNull: false },
    vehicleId: { type: DataTypes.INTEGER, allowNull: false },
    
    status: { 
        type: DataTypes.ENUM(
            'Draft', 
            'Pending Internal Review', 
            'Ready for Customer', 
            'Sent', 
            'Approved', 
            'Scheduled', 
            'In-Progress', 
            'Done', 
            'Picked Up'
        ), 
        defaultValue: 'Draft' 
    },

    expirationDate: { 
        type: DataTypes.DATE, 
        defaultValue: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 Days from now
    },

    grandTotal: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
    internalNotes: { type: DataTypes.TEXT, allowNull: true },
    customerNotes: { type: DataTypes.TEXT, allowNull: true },
    
    linkOpened: { type: DataTypes.BOOLEAN, defaultValue: false },
    openedAt: { type: DataTypes.DATE, allowNull: true }
}, {
    tableName: 'work_orders',
    timestamps: true
});

module.exports = WorkOrder;