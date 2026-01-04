// Gamification Module

class Gamification {
    constructor() {
        this.points = this.loadPoints();
        this.badges = this.loadBadges();
        this.challenges = this.loadChallenges();
        this.updateDisplay();
    }

    loadPoints() {
        return parseInt(localStorage.getItem('ecopulse_points')) || 0;
    }

    savePoints() {
        localStorage.setItem('ecopulse_points', this.points);
    }

    loadBadges() {
        const saved = localStorage.getItem('ecopulse_badges');
        return saved ? JSON.parse(saved) : [];
    }

    saveBadges() {
        localStorage.setItem('ecopulse_badges', JSON.stringify(this.badges));
    }

    loadChallenges() {
        const saved = localStorage.getItem('ecopulse_challenges');
        if (saved) {
            return JSON.parse(saved);
        }
        return [
            {
                id: 'plastic_free_week',
                name: '🚫 Plastic Free Week',
                description: 'Avoid single-use plastics for 7 consecutive days',
                duration: 7,
                points: 100,
                badge: 'Plastic Warrior',
                progress: 0,
                active: false,
                completed: false
            },
            {
                id: 'public_transport_month',
                name: '🚌 Public Transport Champion',
                description: 'Use only public transport for 30 days',
                duration: 30,
                points: 300,
                badge: 'Transport Hero',
                progress: 0,
                active: false,
                completed: false
            },
            {
                id: 'low_electricity',
                name: '💡 Energy Saver',
                description: 'Reduce electricity usage by 30% for 30 days',
                duration: 30,
                points: 250,
                badge: 'Power Saver',
                progress: 0,
                active: false,
                completed: false
            },
            {
                id: 'zero_waste_week',
                name: '♻️ Zero Waste Week',
                description: 'Produce minimal waste for 7 days',
                duration: 7,
                points: 150,
                badge: 'Waste Warrior',
                progress: 0,
                active: false,
                completed: false
            },
            {
                id: 'meatless_month',
                name: '🥗 Veggie Month',
                description: 'Go vegetarian for 30 days',
                duration: 30,
                points: 200,
                badge: 'Green Eater',
                progress: 0,
                active: false,
                completed: false
            }
        ];
    }

    saveChallenges() {
        localStorage.setItem('ecopulse_challenges', JSON.stringify(this.challenges));
    }

    addPoints(amount, reason) {
        this.points += amount;
        this.savePoints();
        this.updateDisplay();
        this.showNotification(`+${amount} points! ${reason}`);
    }

    earnBadge(badgeName) {
        if (!this.badges.includes(badgeName)) {
            this.badges.push(badgeName);
            this.saveBadges();
            this.updateDisplay();
            this.showNotification(`🎖️ New badge earned: ${badgeName}!`);
        }
    }

    startChallenge(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (challenge && !challenge.active && !challenge.completed) {
            challenge.active = true;
            challenge.startDate = new Date().toISOString();
            this.saveChallenges();
            this.renderChallenges();
            this.showNotification(`Challenge started: ${challenge.name}`);
        }
    }

    updateChallengeProgress(challengeId, progress) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (challenge && challenge.active) {
            challenge.progress = Math.min(progress, challenge.duration);
            
            if (challenge.progress >= challenge.duration) {
                this.completeChallenge(challengeId);
            }
            
            this.saveChallenges();
            this.renderChallenges();
        }
    }

    completeChallenge(challengeId) {
        const challenge = this.challenges.find(c => c.id === challengeId);
        if (challenge) {
            challenge.completed = true;
            challenge.active = false;
            this.addPoints(challenge.points, `Completed ${challenge.name}`);
            this.earnBadge(challenge.badge);
            this.saveChallenges();
            this.renderChallenges();
        }
    }

    updateDisplay() {
        document.getElementById('totalPoints').textContent = this.points;
        document.getElementById('badgeCount').textContent = this.badges.length;
        this.renderBadges();
    }

    renderChallenges() {
        const grid = document.getElementById('challengesGrid');
        let html = '';

        this.challenges.forEach(challenge => {
            const statusClass = challenge.completed ? 'completed' : (challenge.active ? 'active' : '');
            const progressPercent = (challenge.progress / challenge.duration * 100).toFixed(0);
            
            html += `
                <div class="challenge-card ${statusClass}" data-challenge-id="${challenge.id}">
                    <h3>${challenge.name}</h3>
                    <p>${challenge.description}</p>
                    <div style="margin: 15px 0;">
                        <strong>Duration:</strong> ${challenge.duration} days<br>
                        <strong>Reward:</strong> ${challenge.points} points + Badge
                    </div>
            `;

            if (challenge.completed) {
                html += `<div style="background: rgba(255,255,255,0.3); padding: 10px; border-radius: 5px; margin-top: 10px;">
                    ✅ Completed!
                </div>`;
            } else if (challenge.active) {
                html += `
                    <div style="margin-top: 15px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span>Progress:</span>
                            <span>${challenge.progress}/${challenge.duration} days</span>
                        </div>
                        <div class="breakdown-bar" style="background: rgba(255,255,255,0.3);">
                            <div class="breakdown-fill" style="width: ${progressPercent}%; background: white;"></div>
                        </div>
                        <button class="btn-primary" style="margin-top: 10px; padding: 8px 15px; font-size: 0.9em;" 
                                onclick="gamification.updateChallengeProgress('${challenge.id}', ${challenge.progress + 1})">
                            Log Day ${challenge.progress + 1}
                        </button>
                    </div>
                `;
            } else {
                html += `
                    <button class="btn-primary" style="margin-top: 10px;" 
                            onclick="gamification.startChallenge('${challenge.id}')">
                        Start Challenge
                    </button>
                `;
            }

            html += '</div>';
        });

        grid.innerHTML = html;
    }

    renderBadges() {
        const badgesDisplay = document.getElementById('badgesDisplay');
        
        const allPossibleBadges = [
            { name: 'Plastic Warrior', icon: '🚫', description: 'Completed Plastic Free Week' },
            { name: 'Transport Hero', icon: '🚌', description: 'Public Transport Champion' },
            { name: 'Power Saver', icon: '💡', description: 'Reduced electricity usage' },
            { name: 'Waste Warrior', icon: '♻️', description: 'Zero waste achieved' },
            { name: 'Green Eater', icon: '🥗', description: 'Completed veggie month' },
            { name: 'Eco Starter', icon: '🌱', description: 'First calculation' },
            { name: 'Device Master', icon: '📱', description: 'Added 5+ devices' },
            { name: 'Image Analyzer', icon: '📸', description: 'Analyzed first image' }
        ];

        let html = '';
        allPossibleBadges.forEach(badge => {
            const earned = this.badges.includes(badge.name);
            html += `
                <div class="badge ${earned ? 'earned' : ''}">
                    <div class="badge-icon">${badge.icon}</div>
                    <strong>${badge.name}</strong>
                    <p style="font-size: 0.9em; margin-top: 5px;">${badge.description}</p>
                    ${!earned ? '<p style="font-size: 0.8em; color: #999; margin-top: 5px;">Not earned yet</p>' : ''}
                </div>
            `;
        });

        badgesDisplay.innerHTML = html;
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize gamification
const gamification = new Gamification();

// Check if this is first calculation
let hasCalculated = localStorage.getItem('ecopulse_calculated');
if (!hasCalculated) {
    localStorage.setItem('ecopulse_calculated', 'true');
    gamification.earnBadge('Eco Starter');
}

// Render challenges on page load
document.addEventListener('DOMContentLoaded', () => {
    gamification.renderChallenges();
});