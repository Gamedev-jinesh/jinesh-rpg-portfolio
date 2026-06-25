// Sound Effect Triggers
const coinSound = document.getElementById("coin-sound");
const selectSound = document.getElementById("select-sound");
const levelUpSound = document.getElementById("level-up");

// Dynamic XP Tracker Logic
let unlockedSections = new Set();
const totalSections = 8; // 8 unlockable nodes
const xpFill = document.getElementById("xp-fill");
const xpCounter = document.getElementById("xp-counter");

function playSound(sound) {
    sound.currentTime = 0;
    sound.play().catch(e => console.log("Audio prevented: ", e));
}

// Start arcade world transition
document.getElementById('start-btn').addEventListener('click', () => {
    playSound(coinSound);
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('main-hub').classList.remove('hidden');
});

// Click sounds for hub
document.querySelectorAll('.level-node, .social-icon, .arcade-btn, .arcade-btn-alt, .close-btn, .game-card, .gal-item').forEach(elem => {
    elem.addEventListener('click', () => {
        playSound(selectSound);
    });
});

// Interactive Progression & Level Up System
function activateSection(nodeId, modalId) {
    const node = document.getElementById(nodeId);
    if (node && node.innerText === "LOCKED") {
        node.innerText = "UNLOCKED";
        node.classList.add("unlocked-status");
        node.parentElement.classList.add("unlocked");
        
        unlockedSections.add(nodeId);
        
        // Calculate XP Percentage (12.5% per section)
        let progress = (unlockedSections.size / totalSections) * 100;
        xpFill.style.width = `${progress}%`;
        xpCounter.innerText = `${Math.round(progress)}%`;

        if (progress === 100) {
            playSound(levelUpSound);
            alert("ACHIEVEMENTS UNLOCKED: MAX LEVEL REACHED!");
        }
    }
    
    // Open targeted modal
    openModal(modalId);
}

// Navigation Modals
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden";
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

function openSubMenu(subId) {
    openModal(subId);
}
function closeSubMenu(subId) {
    closeModal(subId);
}

// Lightbox Zoom
function openLightbox(imgSrc) {
    const lightbox = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    img.src = imgSrc;
    lightbox.style.display = "block";
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox-modal');
    if(lightbox) {
        lightbox.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// Background click closes modal
window.onclick = function(event) {
    if (event.target.classList.contains('modal') && 
        !event.target.classList.contains('sub-modal') && 
        !event.target.classList.contains('lightbox-backdrop')) {
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
    }
}