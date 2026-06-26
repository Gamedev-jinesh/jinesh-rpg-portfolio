// =========================
// PRELOADER
// =========================

const preloader = document.getElementById("preloader");
const loadingFill = document.querySelector(".loading-fill");
const loadingText = document.getElementById("loading-text");

const loadingMessages = [
  "Initializing Portfolio...",
  "Loading Assets...",
  "Spawning Characters...",
  "Loading Games...",
  "Entering Studio..."
];

let progress = 0;
let messageIndex = 0;

const preloadInterval = setInterval(() => {
  progress += Math.random() * 18;

  if (progress > 100) {
    progress = 100;
  }

  loadingFill.style.width = progress + "%";

  if (progress > messageIndex * 25) {
    loadingText.innerText =
      loadingMessages[
        Math.min(
          messageIndex,
          loadingMessages.length - 1
        )
      ];

    messageIndex++;
  }

  if (progress === 100) {
    clearInterval(preloadInterval);

    setTimeout(() => {
      preloader.style.opacity = "0";
      preloader.style.pointerEvents = "none";

      setTimeout(() => {
        preloader.remove();
      }, 700);
    }, 600);
  }
}, 200);

// =========================
// CUSTOM CURSOR
// =========================

const cursor = document.querySelector(".cursor");
const outline = document.querySelector(".cursor-outline");

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  cursor.style.left = mouseX + "px";
  cursor.style.top = mouseY + "px";
});

function animateCursor() {
  outline.style.left = mouseX - 20 + "px";
  outline.style.top = mouseY - 20 + "px";

  requestAnimationFrame(animateCursor);
}

animateCursor();

// =========================
// HOVER EFFECT
// =========================

document.querySelectorAll(
  "a, button, .game-card, img"
).forEach((item) => {
  item.addEventListener("mouseenter", () => {
    outline.style.transform = "scale(1.8)";
    outline.style.borderColor = "#ff5a1f";
  });

  item.addEventListener("mouseleave", () => {
    outline.style.transform = "scale(1)";
    outline.style.borderColor =
      "rgba(255,90,31,.5)";
  });
});

// =========================
// STATS COUNTER
// =========================

const counters =
  document.querySelectorAll("[data-count]");

function runCounters() {
  counters.forEach((counter) => {
    const target = +counter.dataset.count;

    const update = () => {
      let current =
        +counter.innerText.replace(/\D/g, "");

      const increment = target / 100;

      if (current < target) {
        counter.innerText =
          Math.ceil(current + increment);

        requestAnimationFrame(update);
      } else {
        if (target >= 1000000) {
          counter.innerText = "1M+";
        } else if (target >= 1000) {
          counter.innerText =
            target.toLocaleString() + "+";
        } else {
          counter.innerText = target;
        }
      }
    };

    update();
  });
}

const statSection =
  document.querySelector(".stats");

let counterStarted = false;

window.addEventListener("scroll", () => {
  if (
    !counterStarted &&
    statSection.getBoundingClientRect().top <
      window.innerHeight - 100
  ) {
    counterStarted = true;
    runCounters();
  }
});

// =========================
// SCROLL REVEAL
// =========================

const observer =
  new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(
            "show"
          );
        }
      });
    },
    {
      threshold: 0.15
    }
  );

document
  .querySelectorAll(
    ".section, .game-card, .timeline-item"
  )
  .forEach((el) => {
    observer.observe(el);
  });

// =========================
// PARALLAX HERO
// =========================

const hero =
  document.querySelector("#hero");

document.addEventListener(
  "mousemove",
  (e) => {
    const x =
      (e.clientX /
        window.innerWidth -
        0.5) *
      20;

    const y =
      (e.clientY /
        window.innerHeight -
        0.5) *
      20;

    hero.style.transform =
      `translate(${x}px, ${y}px)`;
  }
);

// =========================
// NAVBAR BACKGROUND
// =========================

const header =
  document.querySelector(".header");

window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY > 100) {
      header.style.background =
        "rgba(7,7,12,.85)";
    } else {
      header.style.background =
        "rgba(7,7,12,.5)";
    }
  }
);

// =========================
// MOBILE MENU
// =========================

const menuBtn =
  document.getElementById(
    "menu-btn"
  );

const navLinks =
  document.querySelector(
    ".nav-links"
  );

menuBtn?.addEventListener(
  "click",
  () => {
    navLinks.classList.toggle(
      "mobile-active"
    );
  }
);

// =========================
// GALLERY LIGHTBOX
// =========================

const galleryImages =
  document.querySelectorAll(
    ".gallery-grid img"
  );

galleryImages.forEach((img) => {
  img.addEventListener(
    "click",
    () => {
      const lightbox =
        document.createElement(
          "div"
        );

      lightbox.className =
        "lightbox";

      lightbox.innerHTML = `
        <img src="${img.src}">
      `;

      document.body.appendChild(
        lightbox
      );

      lightbox.addEventListener(
        "click",
        () => {
          lightbox.remove();
        }
      );
    }
  );
});

// =========================
// XP SYSTEM
// =========================

let xp =
  Number(
    localStorage.getItem(
      "portfolioXP"
    )
  ) || 0;

function gainXP(amount) {
  xp += amount;

  localStorage.setItem(
    "portfolioXP",
    xp
  );

  showToast(
    `+${amount} XP`
  );
}

document
  .querySelectorAll(
    ".game-card"
  )
  .forEach((card) => {
    card.addEventListener(
      "click",
      () => gainXP(50)
    );
  });

// =========================
// TOAST
// =========================

function showToast(text) {
  const toast =
    document.createElement(
      "div"
    );

  toast.className =
    "toast";

  toast.innerText = text;

  document.body.appendChild(
    toast
  );

  setTimeout(() => {
    toast.classList.add(
      "show"
    );
  }, 50);

  setTimeout(() => {
    toast.remove();
  }, 2500);
}

// =========================
// CONTACT FORM
// =========================

const form =
  document.querySelector(
    ".contact-form"
  );

form?.addEventListener(
  "submit",
  (e) => {
    e.preventDefault();

    const btn =
      form.querySelector(
        "button"
      );

    btn.innerText =
      "Message Sent ✓";

    btn.disabled = true;

    gainXP(100);
  }
);

// =========================
// FLOATING PARTICLES
// =========================

const canvas =
  document.createElement(
    "canvas"
  );

canvas.id = "particles";

document.body.prepend(
  canvas
);

const ctx =
  canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
  canvas.width =
    window.innerWidth;

  canvas.height =
    window.innerHeight;
}

resizeCanvas();

window.addEventListener(
  "resize",
  resizeCanvas
);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x =
      Math.random() *
      canvas.width;

    this.y =
      Math.random() *
      canvas.height;

    this.radius =
      Math.random() * 2;

    this.speed =
      Math.random() * 0.5;

    this.opacity =
      Math.random() * 0.5;
  }

  draw() {
    ctx.beginPath();

    ctx.fillStyle =
      `rgba(255,90,31,${this.opacity})`;

    ctx.arc(
      this.x,
      this.y,
      this.radius,
      0,
      Math.PI * 2
    );

    ctx.fill();
  }

  update() {
    this.y -= this.speed;

    if (this.y < 0) {
      this.reset();
      this.y =
        canvas.height;
    }

    this.draw();
  }
}

for (let i = 0; i < 120; i++) {
  particles.push(
    new Particle()
  );
}

function animateParticles() {
  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  particles.forEach((p) =>
    p.update()
  );

  requestAnimationFrame(
    animateParticles
  );
}

animateParticles();

console.log(
  "🎮 Jinesh Portfolio Loaded Successfully"
);