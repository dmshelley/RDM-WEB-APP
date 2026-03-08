const ShopSetting = require('../models/ShopSetting');
const StandardService = require('../models/StandardService');

class SettingsService {
    async getSettings() {
        try {
            const [settings] = await ShopSetting.findOrCreate({ where: { id: 1 } });
            return settings;
        } catch (error) {
            console.error("Error in getSettings:", error);
            throw error;
        }
    }

    async updateSettings(updateData) {
        try {
            const settings = await this.getSettings();
            await settings.update(updateData);
            return settings;
        } catch (error) {
            console.error("Error in updateSettings:", error);
            throw error;
        }
    }

    // 🚨 NEW: Safe Reset Method just for styling
    async resetBrandingDefaults() {
        try {
            const settings = await this.getSettings();
            await settings.update({
                primaryColor: '#d32f2f',
                btnBgColor: '#d32f2f',
                btnTextColor: '#ffffff',
                sidebarBgColor: '#0b0f19',
                sidebarTextColor: '#ffffff'
            });
            return settings;
        } catch (error) {
            console.error("Error in resetBrandingDefaults:", error);
            throw error;
        }
    }

    async getStandardServices() {
        return await StandardService.findAll({ order: [['name', 'ASC']] });
    }

    async addStandardService(serviceData) {
        return await StandardService.create(serviceData);
    }

    async deleteStandardService(id) {
        const service = await StandardService.findByPk(id);
        if (service) await service.destroy();
    }
}

module.exports = new SettingsService();