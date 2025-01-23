const buttonContainer = document.getElementById('button-container');
const progressBar = document.getElementById('progress-bar');
const messageDisplay = document.getElementById('message');

let score = 0;
const targetScore = 100;
let currentButton = null;
let buttonTimeout;
let buttonInterval;

// Game Settings for Increased Difficulty
const buttonAppearInterval = 1000; // Time between button appearances in ms
const buttonLifetime = 1500; // Time a button stays on screen in ms

// Function to generate a random letter
function getRandomLetter() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    return letters[Math.floor(Math.random() * letters.length)];
}

// Function to create a new button at a random position
function createButton() {
    if (currentButton) return; // Only one button at a time for added difficulty

    const button = document.createElement('button');
    button.classList.add('mash-button');
    const letter = getRandomLetter();
    button.textContent = letter;
    button.dataset.letter = letter;

    // Calculate random position within the container
    const containerRect = buttonContainer.getBoundingClientRect();
    const buttonWidth = 100; // Approximate width
    const buttonHeight = 50; // Approximate height

    // Ensure the button stays within the container boundaries
    const maxLeft = containerRect.width - buttonWidth;
    const maxTop = containerRect.height - buttonHeight;

    const left = Math.floor(Math.random() * maxLeft);
    const top = Math.floor(Math.random() * maxTop);

    button.style.left = `${left}px`;
    button.style.top = `${top}px`;

    buttonContainer.appendChild(button);
    currentButton = button;

    // Add event listener for click
    button.addEventListener('click', handleButtonPress);

    // Set a timeout to remove the button if not clicked
    buttonTimeout = setTimeout(() => {
        removeButton(button);
    }, buttonLifetime);
}

// Function to remove a button (either clicked or timed out)
function removeButton(button) {
    if (button) {
        button.removeEventListener('click', handleButtonPress);
        if (button.parentElement) {
            button.parentElement.removeChild(button);
        }
        currentButton = null;
        clearTimeout(buttonTimeout);
    }
}

// Function to handle button press
function handleButtonPress(e) {
    pressButton(e.target.dataset.letter);
}

// Function to handle key presses
function handleKeyPress(e) {
    const pressedKey = e.key.toUpperCase();
    if (currentButton && pressedKey === currentButton.dataset.letter) {
        pressButton(pressedKey);
    }
}

// Function to handle pressing a button (click or key press)
function pressButton(letter) {
    if (currentButton && letter === currentButton.dataset.letter) {
        score++;
        updateProgressBar();
        removeButton(currentButton);
        currentButton = null;

        if (score >= targetScore) {
            endGame();
        }
    }
}

// Function to update the progress bar
function updateProgressBar() {
    const progressPercentage = (score / targetScore) * 100;
    progressBar.style.width = `${progressPercentage}%`;
}

// Function to end the game
function endGame() {
    // Stop generating new buttons
    clearInterval(buttonInterval);
    clearTimeout(buttonTimeout);

    // Remove any existing button
    removeButton(currentButton);

    // Display congratulations message
    messageDisplay.textContent = "Congratulations, you have completed the Spider's Web! Please screenshot this message and send it in your CF to win the death challenge.";
    messageDisplay.classList.remove('hidden');
}

// Initialize the game
function initGame() {
    // Initialize progress bar
    updateProgressBar();

    // Start generating buttons at intervals
    buttonInterval = setInterval(createButton, buttonAppearInterval);

    // Create the first button immediately
    createButton();

    // Listen for key presses
    document.addEventListener('keydown', handleKeyPress);
}

// Start the game when the window loads
window.onload = initGame;
