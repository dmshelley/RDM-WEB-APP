const User = require('../models/User');
const bcrypt = require('bcryptjs');

class AuthService {
    // Automatically creates your default admin account if the database is empty
    async seedAdmin() {
        try {
            const count = await User.count();
            if (count === 0) {
                await User.create({
                    firstName: 'System',
                    lastName: 'Admin',
                    email: 'admin@autoshop.com',
                    password: 'admin123',
                    role: 'Manager'
                });
                console.log('✅ Default Admin seeded: admin@autoshop.com | Pass: admin123');
            }
        } catch (error) {
            console.error('Error seeding admin user:', error);
        }
    }

    // Validates login attempts
    async validateUser(email, password) {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) return null;
            
            const isValid = await bcrypt.compare(password, user.password);
            return isValid ? user : null;
        } catch (error) {
            console.error('Error validating user:', error);
            throw error;
        }
    }
}

module.exports = new AuthService();