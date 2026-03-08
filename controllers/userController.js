const userService = require('../services/userService');

class UserController {
    async list(req, res) {
        try {
            const users = await userService.getAllUsers();
            res.render('users/list', { 
                title: 'Team Management - The Red Deer Mechanic', 
                users, 
                error: req.query.error
            });
        } catch (error) {
            console.error('Error fetching users:', error);
            res.status(500).send('Server Error');
        }
    }

    renderCreate(req, res) {
        res.render('users/create', { title: 'Add Staff Member', error: null });
    }

    async create(req, res) {
        try {
            // 🚨 We remove 'avatarUrl' from the req.body destructuring list
            const { firstName, lastName, email, password, role, title, certifications, quickPin } = req.body;
            
            if (!firstName || !lastName || !email || !password) {
                return res.render('users/create', { title: 'Add Staff Member', error: 'All fields are required.' });
            }

            // 🚨 NEW: Multer places the file info in 'req.file'. We use its filename to build the public URL.
            let avatarUrl = null;
            if (req.file) {
                // This saves '/uploads/avatars/avatar-1234.jpg' to the DB
                avatarUrl = '/uploads/avatars/' + req.file.filename;
            }

            await userService.createUser({ firstName, lastName, email, password, role, avatarUrl, title, certifications, quickPin });
            res.redirect('/users');
        } catch (error) {
            console.error('Error creating user:', error);
            res.render('users/create', { title: 'Add Staff Member', error: 'Could not create user. Email may be invalid or already in use.' });
        }
    }

    async renderEdit(req, res) {
        try {
            const user = await userService.getUserById(req.params.id);
            if (!user) return res.status(404).send('User not found');
            
            res.render('users/edit', { title: `Edit ${user.firstName}`, user, error: req.query.error || null });
        } catch (error) {
            res.status(500).send('Server Error');
        }
    }

    async update(req, res) {
        try {
            // 🚨 Remove 'avatarUrl' from req.body destructuring
            const { firstName, lastName, email, password, role, title, certifications, quickPin } = req.body;
            
            let updateData = { firstName, lastName, email, role, title, certifications };
            
            // 🚨 NEW: Only update 'avatarUrl' if a new file was actually uploaded. 
            // This prevents a generic save from wiping out an existing photo.
            if (req.file) {
                updateData.avatarUrl = '/uploads/avatars/' + req.file.filename;
            }

            if (password && password.trim() !== '') {
                updateData.password = password;
            }
            if (quickPin && quickPin.trim() !== '') {
                updateData.quickPin = quickPin;
            }

            await userService.updateUser(req.params.id, updateData);
            res.redirect('/users');
        } catch (error) {
            console.error('Error updating user:', error);
            res.redirect(`/users/${req.params.id}/edit?error=Update failed. Email may already exist.`);
        }
    }

    async deactivate(req, res) {
        try {
            if (parseInt(req.params.id) === req.session.userId) {
                return res.redirect('/users?error=Cannot deactivate your own account.');
            }
            await userService.deactivateUser(req.params.id);
            res.redirect('/users');
        } catch (error) {
            res.status(500).send('Server Error');
        }
    }

    async reactivate(req, res) {
        try {
            await userService.reactivateUser(req.params.id);
            res.redirect('/users');
        } catch (error) {
            res.status(500).send('Server Error');
        }
    }
}

module.exports = new UserController();