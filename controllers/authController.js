const authService = require('../services/authService');

module.exports = {
    renderLogin: (req, res) => {
        if (req.session && req.session.userId) {
            return res.redirect('/');
        }
        res.render('auth/login', { 
            title: 'Login - The Red Deer Mechanic', 
            layout: false, 
            error: req.query.error || null 
        });
    },

    login: async (req, res) => {
        try {
            const { email, password, rememberMe } = req.body;
            const user = await authService.validateUser(email, password);
            
            // Check if user is valid AND not deactivated
            if (!user || !user.isActive) {
                return res.render('auth/login', { title: 'Login', layout: false, error: 'Invalid email or password.' });
            }

            // The middleware handles names, we just need to set the core session
            req.session.userId = user.id;
            req.session.userRole = user.role;
            
            if (rememberMe) {
                req.session.cookie.maxAge = 1000 * 60 * 60 * 24 * 30; // 30 Days
            } else {
                req.session.cookie.expires = null; 
            }
            
            res.redirect('/');
        } catch (error) {
            console.error('Login error:', error);
            res.render('auth/login', { title: 'Login', layout: false, error: 'An internal server error occurred.' });
        }
    },

    logout: (req, res) => {
        req.session.destroy(() => {
            res.redirect('/auth/login');
        });
    }
};