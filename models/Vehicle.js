const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    customerId: { type: DataTypes.INTEGER, allowNull: false },
    unitNumber: { type: DataTypes.STRING, allowNull: true }, // NEW: Fleet Unit Number
    make: { type: DataTypes.STRING, allowNull: false },
    model: { type: DataTypes.STRING, allowNull: false },
    trim: { type: DataTypes.STRING, allowNull: true }, // NEW: Sub-model / Trim level
    year: { type: DataTypes.INTEGER, allowNull: false },
    productionDate: { type: DataTypes.STRING, allowNull: true }, // NEW: MM/YY Build Date
    vin: { type: DataTypes.STRING, allowNull: true },
    licensePlate: { type: DataTypes.STRING, allowNull: true },
    color: { type: DataTypes.STRING, allowNull: true },
    engineSize: { type: DataTypes.STRING, allowNull: true },
    mileage: { type: DataTypes.INTEGER, allowNull: true },
    transmission: { type: DataTypes.STRING, allowNull: true },
    drivetrain: { type: DataTypes.STRING, allowNull: true },
    fuelType: { type: DataTypes.STRING, allowNull: true },
    bodyStyle: { type: DataTypes.STRING, allowNull: true },
    weightClass: { type: DataTypes.STRING, allowNull: true },
    imageUrl: { type: DataTypes.STRING, allowNull: true },
    notes: { type: DataTypes.TEXT, allowNull: true },
    
    // THE SMART LOGO DICTIONARY (Adblocker Proof)
    brandLogo: {
        type: DataTypes.VIRTUAL,
        get() {
            const make = this.getDataValue('make');
            if (!make) return null;
            
            const m = make.toLowerCase().trim();
            const domains = {
                'toyota': 'toyota.com', 'ford': 'ford.com', 'chevrolet': 'chevrolet.com',
                'chevy': 'chevrolet.com', 'honda': 'honda.com', 'nissan': 'nissanusa.com',
                'dodge': 'dodge.com', 'ram': 'ramtrucks.com', 'jeep': 'jeep.com',
                'gmc': 'gmc.com', 'hyundai': 'hyundai.com', 'kia': 'kia.com',
                'subaru': 'subaru.com', 'volkswagen': 'vw.com', 'vw': 'vw.com',
                'bmw': 'bmw.com', 'mercedes-benz': 'mbusa.com', 'mercedes': 'mbusa.com',
                'audi': 'audi.com', 'lexus': 'lexus.com', 'mazda': 'mazda.com',
                'volvo': 'volvo.com', 'tesla': 'tesla.com', 'chrysler': 'chrysler.com',
                'cadillac': 'cadillac.com', 'buick': 'buick.com', 'acura': 'acura.com',
                'infiniti': 'infiniti.com', 'lincoln': 'lincoln.com', 'porsche': 'porsche.com',
                'land rover': 'landrover.com', 'jaguar': 'jaguar.com', 'mitsubishi': 'mitsubishicars.com',
                'mini': 'miniusa.com', 'fiat': 'fiatusa.com', 'alfa romeo': 'alfaromeousa.com'
            };
            
            return domains[m] ? `https://icon.horse/icon/${domains[m]}` : null;
        }
    },

    // NEW: Foolproof Display Image Logic
    safeDisplayImage: {
        type: DataTypes.VIRTUAL,
        get() {
            const url = this.getDataValue('imageUrl');
            if (url && url.trim() !== '') return url;
            if (this.brandLogo) return this.brandLogo;
            return null; // The front-end EJS will handle the null with a generic font-awesome car
        }
    }
}, {
    tableName: 'vehicles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

module.exports = Vehicle;