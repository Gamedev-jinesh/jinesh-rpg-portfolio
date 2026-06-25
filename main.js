// ==========================================
// AUDIO SYNTHESIZER & BROWSER POLICY MANAGER
// ==========================================
let audioCtx;

// Initialize AudioContext only after the user clicks to bypass browser autoplay restrictions
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playTone(freq, type, duration) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = type; 
    osc.frequency.value = freq;
    
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
    
    osc.connect(gain); 
    gain.connect(audioCtx.destination);
    
    osc.start(); 
    osc.stop(audioCtx.currentTime + duration);
}

function playRetroCoinChirp() {
    playTone(523.25, "square", 0.1); 
    setTimeout(() => playTone(659.25, "square", 0.1), 100); 
    setTimeout(() => playTone(783.99, "square", 0.15), 200); 
    setTimeout(() => playTone(1046.50, "square", 0.3), 350); 
}

function playRetroConfirmSound() {
    playTone(300, "sawtooth", 0.08);
    setTimeout(() => playTone(600, "sawtooth", 0.12), 80);
}

// ==========================================
// RPG XP DYNAMIC LEVEL ENGINE 
// ==========================================
let playerXP = parseInt(localStorage.getItem('jinesh_portfolio_xp')) || 0;
let unlockedNodes = new Set(JSON.parse(localStorage.getItem('jinesh_portfolio_inv')) || []);
const totalUnlockableNodes = 8; // Total main overworld nodes

// Update UI Progress Bar
function updateXPBar() {
    const currentProg = (unlockedNodes.size / totalUnlockableNodes) * 100;
    const xpFill = document.getElementById("xp-fill");
    const xpCounter = document.getElementById("xp-counter");
    
    if (xpFill) xpFill.style.width = `${currentProg}%`;
    if (xpCounter) xpCounter.innerText = `${Math.round(currentProg)}%`;
}

// Load Saved State on Page Load
window.addEventListener('load', () => {
    unlockedNodes.forEach(nodeId => {
       const node = document.getElementById(nodeId);
       if(node) {
           node.innerText = "UNLOCKED";
           node.className = "node-status unlocked-status";
           if (node.parentElement) node.parentElement.classList.add("unlocked");
       }
    });
    updateXPBar(); // Safe execution
});

// ==========================================
// OVERWORLD INTERACTIONS & NAVIGATION
// ==========================================

// Start button: Initializes audio, plays sound, hides start screen
document.getElementById('start-btn').addEventListener('click', () => {
    initAudio(); 
    playRetroCoinChirp();
    
    const startScreen = document.getElementById('start-screen');
    const mainHub = document.getElementById('main-hub');
    
    if (startScreen) startScreen.classList.add('hidden');
    if (mainHub) mainHub.classList.remove('hidden');
});

// Add click sounds to all interactive UI elements
document.addEventListener('click', (e) => {
    if (e.target.closest('.level-node, .social-icon, .arcade-btn, .arcade-btn-alt, .arcade-btn-small, .close-btn, .game-card, .gal-item, .cert-item')) {
        initAudio();
        playRetroConfirmSound();
    }
});

// Experience & Progression Logic
function unlockSectionProgression(nodeId) {
    const node = document.getElementById(nodeId);
    if (node && node.innerText === "LOCKED") {
        node.innerText = "UNLOCKED";
        node.className = "node-status unlocked-status";
        node.parentElement.classList.add("unlocked");
        
        unlockedNodes.add(nodeId);
        
        // Save to local storage
        localStorage.setItem('jinesh_portfolio_inv', JSON.stringify(Array.from(unlockedNodes)));
        
        playerXP += 1250;
        localStorage.setItem('jinesh_portfolio_xp', playerXP);

        updateXPBar();

        if (unlockedNodes.size >= totalUnlockableNodes) {
            setTimeout(() => {
                alert("QUEST LOG CLEARED! LEVEL CAP REACHED! You've unlocked the ultimate achievement.");
            }, 500); // Slight delay so the bar updates first
        }
    }
}

// Triggered when clicking a main grid node
function activateSection(nodeId, modalId) {
    unlockSectionProgression(nodeId);
    openModal(modalId);
}

// Triggered when clicking a quest inside the quest board
function unlockAchievement(cardElem) {
    if(!cardElem.classList.contains('completed-quest')) {
        cardElem.classList.add('completed-quest');
        initAudio();
        playRetroCoinChirp(); // Extra rewarding sound for quests
        alert("ACHIEVEMENT UNLOCKED: QUEST COMPLETED!");
    }
}

// ==========================================
// MODAL & LIGHTBOX CONTROLLERS
// ==========================================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevents background scrolling
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if(modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
    }
    
    // Stop iframe videos from continuing to play in the background when modal is closed
    const iframe = modal.querySelector('iframe');
    if (iframe) {
        const src = iframe.src;
        iframe.src = src; // Reloads the iframe, stopping the video
    }
}

// Sub-menus (Like individual game profiles)
function openSubMenu(subId) { openModal(subId); }
function closeSubMenu(subId) { closeModal(subId); }

// Picture-in-Picture Lightbox
function openLightbox(imgSrc) {
    const lightbox = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    if (img) img.src = imgSrc;
    if (lightbox) {
        lightbox.style.display = "block";
        document.body.style.overflow = "hidden";
    }
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox-modal');
    if(lightbox) {
        lightbox.style.display = "none";
        document.body.style.overflow = "auto";
    }
}

// Global failsafe: clicking the dark overlay closes the active modal
window.onclick = function(event) {
    if (event.target.classList.contains('modal') && 
        !event.target.classList.contains('sub-modal') && 
        !event.target.classList.contains('lightbox-backdrop')) {
        
        event.target.style.display = "none";
        document.body.style.overflow = "auto";
        
        // Stop background videos
        const iframe = event.target.querySelector('iframe');
        if (iframe) {
            const src = iframe.src;
            iframe.src = src; 
        }
    }
}