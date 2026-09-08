// Initialize votes from localStorage
const options = ['JavaScript', 'Python', 'Java', 'C++', 'Go'];
const votes = {
    'JavaScript': localStorage.getItem('votes_js') ? parseInt(localStorage.getItem('votes_js')) : 0,
    'Python': localStorage.getItem('votes_python') ? parseInt(localStorage.getItem('votes_python')) : 0,
    'Java': localStorage.getItem('votes_java') ? parseInt(localStorage.getItem('votes_java')) : 0,
    'C++': localStorage.getItem('votes_cpp') ? parseInt(localStorage.getItem('votes_cpp')) : 0,
    'Go': localStorage.getItem('votes_go') ? parseInt(localStorage.getItem('votes_go')) : 0
};

// Add event listeners to vote buttons
document.querySelectorAll('.vote-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const option = this.getAttribute('data-option');
        castVote(option);
    });
});

// Cast vote function
function castVote(option) {
    votes[option]++;
    
    // Save to localStorage
    const storageKey = `votes_${option.toLowerCase().replace('+', 'plus').replace(/\s+/g, '_')}`;
    localStorage.setItem(storageKey, votes[option]);
    
    // Update UI
    updateDisplay();
    
    // Animation effect
    const countElement = document.getElementById(getCountElementId(option));
    countElement.style.transform = 'scale(1.2)';
    setTimeout(() => {
        countElement.style.transform = 'scale(1)';
    }, 200);
}

// Get count element ID by option
function getCountElementId(option) {
    const ids = {
        'JavaScript': 'js-count',
        'Python': 'python-count',
        'Java': 'java-count',
        'C++': 'cpp-count',
        'Go': 'go-count'
    };
    return ids[option];
}

// Update display
function updateDisplay() {
    // Update vote counts
    Object.keys(votes).forEach(option => {
        const countElement = document.getElementById(getCountElementId(option));
        countElement.textContent = votes[option];
        countElement.style.transition = 'transform 0.2s ease';
    });
    
    // Update results chart
    updateResultsChart();
}

// Update results chart
function updateResultsChart() {
    const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);
    const chartDiv = document.getElementById('results-chart');
    chartDiv.innerHTML = '';
    
    options.forEach(option => {
        const percentage = totalVotes === 0 ? 0 : Math.round((votes[option] / totalVotes) * 100);
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div class="result-label">
                <span>${option}</span>
                <span>${votes[option]} (${percentage}%)</span>
            </div>
            <div class="result-bar">
                <div class="result-fill" style="width: ${percentage}%">
                    ${percentage > 5 ? percentage + '%' : ''}
                </div>
            </div>
        `;
        chartDiv.appendChild(resultItem);
    });
    
    // Update total votes
    document.getElementById('total-votes').innerHTML = `Total votes: <strong>${totalVotes}</strong>`;
}

// Reset votes
function resetVotes() {
    if (confirm('Are you sure you want to reset all votes?')) {
        Object.keys(votes).forEach(option => {
            votes[option] = 0;
            const storageKey = `votes_${option.toLowerCase().replace('+', 'plus').replace(/\s+/g, '_')}`;
            localStorage.removeItem(storageKey);
        });
        updateDisplay();
    }
}

// Initial display update
updateDisplay();