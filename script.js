// Habit data structure
let habits = [
    {
        id: '1',
        name: 'Morning Meditation',
        cue: 'Wake up',
        routine: 'Meditate for 10 minutes',
        reward: 'Feel calm and centered',
        streak: 7,
        completedToday: true,
        color: '#8b5cf6'
    },
    {
        id: '2',
        name: 'Evening Run',
        cue: 'After work',
        routine: 'Run for 30 minutes',
        reward: 'Feel energized',
        streak: 12,
        completedToday: false,
        color: '#06b6d4'
    },
    {
        id: '3',
        name: 'Read Daily',
        cue: 'Before bed',
        routine: 'Read for 20 minutes',
        reward: 'Learn something new',
        streak: 5,
        completedToday: true,
        color: '#10b981'
    }
];

let currentMood = 'neutral';
let selectedDate = new Date();
let selectedColor = '#8b5cf6';

// Mood suggestions
const moodSuggestions = {
    happy: ['Celebrate with a healthy treat', 'Share your progress with friends', 'Try a new challenging habit'],
    sad: ['Take a gentle walk', 'Practice deep breathing', 'Listen to uplifting music'],
    energetic: ['Do an intense workout', 'Tackle a big project', 'Learn something new'],
    tired: ['Take a power nap', 'Do gentle stretches', 'Practice mindfulness'],
    neutral: ['Stick to your routine', 'Focus on consistency', 'Review your progress']
};

// Badge definitions
const badges = [
    {
        id: 'first-step',
        name: 'First Step',
        description: 'Complete your first habit',
        icon: '🌱',
        requirement: (habits) => habits.some(h => h.completedToday)
    },
    {
        id: 'streak-master',
        name: 'Streak Master',
        description: 'Maintain a 7-day streak',
        icon: '🔥',
        requirement: (habits) => habits.some(h => h.streak >= 7)
    },
    {
        id: 'habit-builder',
        name: 'Habit Builder',
        description: 'Create 3 habits',
        icon: '🏗️',
        requirement: (habits) => habits.length >= 3
    },
    {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Complete all habits in one day',
        icon: '💎',
        requirement: (habits) => habits.length > 0 && habits.every(h => h.completedToday)
    },
    {
        id: 'marathon-runner',
        name: 'Marathon Runner',
        description: 'Achieve a 30-day streak',
        icon: '🏃‍♂️',
        requirement: (habits) => habits.some(h => h.streak >= 30)
    },
    {
        id: 'habit-master',
        name: 'Habit Master',
        description: 'Create 10 habits',
        icon: '👑',
        requirement: (habits) => habits.length >= 10
    }
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    updateDisplay();
});

function initializeEventListeners() {
    // Add habit button
    document.getElementById('add-habit-btn').addEventListener('click', showAddHabitModal);
    
    // Modal close events
    document.getElementById('modal-overlay').addEventListener('click', hideAddHabitModal);
    document.getElementById('cancel-btn').addEventListener('click', hideAddHabitModal);
    
    // Form submission
    document.getElementById('habit-form').addEventListener('submit', handleAddHabit);
    
    // Mood selector
    const moodButtons = document.querySelectorAll('.mood-btn');
    moodButtons.forEach(btn => {
        btn.addEventListener('click', () => changeMood(btn.dataset.mood));
    });
    
    // Color picker
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.style.backgroundColor = btn.dataset.color;
        btn.addEventListener('click', () => selectColor(btn.dataset.color));
    });
    
    // Time slider
    document.getElementById('time-slider').addEventListener('input', handleTimeSliderChange);
    
    // Escape key to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideAddHabitModal();
        }
    });
}

function updateDisplay() {
    updateHeader();
    renderHabitRings();
    updateStreakFlame();
    updateMoodDisplay();
    updateTimeSlider();
    updateBadgeSystem();
}

function updateHeader() {
    const completedToday = habits.filter(h => h.completedToday).length;
    const totalHabits = habits.length;
    const completionRate = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
    
    document.getElementById('completed-today').textContent = `${completedToday}/${totalHabits}`;
    document.getElementById('completion-rate').textContent = `${completionRate}%`;
}

function renderHabitRings() {
    const container = document.getElementById('habit-rings');
    container.innerHTML = '';
    
    habits.forEach(habit => {
        const habitElement = createHabitRingElement(habit);
        container.appendChild(habitElement);
    });
}

function createHabitRingElement(habit) {
    const element = document.createElement('div');
    element.className = 'habit-ring';
    element.addEventListener('click', () => toggleHabit(habit.id));
    
    const progress = habit.completedToday ? 100 : (habit.streak * 10) % 100;
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    
    element.innerHTML = `
        <div class="ring-visualization">
            <svg class="ring-svg" viewBox="0 0 100 100">
                <circle
                    cx="50" cy="50" r="40"
                    stroke="#374151" stroke-width="8"
                    fill="none" opacity="0.3">
                </circle>
                <circle
                    cx="50" cy="50" r="40"
                    stroke="${habit.color}" stroke-width="8"
                    fill="none" stroke-linecap="round"
                    stroke-dasharray="${circumference}"
                    stroke-dashoffset="${strokeDashoffset}"
                    style="transition: stroke-dashoffset 0.5s ease">
                </circle>
            </svg>
            <div class="ring-center">
                <div class="ring-indicator" style="background-color: ${habit.completedToday ? '#10b981' : '#6b7280'}"></div>
                <div class="ring-streak">${habit.streak}</div>
            </div>
        </div>
        <h3 class="habit-name">${habit.name}</h3>
        <div class="habit-details">
            <div class="habit-detail">
                <span class="detail-label" style="color: #a78bfa">Cue:</span>
                <span class="detail-value">${habit.cue}</span>
            </div>
            <div class="habit-detail">
                <span class="detail-label" style="color: #67e8f9">Routine:</span>
                <span class="detail-value">${habit.routine}</span>
            </div>
            <div class="habit-detail">
                <span class="detail-label" style="color: #6ee7b7">Reward:</span>
                <span class="detail-value">${habit.reward}</span>
            </div>
        </div>
        <div class="habit-status">
            <span class="status-badge ${habit.completedToday ? 'status-completed' : 'status-pending'}">
                ${habit.completedToday ? 'Completed Today' : 'Pending'}
            </span>
        </div>
    `;
    
    return element;
}

function toggleHabit(habitId) {
    const habitIndex = habits.findIndex(h => h.id === habitId);
    if (habitIndex !== -1) {
        const habit = habits[habitIndex];
        habit.completedToday = !habit.completedToday;
        habit.streak = habit.completedToday ? habit.streak + 1 : Math.max(0, habit.streak - 1);
        updateDisplay();
    }
}

function updateStreakFlame() {
    const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
    const flameElement = document.querySelector('.flame');
    const streakNumber = document.getElementById('streak-number');
    const totalStreakSpan = document.getElementById('total-streak');
    
    // Update flame size and color based on streak
    if (totalStreak < 5) {
        flameElement.style.fontSize = '3rem';
        flameElement.style.color = '#fb923c';
    } else if (totalStreak < 15) {
        flameElement.style.fontSize = '4rem';
        flameElement.style.color = '#f97316';
    } else if (totalStreak < 30) {
        flameElement.style.fontSize = '5rem';
        flameElement.style.color = '#ef4444';
    } else {
        flameElement.style.fontSize = '6rem';
        flameElement.style.color = '#dc2626';
    }
    
    streakNumber.textContent = totalStreak;
    totalStreakSpan.textContent = totalStreak;
}

function changeMood(mood) {
    currentMood = mood;
    updateMoodDisplay();
}

function updateMoodDisplay() {
    // Update active mood button
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.mood === currentMood);
    });
    
    // Update current mood text
    document.getElementById('current-mood').textContent = currentMood;
    
    // Update suggestions
    const suggestionsContainer = document.getElementById('mood-suggestions');
    const suggestions = moodSuggestions[currentMood] || moodSuggestions.neutral;
    
    suggestionsContainer.innerHTML = `
        <h4>Suggested for your mood:</h4>
        <ul>
            ${suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
        </ul>
    `;
}

function handleTimeSliderChange(event) {
    const value = parseInt(event.target.value);
    const today = new Date();
    selectedDate = new Date(today);
    selectedDate.setDate(today.getDate() - (30 - value));
    updateTimeSlider();
}

function updateTimeSlider() {
    const formatDate = (date) => {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        
        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };
    
    const getHabitCompletionForDate = (date) => {
        const daysSinceToday = Math.floor((new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        return Math.max(0, habits.length - Math.floor(daysSinceToday / 3));
    };
    
    document.getElementById('selected-date').textContent = formatDate(selectedDate);
    
    const completedCount = getHabitCompletionForDate(selectedDate);
    document.getElementById('date-completion').textContent = `${completedCount}/${habits.length} habits completed`;
    
    // Update progress list
    const progressList = document.getElementById('progress-list');
    progressList.innerHTML = habits.map((habit, index) => {
        const completed = index < completedCount;
        return `
            <div class="progress-item">
                <div class="progress-dot ${completed ? 'completed' : 'pending'}"></div>
                <span class="progress-name ${completed ? 'completed' : 'pending'}">${habit.name}</span>
            </div>
        `;
    }).join('');
}

function updateBadgeSystem() {
    const unlockedBadges = badges.map(badge => ({
        ...badge,
        unlocked: badge.requirement(habits)
    }));
    
    const unlockedCount = unlockedBadges.filter(b => b.unlocked).length;
    
    // Update progress
    document.getElementById('unlocked-count').textContent = unlockedCount;
    const progressFill = document.getElementById('badge-progress-fill');
    progressFill.style.width = `${(unlockedCount / badges.length) * 100}%`;
    
    // Render badges
    const badgeGrid = document.getElementById('badge-grid');
    badgeGrid.innerHTML = unlockedBadges.map(badge => `
        <div class="badge ${badge.unlocked ? 'unlocked' : 'locked'}">
            <div class="badge-icon">${badge.icon}</div>
            <div class="badge-name">${badge.name}</div>
            <div class="badge-description">${badge.description}</div>
            ${badge.unlocked ? '<div class="badge-status">Unlocked!</div>' : ''}
        </div>
    `).join('');
    
    // Show next badge hint
    const nextBadge = unlockedBadges.find(b => !b.unlocked);
    const nextBadgeContainer = document.getElementById('next-badge');
    
    if (nextBadge && unlockedCount < badges.length) {
        nextBadgeContainer.innerHTML = `
            <h4>🎯 Next Badge to Unlock:</h4>
            <div class="next-badge-content">
                <span class="next-badge-icon">${nextBadge.icon}</span>
                <div>
                    <div class="badge-name">${nextBadge.name}</div>
                    <div class="badge-description">${nextBadge.description}</div>
                </div>
            </div>
        `;
        nextBadgeContainer.style.display = 'block';
    } else {
        nextBadgeContainer.style.display = 'none';
    }
}

function showAddHabitModal() {
    document.getElementById('habit-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideAddHabitModal() {
    document.getElementById('habit-modal').classList.remove('active');
    document.body.style.overflow = '';
    resetForm();
}

function resetForm() {
    document.getElementById('habit-form').reset();
    selectedColor = '#8b5cf6';
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === selectedColor);
    });
}

function selectColor(color) {
    selectedColor = color;
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.color === color);
    });
}

function handleAddHabit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = document.getElementById('habit-name').value.trim();
    const cue = document.getElementById('habit-cue').value.trim();
    const routine = document.getElementById('habit-routine').value.trim();
    const reward = document.getElementById('habit-reward').value.trim();
    
    if (name && cue && routine && reward) {
        const newHabit = {
            id: Date.now().toString(),
            name,
            cue,
            routine,
            reward,
            streak: 0,
            completedToday: false,
            color: selectedColor
        };
        
        habits.push(newHabit);
        updateDisplay();
        hideAddHabitModal();
    }
}

// Initialize time slider value
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('time-slider').value = 30;
});