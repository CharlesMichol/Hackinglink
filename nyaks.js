const gameBox = document.getElementById('gameBox');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.createElement('p');
document.body.appendChild(timerDisplay);

// Create an img element for the jumpscare (initially hidden)
const jumpscareImage = document.createElement('img');
jumpscareImage.src = 'https://i.ibb.co/Jvdf3W9/images-85.jpg'; // Jumpscare image link
jumpscareImage.style.display = 'none';
jumpscareImage.style.position = 'fixed';
jumpscareImage.style.top = '50%';
jumpscareImage.style.left = '50%';
jumpscareImage.style.transform = 'translate(-50%, -50%)';
jumpscareImage.style.zIndex = '100'; // Ensure it appears above other elements
jumpscareImage.style.width = '400px'; // Adjust the width as needed
jumpscareImage.style.height = 'auto'; // Keep aspect ratio
document.body.appendChild(jumpscareImage);

let score = 0;
let timeLeft = 0;
let requiredScore = 15;
let round = 1;
let timer;
let moveInterval;
let difficultyLevel = ''; // Track current difficulty

// Function to get a random position for the box
function getRandomPosition() {
  const x = Math.floor(Math.random() * (window.innerWidth - 50));
  const y = Math.floor(Math.random() * (window.innerHeight - 50));
  return { x, y };
}

// Function to move the box to a random position
function moveBox() {
  const { x, y } = getRandomPosition();
  gameBox.style.left = `${x}px`;
  gameBox.style.top = `${y}px`;
}

// Function to update the score and check for round progression
gameBox.addEventListener('click', () => {
  if (timeLeft > 0) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;

    // Check the current difficulty
    if (difficultyLevel !== 'easy') {
      moveBox(); // Move the box for Medium and Hard difficulties
    }

    // Check if the player has reached the required score for each mode
    if (difficultyLevel === 'easy' && score >= 25) {
      endGame('gulat ka no? - willy the poh');
      displayJumpscare(); // Show jumpscare only in Easy mode
    } else if (difficultyLevel === 'medium') {
      if (score >= requiredScore) {
        if (round === 1) {
          timeLeft += 5; // Add 5 seconds for the second round
          requiredScore = 30; // New target score for the second round
          round++;
          startMovingTarget(); // Start moving the target in the second round
        } else if (round === 2) {
          timeLeft += 7; // Add 7 seconds in second round
          clearInterval(moveInterval); // Stop moving the target at the end of the game
        }
      }
    } else if (difficultyLevel === 'hard') {
      if (score >= 15 && timeLeft <= 10) {
        timeLeft += 10; // Add 10 seconds when reaching 15 points
      }
    }
  }
});

// Countdown timer function
function countdown() {
  if (timeLeft > 0) {
    timerDisplay.textContent = `Time left: ${timeLeft}s`;
    timeLeft--;
  } else {
    endGame('TALO HAHAHA ETO SCORE MO: ' + score);
  }
}

// Function to display the jumpscare image
function displayJumpscare() {
  jumpscareImage.style.display = 'block'; // Show the jumpscare image

  // Optionally, hide the image after a few seconds (e.g., after 3 seconds)
  setTimeout(() => {
    jumpscareImage.style.display = 'none';
  }, 3000);
}

// Function to end the game with a custom message
function endGame(message) {
  clearInterval(timer);
  clearInterval(moveInterval);
  timerDisplay.textContent = message;
  gameBox.style.display = 'none';
  showOptions();
}

// Function to show "Play Again" and "Stop" buttons
function showOptions() {
  const playAgainBtn = document.createElement('button');
  playAgainBtn.textContent = 'Play Again';
  playAgainBtn.onclick = () => location.reload();

  const stopBtn = document.createElement('button');
  stopBtn.textContent = 'Stop';
  stopBtn.onclick = () => {
    timerDisplay.textContent = 'salamat sa paglalaro binibini!';
    playAgainBtn.remove();
    stopBtn.remove();
  };

  document.body.appendChild(playAgainBtn);
  document.body.appendChild(stopBtn);
}

// Function to start the target moving for Medium and Hard difficulties
function startMovingTarget() {
  moveInterval = setInterval(moveBox, 1000);
}

// Function to configure the game based on difficulty
function setDifficulty(difficulty) {
  difficultyLevel = difficulty;
  if (difficulty === 'easy') {
    timeLeft = 15; // 15 seconds for easy
    requiredScore = 25; // Target score for easy
  } else if (difficulty === 'medium') {
    timeLeft = 10; // Default time for medium
    requiredScore = 15; // Default target score for medium
  } else if (difficulty === 'hard') {
    timeLeft = 10; // 10 seconds for hard
    requiredScore = 15; // Score to reach for hard mode
    startMovingTarget(); // Move the box from the start in hard mode
  }
}

// Function to start the game with the selected difficulty
function startGame(difficulty) {
  setDifficulty(difficulty);
  document.getElementById('difficultySelection').style.display = 'none'; // Hide difficulty options
  gameBox.style.display = 'block'; // Show the game box
  scoreDisplay.style.display = 'block'; // Show the score
  moveBox();
  timer = setInterval(countdown, 1000); // Start the countdown
}