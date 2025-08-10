"use strict";

const tournamentKey = "gamezone_tournaments";

// Load tournaments from localStorage or initialize
function loadTournaments() {
    const data = JSON.parse(localStorage.getItem(tournamentKey));
    if (!data) {
        const initial = [
            { id: 1, name: "Spring Showdown", game: "dice", date: "2024-12-01", players: [] },
            { id: 2, name: "Summer Slam", game: "guess", date: "2024-12-15", players: [] },
        ];
        localStorage.setItem(tournamentKey, JSON.stringify(initial));
        return initial;
    }
    return data;
}

// Save tournaments to localStorage
function saveTournaments(tournaments) {
    localStorage.setItem(tournamentKey, JSON.stringify(tournaments));
}

// Render tournament cards
function renderTournaments() {
    const container = document.getElementById('tournamentList');
    container.innerHTML = '';
    const tournaments = loadTournaments();

    tournaments.forEach(t => {
        const card = document.createElement('div');
        card.className = 'bg-purple-700 bg-opacity-80 rounded-lg p-6 shadow-lg text-white';
        card.innerHTML = `
            <h3 class="text-2xl font-bold mb-2">${t.name}</h3>
            <p><strong>Game:</strong> ${t.game === 'dice' ? 'Dice Roll' : 'Guess the Number'}</p>
            <p><strong>Date:</strong> ${t.date}</p>
            <p><strong>Players Joined:</strong> ${t.players.length}</p>
            <ul class="list-disc list-inside mt-2 max-h-40 overflow-auto">
                ${t.players.map(p => `<li>${p}</li>`).join('')}
            </ul>
        `;
        container.appendChild(card);
    });
}

// Populate tournament select options
function populateTournamentSelect() {
    const select = document.getElementById('tournamentSelect');
    select.innerHTML = '';
    const tournaments = loadTournaments();
    tournaments.forEach(t => {
        const option = document.createElement('option');
        option.value = t.id;
        option.textContent = `${t.name} (${t.game === 'dice' ? 'Dice Roll' : 'Guess the Number'}) - ${t.date}`;
        select.appendChild(option);
    });
}

// Handle join tournament form submission
function handleJoinTournament(event) {
    event.preventDefault();
    const playerNameInput = document.getElementById('playerName');
    const tournamentSelect = document.getElementById('tournamentSelect');

    const playerName = playerNameInput.value.trim();
    const tournamentId = parseInt(tournamentSelect.value);

    if (!playerName) {
        alert('Please enter your name.');
        return;
    }
    if (!tournamentId) {
        alert('Please select a tournament.');
        return;
    }

    const tournaments = loadTournaments();
    const tournament = tournaments.find(t => t.id === tournamentId);
    if (!tournament) {
        alert('Tournament not found.');
        return;
    }

    if (tournament.players.includes(playerName)) {
        alert('You have already joined this tournament.');
        return;
    }

    tournament.players.push(playerName);
    saveTournaments(tournaments);
    renderTournaments();
    populateTournamentSelect();
    playerNameInput.value = '';
    alert(`Successfully joined ${tournament.name}!`);
}

// Initialize tournaments page
document.addEventListener('DOMContentLoaded', () => {
    renderTournaments();
    populateTournamentSelect();
    document.getElementById('joinTournamentForm').addEventListener('submit', handleJoinTournament);
});
