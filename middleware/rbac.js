// Define what each role is legally allowed to do in the shop
const rolePermissions = {
    'Manager': [
        'create:customer', 'edit:customer', 'delete:customer',
        'create:vehicle', 'edit:vehicle', 'delete:vehicle'
    ],
    'Service Writer': [
        'create:customer', 'edit:customer',
        'create:vehicle', 'edit:vehicle' // Cannot delete
    ],
    'Technician': [
        'edit:vehicle' // Can update mileage or add notes, but cannot delete or create
    ],
    'Read-Only': [
        // Empty. Can only view pages.
    ]
};

function hasPermission(role, action) {
    const permissions = rolePermissions[role] || [];
    return permissions.includes(action);
}

// Middleware to protect backend routes
function requirePermission(action) {
    return (req, res, next) => {
        if (!req.session || !req.session.userRole) {
            return res.status(403).send('Forbidden: No active session.');
        }
        
        if (hasPermission(req.session.userRole, action)) {
            next(); // Allowed!
        } else {
            // Blocked at the server level
            res.status(403).send(`
                <h2>403 - Access Denied</h2>
                <p>Your current role (${req.session.userRole}) does not have permission to perform this action.</p>
                <button onclick="window.history.back()">Go Back</button>
            `);
        }
    };
}

module.exports = { hasPermission, requirePermission };