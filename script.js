class Stopwatch {
    constructor() {
        // State variables
        this.startTime = 0;
        this.elapsedTime = 0;
        this.timerInterval = null;
        this.isRunning = false;
        this.laps = [];

        // DOM Elements
        this.displayHours = document.getElementById('hours');
        this.displayMinutes = document.getElementById('minutes');
        this.displaySeconds = document.getElementById('seconds');
        this.displayMilliseconds = document.getElementById('milliseconds');
        this.progressCircle = document.getElementById('progress-circle');
        this.statusDisplay = document.getElementById('status-display');
        this.lapsContainer = document.getElementById('laps-container');
        this.lapCountDisplay = document.getElementById('lap-count');

        // Buttons
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapBtn = document.getElementById('lapBtn');

        // Initialize progress ring
        this.radius = 45;
        this.circumference = 2 * Math.PI * this.radius;

        this.init();
    }

    init() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.recordLap());

        // Initial UI State
        this.updateDisplay();
    }

    start() {
        if (!this.isRunning) {
            this.startTime = Date.now() - this.elapsedTime;
            this.timerInterval = setInterval(() => this.update(), 10);
            this.isRunning = true;
            
            // UI Feedback
            this.startBtn.classList.add('hidden');
            this.pauseBtn.classList.remove('hidden');
            this.statusDisplay.classList.add('active');
            this.statusDisplay.querySelector('.text').textContent = 'RUNNING';
            this.lapBtn.disabled = false;
        }
    }

    pause() {
        if (this.isRunning) {
            clearInterval(this.timerInterval);
            this.elapsedTime = Date.now() - this.startTime;
            this.isRunning = false;

            // UI Feedback
            this.pauseBtn.classList.add('hidden');
            this.startBtn.classList.remove('hidden');
            this.statusDisplay.classList.remove('active');
            this.statusDisplay.querySelector('.text').textContent = 'PAUSED';
        }
    }

    reset() {
        this.pause();
        this.elapsedTime = 0;
        this.laps = [];
        this.updateDisplay();
        this.renderLaps();
        
        // UI Feedback
        this.statusDisplay.querySelector('.text').textContent = 'STANDBY';
        this.lapBtn.disabled = true;
        this.updateProgress(0);
    }

    update() {
        this.elapsedTime = Date.now() - this.startTime;
        this.updateDisplay();
        
        // Update progress ring based on seconds (cycles every 60s)
        const seconds = Math.floor((this.elapsedTime / 1000) % 60);
        const ms = (this.elapsedTime % 1000) / 1000;
        this.updateProgress((seconds + ms) / 60);
    }

    updateDisplay() {
        const time = this.elapsedTime;
        
        const milliseconds = Math.floor((time % 1000) / 10);
        const seconds = Math.floor((time / 1000) % 60);
        const minutes = Math.floor((time / (1000 * 60)) % 60);
        const hours = Math.floor((time / (1000 * 60 * 60)) % 24);

        this.displayHours.textContent = this.formatTime(hours);
        this.displayMinutes.textContent = this.formatTime(minutes);
        this.displaySeconds.textContent = this.formatTime(seconds);
        this.displayMilliseconds.textContent = this.formatTime(milliseconds);
    }

    formatTime(value) {
        return value.toString().padStart(2, '0');
    }

    updateProgress(percent) {
        const offset = this.circumference - (percent * this.circumference);
        this.progressCircle.style.strokeDashoffset = offset;
    }

    recordLap() {
        const timeString = `${this.displayHours.textContent}:${this.displayMinutes.textContent}:${this.displaySeconds.textContent}.${this.displayMilliseconds.textContent}`;
        this.laps.unshift({
            id: this.laps.length + 1,
            time: timeString
        });
        this.renderLaps();
    }

    renderLaps() {
        this.lapCountDisplay.textContent = `${this.laps.length} LAPS`;

        if (this.laps.length === 0) {
            this.lapsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-stopwatch-20"></i>
                    <p>No laps recorded yet</p>
                </div>
            `;
            return;
        }

        this.lapsContainer.innerHTML = this.laps.map(lap => `
            <div class="lap-item">
                <span class="lap-number">LAP ${lap.id}</span>
                <span class="lap-time">${lap.time}</span>
            </div>
        `).join('');
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new Stopwatch();
    createParticles();
});

function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.background = 'var(--neon-cyan)';
        particle.style.boxShadow = '0 0 5px var(--neon-cyan)';
        
        // Random animation duration
        const duration = Math.random() * 20 + 10;
        particle.style.animation = `float ${duration}s infinite linear`;
        particle.style.opacity = Math.random() * 0.3;
        
        container.appendChild(particle);
    }
}
