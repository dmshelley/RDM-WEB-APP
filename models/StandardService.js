const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StandardService = sequelize.define('StandardService', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    flatPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, {
    tableName: 'standard_services',
    timestamps: true
});

module.exports = StandardService;