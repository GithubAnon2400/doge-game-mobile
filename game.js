class Game {
    constructor(gameWidth, gameHeight) {
        // ... existing code ...
        
        // Add touch/click position tracking
        this.touchX = 0;
        this.isTouching = false;
        
        // Add touch/click event listeners
        document.addEventListener('mousedown', (e) => this.handleInputStart(e));
        document.addEventListener('mousemove', (e) => this.handleInputMove(e));
        document.addEventListener('mouseup', () => this.handleInputEnd());
        
        document.addEventListener('touchstart', (e) => this.handleInputStart(e));
        document.addEventListener('touchmove', (e) => this.handleInputMove(e));
        document.addEventListener('touchend', () => this.handleInputEnd());
    }
    
    handleInputStart(e) {
        this.isTouching = true;
        this.handleInputMove(e);
    }
    
    handleInputMove(e) {
        if (!this.isTouching) return;
        
        const rect = this.gameCanvas.getBoundingClientRect();
        let x;
        
        if (e.type.startsWith('touch')) {
            x = e.touches[0].clientX - rect.left;
        } else {
            x = e.clientX - rect.left;
        }
        
        // Convert to game coordinates
        this.touchX = (x / rect.width) * this.gameWidth;
        
        // Move paddle to touch position
        if (this.paddle) {
            this.paddle.position.x = this.touchX - this.paddle.width / 2;
            
            // Keep paddle within game bounds
            if (this.paddle.position.x < 0) this.paddle.position.x = 0;
            if (this.paddle.position.x + this.paddle.width > this.gameWidth) {
                this.paddle.position.x = this.gameWidth - this.paddle.width;
            }
        }
    }
    
    handleInputEnd() {
        this.isTouching = false;
    }
} 