const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

const setupFile = __filename;
const completedFile = path.join(__dirname, 'setup.completed.js');

async function runSetup() {
    console.log('--- Starting Auto Shop App First-Run Setup ---');

    // 1. Check if setup has already been run
    if (fs.existsSync(completedFile)) {
        console.log('Setup has already been completed. Exiting.');
        process.exit(0);
    }

    // 2. Check for environment variables
    if (!process.env.DB_USER || !process.env.DB_HOST) {
        console.error('ERROR: Missing database configuration in .env file.');
        process.exit(1);
    }

    let connection;
    try {
        // 3. Create Database if it doesn't exist (Connect without DB name first)
        console.log('Connecting to MySQL server...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER,
            password: process.env.DB_PASS
        });

        console.log(`Checking/Creating database: ${process.env.DB_NAME}...`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        console.log('Database check complete.');
        await connection.end();

        // 4. Run Sequelize migrations/sync
        console.log('Initializing Sequelize models...');
        const sequelize = require('./config/database');
        const User = require('./models/User'); // Load User model for seeding

        console.log('Syncing database tables...');
        await sequelize.sync({ alter: true });

        // 5. Seed default admin user
        console.log('Checking for admin user...');
        const adminExists = await User.findOne({ where: { email: 'admin@autoshop.com' } });
        
        if (!adminExists) {
            console.log('Creating default admin user...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await User.create({
                name: 'System Admin',
                email: 'admin@autoshop.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Admin user created successfully. (Login: admin@autoshop.com / admin123)');
        } else {
            console.log('Admin user already exists.');
        }

        // 6. Rename setup file to prevent re-running
        console.log('Renaming setup file to prevent accidental re-runs...');
        fs.renameSync(setupFile, completedFile);
        
        console.log('--- Setup Complete! You can now run the application. ---');
        process.exit(0);

    } catch (error) {
        console.error('Setup failed:', error);
        if (connection) await connection.end();
        process.exit(1);
    }
}

runSetup();