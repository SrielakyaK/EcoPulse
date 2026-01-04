// Dashboard Module

function updateDashboard(result) {
    const dashboardContent = document.getElementById('dashboardContent');
    
    const categoryNames = {
        transport: '🚗 Transportation',
        electricity: '⚡ Electricity',
        cooking: '🔥 Cooking',
        food: '🍽️ Food',
        waste: '🗑️ Waste'
    };

    const categoryColors = {
        transport: '#667eea',
        electricity: '#f093fb',
        cooking: '#ffd89b',
        food: '#11998e',
        waste: '#f5576c'
    };

    let html = `
        <div class="dashboard-summary">
            <div class="result-box">
                <h3>Total Monthly Emissions</h3>
                <div class="result-value">
                    <span class="co2-value">${result.total.toFixed(2)}</span> kg CO₂
                </div>
                <p>${result.comparison}</p>
            </div>
        </div>

        <div class="chart-container">
            <h3>Category-wise Breakdown</h3>
    `;

    // Sort emissions by value
    const sortedEmissions = Object.entries(result.emissions)
        .sort((a, b) => b[1] - a[1])
        .filter(([_, value]) => value > 0);

    sortedEmissions.forEach(([category, value]) => {
        const percentage = ((value / result.total) * 100).toFixed(1);
        html += `
            <div class="breakdown-item">
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <strong>${categoryNames[category]}</strong>
                        <span>${value.toFixed(2)} kg CO₂ (${percentage}%)</span>
                    </div>
                    <div class="breakdown-bar">
                        <div class="breakdown-fill" style="width: ${percentage}%; background: ${categoryColors[category]};"></div>
                    </div>
                </div>
            </div>
        `;
    });

    html += `</div>`;

    // Comparison chart
    const avgIndian = 150;
    const avgGlobal = 333;
    
    html += `
        <div class="chart-container">
            <h3>Compare with Averages</h3>
            <div class="breakdown-item">
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between;">
                        <strong>Your Footprint</strong>
                        <span>${result.total.toFixed(2)} kg</span>
                    </div>
                    <div class="breakdown-bar">
                        <div class="breakdown-fill" style="width: ${(result.total / avgGlobal * 100).toFixed(0)}%; background: #667eea;"></div>
                    </div>
                </div>
            </div>
            <div class="breakdown-item">
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between;">
                        <strong>Average Indian</strong>
                        <span>${avgIndian} kg</span>
                    </div>
                    <div class="breakdown-bar">
                        <div class="breakdown-fill" style="width: ${(avgIndian / avgGlobal * 100).toFixed(0)}%; background: #11998e;"></div>
                    </div>
                </div>
            </div>
            <div class="breakdown-item">
                <div style="flex: 1;">
                    <div style="display: flex; justify-content: space-between;">
                        <strong>Average Global</strong>
                        <span>${avgGlobal} kg</span>
                    </div>
                    <div class="breakdown-bar">
                        <div class="breakdown-fill" style="width: 100%; background: #f5576c;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Yearly projection
    const yearlyEmission = (result.total * 12 / 1000).toFixed(2);
    html += `
        <div class="chart-container">
            <h3>📊 Yearly Projection</h3>
            <p style="font-size: 1.5em; color: #667eea; text-align: center; margin: 20px 0;">
                <strong>${yearlyEmission} tonnes CO₂/year</strong>
            </p>
            <p style="text-align: center; color: #666;">
                That's equivalent to driving ${(yearlyEmission * 4500).toFixed(0)} km in a car!
            </p>
        </div>
    `;

    dashboardContent.innerHTML = html;
}