// Global variables
let currentWallet = 0;
let turnNumber = 1;
let state = 'idle';
let message = 'Press START to begin auditing government waste!';
let isFlashing = false;
let currentIndex = 0;
let turnHistory = [];
let particles = [];
let confetti = [];
let outcomes = [];
let scrollOffset = 0;
let maxScrollOffset = 0;
let startTime;
let timeLeft;
let lastOutcomeTime;
let pendingMultiplier = 1;
let isEnteringDetails = false;
let playerInitials = '';
let playerEmail = '';
let inputField = null;
let emailField = null;
let leaderboardData = [];
let showingLeaderboard = false;
let highestWallet = 0;
let elonImage = null;
let dogeImage = null;
let isElonImageLoaded = false;
let isDogeImageLoaded = false;
let isShareButtonHovered = false;
let isFirstTurn = true;
let reactionTimer = 0;
let achievements = [];
let totalSaved = 0;
let startButton, stopButton;

// Classes
class Particle {
  constructor() {
    this.x = random(windowWidth);
    this.y = random(windowHeight);
    this.size = random(2, 5);
    this.speedX = random(-1, 1);
    this.speedY = random(-1, 1);
  }
  move() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > windowWidth) this.speedX *= -1;
    if (this.y < 0 || this.y > windowHeight) this.speedY *= -1;
  }
  display() {
    noStroke();
    fill(150, 150, 255, 100);
    ellipse(this.x, this.y, this.size);
  }
}

class ConfettiParticle {
  constructor() {
    this.x = random(windowWidth);
    this.y = random(-50, 0);
    this.size = random(5, 15);
    this.color = [random(255), random(255), random(255)];
    this.speed = random(2, 5);
  }
  move() {
    this.y += this.speed;
  }
  display() {
    noStroke();
    fill(this.color[0], this.color[1], this.color[2]);
    ellipse(this.x, this.y, this.size);
  }
}

// Utility Functions
function formatMoney(amount) {
  if (amount >= 1000000) {
    return '$' + (amount / 1000000).toFixed(2) + 'T';
  } else if (amount >= 1000) {
    return '$' + (amount / 1000).toFixed(2) + 'B';
  } else {
    return '$' + amount.toFixed(2) + 'M';
  }
}

function shuffleOutcomes() {
  for (let i = outcomes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [outcomes[i], outcomes[j]] = [outcomes[j], outcomes[i]];
  }
}

// Setup
function setup() {
  createCanvas(windowWidth, windowHeight);
  textSize(windowWidth / 20);
  textAlign(CENTER, CENTER);
  textFont('Arial');

  // Load images
  loadImage(
    'https://raw.githubusercontent.com/githubanon2400/doge-game/main/assets/elon_cartoon.png',
    img => {
      elonImage = img;
      isElonImageLoaded = true;
    },
    () => console.error('Failed to load Elon image')
  );
  loadImage(
    'https://raw.githubusercontent.com/githubanon2400/doge-game/main/assets/shiba_laser.png',
    img => {
      dogeImage = img;
      isDogeImageLoaded = true;
    },
    () => console.error('Failed to load DOGE image')
  );

  // Initialize outcomes
  outcomes = [
    { type: 'gain', amount: random(500, 2000), color: [255, 0, 0], 
      label: 'FOUND $1M STUDY ON POLITICIAN LIES 🤥\nSaved taxpayers from "honesty research".' },
    { type: 'gain', amount: random(1000, 3000), color: [0, 255, 0], 
      label: 'CANCELLED $2B SQUIRREL RECYCLING PROGRAM 🐿️\nNo more eco-nuts.' },
    { type: 'gain', amount: random(2000, 5000), color: [0, 0, 255], 
      label: 'RECOVERED $5B FROM "HOW TO SPEND MONEY" SEMINAR 📚\nTaught them for free.' },
    { type: 'gain', amount: random(3000, 6000), color: [255, 255, 0], 
      label: 'STOPPED $3B GOLD-PLATED TOILET INITIATIVE 🚽\nFlushed the waste away.' },
    { type: 'gain', amount: random(1000, 4000), color: [0, 255, 255], 
      label: 'CUT $1.5B ON INVISIBLE BRIDGE RESEARCH 🌉\nNowhere to go!' },
    { type: 'rugpull', color: [255, 0, 0], 
      label: 'BUREAUCRATS BUY $10K STAPLERS 🖇️\nGame over, fancy office wins.' },
    { type: 'rugpull', color: [255, 0, 0], 
      label: 'FUNDED $20B CAT VIDEO ARCHIVE 😺\nPurr-fect waste detected.' }
  ];
  shuffleOutcomes();

  // Create particles
  let particleCount = windowWidth < 600 ? 20 : 40;
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  // Create buttons
  startButton = createButton('START AUDIT');
  startButton.position(windowWidth / 2 - 60, windowHeight / 2 + 50);
  startButton.mousePressed(startFlashing);
  startButton.style('font-size', `${windowWidth / 25}px`);
  startButton.style('padding', '10px');
  startButton.hide();

  stopButton = createButton('STOP');
  stopButton.position(windowWidth / 2 - 50, windowHeight - 100);
  stopButton.mousePressed(stopFlashing);
  stopButton.style('font-size', `${windowWidth / 20}px`);
  stopButton.style('padding', '15px');
  stopButton.hide();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  startButton.position(windowWidth / 2 - 60, windowHeight / 2 + 50);
  stopButton.position(windowWidth / 2 - 50, windowHeight - 100);
  textSize(windowWidth / 20);
}

// Draw
function draw() {
  background(20);

  // Draw particles
  for (let particle of particles) {
    particle.move();
    particle.display();
  }

  // Draw confetti
  for (let i = confetti.length - 1; i >= 0; i--) {
    let c = confetti[i];
    c.move();
    c.display();
    if (c.y > windowHeight) {
      confetti.splice(i, 1);
    }
  }

  // Draw Elon image
  if (isElonImageLoaded && elonImage) {
    image(elonImage, 30, windowHeight - (windowHeight / 3), windowWidth / 4, windowWidth / 4);
  }

  drawTitle();
  drawWallet();
  drawHistoryPanel();

  if (state === 'flashing' || state === 'processing') {
    drawFlashingOutcome();
  }

  if (millis() < reactionTimer) {
    drawDogeReaction();
  }

  if (showingLeaderboard) {
    drawLeaderboard();
  } else if (isEnteringDetails) {
    drawInputFields();
  } else {
    drawMessage();
  }

  // Button visibility
  if (state === 'idle' && isFirstTurn) {
    startButton.show();
  } else {
    startButton.hide();
  }
  if (state === 'flashing' && isFlashing) {
    stopButton.show();
  } else {
    stopButton.hide();
  }
}

function drawTitle() {
  fill(255, 215, 0);
  text('DOGE: THE GAME', windowWidth / 2, windowHeight / 10);
}

function drawWallet() {
  fill(255);
  text(`Wallet: ${formatMoney(currentWallet)}`, windowWidth / 2, windowHeight / 5);
  text(`Turn: ${turnNumber}`, windowWidth / 2, windowHeight / 4);
}

function drawHistoryPanel() {
  let panelWidth = windowWidth / 4;
  let panelHeight = windowHeight / 2;
  let panelX = windowWidth - panelWidth - 20;
  let panelY = 20;

  fill(50, 50, 50, 200);
  rect(panelX, panelY, panelWidth, panelHeight, 10);
  
  fill(255);
  textSize(windowWidth / 30);
  text('History', panelX + panelWidth / 2, panelY + 30);

  push();
  translate(panelX, panelY + 60);
  let historyY = -scrollOffset;
  for (let i = turnHistory.length - 1; i >= 0; i--) {
    fill(turnHistory[i].color);
    textSize(windowWidth / 40);
    text(turnHistory[i].label, 10, historyY, panelWidth - 20);
    historyY += textAscent() + 20;
  }
  pop();

  maxScrollOffset = Math.max(0, historyY - (panelHeight - 60));
  scrollOffset = constrain(scrollOffset, 0, maxScrollOffset);
}

function drawMessage() {
  fill(255);
  textSize(windowWidth / 20);
  text(message, windowWidth / 2, windowHeight / 2);
}

function drawFlashingOutcome() {
  if (isFlashing) {
    currentIndex = floor(random(outcomes.length));
  }
  let outcome = outcomes[currentIndex];
  fill(outcome.color[0], outcome.color[1], outcome.color[2]);
  textSize(windowWidth / 20);
  text(outcome.label, windowWidth / 2, windowHeight / 2);
}

function drawDogeReaction() {
  if (isDogeImageLoaded && dogeImage) {
    image(dogeImage, windowWidth / 2 - (windowWidth / 8), windowHeight / 2 - (windowWidth / 8), windowWidth / 4, windowWidth / 4);
    stroke(255, random(0, 255), random(0, 255));
    strokeWeight(5);
    line(windowWidth / 2 - (windowWidth / 16), windowHeight / 2 - (windowWidth / 16), random(windowWidth), random(windowHeight));
    line(windowWidth / 2 + (windowWidth / 16), windowHeight / 2 - (windowWidth / 16), random(windowWidth), random(windowHeight));
  }
}

function drawInputFields() {
  fill(255);
  text('Enter Initials:', windowWidth / 2, windowHeight / 2 - 60);
  text('Enter Email:', windowWidth / 2, windowHeight / 2 + 20);
}

async function drawLeaderboard() {
  fill(0, 0, 0, 200);
  rect(0, 0, windowWidth, windowHeight);
  fill(255);
  textSize(windowWidth / 20);
  text('Leaderboard', windowWidth / 2, windowHeight / 10);
  textSize(windowWidth / 30);
  for (let i = 0; i < leaderboardData.length; i++) {
    let entry = leaderboardData[i];
    text(`${i + 1}. ${entry.initials}: ${formatMoney(entry.score)}`, windowWidth / 2, windowHeight / 5 + i * 40);
  }
  text(`Total Saved by Players: ${formatMoney(totalSaved)}`, windowWidth / 2, windowHeight - 50);
  
  let shareX = windowWidth / 2 - 50;
  let shareY = windowHeight - 100;
  fill(isShareButtonHovered ? 100 : 50);
  rect(shareX, shareY, 100, 40, 10);
  fill(255);
  textSize(windowWidth / 40);
  text('Share on X', windowWidth / 2, shareY + 20);
}

// Game Logic
function startFlashing() {
  if (state === 'idle') {
    isFlashing = true;
    state = 'flashing';
    startTime = millis();
    timeLeft = 5000; // 5 seconds
    isFirstTurn = false;
  }
}

function stopFlashing() {
  if (state === 'flashing' && isFlashing) {
    isFlashing = false;
    state = 'processing';
    lastOutcomeTime = millis();
    applyOutcome(currentIndex);
  }
}

function applyOutcome(i) {
  let outcome = outcomes[i];
  turnHistory.push({ label: `${turnNumber}: ${outcome.label}`, color: outcome.color });
  if (outcome.type === 'gain') {
    let amount = outcome.amount * pendingMultiplier;
    currentWallet += amount;
    highestWallet = max(highestWallet, currentWallet);
    let reactions = [
      `Victory! Saved ${formatMoney(amount)}! Elon: "To the moon!" 🚀`,
      `Victory! Saved ${formatMoney(amount)}! Trump: "Best audit ever!" 🇺🇸`
    ];
    message = random(reactions);
    if (amount >= 1000) {
      celebrateWin();
    }
    if (currentWallet >= 1000000 && !achievements.includes('Trillionaire')) {
      achievements.push('Trillionaire');
      message += "\nACHIEVEMENT: Trillionaire Savior! 💸";
    }
    pendingMultiplier = 1;
    turnNumber++;
    state = 'idle';
  } else if (outcome.type === 'rugpull') {
    message = `Game Over! Trump: "Swamp wins, sad!" 😡`;
    currentWallet = 0;
    state = 'idle';
    isEnteringDetails = true;
    createInputFields();
  }
  reactionTimer = millis() + 2000;
}

function celebrateWin() {
  for (let i = 0; i < 100; i++) {
    confetti.push(new ConfettiParticle());
  }
}

function createInputFields() {
  inputField = createInput('');
  inputField.position(windowWidth / 2 - 100, windowHeight / 2 - 40);
  inputField.size(200, 30);
  inputField.style('font-size', '20px');

  emailField = createInput('');
  emailField.position(windowWidth / 2 - 100, windowHeight / 2 + 40);
  emailField.size(200, 30);
  emailField.style('font-size', '20px');
}

function shareOnX() {
  saveCanvas('DOGE_Score', 'png');
  const score = formatMoney(highestWallet);
  const text = `I saved ${score} in DOGE: THE GAME! Beat me if you can! #DOGETheGame`;
  const url = 'https://[your-username].github.io/doge-game/';
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
}

// Event Handlers
function mouseWheel(event) {
  if (mouseX > windowWidth - windowWidth / 4 - 20 && mouseX < windowWidth - 20 &&
      mouseY > 20 && mouseY < windowHeight / 2 + 20) {
    scrollOffset += event.delta / 10;
  }
}

function mousePressed() {
  if (showingLeaderboard) {
    let shareX = windowWidth / 2 - 50;
    let shareY = windowHeight - 100;
    if (mouseX > shareX && mouseX < shareX + 100 && mouseY > shareY && mouseY < shareY + 40) {
      shareOnX();
    }
  }
}

function mouseMoved() {
  let shareX = windowWidth / 2 - 50;
  let shareY = windowHeight - 100;
  isShareButtonHovered = (mouseX > shareX && mouseX < shareX + 100 && mouseY > shareY && mouseY < shareY + 40);
}

function keyPressed() {
  if (isEnteringDetails && keyCode === ENTER) {
    playerInitials = inputField.value().toUpperCase().substring(0, 3);
    playerEmail = emailField.value();
    if (playerInitials.length > 0) {
      inputField.remove();
      emailField.remove();
      isEnteringDetails = false;
      submitAndShowLeaderboard();
    }
  }
}

async function submitAndShowLeaderboard() {
  await submitScore(playerInitials, highestWallet, playerEmail);
  leaderboardData = await getLeaderboard();
  totalSaved = await getTotalSaved();
  showingLeaderboard = true;
}