const User = require('../models/User');

class UserService {
    async getAllUsers() {
        try {
            return await User.findAll({
                // Sort Active first, then by Role, then by Name
                order: [
                    ['isActive', 'DESC'], 
                    ['role', 'ASC'], 
                    ['firstName', 'ASC']
                ]
            });
        } catch (error) {
            console.error("Error in getAllUsers:", error);
            throw error;
        }
    }

    async getUserById(id) {
        try {
            return await User.findByPk(id);
        } catch (error) {
            console.error("Error in getUserById:", error);
            throw error;
        }
    }

    async createUser(userData) {
        try {
            return await User.create(userData);
        } catch (error) {
            console.error("Error in createUser:", error);
            throw error;
        }
    }

    async updateUser(id, updateData) {
        try {
            const user = await User.findByPk(id);
            if (!user) throw new Error('User not found');
            await user.update(updateData);
            return user;
        } catch (error) {
            console.error("Error in updateUser:", error);
            throw error;
        }
    }

    // AUDIT FIX: Soft delete methods
    async deactivateUser(id) {
        try {
            const user = await User.findByPk(id);
            if (user) await user.update({ isActive: false });
        } catch (error) {
            console.error("Error in deactivateUser:", error);
            throw error;
        }
    }

    async reactivateUser(id) {
        try {
            const user = await User.findByPk(id);
            if (user) await user.update({ isActive: true });
        } catch (error) {
            console.error("Error in reactivateUser:", error);
            throw error;
        }
    }
}

module.exports = new UserService();