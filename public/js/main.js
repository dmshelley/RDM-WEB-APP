document.addEventListener('DOMContentLoaded', () => {
    // Initialize Socket.IO connection to test real-time capabilities
    const socket = io();
    
    socket.on('connect', () => {
        console.log('Connected to real-time server.');
    });
});