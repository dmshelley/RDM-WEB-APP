const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ShopSetting = sequelize.define('ShopSetting', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    shopName: { type: DataTypes.STRING, defaultValue: 'The Red Deer Mechanic' },
    phone: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    address: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    province: { type: DataTypes.STRING },
    postalCode: { type: DataTypes.STRING },
    logoUrl: { type: DataTypes.STRING },
    
    // NEW: Localization
    unitOfMeasure: { type: DataTypes.STRING, defaultValue: 'km' }, // 'km' or 'mi'
    
    // Branding
    primaryColor: { type: DataTypes.STRING, defaultValue: '#d32f2f' },
    btnBgColor: { type: DataTypes.STRING, defaultValue: '#d32f2f' },
    btnTextColor: { type: DataTypes.STRING, defaultValue: '#ffffff' },
    sidebarBgColor: { type: DataTypes.STRING, defaultValue: '#0b0f19' },
    sidebarTextColor: { type: DataTypes.STRING, defaultValue: '#ffffff' },
    
    // Financial & Legal
    laborRate: { type: DataTypes.DECIMAL(10, 2), defaultValue: 120.00 },
    taxRate: { type: DataTypes.DECIMAL(5, 3), defaultValue: 5.000 },
    taxName: { type: DataTypes.STRING, defaultValue: 'GST' },
    taxNumber: { type: DataTypes.STRING },
    regulatoryNumber: { type: DataTypes.STRING }, // NEW: AMVIC / BAR License
    
    shopSuppliesPercent: { type: DataTypes.DECIMAL(5, 2), defaultValue: 5.00 },
    shopSuppliesCap: { type: DataTypes.DECIMAL(10, 2), defaultValue: 35.00 },
    
    // NEW: Workflow
    nextWorkOrderNumber: { type: DataTypes.INTEGER, defaultValue: 1000 }, 
    estimateValidityDays: { type: DataTypes.INTEGER, defaultValue: 30 },
    
    legalDisclaimer: { type: DataTypes.TEXT }
}, {
    tableName: 'shop_settings',
    timestamps: true
});

module.exports = ShopSetting;