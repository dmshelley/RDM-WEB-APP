const User = require('../models/User');
const { hasPermission } = require('./rbac');

module.exports = {
    requireAuth: async (req, res, next) => {
        if (req.session && req.session.userId) {
            try {
                const user = await User.findByPk(req.session.userId);

                if (!user || !user.isActive) {
                    req.session.destroy(); 
                    return res.redirect('/auth/login?error=Account has been deactivated.');
                }

                res.locals.currentUser = {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    avatarUrl: user.avatarUrl // 🚨 NEW: Pass Avatar to Header
                };
                
                res.locals.can = (action) => hasPermission(user.role, action);
                next(); 
            } catch (error) {
                console.error('Auth Middleware Error:', error);
                res.redirect('/auth/login');
            }
        } else {
            res.redirect('/auth/login');
        }
    }
};