// Global variables
let currentWallet = 0; // Now in raw dollars, scaled to millions/billions
let turnNumber = 1;
let state = 'idle';
let gameOver = false;
let isElonImageLoaded = false;
let isDogeImageLoaded = false;
let elonImage, dogeImage;
let currentIndex;
let flashingStartTime;
let flashDuration = 1500;
let shakeOffset = 0;
let shakeDuration = 0;
let showShiba = false;
let shibaDisplayTime = 0;
let shibaDisplayDuration = 1000;

// Outcomes in millions and billions (raw dollars)
let outcomes = [
  // Positive outcomes (gains)
  { label: "Tax loophole found! +$1bn", type: "gain", amount: 1000000000, color: [0, 255, 0] }, // $1 billion
  { label: "New efficiency law! +$750m", type: "gain", amount: 750000000, color: [0, 255, 0] }, // $750 million
  { label: "Elon tweets support! +$500m", type: "gain", amount: 500000000, color: [0, 255, 0] }, // $500 million
  { label: "Coffee budget approved! +$200m", type: "gain", amount: 200000000, color: [0, 255, 0] }, // $200 million
  { label: "Intern finds $400m in a drawer!", type: "gain", amount: 400000000, color: [0, 255, 0] }, // $400 million
  // Negative outcomes: Large random losses (set in applyOutcome)
  { label: "Paperwork avalanche! -$(random)", type: "loss", amount: 0, color: [255, 165, 0] },
  { label: "Caught in red tape! -$(random)", type: "loss", amount: 0, color: [255, 165, 0] },
  // Negative outcomes: Game over (reset to zero)
  { label: "Bureaucratic gremlins bankrupt you! Game Over", type: "gameover", amount: 0, color: [255, 0, 0] },
  { label: "Form 47-B rejected! Total collapse!", type: "gameover", amount: 0, color: [255, 0, 0] },
  { label: "Endless meeting tax drains all! Game Over", type: "gameover", amount: 0, color: [255, 0, 0] }
];

// Preload images
function preload() {
  elonImage = loadImage('elon_cartoon.png', () => isElonImageLoaded = true);
  dogeImage = loadImage('shiba_laser.png', () => isDogeImageLoaded = true);
}

// Setup function
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Arial');
  textAlign(CENTER);
  textSize(windowWidth / 25);
}

// Draw function
function draw() {
  background(0);
  
  if (gameOver) {
    drawGameOver();
    return;
  }
  
  // Apply screen shake if active
  if (shakeDuration > millis()) {
    translate(random(-shakeOffset, shakeOffset), random(-shakeOffset, shakeOffset));
  }
  
  // Draw Elon cartoon
  drawElon();
  
  // Handle flashing state
  if (state === 'flashing') {
    drawFlashingOutcome();
    if (millis() - flashingStartTime > flashDuration) {
      state = 'idle';
    }
  }
  
  // Draw Shiba laser if applicable
  drawShiba();
  
  // Draw wallet and audit info
  drawWallet();
}

// Draw Elon cartoon in bottom-right corner
function drawElon() {
  if (isElonImageLoaded && elonImage) {
    let imgWidth = windowWidth / 5;
    let imgHeight = imgWidth * (elonImage.height / elonImage.width);
    image(elonImage, windowWidth - imgWidth - 20, windowHeight - imgHeight - 20, imgWidth, imgHeight);
  }
}

// Draw Shiba laser image
function drawShiba() {
  if (showShiba && isDogeImageLoaded && dogeImage) {
    let imgWidth = windowWidth / 3;
    let imgHeight = imgWidth * (dogeImage.height / dogeImage.width);
    image(dogeImage, windowWidth / 2 - imgWidth / 2, windowHeight / 2 - imgHeight / 2, imgWidth, imgHeight);
  }
  if (millis() > shibaDisplayTime) {
    showShiba = false;
  }
}

// Draw wallet and audit UI
function drawWallet() {
  fill(255);
  textSize(windowWidth / 25);
  text(`Taxpayer Savings: ${formatMoney(currentWallet)}`, windowWidth / 2, windowHeight / 5);
  text(`Audit: ${turnNumber}`, windowWidth / 2, windowHeight / 4);
  textSize(windowWidth / 30);
  text("Click to Audit!", windowWidth / 2, windowHeight / 3);
}

// Draw game over screen
function drawGameOver() {
  background(50, 0, 0); // Dark red tint
  fill(255);
  textSize(windowWidth / 20);
  text("GAME OVER", windowWidth / 2, windowHeight / 2 - windowWidth / 20);
  textSize(windowWidth / 30);
  text(`Final Savings: ${formatMoney(currentWallet)}`, windowWidth / 2, windowHeight / 2);
  text("Click to Restart", windowWidth / 2, windowHeight / 2 + windowWidth / 20);
}

// Draw flashing outcome with text wrapping
function drawFlashingOutcome() {
  let outcome = outcomes[currentIndex];
  let maxWidth = windowWidth * 0.8;
  let displayLabel = outcome.label;
  if (outcome.type === "loss") {
    let randomLoss = floor(random(500000000, 2000000001)); // $500m to $2bn
    displayLabel = displayLabel.replace("$(random)", formatMoney(randomLoss).slice(1)); // Remove $ for label
    outcomes[currentIndex].amount = -randomLoss; // Update amount dynamically
  }
  let lines = splitText(displayLabel, maxWidth);
  
  push();
  textAlign(CENTER, CENTER);
  fill(outcome.color[0], outcome.color[1], outcome.color[2]);
  textSize(windowWidth / 20);
  
  let yOffset = - (lines.length - 1) * (windowWidth / 40);
  for (let line of lines) {
    text(line, windowWidth / 2, windowHeight / 2 + yOffset);
    yOffset += windowWidth / 40;
  }
  pop();
}

// Split text into multiple lines based on max width
function splitText(text, maxWidth) {
  let words = text.split(' ');
  let lines = [];
  let currentLine = words[0];
  
  for (let i = 1; i < words.length; i++) {
    let word = words[i];
    let width = textWidth(currentLine + " " + word);
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

// Apply the outcome logic
function applyOutcome(i) {
  let outcome = outcomes[i];
  if (outcome.type === "gain") {
    currentWallet += outcome.amount;
    showShiba = true;
    shibaDisplayTime = millis() + shibaDisplayDuration;
  } else if (outcome.type === "loss") {
    currentWallet = max(0, currentWallet + outcome.amount); // Apply random loss
    shakeOffset = 5;
    shakeDuration = millis() + 500;
  } else if (outcome.type === "gameover") {
    currentWallet = 0;
    gameOver = true;
    shakeOffset = 10;
    shakeDuration = millis() + 1000;
  }
  if (!gameOver) turnNumber++;
}

// Start the flashing sequence
function startFlashing() {
  if (state === 'idle' && !gameOver) {
    state = 'flashing';
    flashingStartTime = millis();
    currentIndex = floor(random(outcomes.length));
    applyOutcome(currentIndex);
  }
}

// Format money as $XXm or $XXbn
function formatMoney(amount) {
  if (amount >= 1000000000) { // Billions
    let billions = Math.floor(amount / 1000000000);
    return `$${billions}bn`;
  } else if (amount >= 1000000) { // Millions
    let millions = Math.floor(amount / 1000000);
    return `$${millions}m`;
  } else {
    return "$0"; // Default for small amounts or zero
  }
}

// Handle mouse clicks
function mousePressed() {
  if (gameOver) {
    // Restart game
    currentWallet = 0;
    turnNumber = 1;
    gameOver = false;
    state = 'idle';
  } else {
    startFlashing();
  }
}

// Handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}