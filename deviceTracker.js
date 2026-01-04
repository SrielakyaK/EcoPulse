// Device Energy Tracker Module

class DeviceTracker {
    constructor() {
        this.devices = this.loadDevices();
        this.renderDevices();
        this.updateInsights();
    }

    loadDevices() {
        const saved = localStorage.getItem('ecopulse_devices');
        return saved ? JSON.parse(saved) : [];
    }

    saveDevices() {
        localStorage.setItem('ecopulse_devices', JSON.stringify(this.devices));
    }

    addDevice(name, wattage, hoursPerDay) {
        const device = {
            id: Date.now(),
            name,
            wattage: parseFloat(wattage),
            hoursPerDay: parseFloat(hoursPerDay),
            addedDate: new Date().toISOString()
        };

        this.devices.push(device);
        this.saveDevices();
        this.renderDevices();
        this.updateInsights();
        
        // Award points
        gamification.addPoints(5, `Added device: ${name}`);
        
        // Badge for adding 5 devices
        if (this.devices.length >= 5) {
            gamification.earnBadge('Device Master');
        }
    }

    removeDevice(id) {
        this.devices = this.devices.filter(d => d.id !== id);
        this.saveDevices();
        this.renderDevices();
        this.updateInsights();
    }

    calculateDeviceEnergy(device) {
        // kWh per day
        const kwhPerDay = (device.wattage * device.hoursPerDay) / 1000;
        // kWh per month
        const kwhPerMonth = kwhPerDay * 30;
        // CO2 emissions (0.82 kg per kWh in India)
        const co2PerMonth = kwhPerMonth * 0.82;
        // Cost per month (assuming ₹7 per kWh average)
        const costPerMonth = kwhPerMonth * 7;

        return {
            kwhPerDay: kwhPerDay.toFixed(2),
            kwhPerMonth: kwhPerMonth.toFixed(2),
            co2PerMonth: co2PerMonth.toFixed(2),
            costPerMonth: costPerMonth.toFixed(2)
        };
    }

    getTotalStats() {
        let totalKwh = 0;
        let totalCO2 = 0;
        let totalCost = 0;

        this.devices.forEach(device => {
            const stats = this.calculateDeviceEnergy(device);
            totalKwh += parseFloat(stats.kwhPerMonth);
            totalCO2 += parseFloat(stats.co2PerMonth);
            totalCost += parseFloat(stats.costPerMonth);
        });

        return {
            totalKwh: totalKwh.toFixed(2),
            totalCO2: totalCO2.toFixed(2),
            totalCost: totalCost.toFixed(2)
        };
    }

    renderDevices() {
        const deviceList = document.getElementById('deviceList');
        
        if (this.devices.length === 0) {
            deviceList.innerHTML = '<p class="empty-state">No devices added yet. Add your first device above!</p>';
            return;
        }

        let html = '<h3>Your Devices</h3>';
        
        this.devices.forEach(device => {
            const stats = this.calculateDeviceEnergy(device);
            html += `
                <div class="device-item">
                    <div class="device-header">
                        <span class="device-name">⚡ ${device.name}</span>
                        <button class="device-remove" onclick="deviceTracker.removeDevice(${device.id})">Remove</button>
                    </div>
                    <div class="device-stats">
                        <p><strong>Power:</strong> ${device.wattage}W | <strong>Usage:</strong> ${device.hoursPerDay}h/day</p>
                        <p><strong>Energy:</strong> ${stats.kwhPerMonth} kWh/month</p>
                        <p><strong>CO₂ Emissions:</strong> ${stats.co2PerMonth} kg/month</p>
                        <p><strong>Estimated Cost:</strong> ₹${stats.costPerMonth}/month</p>
                    </div>
                </div>
            `;
        });

        deviceList.innerHTML = html;
    }

    updateInsights() {
        const insightsBox = document.getElementById('deviceInsights');
        
        if (this.devices.length === 0) {
            insightsBox.innerHTML = '';
            return;
        }

        const totals = this.getTotalStats();
        
        // Find top energy consumers
        const sortedDevices = [...this.devices].sort((a, b) => {
            const aEnergy = this.calculateDeviceEnergy(a);
            const bEnergy = this.calculateDeviceEnergy(b);
            return parseFloat(bEnergy.kwhPerMonth) - parseFloat(aEnergy.kwhPerMonth);
        });

        let html = `
            <h3>Energy Insights</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0;">
                <div style="text-align: center;">
                    <div style="font-size: 2em; font-weight: bold;">${totals.totalKwh}</div>
                    <div>kWh/month</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2em; font-weight: bold;">${totals.totalCO2}</div>
                    <div>kg CO₂/month</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 2em; font-weight: bold;">₹${totals.totalCost}</div>
                    <div>Cost/month</div>
                </div>
            </div>
        `;

        // Top consumers
        if (sortedDevices.length > 0) {
            html += `<h4 style="margin-top: 20px;">Top Energy Consumers</h4>`;
            sortedDevices.slice(0, 3).forEach((device, index) => {
                const stats = this.calculateDeviceEnergy(device);
                html += `
                    <div style="background: rgba(255,255,255,0.2); padding: 10px; margin: 10px 0; border-radius: 5px;">
                        <strong>${index + 1}. ${device.name}</strong> - ${stats.kwhPerMonth} kWh/month
                    </div>
                `;
            });
        }

        // Conservation tips
        html += `
            <h4 style="margin-top: 20px;">💡 Energy Conservation Tips</h4>
            <ul style="margin-left: 20px; margin-top: 10px;">
        `;

        if (totals.totalKwh > 300) {
            html += `<li>Your energy usage is high. Consider replacing old appliances with energy-efficient models.</li>`;
        }

        if (sortedDevices.length > 0) {
            const topDevice = sortedDevices[0];
            if (topDevice.hoursPerDay > 10) {
                html += `<li>Your ${topDevice.name} is used ${topDevice.hoursPerDay}h/day. Try reducing usage time.</li>`;
            }
        }

        const highWattageDevices = this.devices.filter(d => d.wattage > 1000);
        if (highWattageDevices.length > 0) {
            html += `<li>You have ${highWattageDevices.length} high-power device(s). Use them only when necessary.</li>`;
        }

        html += `
                <li>Unplug devices when not in use to avoid standby power consumption.</li>
                <li>Use power strips to easily turn off multiple devices at once.</li>
                <li>Consider using timers for devices that don't need to run 24/7.</li>
            </ul>
        `;

        // Savings potential
        const potentialSavings = (totals.totalKwh * 0.2).toFixed(2);
        const potentialCostSavings = (totals.totalCost * 0.2).toFixed(2);
        html += `
            <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 5px; margin-top: 20px;">
                <strong>💰 Savings Potential</strong><br>
                By reducing usage by 20%, you could save:<br>
                • ${potentialSavings} kWh/month<br>
                • ${(potentialSavings * 0.82).toFixed(2)} kg CO₂/month<br>
                • ₹${potentialCostSavings}/month (₹${(potentialCostSavings * 12).toFixed(2)}/year)
            </div>
        `;

        insightsBox.innerHTML = html;
    }
}

// Initialize device tracker
const deviceTracker = new DeviceTracker();

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const addDeviceBtn = document.getElementById('addDeviceBtn');
    
    addDeviceBtn.addEventListener('click', () => {
        const name = document.getElementById('deviceName').value.trim();
        const wattage = document.getElementById('deviceWattage').value;
        const hours = document.getElementById('deviceHours').value;

        if (!name || !wattage || !hours) {
            alert('Please fill in all fields!');
            return;
        }

        if (wattage <= 0 || hours <= 0 || hours > 24) {
            alert('Please enter valid values!');
            return;
        }

        deviceTracker.addDevice(name, wattage, hours);

        // Clear form
        document.getElementById('deviceName').value = '';
        document.getElementById('deviceWattage').value = '';
        document.getElementById('deviceHours').value = '';
    });
});