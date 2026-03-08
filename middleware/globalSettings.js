const settingsService = require('../services/settingsService');

module.exports = async (req, res, next) => {
    try {
        // Fetches global shop settings and makes them available to all EJS views
        res.locals.globalSettings = await settingsService.getSettings();
        next();
    } catch (error) {
        console.error("Failed to load global settings middleware", error);
        next();
    }
};