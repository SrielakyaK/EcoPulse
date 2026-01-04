// Tips Generation Module

const tipDatabase = {
    transport: [
        {
            title: "Switch to Public Transport",
            description: "Using buses or trains can reduce your carbon footprint by up to 45%. Consider getting a monthly pass!",
            impact: "High",
            difficulty: "Medium"
        },
        {
            title: "Carpool with Colleagues",
            description: "Share rides with coworkers. If 4 people carpool, you reduce emissions by 75%.",
            impact: "High",
            difficulty: "Easy"
        },
        {
            title: "Cycle for Short Distances",
            description: "For trips under 5km, cycling is faster than driving in traffic and produces zero emissions.",
            impact: "High",
            difficulty: "Medium"
        },
        {
            title: "Walk More",
            description: "Walking is the most eco-friendly option. Aim for 10,000 steps daily for health and planet!",
            impact: "High",
            difficulty: "Easy"
        }
    ],
    electricity: [
        {
            title: "Switch to LED Bulbs",
            description: "LED bulbs use 75% less energy than incandescent bulbs and last 25 times longer.",
            impact: "Medium",
            difficulty: "Easy"
        },
        {
            title: "Unplug Standby Devices",
            description: "Devices on standby consume 10% of household electricity. Unplug chargers and appliances when not in use.",
            impact: "Medium",
            difficulty: "Easy"
        },
        {
            title: "Use Natural Light",
            description: "Open curtains during day. Natural light reduces electricity use and improves mood!",
            impact: "Low",
            difficulty: "Easy"
        },
        {
            title: "Optimize AC Usage",
            description: "Set AC to 24°C instead of 18°C. Each degree saves 6% energy. Use fans to circulate air.",
            impact: "High",
            difficulty: "Easy"
        },
        {
            title: "Regular Appliance Maintenance",
            description: "Clean AC filters monthly, defrost refrigerators regularly. Efficient appliances use less power.",
            impact: "Medium",
            difficulty: "Medium"
        }
    ],
    cooking: [
        {
            title: "Use Pressure Cookers",
            description: "Pressure cookers use 50% less energy and time compared to regular cooking.",
            impact: "Medium",
            difficulty: "Easy"
        },
        {
            title: "Cover Pots While Cooking",
            description: "Covering pots reduces cooking time by 25% and saves fuel.",
            impact: "Low",
            difficulty: "Easy"
        },
        {
            title: "Switch to Induction",
            description: "Induction cooktops are 90% efficient vs 55% for gas stoves. Consider switching!",
            impact: "High",
            difficulty: "Hard"
        }
    ],
    food: [
        {
            title: "Meatless Mondays",
            description: "Going vegetarian one day a week reduces carbon footprint by 8 kg CO₂/month.",
            impact: "Medium",
            difficulty: "Easy"
        },
        {
            title: "Buy Local Produce",
            description: "Local vegetables have 5x less carbon footprint than imported ones. Visit farmer's markets!",
            impact: "Medium",
            difficulty: "Easy"
        },
        {
            title: "Reduce Food Waste",
            description: "Plan meals, store food properly. 1/3 of food is wasted globally - that's 8% of emissions!",
            impact: "High",
            difficulty: "Medium"
        },
        {
            title: "Eat Seasonal Foods",
            description: "Seasonal produce doesn't need energy-intensive storage. Tastes better too!",
            impact: "Medium",
            difficulty: "Easy"
        }
    ],
    waste: [
        {
            title: "Start Composting",
            description: "Compost food waste instead of throwing it away. Reduces methane emissions by 50%.",
            impact: "High",
            difficulty: "Medium"
        },
        {
            title: "Say No to Single-Use Plastic",
            description: "Carry cloth bags, steel bottles. Each plastic bottle takes 450 years to decompose!",
            impact: "High",
            difficulty: "Easy"
        },
        {
            title: "Segregate Waste",
            description: "Separate wet, dry, and hazardous waste. Makes recycling 80% more effective.",
            impact: "Medium",
            difficulty: "Easy"
        },
        {
            title: "Donate or Sell Old Items",
            description: "Before discarding, see if items can be reused. One person's trash is another's treasure!",
            impact: "Medium",
            difficulty: "Easy"
        }
    ]
};

function generateTips(result) {
    const tipsContent = document.getElementById('tipsContent');
    const highestCategories = carbonCalculator.getHighestCategories();
    
    let html = '<div class="tips-grid">';
    
    // Get 2 tips from each high-emission category
    highestCategories.forEach(([category, _]) => {
        const categoryTips = tipDatabase[category];
        if (categoryTips) {
            const selectedTips = categoryTips.slice(0, 2);
            selectedTips.forEach(tip => {
                html += `
                    <div class="tip-card">
                        <div class="tip-category">${getCategoryEmoji(category)} ${category.toUpperCase()}</div>
                        <h4>${tip.title}</h4>
                        <p>${tip.description}</p>
                        <div style="margin-top: 15px; display: flex; gap: 15px;">
                            <span style="background: #667eea; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.9em;">
                                Impact: ${tip.impact}
                            </span>
                            <span style="background: #11998e; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.9em;">
                                ${tip.difficulty}
                            </span>
                        </div>
                    </div>
                `;
            });
        }
    });
    
    html += '</div>';
    tipsContent.innerHTML = html;
}

function getCategoryEmoji(category) {
    const emojis = {
        transport: '🚗',
        electricity: '⚡',
        cooking: '🔥',
        food: '🍽️',
        waste: '🗑️'
    };
    return emojis[category] || '🌱';
}