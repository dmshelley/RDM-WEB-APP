const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notification = sequelize.define('Notification', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    userId: { type: DataTypes.INTEGER, allowNull: true }, // Null means "Global/Manager-wide"
    
    type: { 
        type: DataTypes.ENUM('Urgent', 'Action', 'Follow-up', 'Info'), 
        allowNull: false 
    },
    
    title: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    
    relatedId: { type: DataTypes.INTEGER, allowNull: true }, // ID of the Work Order or Job
    isSticky: { type: DataTypes.BOOLEAN, defaultValue: false },
    isRead: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
    tableName: 'notifications',
    timestamps: true
});

module.exports = Notification;