const passwordProtect = document.getElementById('password-protect');
const passwordInput = document.getElementById('password-input');
const passwordSubmit = document.getElementById('password-submit');
const correctPassword = "1"; // Change this to your desired password

passwordSubmit.addEventListener('click', () => {
    if (passwordInput.value === correctPassword) {
        passwordProtect.style.display = 'none';
    } else {
        alert('Incorrect password!');
    }
});

// Handle password input submit with the "Enter" key
passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { // Check if the "Enter" key is pressed
        passwordSubmit.click(); // Trigger the submit button click event
    }
});

const ball = document.getElementById('ball');
const scoreMessage = document.getElementById('score-message');
const gameContainer = document.getElementById('game-container');
const retryButton = document.getElementById('retry-button'); // Retry button
const scoreboard = document.getElementById('scoreboard'); // Scoreboard display
const goal = document.getElementById('goal'); // Goal element

let isDragging = false;
let lastMouseX = 0;
let lastMouseY = 0;
let velocityX = 0;
let velocityY = 0;
let ballX = 0;
let ballY = 0;
let score = 0; // Track the score
let hasScored = false; // Flag to track if a goal has been scored
let isBallInsideGoal = false; // Track if the ball is inside the goal rectangle

const initialBallPosition = { x: 0, y: 0 }; // Initial position of the ball

// Initialize the ball to its starting position
function resetBallPosition() {
    ballX = initialBallPosition.x;
    ballY = initialBallPosition.y;
    velocityX = 0; // Stop the ball by setting velocity to 0
    velocityY = 0;
    updateBallPosition();
    hasScored = false; // Reset the score flag when retrying
    isBallInsideGoal = false; // Reset inside goal flag
}

// Update the scoreboard display
function updateScore() {
    scoreboard.textContent = `Score: ${score}`;
}

// Handle drag start
ball.addEventListener('mousedown', (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    velocityX = 0;
    velocityY = 0;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaX = e.clientX - lastMouseX;
        const deltaY = e.clientY - lastMouseY;

        ballX += deltaX;
        ballY += deltaY;

        velocityX = deltaX;
        velocityY = deltaY;

        lastMouseX = e.clientX;
        lastMouseY = e.clientY;

        updateBallPosition();
    }
});

// Handle drag end
document.addEventListener('mouseup', () => {
    if (isDragging) {
        isDragging = false;
        applyMomentum();
    }
});

function updateBallPosition() {
    ball.style.transform = `translate(${ballX}px, ${ballY}px)`;
}

function applyMomentum() {
    const friction = 0.98; // Gradually slow down
    const interval = setInterval(() => {
        if (Math.abs(velocityX) < 0.1 && Math.abs(velocityY) < 0.1) {
            clearInterval(interval);
            checkGoalCollision(); // Check for goal when the ball stops
        } else {
            ballX += velocityX;
            ballY += velocityY;
            velocityX *= friction;
            velocityY *= friction;

            checkGoalCollision();
            updateBallPosition();
        }
    }, 16); // Approximately 60 frames per second
}

function checkGoalCollision() {
    const ballRect = ball.getBoundingClientRect();
    const goalRect = goal.getBoundingClientRect();

    // Check if the ball is entirely within the goal rectangle
    const isInsideGoal =
        ballRect.left >= goalRect.left &&
        ballRect.right <= goalRect.right &&
        ballRect.top >= goalRect.top &&
        ballRect.bottom <= goalRect.bottom;

    if (isInsideGoal) {
        isBallInsideGoal = true;

        // Check if the ball has stopped moving (Condition A)
        if (!hasScored && Math.abs(velocityX) < 0.1 && Math.abs(velocityY) < 0.1) {
            handleGoalScored();
        }
    } else {
        // Check if the ball was inside and has now moved out (Condition B)
        if (isBallInsideGoal && !hasScored) {
            handleGoalScored();
        }
        isBallInsideGoal = false; // Update the flag since the ball is now outside
    }
}

function handleGoalScored() {
    hasScored = true; // Mark goal as scored
    score++; // Increase the score
    updateScore(); // Update the scoreboard

    // Show score message
    scoreMessage.style.display = 'block';
    setTimeout(() => {
        scoreMessage.style.display = 'none';
    }, 1500);

    // Reset the ball to the initial position
    resetBallPosition();
}

// Make the ball draggable on touch devices
ball.addEventListener('touchstart', (e) => {
    const touch = e.touches[0];
    isDragging = true;
    lastMouseX = touch.clientX;
    lastMouseY = touch.clientY;
    velocityX = 0;
    velocityY = 0;
});

document.addEventListener('touchmove', (e) => {
    if (isDragging) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - lastMouseX;
        const deltaY = touch.clientY - lastMouseY;

        ballX += deltaX;
        ballY += deltaY;

        velocityX = deltaX;
        velocityY = deltaY;

        lastMouseX = touch.clientX;
        lastMouseY = touch.clientY;

        updateBallPosition();
    }
});

document.addEventListener('touchend', () => {
    if (isDragging) {
        isDragging = false;
        applyMomentum();
    }
});

// Retry button functionality
retryButton.addEventListener('click', () => {
    resetBallPosition();
    updateScore(); // Update the scoreboard to show 0
});
