// Application state with temperature = 0 (deterministic)
let appState = {
    fromStation: 'Central Station',
    toStation: 'East Park',
    delayPercentage: 50,
    delayMinutes: 5,
    alternativeDistance: 5,
    timeSaved: 2,
    selectedMode: null
};

// Predefined delay data for deterministic behavior (temperature = 0)
const delayData = {
    'Central Station-East Park': { percentage: 50, minutes: 5, distance: 5 },
    'Central Station-West Gate': { percentage: 30, minutes: 3, distance: 3 },
    'Central Station-North Plaza': { percentage: 70, minutes: 8, distance: 7 },
    'Central Station-South Terminal': { percentage: 45, minutes: 5, distance: 4 },
    'Central Station-City Center': { percentage: 20, minutes: 2, distance: 2 },
    'Central Station-Harbor Point': { percentage: 60, minutes: 7, distance: 6 },
    'Central Station-University Campus': { percentage: 40, minutes: 4, distance: 4 },
    'East Park-West Gate': { percentage: 35, minutes: 4, distance: 4 },
    'East Park-North Plaza': { percentage: 55, minutes: 6, distance: 5 },
    'East Park-South Terminal': { percentage: 25, minutes: 3, distance: 3 },
    'East Park-City Center': { percentage: 65, minutes: 7, distance: 6 },
    'East Park-Harbor Point': { percentage: 50, minutes: 5, distance: 5 },
    'East Park-University Campus': { percentage: 40, minutes: 4, distance: 4 },
    'West Gate-North Plaza': { percentage: 45, minutes: 5, distance: 5 },
    'West Gate-South Terminal': { percentage: 30, minutes: 3, distance: 3 },
    'West Gate-City Center': { percentage: 55, minutes: 6, distance: 5 },
    'West Gate-Harbor Point': { percentage: 60, minutes: 7, distance: 6 },
    'West Gate-University Campus': { percentage: 35, minutes: 4, distance: 4 },
    'North Plaza-South Terminal': { percentage: 70, minutes: 8, distance: 7 },
    'North Plaza-City Center': { percentage: 40, minutes: 4, distance: 4 },
    'North Plaza-Harbor Point': { percentage: 50, minutes: 5, distance: 5 },
    'North Plaza-University Campus': { percentage: 45, minutes: 5, distance: 5 },
    'South Terminal-City Center': { percentage: 35, minutes: 4, distance: 4 },
    'South Terminal-Harbor Point': { percentage: 55, minutes: 6, distance: 5 },
    'South Terminal-University Campus': { percentage: 40, minutes: 4, distance: 4 },
    'City Center-Harbor Point': { percentage: 25, minutes: 3, distance: 3 },
    'City Center-University Campus': { percentage: 30, minutes: 3, distance: 3 },
    'Harbor Point-University Campus': { percentage: 45, minutes: 5, distance: 5 }
};

// DOM elements
const fromStationSelect = document.getElementById('from-station');
const toStationSelect = document.getElementById('to-station');
const delayPercentageEl = document.getElementById('delay-percentage');
const delayTimeEl = document.getElementById('delay-time');
const distanceTextEl = document.getElementById('distance-text');
const timeSavedEl = document.getElementById('time-saved');
const progressCircle = document.getElementById('progress-circle');
const summaryProgress = document.getElementById('summary-progress');
const alternativeSection = document.getElementById('alternative-section');
const modeItems = document.querySelectorAll('.mode-item');

// Initialize the app
function init() {
    updateDelayPrediction();
    attachEventListeners();
}

// Attach event listeners
function attachEventListeners() {
    fromStationSelect.addEventListener('change', handleStationChange);
    toStationSelect.addEventListener('change', handleStationChange);
    
    modeItems.forEach(item => {
        item.addEventListener('click', handleModeClick);
    });
}

// Handle station selection change
function handleStationChange() {
    const from = fromStationSelect.value;
    const to = toStationSelect.value;
    
    if (from === to) {
        // If same station, reset to default
        appState.delayPercentage = 0;
        appState.delayMinutes = 0;
        appState.alternativeDistance = 0;
    } else {
        // Get delay data for this route
        const routeKey = `${from}-${to}`;
        const reverseRouteKey = `${to}-${from}`;
        
        let data = delayData[routeKey] || delayData[reverseRouteKey];
        
        if (!data) {
            // Default fallback
            data = { percentage: 40, minutes: 4, distance: 4 };
        }
        
        appState.fromStation = from;
        appState.toStation = to;
        appState.delayPercentage = data.percentage;
        appState.delayMinutes = data.minutes;
        appState.alternativeDistance = data.distance;
    }
    
    updateDelayPrediction();
}

// Update delay prediction display
function updateDelayPrediction() {
    const { delayPercentage, delayMinutes, alternativeDistance } = appState;
    
    // Update percentage text
    delayPercentageEl.textContent = `${delayPercentage}%`;
    
    // Update delay time
    if (delayMinutes === 0) {
        delayTimeEl.textContent = 'No delay';
    } else {
        delayTimeEl.textContent = `${delayMinutes} min delay`;
    }
    
    // Update circular progress
    updateCircularProgress(delayPercentage);
    
    // Update alternative route section
    if (delayPercentage > 20) {
        alternativeSection.style.display = 'block';
        distanceTextEl.textContent = `${alternativeDistance} km left`;
    } else {
        alternativeSection.style.display = 'none';
    }
    
    // Update monthly summary based on trips
    updateMonthlySummary();
}

// Update circular progress indicator
function updateCircularProgress(percentage) {
    // Circle circumference: 2 * π * r = 2 * π * 85 = 534
    const circumference = 534;
    const offset = circumference - (percentage / 100) * circumference;
    
    progressCircle.style.strokeDashoffset = offset;
}

// Update monthly summary
function updateMonthlySummary() {
    // Calculate time saved based on delay percentage
    const savedHours = Math.max(1, Math.floor(appState.delayPercentage / 25));
    appState.timeSaved = savedHours;
    
    timeSavedEl.textContent = `${savedHours} hr`;
    
    // Update progress bar
    const progressPercentage = Math.min(100, (savedHours / 3) * 100);
    summaryProgress.style.width = `${progressPercentage}%`;
}

// Handle transport mode click
function handleModeClick(e) {
    const modeItem = e.currentTarget;
    const mode = modeItem.getAttribute('data-mode');
    
    // Remove previous selection
    modeItems.forEach(item => {
        item.style.opacity = '1';
    });
    
    // Highlight selected mode
    appState.selectedMode = mode;
    modeItem.style.opacity = '1';
    
    // Add a subtle pulse effect
    modeItem.style.transform = 'scale(1.1)';
    setTimeout(() => {
        modeItem.style.transform = 'scale(1)';
    }, 200);
    
    // Update summary based on mode selection
    const modeTimeSavings = {
        'tram': 1,
        'bike': 2,
        'train': 3
    };
    
    const additionalSavings = modeTimeSavings[mode] || 0;
    const newTimeSaved = appState.timeSaved + additionalSavings;
    timeSavedEl.textContent = `${newTimeSaved} hr`;
    
    // Animate the summary
    summaryProgress.style.width = `${Math.min(100, (newTimeSaved / 3) * 100)}%`;
}

// Initialize on load
window.addEventListener('DOMContentLoaded', init);