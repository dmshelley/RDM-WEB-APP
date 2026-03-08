const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LineItem = sequelize.define('LineItem', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    jobId: { type: DataTypes.INTEGER, allowNull: false },
    
    type: { type: DataTypes.ENUM('Part', 'Labor', 'Sublet', 'Fee'), allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    quantity: { type: DataTypes.DECIMAL(10, 2), defaultValue: 1.00 },
    
    unitCost: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 }, // Shop Cost
    unitPrice: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 }, // Customer Price
    
    isTaxable: { type: DataTypes.BOOLEAN, defaultValue: true },
    supplier: { type: DataTypes.STRING, allowNull: true } // For Parts tracking
}, {
    tableName: 'line_items',
    timestamps: true
});

module.exports = LineItem;