"use strict";

// Games page logic
// Implements two simple games: Dice Roll and Guess the Number

const leaderboardKey = "gamezone_leaderboard";

// Initialize leaderboard data structure in localStorage if not present
function initLeaderboard() {
    if (!localStorage.getItem(leaderboardKey)) {
        const initialData = {
            dice: [],
            guess: [],
        };
        localStorage.setItem(leaderboardKey, JSON.stringify(initialData));
    }
}

// Save a new score for a game
function saveScore(game, playerName, score) {
    const data = JSON.parse(localStorage.getItem(leaderboardKey));
    if (!data[game]) data[game] = [];
    data[game].push({ player: playerName, score: score, date: Date.now() });
    // Sort descending by score
    data[game].sort((a, b) => b.score - a.score);
    // Keep top 10
    data[game] = data[game].slice(0, 10);
    localStorage.setItem(leaderboardKey, JSON.stringify(data));
}

// Render Dice Roll game UI
function renderDiceGame(container) {
    container.innerHTML = `
        <div class="bg-white bg-opacity-20 rounded-lg p-6 shadow-lg max-w-md mx-auto">
            <h3 class="text-2xl font-bold mb-4 text-center text-white">Dice Roll</h3>
            <p class="text-indigo-200 mb-4 text-center">Click roll to roll the dice and score points.</p>
            <div class="flex justify-center mb-4">
                <div id="diceResult" class="text-6xl font-extrabold text-pink-500">-</div>
            </div>
            <div class="flex justify-center space-x-4">
                <input type="text" id="dicePlayerName" placeholder="Enter your name" class="rounded p-2 w-2/3 text-gray-900" />
                <button id="rollDiceBtn" class="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded shadow">Roll Dice</button>
            </div>
            <div id="diceMessage" class="mt-4 text-center text-yellow-400"></div>
        </div>
    `;

    const rollBtn = document.getElementById('rollDiceBtn');
    const diceResult = document.getElementById('diceResult');
    const diceMessage = document.getElementById('diceMessage');
    const dicePlayerName = document.getElementById('dicePlayerName');

    rollBtn.addEventListener('click', () => {
        const playerName = dicePlayerName.value.trim();
        if (!playerName) {
            diceMessage.textContent = "Please enter your name to play.";
            return;
        }
        diceMessage.textContent = "";
        const roll = Math.floor(Math.random() * 6) + 1;
        diceResult.textContent = roll;
        saveScore('dice', playerName, roll);
        diceMessage.textContent = `Congrats ${playerName}! You scored ${roll} points.`;
    });
}

// Render Guess the Number game UI
function renderGuessGame(container) {
    let secretNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    let gameOver = false;

    container.innerHTML = `
        <div class="bg-white bg-opacity-20 rounded-lg p-6 shadow-lg max-w-md mx-auto">
            <h3 class="text-2xl font-bold mb-4 text-center text-white">Guess the Number</h3>
            <p class="text-indigo-200 mb-4 text-center">Guess a number between 1 and 100.</p>
            <input type="number" id="guessInput" class="w-full p-3 rounded mb-4 text-gray-900" placeholder="Enter your guess" min="1" max="100" />
            <button id="guessBtn" class="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded shadow w-full">Guess</button>
            <div id="guessMessage" class="mt-4 text-center text-yellow-400"></div>
            <div id="guessAttempts" class="mt-2 text-center text-indigo-200"></div>
            <input type="text" id="guessPlayerName" placeholder="Enter your name" class="rounded p-2 w-full mt-4 text-gray-900" />
        </div>
    `;

    const guessInput = document.getElementById('guessInput');
    const guessBtn = document.getElementById('guessBtn');
    const guessMessage = document.getElementById('guessMessage');
    const guessAttempts = document.getElementById('guessAttempts');
    const guessPlayerName = document.getElementById('guessPlayerName');

    guessBtn.addEventListener('click', () => {
        if (gameOver) {
            guessMessage.textContent = "Game over! Please refresh to play again.";
            return;
        }
        const guess = parseInt(guessInput.value);
        if (isNaN(guess) || guess < 1 || guess > 100) {
            guessMessage.textContent = "Please enter a valid number between 1 and 100.";
            return;
        }
        attempts++;
        if (guess === secretNumber) {
            guessMessage.textContent = `Correct! You guessed the number in ${attempts} attempts.`;
            gameOver = true;
            const playerName = guessPlayerName.value.trim();
            if (playerName) {
                saveScore('guess', playerName, 101 - attempts); // Higher score for fewer attempts
                guessMessage.textContent += ` Score saved for ${playerName}.`;
            } else {
                guessMessage.textContent += ` Enter your name to save your score next time.`;
            }
        } else if (guess < secretNumber) {
            guessMessage.textContent = "Too low! Try again.";
        } else {
            guessMessage.textContent = "Too high! Try again.";
        }
        guessAttempts.textContent = `Attempts: ${attempts}`;
        guessInput.value = "";
        guessInput.focus();
    });
}

// Setup event listeners for game buttons
function setupGameButtons() {
    const playDiceBtn = document.getElementById('playDice');
    const playGuessBtn = document.getElementById('playGuess');
    const gameContainer = document.getElementById('gameContainer');

    playDiceBtn.addEventListener('click', () => {
        renderDiceGame(gameContainer);
    });

    playGuessBtn.addEventListener('click', () => {
        renderGuessGame(gameContainer);
    });
}

// Initialize leaderboard data and setup
document.addEventListener('DOMContentLoaded', () => {
    initLeaderboard();
    setupGameButtons();
});
