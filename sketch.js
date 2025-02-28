// Global variables
let currentWallet = 0;
let turnNumber = 1;
let state = 'idle';
let message = 'Press ENTER to start DOGE Audit 1';
let isFlashing = false;
let currentIndex = 0;
let flashSpeed = 100; // Starting speed in milliseconds
let minSpeed = 50;    // Fastest speed
let speedIncrement = 5; // How much faster it gets each flash
let turnHistory = [];
let particles = [];
let outcomes = [];
let scrollOffset = 0;
let maxScrollOffset = 0;
let flashStartTime;
let minFlashTime = 400;    // Start slow (400ms per outcome)
let maxFlashTime = 100;    // End fast (100ms per outcome)
let flashTimeDecrease = 2; // Gentler speed increase (was 4)
let autoStopTime = 5000;   // 5 seconds total
let startTime;
let timeLeft;
let lastOutcomeTime;       // Track when we last changed outcomes
let pendingMultiplier = 1;  // Changed from boolean to number
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
let imageLoadError = false;
let isShareButtonHovered = false;
let autoStartDelay = 500;  // Changed from 800 to 500 milliseconds (0.5 seconds)
let lastTurnEndTime = 0;    // Track when the last turn ended
let isFirstTurn = true;  // Track if this is the very first turn
let showingElon = false;
let elonDisplayStartTime = 0;
let elonDisplayDuration = 1000; // 1 second in milliseconds

function setup() {
  createCanvas(1100, 600);
  textSize(32);
  textAlign(CENTER, CENTER);
  
  // Load both images with correct GitHub paths
  loadImage(
    'https://raw.githubusercontent.com/githubanon2400/doge-game/main/assets/elon.png',
    img => {
      console.log('Successfully loaded Elon image');
      elonImage = img;
      isElonImageLoaded = true;
    },
    () => {
      console.error('Failed to load Elon image');
      imageLoadError = true;
    }
  );
  
  loadImage(
    './assets/DOGE.png',  // Keep local path for DOGE
    img => {
      console.log('Successfully loaded DOGE image');
      dogeImage = img;
      isDogeImageLoaded = true;
    },
    () => {
      console.error('Failed to load DOGE image');
      imageLoadError = true;
    }
  );
  
  // Initialize outcomes array with new descriptions
  outcomes = [
    // Major Program Reforms ($2B-$10B)
    { type: 'gain', amount: random(2000, 10000), color: [98, 126, 234], 
      label: 'FOUND MEDICARE FRAUD RING 🏥\nBusted unicorn scam, $6B saved.' },
    { type: 'gain', amount: random(1500, 8000), color: [247, 147, 26], 
      label: 'FIXED SSA PAYMENT ERROR 👴\nCut 1812 ghosts, $3B freed.' },
    { type: 'gain', amount: random(2000, 7000), color: [0, 200, 0], label: 'OPTIMIZED VA SPENDING 🎖️' },
    { type: 'gain', amount: random(3000, 9000), color: [0, 180, 0], label: 'CAUGHT DEFENSE OVERBILLING 🚀' },
    
    // Specific Waste Items (millions range: $200M-$2B)
    { type: 'gain', amount: random(200, 2000), color: [0, 150, 220], label: 'CANCELED $1200 STAPLER 📎' },
    { type: 'gain', amount: random(500, 2000), color: [0, 170, 200], label: 'FOUND LOST TANKS 🎯' },
    { type: 'gain', amount: random(300, 1500), color: [131, 55, 236], label: 'FIXED $2M DOOR HINGE 🚪' },
    { type: 'gain', amount: random(400, 2000), color: [50, 180, 50], label: 'RETURNED GOLDEN TOILET 🚽' },
    
    // IT and System Fixes (billions range: $1B-$5B)
    { type: 'gain', amount: random(1000, 5000), color: [0, 180, 180], label: 'FIXED PAYMENT SYSTEM 💻' },
    { type: 'gain', amount: random(1200, 4000), color: [0, 160, 180], label: 'UPGRADED ANCIENT COMPUTERS 🖥️' },
    { type: 'gain', amount: random(800, 3000), color: [0, 140, 180], label: 'CONSOLIDATED DATABASES 📊' },
    { type: 'gain', amount: random(1000, 4000), color: [0, 120, 180], label: 'AUTOMATED PAPERWORK 📄' },
    
    // Military Spending (billions range: $2B-$8B)
    { type: 'gain', amount: random(2000, 8000), color: [100, 200, 0], label: 'FOUND MISSING F-35 PARTS 🛩️' },
    { type: 'gain', amount: random(3000, 8000), color: [120, 200, 0], label: 'FIXED PENTAGON ACCOUNTING 📚' },
    { type: 'gain', amount: random(2000, 6000), color: [140, 200, 0], label: 'OPTIMIZED SUPPLY CHAIN 📦' },
    { type: 'gain', amount: random(1500, 5000), color: [160, 200, 0], label: 'CONSOLIDATED CONTRACTORS 🏗️' },
    
    // Foreign Aid (billions range: $3B-$10B)
    { type: 'gain', amount: random(3000, 10000), color: [200, 100, 0], label: 'STOPPED FOREIGN SLUSH FUND 🌍' },
    { type: 'gain', amount: random(3500, 8000), color: [200, 120, 0], label: 'CAUGHT GRANT FRAUD 🔍' },
    { type: 'gain', amount: random(3000, 7000), label: 'ENDED GHOST PROJECTS 👻' },
    { type: 'gain', amount: random(2500, 6000), color: [200, 160, 0], label: 'FIXED AID OVERSIGHT 🔎' },

    // Multipliers
    { type: 'double', multiplier: 2, color: [255, 215, 0], 
      label: 'DIRECTOR APPROVED 2X 🌟\nElon winks, 2X savings.' },
    { type: 'double', multiplier: 3, color: [255, 215, 0], 
      label: 'EFFICIENCY MASTER 3X 🚀\nTriple cuts, no slips.' },
    { type: 'double', multiplier: 4, color: [255, 215, 0], label: 'REFORM CHAMPION 4X 🇺🇸' },
    { type: 'double', multiplier: 5, color: [255, 215, 0], label: 'TAXPAYER HERO 5X 💪' },
    { type: 'double', multiplier: 50, color: [255, 140, 0], label: 'MUCH WOW BUDGET WOOF 50X 🐕' },

    // Negative Outcomes
    { type: 'rugpull', color: [255, 0, 0], 
      label: 'BUREAUCRATS STAGE COUP 🕴️\nSuits bury DOGE in memos; game ends.' },
    { type: 'rugpull', color: [255, 0, 0], 
      label: 'SHREDDER STEVE GOES ROGUE 🧾\nSteve eats plans, $3B gone; game over.' },
    { type: 'rugpull', color: [255, 0, 0], label: 'CONGRESS DEMANDS WASTE 💸' },
    { type: 'rugpull', color: [255, 0, 0], label: 'LOBBYISTS BLOCK CUTS 🦞' },
    { type: 'rugpull', color: [255, 0, 0], label: 'CAREER STAFF RESIST 😤' },
    { type: 'rugpull', color: [255, 0, 0], label: 'COMMITTEE CHAIRS OBJECT ⛔' },
    { type: 'rugpull', color: [255, 0, 0], label: 'UNIONS FILE LAWSUIT ⚖️' },
    { type: 'rugpull', color: [255, 0, 0], label: 'STATUS QUO PREVAILS 🏛️' }
  ];
  
  shuffleOutcomes(); // Shuffle outcomes initially
  
  // Create background particles
  for (let i = 0; i < 40; i++) {
    particles.push(new Particle());
  }
}

// Enhanced Particle class
class Particle {
  constructor() {
    this.reset();
    this.y = random(height);
    this.direction = random(['up', 'down', 'diagonal']);
    this.rotationSpeed = random(-0.03, 0.03);
    this.rotation = random(TWO_PI);
    // Updated particle types
    this.type = random([
      'money', 'money',           // Weight money higher
      'bureaucracy', 'bureaucracy', // Weight bureaucracy higher
      'doge', 'doge',            // Weight doge higher
      'waste'                     // Add government waste items
    ]);
    this.scale = 1;
    this.pulseSpeed = random(0.02, 0.05);
    this.pulseTime = random(TWO_PI);
  }

  reset() {
    this.x = random(width);
    this.y = this.direction === 'up' ? height + 50 : -50;
    this.size = random(25, 45);
    this.diagonalSpeed = random(-1, 1);
    
    // Updated symbols with more variety
    if (this.type === 'money') {
      this.symbol = random([
        '💸', // Flying money
        '💰', // Money bag
        '🏦', // Bank
        '💵', // Dollar bill
        '📈', // Stonks up
        '🤑', // Money face
      ]);
      this.speed = random(0.8, 2);
      this.opacity = random(30, 50);
    } else if (this.type === 'bureaucracy') {
      this.symbol = random([
        '🏛️', // Government building
        '📋', // Clipboard
        '📝', // Memo
        '🗄️', // Filing cabinet
        '📑', // Stack of papers
        '⚖️', // Scales of justice
        '🔨', // Gavel
        '👔', // Bureaucrat tie
        '🗃️', // File box
        '📊', // Chart
      ]);
      this.speed = random(0.3, 0.8);
      this.opacity = random(20, 35);
    } else if (this.type === 'doge') {
      this.symbol = random([
        '🐕', // Classic doge
        '🦮', // Service doge
        '🐶', // Doge face
        '🦴', // Bone for doge
        '🐾', // Doge prints
      ]);
      this.speed = random(1, 1.5);
      this.opacity = random(40, 60);
      this.size = random(35, 55);
    } else {
      // Government waste symbols
    this.symbol = random([
        '🚽', // Golden toilet
        '✂️', // Budget cuts
        '🗑️', // Government waste
        '🛋️', // Expensive furniture
        '🚁', // Expensive helicopter
        '🛥️', // Luxury boat
        '🏌️', // Golf outings
        '🎪', // Circus/waste
        '🎭', // Theater/drama
        '🎰', // Gambling with tax money
        '🍽️', // Expensive dinners
        '✈️', // Private jets
        '💺', // First class seats
        '🏨', // Luxury hotels
        '🎟️', // Expensive tickets
        '⌚', // Luxury watches
        '💼', // Contractor briefcase
        '🖨️', // Expensive printer
        '☕', // $1200 coffee cup
        '📱', // Overpriced phones
      ]);
      this.speed = random(0.5, 1.2);
      this.opacity = random(30, 45);
    }
  }

  move() {
    // Add bobbing/floating motion
    this.pulseTime += this.pulseSpeed;
    this.scale = 1 + sin(this.pulseTime) * 0.1;

    // Special movement for doge - more playful
    if (this.type === 'doge') {
      this.y += sin(this.pulseTime) * this.speed;
      this.x += cos(this.pulseTime * 0.5) * this.speed;
    } else {
    if (this.direction === 'up') {
      this.y -= this.speed;
        this.x += sin(this.y / 30) * 0.5;
      } else if (this.direction === 'down') {
        this.y += this.speed;
        this.x += cos(this.y / 30) * 0.5;
    } else {
      this.y += this.speed;
        this.x += this.diagonalSpeed;
      }
    }

    // Reset when off screen
    if (this.y < -50 || this.y > height + 50 || 
        this.x < -50 || this.x > width + 50) {
      this.reset();
      this.type = random(['money', 'bureaucracy', 'doge']);
      if (this.direction === 'diagonal') {
        this.x = random([-50, width + 50]);
        this.y = random(height);
      }
    }
    
    this.rotation += this.rotationSpeed;
  }

  display() {
    push();
    // Update colors to include doge
    if (this.type === 'money') {
      fill(255, 215, 0, this.opacity);
    } else if (this.type === 'bureaucracy') {
      fill(200, 200, 200, this.opacity);
    } else {
      // Golden-orange color for doge
      fill(255, 140, 0, this.opacity);
    }
    
    noStroke();
    textSize(this.size * this.scale);
    translate(this.x, this.y);
    rotate(this.rotation);
    
    // Draw shadow for depth
    fill(0, this.opacity * 0.3);
    text(this.symbol, 2, 2);
    
    // Draw main symbol
    if (this.type === 'money') {
      fill(255, 215, 0, this.opacity);
    } else if (this.type === 'bureaucracy') {
      fill(200, 200, 200, this.opacity);
    } else {
      fill(255, 140, 0, this.opacity);
    }
    text(this.symbol, 0, 0);
    pop();
  }
}

function draw() {
  background(20);
  
  try {
  // Draw floating background particles
  for (let particle of particles) {
    particle.move();
    particle.display();
  }
  
  // Draw Elon in lower left corner
  if (isElonImageLoaded && elonImage) {
    push();
    imageMode(CORNER);
    let elonSize = 300;
    let padding = 30;
    
    // Add stronger glow effect
    drawingContext.shadowBlur = 30;
    drawingContext.shadowColor = 'rgba(255, 215, 0, 0.5)';
    
    // Draw Elon with full opacity
    tint(255, 255);
    image(elonImage, padding, height - elonSize - padding, elonSize, elonSize);
    pop();
  }
  
  // Draw gradient overlay AFTER Elon
  drawingContext.fillStyle = createGradient();
  rect(0, 0, width, height);
    drawTitle();
    
    // Handle flashing outcomes
    if (state === 'flashing' && isFlashing) {
      timeLeft = autoStopTime - (millis() - startTime);
      
      if (timeLeft <= 0) {
        stopFlashing();
      } else {
        message = `Press SPACE to stop! (${Math.ceil(timeLeft/1000)}s)`;
        
        // Ensure outcomes keep changing
        let currentTime = millis();
        let flashInterval = map(
          timeLeft,
          autoStopTime,   // From 5 seconds
          0,              // To 0 seconds
          minFlashTime,   // Start slow (400ms)
          maxFlashTime    // End fast (100ms)
        );
        
        // Force outcome change if enough time has passed
        if (currentTime - lastOutcomeTime >= flashInterval) {
          do {
            currentIndex = Math.floor(random(outcomes.length));
          } while (currentIndex === lastOutcomeTime); // Ensure we get a new outcome
          
          lastOutcomeTime = currentTime;
        }
      }
    }
    
    // Always draw the current outcome while flashing
    if (state === 'flashing' || state === 'processing') {
  drawFlashingOutcome();
    }
    
  drawWallet();
  drawButtons();
  drawMessage();
  drawTurnHistory();
  
  if (showingLeaderboard) {
    drawLeaderboard();
  } else if (isEnteringDetails) {
    // Semi-transparent overlay
    fill(0, 0, 0, 150);
    rect(0, 0, width, height);
    
    // Draw input prompt background
    push();
    fill(180, 0, 0, 200);
    stroke(255, 215, 0);
    strokeWeight(3);
    rect(width/2 - 400, height/2 - 300, 800, 600, 20);
    
    // Calculate same vertical positions as in promptPlayerDetails
    const boxY = height/2 - 300;
    const titleY = boxY + 100;
    const scoreY = titleY + 70;
    const initialsLabelY = scoreY + 100;
    const emailLabelY = initialsLabelY + 140;
    
    // Draw text elements using calculated positions
    fill(255);
    noStroke();
    
    // Title
    textSize(48);
    textAlign(CENTER, CENTER);
    text('NEW HIGH SCORE!', width/2, titleY);
    
    // Score
    textSize(42);
    text(`${formatMoney(highestWallet)}`, width/2, scoreY);
    
    // Initials prompt
    textSize(28);
    text('Enter your initials:', width/2, initialsLabelY);
    
    // Email prompt
    text('Enter email to see leaderboard:', width/2, emailLabelY);
    
    // Small print
    textSize(18);
    fill(220);
    text('(We\'ll notify you of future updates!)', width/2, emailLabelY + 80);
    
    // Instructions
    textSize(20);
    text('Press ENTER when done', width/2, emailLabelY + 160);
    pop();
  } else {
    // Add auto-start check after drawing everything
    if (state === 'idle' && !isEnteringDetails && !showingLeaderboard) {
      if (isFirstTurn) {
        // Draw start message in center of screen
        push();
        textAlign(CENTER, CENTER);
        textSize(48);  // Larger text size
        fill(255, 215, 0);  // Gold color
        
        // Add glow effect
        drawingContext.shadowBlur = 20;
        drawingContext.shadowColor = 'rgba(255, 215, 0, 0.5)';
        
        // Draw centered text
        text('PRESS ENTER TO START GAME', width/2, height/2);
        pop();
      } else {
        let currentTime = millis();
        if (currentTime - lastTurnEndTime >= autoStartDelay) {
          startFlashing();
        }
      }
    }
  }
  
  if (state === 'showingElon' && showingElon) {
    if (isDogeImageLoaded && dogeImage) {
      push();
      // Dark overlay
      fill(0, 0, 0, 150);
      rect(0, 0, width, height);
      
      // Center DOGE
      imageMode(CENTER);
      let dogeSize = 400;
      
      // Add glow effect
      drawingContext.shadowBlur = 40;
      drawingContext.shadowColor = 'rgba(255, 215, 0, 0.7)';
      
      // Draw DOGE centered
      image(dogeImage, width/2, height/2, dogeSize, dogeSize);
      pop();
    }
    
    // Check if display time is over
    if (millis() - elonDisplayStartTime >= elonDisplayDuration) {
      showingElon = false;
      state = 'idle';
      lastTurnEndTime = millis();
      message = 'Next audit starting soon...';
    }
  }
  
  } catch (error) {
    console.error('Game error:', error);
    state = 'idle';
    isFlashing = false;
    message = 'Press ENTER to start DOGE Audit ' + turnNumber;
  }
}

function drawFlashingOutcome() {
  push();
  let outcome = outcomes[currentIndex];
  
  // Center position calculations
  let centerX = width/2;
  let centerY = height/2;
  
  // Make panel narrower but still fit text
  let panelWidth = 600;  // Keep this width for text
  let panelHeight = 200;
  
  // Background panel for outcome
  fill(30, 35, 45, 230);
  stroke(outcome.color[0], outcome.color[1], outcome.color[2]);
  strokeWeight(3);
  rectMode(CENTER);
  rect(centerX, centerY, panelWidth, panelHeight, 15);
  
  // Draw outcome text
  noStroke();
  fill(255);
  textAlign(CENTER, CENTER);
  
  // Split text into title and description
  let [title, description] = outcome.label.split('\n');
  
  // Draw title in larger size
  textSize(28);
  text(title, centerX, centerY - 30);
  
  // Draw description in smaller size
  textSize(22);
  text(description || '', centerX, centerY + 20);
  
  // If it's a gain or multiplier, show the amount/multiplier
  if (outcome.type === 'gain') {
    textSize(24);
    text(`+${formatMoney(outcome.amount)}`, centerX, centerY + 60);
  } else if (outcome.type === 'double') {
    textSize(24);
    text(`${outcome.multiplier}X MULTIPLIER!`, centerX, centerY + 60);
  }
  
  pop();
}

function drawWallet() {
  push();
  // Add glow effect for emphasis
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = 'rgba(255, 215, 0, 0.5)';
  
  // Draw background panel
  fill(30, 35, 45, 230);
  stroke(255, 215, 0);
  strokeWeight(2);
  rect(width/2 - 200, 80, 400, 100, 10);
  
  // Draw icon and text
  textAlign(CENTER, CENTER);
  noStroke();
  
  // Larger icon
  textSize(48);  // Increased from default
  text('💰', width/2 - 140, 130);
  
  // Larger, bolder title
  textSize(28);  // Increased from default
  textStyle(BOLD);
  fill(200);
  text('TAXPAYER SAVINGS:', width/2 + 20, 110);
  
  // Larger amount with brighter color
  textSize(38);  // Increased from default
  fill(255, 215, 0);  // Bright gold color
  textStyle(BOLD);
  text(formatMoney(currentWallet), width/2 + 20, 150);
  
  pop();
}

function drawButtons() {
  fill(150);
  textSize(20);
  text("Press SPACE to stop (5s limit)", 350, 500);
}

function drawMessage() {
  fill(255);
  textSize(28);
  text(message, 350, 550); // Adjusted x position
}

function keyPressed() {
  try {
    if (isEnteringDetails && keyCode === ENTER) {
      submitAndShowLeaderboard();
    } else if (showingLeaderboard && keyCode === ENTER) {
      // Reset game
      showingLeaderboard = false;
      currentWallet = 0;
      highestWallet = 0;
      turnNumber = 1;
      state = 'idle';
      isFirstTurn = true;  // Reset first turn flag
      message = 'Press ENTER to start first audit';
      turnHistory = [];
    } else if (isFirstTurn && keyCode === ENTER && state === 'idle') {
      isFirstTurn = false;  // No longer first turn
    startFlashing();
    } else if (keyCode === 32 && state === 'flashing') {  // Space bar only
    stopFlashing();
    }
  } catch (error) {
    console.error('Input error:', error);
    state = 'idle';
    isFlashing = false;
    lastTurnEndTime = millis();
    message = 'Next audit starting soon...';
  }
}

function startFlashing() {
  if (state === 'idle' || state === 'turnEnd') {
    state = 'flashing';
    isFlashing = true;
    currentIndex = Math.floor(random(outcomes.length));
    message = 'Press SPACE to stop! (5s)';
    startTime = millis();
    lastOutcomeTime = startTime;
    shuffleOutcomes();
  }
}

function stopFlashing() {
  if (state === 'flashing' && isFlashing) {
    isFlashing = false;
    let selectedOutcome = outcomes[currentIndex];
    if (selectedOutcome) {
    applyOutcome(currentIndex);
    } else {
      // Recovery if outcome is undefined
      state = 'idle';
      message = 'Press ENTER to continue DOGE Audit ' + turnNumber;
    }
  }
}

function applyOutcome(i) {
  let outcome = outcomes[i];
  let historyEntry = {
    initiative: turnNumber,
    turn: turnHistory.length + 1,
    color: outcome.color,
    amount: 0,
    wallet: currentWallet,
    outcome: outcome.label,
    isNegative: outcome.type === 'rugpull'
  };

  if (outcome.type === 'gain') {
    let amount = outcome.amount;
    if (pendingMultiplier > 1) {
      amount *= pendingMultiplier;
      historyEntry.outcome = `${pendingMultiplier}X BONUS! ` + outcome.label;
      pendingMultiplier = 1;
    }
    historyEntry.amount = amount;
    currentWallet += amount;
    message = `Victory! Saved taxpayers ${formatMoney(amount)}!`;
    historyEntry.wallet = currentWallet;
    turnHistory.push(historyEntry);
    state = 'idle';
    lastTurnEndTime = millis();  // Start countdown for next turn
    message = 'Next audit starting soon...';
    highestWallet = Math.max(highestWallet, currentWallet);
    showingElon = true;
    elonDisplayStartTime = millis();
    state = 'showingElon';
  } else if (outcome.type === 'rugpull') {
    historyEntry.amount = -currentWallet;
    currentWallet = 0;
    pendingMultiplier = 1;
    historyEntry.wallet = 0;
    historyEntry.outcome = "BUREAUCRACY WON - " + outcome.label;
    turnHistory.push(historyEntry);
  
    // Remove turnNumber check - game always ends on rugpull
    state = 'gameOver';
    message = `Game Over! Best Score: ${formatMoney(highestWallet)}`;
    promptPlayerDetails();
  } else if (outcome.type === 'double') {
    historyEntry.amount = 0;
    pendingMultiplier = outcome.multiplier;
    message = `MULTIPLIER READY! Next save will be ${outcome.multiplier}X! 🌟`;
    historyEntry.outcome = `${outcome.multiplier}X MULTIPLIER ACTIVATED - ` + outcome.label;
  historyEntry.wallet = currentWallet;
  turnHistory.push(historyEntry);
    state = 'idle';
    lastTurnEndTime = millis();  // Start countdown for next turn
    message = 'Next audit starting soon...';
    showingElon = true;
    elonDisplayStartTime = millis();
    state = 'showingElon';
  }
}

// Update drawTurnHistory for new position and size
function drawTurnHistory() {
  push();
  // Save the drawing context state
  drawingContext.save();
  
  // Make panel more narrow and position on right side
  let panelWidth = 200;  // Keep narrow width
  let panelX = width - panelWidth - 10; // Keep close to right edge
  let panelY = 80;  // Start right below title
  let panelHeight = height - panelY - 10; // Extend to bottom of screen
  
  // Draw panel background
  fill(30, 35, 45, 230);
  stroke(255, 215, 0);
  strokeWeight(2);
  rect(panelX, panelY, panelWidth, panelHeight, 10);
  
  // Set up clipping region for scrolling
  drawingContext.beginPath();
  drawingContext.rect(panelX + 10, panelY + 50, panelWidth - 20, panelHeight - 60);
  drawingContext.clip();
  
  // Panel title - make HISTORY fit and visible
  noStroke();
  fill(255, 215, 0);  // Keep gold color
  textSize(11);       // Keep same size
  textStyle(BOLD);    // Keep bold
  textAlign(CENTER, TOP);
  
  // Draw title above the clipping region
  drawingContext.restore();  // Restore context before drawing title
  text('HISTORY', panelX + panelWidth/2, panelY + 15);
  
  // Save context again for the rest of the content
  drawingContext.save();
  drawingContext.beginPath();
  drawingContext.rect(panelX + 10, panelY + 50, panelWidth - 20, panelHeight - 60);
  drawingContext.clip();
  
  // Calculate dimensions for entries
  let entryHeight = 70;
  let visibleHeight = panelHeight - 60;
  let totalEntriesHeight = turnHistory.length * entryHeight;
  maxScrollOffset = Math.max(0, totalEntriesHeight - visibleHeight);
  
  // Draw entries with scrolling - reverse order to show newest first
  let y = panelY + 50 - scrollOffset;
  
  // Create reversed array for display
  let reversedHistory = [...turnHistory].reverse();
  
  for (let entry of reversedHistory) {
    if (y + entryHeight > panelY + 50 && y < panelY + panelHeight - 10) {
    // Entry background
      fill(20, 25, 35, 200);
      noStroke();
      rect(panelX + 10, y, panelWidth - 20, entryHeight - 5, 5);
      
      // Entry text
      textSize(11);
      textAlign(LEFT, CENTER);
      
      if (entry.isNegative) {
      fill(255, 80, 80);
      } else if (entry.outcome.includes('MULTIPLIER') || entry.outcome.includes('APPROVED')) {
      fill(255, 215, 0);
    } else {
      fill(100, 255, 100);
    }
      
      // Text wrapping for outcome label
      let words = entry.outcome.split(' ');
      let line = '';
      let yOffset = y + 20;
      let maxWidth = panelWidth - 30;
      
      for (let word of words) {
        let testLine = line + word + ' ';
        if (textWidth(testLine) > maxWidth) {
          text(line, panelX + 15, yOffset);
          line = word + ' ';
          yOffset += 15;
        } else {
          line = testLine;
        }
      }
      text(line, panelX + 15, yOffset);
      
      // Show individual outcome amount
      fill(180);
      textSize(11);
      if (entry.type === 'double') {
        text('Multiplier activated', panelX + 15, y + entryHeight - 15);
      } else if (entry.isNegative) {
        text('Lost all savings!', panelX + 15, y + entryHeight - 15);
      } else {
        text(`Saved ${formatMoney(entry.amount)}`, panelX + 15, y + entryHeight - 15);
      }
    }
    y += entryHeight;
  }
  
  drawingContext.restore();
  
  // Draw scroll indicators if needed
  if (maxScrollOffset > 0) {
    let scrollPercent = scrollOffset / maxScrollOffset;
    let scrollBarHeight = Math.max(50, (visibleHeight / totalEntriesHeight) * visibleHeight);
    let scrollBarY = panelY + 50 + (scrollPercent * (visibleHeight - scrollBarHeight));
    
    // Draw scroll bar
    noStroke();
    fill(100, 100, 100, 100);
    rect(panelX + panelWidth - 12, panelY + 50, 4, visibleHeight, 2);
    fill(200, 200, 200, 150);
    rect(panelX + panelWidth - 12, scrollBarY, 4, scrollBarHeight, 2);
  }
  
  pop();
}

// Add mouse wheel handler
function mouseWheel(event) {
  // Only scroll if mouse is over history panel
  let panelX = width - 260;
  let panelY = height * 0.33;
  let panelWidth = 250;
  let panelHeight = height * 0.66;
  
  if (mouseX > panelX && mouseX < panelX + panelWidth &&
      mouseY > panelY && mouseY < panelY + panelHeight) {
    scrollOffset += event.delta;
    scrollOffset = constrain(scrollOffset, 0, maxScrollOffset);
    return false; // Prevent default scrolling
  }
}

// Update createGradient for more dynamic background
function createGradient() {
  let gradient = drawingContext.createRadialGradient(
    width/2, height/2, 0,
    width/2, height/2, height
  );
  gradient.addColorStop(0, 'rgba(187, 19, 19, 0.1)'); // Deep red
  gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)'); // White
  gradient.addColorStop(1, 'rgba(0, 40, 104, 0.1)'); // Deep blue
  return gradient;
}

// Update formatMoney function to better handle large numbers
function formatMoney(amount) {
  // Convert to millions first (since input is already in millions)
  if (amount >= 1000) {
    // Show billions with one decimal place
    return `$${(amount/1000).toFixed(1)}B`;
  } else {
    // Show millions with no decimal places
    return `$${Math.floor(amount)}M`;
  }
}

// Update drawTitle function
function drawTitle() {
  push();
  // Add glow effect
  drawingContext.shadowBlur = 20;
  drawingContext.shadowColor = 'rgba(255, 215, 0, 0.5)';
  
  // Draw title background - full width
  fill(30, 35, 45, 230);
  stroke(187, 19, 19);
  strokeWeight(3);
  rect(0, 0, width, 60);
  
  // Draw patriotic gradient for title
  let titleGradient = drawingContext.createLinearGradient(0, 0, width, 0);
  titleGradient.addColorStop(0, 'rgba(187, 19, 19, 1)');
  titleGradient.addColorStop(0.5, 'rgba(255, 255, 255, 1)');
  titleGradient.addColorStop(1, 'rgba(0, 40, 104, 1)');
  
  // Draw title text with new name
  textSize(36);
  textStyle(BOLD);
  fill(255);
  text("DOGE: THE GAME", width/2, 25);
  
  // Draw subtitle
  textSize(16);
  fill(200);
  text("DEPARTMENT OF GOVERNMENT EFFICIENCY", width/2, 45);
  
  pop();
}

// Add this function to randomly shuffle the outcomes array
function shuffleOutcomes() {
  for (let i = outcomes.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [outcomes[i], outcomes[j]] = [outcomes[j], outcomes[i]];
  }
}

// Update promptPlayerDetails function with a much larger window
function promptPlayerDetails() {
  isEnteringDetails = true;
  
  // Calculate box dimensions and position
  const boxWidth = 800;    // Even wider
  const boxHeight = 600;   // Keep tall height
  const boxX = width/2 - boxWidth/2;
  const boxY = height/2 - boxHeight/2;
  
  // Create and style initials input
  inputField = createInput('').attribute('maxlength', 3);
  inputField.style('font-size', '32px');
  inputField.style('padding', '15px');
  inputField.style('width', '120px');
  inputField.style('text-align', 'center');
  inputField.style('border', '3px solid #FFD700');
  inputField.style('border-radius', '8px');
  inputField.style('background', 'rgba(0,0,0,0.3)');
  inputField.style('color', 'white');
  inputField.input(() => {
    playerInitials = inputField.value().toUpperCase();
  });
  
  // Create and style email input
  emailField = createInput('', 'email');
  emailField.style('font-size', '24px');
  emailField.style('padding', '15px');
  emailField.style('width', '400px');
  emailField.style('text-align', 'center');
  emailField.style('border', '3px solid #FFD700');
  emailField.style('border-radius', '8px');
  emailField.style('background', 'rgba(0,0,0,0.3)');
  emailField.style('color', 'white');
  emailField.input(() => {
    playerEmail = emailField.value();
  });
  
  // Calculate vertical positions for clear sections
  const titleY = boxY + 100;        // Title section
  const scoreY = titleY + 70;       // Score display
  const initialsLabelY = scoreY + 100;  // Initials section
  const initialsInputY = initialsLabelY + 40;
  const emailLabelY = initialsInputY + 100;  // Email section
  const emailInputY = emailLabelY + 40;
  
  // Position inputs using calculated positions
  inputField.position(width/2 - 60, initialsInputY);
  emailField.position(width/2 - 200, emailInputY);
}

// Update submitAndShowLeaderboard with email validation
async function submitAndShowLeaderboard() {
  if (!playerInitials) {
    message = "Please enter your initials";
    return;
  }
  
  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(playerEmail)) {
    message = "Please enter a valid email address";
    return;
  }

  try {
    // Show loading state
    message = "Submitting score...";
    console.log('Submitting score:', { 
      initials: playerInitials, 
      email: playerEmail, 
      score: highestWallet 
    });
    
    // Submit highest score
    const submitted = await submitScore(
      playerInitials.trim().toUpperCase(),
      playerEmail.trim().toLowerCase(),
      highestWallet
    );
    
    if (submitted) {
      console.log('Score submitted successfully');
      // Remove input fields
      if (inputField) inputField.remove();
      if (emailField) emailField.remove();
      isEnteringDetails = false;
      
      // Get updated leaderboard
      message = "Loading leaderboard...";
      leaderboardData = await getTopScores();
      showingLeaderboard = true;
      message = "Press ENTER to start a new game";
    } else {
      message = "Error submitting score. Please try again.";
    }
  } catch (error) {
    console.error('Error in submitAndShowLeaderboard:', error);
    message = "Error submitting score. Please try again.";
  }
}

// Update drawLeaderboard function
function drawLeaderboard() {
  push();
  // Semi-transparent background overlay
  fill(0, 0, 0, 150);
  rect(0, 0, width, height);
  
  // Leaderboard panel - made taller to fit all entries
  fill(30, 35, 45, 230);
  stroke(255, 215, 0);
  strokeWeight(2);
  rect(width/2 - 250, height/2 - 250, 500, 550, 15); // Increased height to 550
  
  // Title with gradient
  let gradient = drawingContext.createLinearGradient(width/2 - 200, 0, width/2 + 200, 0);
  gradient.addColorStop(0, '#FFD700');
  gradient.addColorStop(1, '#FFA500');
  drawingContext.fillStyle = gradient;
  
  noStroke();
  textSize(32);
  textAlign(CENTER, CENTER);
  text('🏆 TOP SCORES 🏆', width/2, height/2 - 220);
  
  // Column headers - moved up slightly
  textSize(16);
  fill(150);
  text('RANK', width/2 - 180, height/2 - 170);
  text('PLAYER', width/2 - 80, height/2 - 170);
  text('SCORE', width/2 + 80, height/2 - 170);
  
  // Scores - adjusted starting position and spacing
  let y = height/2 - 130; // Start higher
  let spacing = 35;      // Reduced spacing between entries
  
  leaderboardData.slice(0, 10).forEach((entry, index) => {
    // Highlight current player's score
    if (entry.initials === playerInitials && entry.score === highestWallet) {
      fill(180, 0, 0, 100);
      noStroke();
      rect(width/2 - 220, y - 15, 440, 30, 5); // Reduced height of highlight
    }
    
    // Rank with medal emojis for top 3
    fill(255, 215, 0);
    textAlign(CENTER, CENTER);
    let rankText = (index + 1).toString();
    if (index === 0) rankText = '🥇 1';
    if (index === 1) rankText = '🥈 2';
    if (index === 2) rankText = '🥉 3';
    text(rankText, width/2 - 180, y);
    
    // Player initials
    fill(255);
    textAlign(CENTER, CENTER);
    text(entry.initials, width/2 - 80, y);
    
    // Score
    textAlign(CENTER, CENTER);
    text(formatMoney(entry.score), width/2 + 80, y);
    
    y += spacing; // Use new spacing value
  });
  
  // Add Share on X button with hover effect
  push();
  // Draw button background
  fill(isShareButtonHovered ? 40 : 30, 45, 55, 230);
  stroke(29, 155, 240);  // X blue color
  strokeWeight(2);
  rect(width/2 - 100, height/2 + 200, 200, 40, 20);
  
  // Draw button text
  noStroke();
  fill(isShareButtonHovered ? 255 : 29, 155, 240);
  textSize(16);
  textAlign(CENTER, CENTER);
  text('Share on 𝕏', width/2, height/2 + 220);
  pop();
  
  // Bottom instruction - moved down slightly
  fill(150);
  textSize(16);
  text('Press ENTER to start a new game', width/2, height/2 + 280);
  pop();
}

// Update shareOnX function to use shorter URL
function shareOnX() {
  const score = formatMoney(highestWallet);
  const text = `I just saved ${score} taxpayer dollars in DOGE: THE GAME! Can you do better?`;
  // Replace this URL with your actual TinyURL
  const url = 'https://tinyurl.com/doge-game1';  
  const shareURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(shareURL, '_blank');
}

function mousePressed() {
  if (showingLeaderboard) {
    // Check if click is within Share button bounds
    let buttonX = width/2 - 100;
    let buttonY = height/2 + 200;
    let buttonWidth = 200;
    let buttonHeight = 40;
    
    if (mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
        mouseY >= buttonY && mouseY <= buttonY + buttonHeight) {
      shareOnX();
    }
  }
}

// Update mousePressed function to include hover check
function mouseMoved() {
  if (showingLeaderboard) {
    let buttonX = width/2 - 100;
    let buttonY = height/2 + 200;
    let buttonWidth = 200;
    let buttonHeight = 40;
    
    isShareButtonHovered = (
      mouseX >= buttonX && mouseX <= buttonX + buttonWidth &&
      mouseY >= buttonY && mouseY <= buttonY + buttonHeight
    );
  }
}