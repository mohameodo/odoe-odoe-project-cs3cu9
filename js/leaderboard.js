"use strict";

const leaderboardKey = "gamezone_leaderboard";

// Load leaderboard data from localStorage
function loadLeaderboard() {
    const data = JSON.parse(localStorage.getItem(leaderboardKey));
    return data || { dice: [], guess: [] };
}

// Render leaderboard table for the selected game
function renderLeaderboard(game) {
    const leaderboardBody = document.getElementById('leaderboardBody');
    leaderboardBody.innerHTML = '';

    const data = loadLeaderboard();
    const scores = data[game] || [];

    if (scores.length === 0) {
        leaderboardBody.innerHTML = `<tr><td colspan="3" class="py-6 text-yellow-400">No scores yet for this game.</td></tr>`;
        return;
    }

    scores.forEach((entry, index) => {
        const tr = document.createElement('tr');
        tr.className = index % 2 === 0 ? 'bg-white bg-opacity-10' : 'bg-white bg-opacity-20';
        tr.innerHTML = `
            <td class="p-4">${index + 1}</td>
            <td class="p-4">${entry.player}</td>
            <td class="p-4">${entry.score}</td>
        `;
        leaderboardBody.appendChild(tr);
    });
}

// Setup tab buttons
function setupTabs() {
    const tabs = document.querySelectorAll('.leaderboard-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('ring-4', 'ring-pink-400'));
            tab.classList.add('ring-4', 'ring-pink-400');
            const game = tab.getAttribute('data-game');
            renderLeaderboard(game);
        });
    });
    // Initialize with dice leaderboard
    tabs[0].click();
}

// Initialize leaderboard page
document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
});
