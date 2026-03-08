const settingsService = require('../services/settingsService');

class SettingsController {
    async renderSettings(req, res) {
        try {
            const settings = await settingsService.getSettings();
            const services = await settingsService.getStandardServices();
            const success = req.query.success === 'true';
            
            res.render('settings/index', { 
                title: 'Shop Settings - The Red Deer Mechanic', 
                settings,
                services,
                success
            });
        } catch (error) {
            console.error('Error fetching settings:', error);
            res.status(500).send('Server Error');
        }
    }

    async update(req, res) {
        try {
            const { 
                shopName, phone, email, address, city, province, postalCode, 
                unitOfMeasure, // NEW
                logoUrl, primaryColor, btnBgColor, btnTextColor, sidebarBgColor, sidebarTextColor, 
                laborRate, taxRate, taxName, taxNumber, regulatoryNumber, // NEW 
                shopSuppliesPercent, shopSuppliesCap, 
                nextWorkOrderNumber, estimateValidityDays, // NEW
                legalDisclaimer 
            } = req.body;
            
            let updateData = {
                shopName, phone, email, address, city, province, postalCode, unitOfMeasure,
                logoUrl, primaryColor, btnBgColor, btnTextColor, sidebarBgColor, sidebarTextColor, 
                laborRate, taxRate, taxName, taxNumber, regulatoryNumber, 
                shopSuppliesPercent, shopSuppliesCap, 
                nextWorkOrderNumber, estimateValidityDays,
                legalDisclaimer
            };

            if (req.file) {
                updateData.logoUrl = '/images/uploads/' + req.file.filename;
            }

            await settingsService.updateSettings(updateData);
            res.redirect('/settings?success=true');
        } catch (error) {
            console.error('Error updating settings:', error);
            res.status(500).send('Server Error');
        }
    }

    async resetBranding(req, res) {
        try {
            await settingsService.resetBrandingDefaults();
            res.redirect('/settings?success=true');
        } catch (error) {
            console.error('Error resetting branding:', error);
            res.status(500).send('Server Error');
        }
    }

    async addService(req, res) {
        try {
            const { name, description, flatPrice } = req.body;
            await settingsService.addStandardService({ name, description, flatPrice });
            res.redirect('/settings?success=true');
        } catch (error) {
            console.error('Error adding service:', error);
            res.status(500).send('Server Error');
        }
    }

    async deleteService(req, res) {
        try {
            await settingsService.deleteStandardService(req.params.id);
            res.redirect('/settings?success=true');
        } catch (error) {
            console.error('Error deleting service:', error);
            res.status(500).send('Server Error');
        }
    }
}

module.exports = new SettingsController();