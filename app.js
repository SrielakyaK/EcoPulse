// Main App Module - Tab Navigation and Initialization

document.addEventListener('DOMContentLoaded', () => {
    // Tab navigation
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all tabs
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab
            btn.classList.add('active');
            const tabId = btn.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Initialize welcome message
    showWelcomeMessage();
});

function showWelcomeMessage() {
    const hasVisited = localStorage.getItem('ecopulse_visited');
    
    if (!hasVisited) {
        setTimeout(() => {
            const message = `
                🌍 Welcome to EcoPulse!
                
                Start by calculating your carbon footprint, 
                then explore tips and take on challenges!
            `;
            alert(message);
            localStorage.setItem('ecopulse_visited', 'true');
        }, 500);
    }
}

// Utility function to format numbers
function formatNumber(num) {
    return parseFloat(num).toFixed(2);
}

// Utility function to get color based on emission level
function getEmissionColor(value, max) {
    const ratio = value / max;
    if (ratio < 0.3) return '#11998e'; // Green
    if (ratio < 0.6) return '#ffd89b'; // Yellow
    return '#f5576c'; // Red
}

// Export functions for use in other modules
window.formatNumber = formatNumber;
window.getEmissionColor = getEmissionColor;