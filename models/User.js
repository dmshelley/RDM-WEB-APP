const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        // 🚨 FIX: Removed 'unique: true' from here to stop the Sequelize bug!
        validate: { isEmail: true }
    },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { 
        type: DataTypes.ENUM('Manager', 'Service Writer', 'Technician', 'Read-Only'), 
        defaultValue: 'Read-Only' 
    },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    
    // Shop Floor & Display Settings
    avatarUrl: { type: DataTypes.STRING, allowNull: true },
    title: { type: DataTypes.STRING, allowNull: true },
    certifications: { type: DataTypes.STRING, allowNull: true },
    quickPin: { type: DataTypes.STRING, allowNull: true },
    
    // User Preferences
    notificationPrefs: { 
        type: DataTypes.JSON, 
        defaultValue: { notifyAssigned: true, notifyParts: true, notifyApproval: true } 
    }
}, {
    tableName: 'users',
    timestamps: true,
    
    // 🚨 FIX: Placed the unique rule here. Sequelize handles this perfectly during alter: true.
    indexes: [
        {
            unique: true,
            fields: ['email']
        }
    ],

    hooks: {
        beforeSave: async (user) => {
            if (user.changed('password') && user.password) {
                user.password = await bcrypt.hash(user.password, 10);
            }
            if (user.changed('quickPin') && user.quickPin) {
                user.quickPin = await bcrypt.hash(user.quickPin, 10);
            }
        }
    }
});

// Authentication Helpers
User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};
User.prototype.validPin = async function(pin) {
    if (!this.quickPin) return false;
    return await bcrypt.compare(pin, this.quickPin);
};

module.exports = User;