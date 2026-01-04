// Carbon Footprint Calculator Module

class CarbonCalculator {
    constructor() {
        this.emissions = {
            transport: 0,
            electricity: 0,
            cooking: 0,
            food: 0,
            waste: 0
        };
        this.total = 0;
        this.averageIndianFootprint = 150; // kg CO2 per month
    }

    calculateTransport(mode, distance) {
        const emissionFactors = {
            bike: 0,
            bus: 0.05,
            train: 0.04,
            car: 0.12,
            flight: 0.25
        };
        return distance * emissionFactors[mode];
    }

    calculateElectricity(units) {
        // India average: 0.82 kg CO2 per kWh
        return units * 0.82;
    }

    calculateCooking(fuel, amount) {
        const emissionFactors = {
            lpg: 3 * amount, // per cylinder
            electric: 15 * amount, // per day * 30 days
            induction: 9 * amount
        };
        return emissionFactors[fuel];
    }

    calculateFood(dietType) {
        const foodEmissions = {
            veg: 50,
            mixed: 75,
            nonveg: 100
        };
        return foodEmissions[dietType];
    }

    calculateWaste(wasteKg, recycling) {
        // 0.5 kg CO2 per kg waste, 30% reduction for recycling
        let emission = wasteKg * 4 * 0.5; // weekly to monthly
        if (recycling) {
            emission *= 0.7;
        }
        return emission;
    }

    calculate(data) {
        this.emissions.transport = this.calculateTransport(data.transportMode, data.transportDistance);
        this.emissions.electricity = this.calculateElectricity(data.electricityUnits);
        this.emissions.cooking = this.calculateCooking(data.cookingFuel, data.cookingAmount);
        this.emissions.food = this.calculateFood(data.foodHabits);
        this.emissions.waste = this.calculateWaste(data.wasteAmount, data.recycling);

        this.total = Object.values(this.emissions).reduce((sum, val) => sum + val, 0);
        
        return {
            emissions: this.emissions,
            total: this.total,
            comparison: this.getComparison()
        };
    }

    getComparison() {
        const percentage = ((this.total / this.averageIndianFootprint) * 100).toFixed(0);
        if (this.total < this.averageIndianFootprint * 0.7) {
            return `Excellent! You're ${100 - percentage}% below average Indian footprint!`;
        } else if (this.total < this.averageIndianFootprint) {
            return `Good! You're ${100 - percentage}% below average Indian footprint.`;
        } else if (this.total < this.averageIndianFootprint * 1.3) {
            return `You're ${percentage - 100}% above average Indian footprint. Room for improvement!`;
        } else {
            return `Your footprint is ${percentage - 100}% above average. Let's work on reducing it!`;
        }
    }

    getHighestCategories() {
        const sorted = Object.entries(this.emissions)
            .sort((a, b) => b[1] - a[1])
            .filter(([_, val]) => val > 0);
        return sorted.slice(0, 3);
    }
}

// Initialize calculator
const carbonCalculator = new CarbonCalculator();

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Update cooking label based on fuel type
    const cookingFuel = document.getElementById('cookingFuel');
    const cylinderLabel = document.getElementById('cylinderLabel');
    
    cookingFuel.addEventListener('change', (e) => {
        if (e.target.value === 'lpg') {
            cylinderLabel.innerHTML = 'Cylinders/month: <input type="number" id="cookingAmount" value="0" min="0" step="0.1">';
        } else {
            cylinderLabel.innerHTML = 'Days used/month: <input type="number" id="cookingAmount" value="0" min="0" step="1">';
        }
    });

    // Calculate button
    document.getElementById('calculateBtn').addEventListener('click', () => {
        const data = {
            transportMode: document.getElementById('transportMode').value,
            transportDistance: parseFloat(document.getElementById('transportDistance').value) || 0,
            electricityUnits: parseFloat(document.getElementById('electricityUnits').value) || 0,
            cookingFuel: document.getElementById('cookingFuel').value,
            cookingAmount: parseFloat(document.getElementById('cookingAmount').value) || 0,
            foodHabits: document.getElementById('foodHabits').value,
            wasteAmount: parseFloat(document.getElementById('wasteAmount').value) || 0,
            recycling: document.getElementById('recycling').checked
        };

        const result = carbonCalculator.calculate(data);
        displayResults(result);
        updateDashboard(result);
        generateTips(result);
        
        // Award points
        gamification.addPoints(10, 'Calculated carbon footprint');
    });
});

function displayResults(result) {
    const resultBox = document.getElementById('calculatorResult');
    const totalCO2 = document.getElementById('totalCO2');
    const comparisonText = document.getElementById('comparisonText');

    totalCO2.textContent = result.total.toFixed(2);
    comparisonText.textContent = result.comparison;
    resultBox.style.display = 'block';
    resultBox.scrollIntoView({ behavior: 'smooth' });
}