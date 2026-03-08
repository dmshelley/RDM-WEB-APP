const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const session = require('express-session'); 
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/database');

// Import ALL Models
const User = require('./models/User'); 
const ShopSetting = require('./models/ShopSetting'); 
const StandardService = require('./models/StandardService'); 
const Customer = require('./models/Customer'); 
const Vehicle = require('./models/Vehicle');   

// ==========================================
// 🚨 DATABASE RELATIONSHIPS (Crucial for preventing 500 errors!)
// ==========================================
Customer.hasMany(Vehicle, { foreignKey: 'customerId', onDelete: 'CASCADE' });
Vehicle.belongsTo(Customer, { foreignKey: 'customerId' });


const authService = require('./services/authService'); 
const app = express();

const sessionStore = new SequelizeStore({ db: sequelize });

app.use(session({
    secret: 'rdm-enterprise-secure-key-2026', 
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 } 
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main'); 
app.use(express.static(path.join(__dirname, 'public')));

// Branding Middleware
const globalSettings = require('./middleware/globalSettings');
app.use(globalSettings); 

// Routing
const { requireAuth } = require('./middleware/auth'); 
const authRoutes = require('./routes/auth');
const customerRoutes = require('./routes/customers');
const vehicleRoutes = require('./routes/vehicles');
const userRoutes = require('./routes/users');
const settingsRoutes = require('./routes/settings'); 
const profileRoutes = require('./routes/profile'); // 🚨 NEW

app.use('/auth', authRoutes);
app.use('/customers', requireAuth, customerRoutes);
app.use('/vehicles', requireAuth, vehicleRoutes);
app.use('/users', requireAuth, userRoutes);
app.use('/settings', requireAuth, settingsRoutes); 
app.use('/profile', requireAuth, profileRoutes); // 🚨 NEW

app.get('/', requireAuth, (req, res) => {
    res.render('dashboard/dashboard', { title: 'Dashboard' });
});

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(async () => {
    console.log('Database synced & updated successfully.');
    await authService.seedAdmin(); 
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log('Error syncing DB:', err));