const User = require('../models/User');

module.exports = {
    renderProfile: async (req, res) => {
        try {
            const user = await User.findByPk(req.session.userId);
            const prefs = user.notificationPrefs || { notifyAssigned: true, notifyParts: true, notifyApproval: true };

            res.render('users/profile', { 
                title: 'My Profile', 
                user, 
                prefs,
                error: req.query.error || null,
                success: req.query.success || null
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            res.status(500).send('Server Error');
        }
    },

    updateProfile: async (req, res) => {
        try {
            const { firstName, lastName, email, password, quickPin } = req.body;
            const user = await User.findByPk(req.session.userId);
            
            const notificationPrefs = {
                notifyAssigned: req.body.notifyAssigned === 'on',
                notifyParts: req.body.notifyParts === 'on',
                notifyApproval: req.body.notifyApproval === 'on'
            };

            let updateData = { firstName, lastName, email, notificationPrefs };
            
            // 🚨 NEW: Save local file path if they upload a new image
            if (req.file) {
                updateData.avatarUrl = '/uploads/avatars/' + req.file.filename;
            }
            if (password && password.trim() !== '') updateData.password = password;
            if (quickPin && quickPin.trim() !== '') updateData.quickPin = quickPin;

            await user.update(updateData);
            res.redirect('/profile?success=Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            res.redirect('/profile?error=Update failed. Email may already be in use.');
        }
    }
};