/* =========================================
   PART 1: THE ULTIMATE INTRO LOGIC
   ========================================= */
const intro = document.getElementById("intro");
const main = document.getElementById("main");

const navEntries = performance.getEntriesByType("navigation");
const navType = navEntries.length > 0 ? navEntries[0].type : "";

// 🎬 NEW: The Domino Effect Function
function animateCardsIn() {
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.classList.remove('visible'); // Reset them first
        
        // Stagger the animation: 150ms delay between each card
        setTimeout(() => {
            card.classList.add('visible');
        }, 100 + (index * 150)); 
    });
}

function skipIntro() {
    intro.style.display = "none";
    main.style.display = "flex";
    main.style.opacity = "1";
    // Trigger cascade instantly
    animateCardsIn(); 
}

function playIntro() {
    intro.style.display = "flex";
    intro.style.opacity = "1";
    main.style.display = "none";
    main.style.opacity = "0";
    
    setTimeout(() => {
        intro.style.opacity = "0";
        intro.style.transition = "1s ease";

        setTimeout(() => {
            intro.style.display = "none";
            main.style.display = "flex";

            setTimeout(() => {
                main.style.opacity = "1";
                main.style.transition = "1s ease";
                
                // Trigger cascade after the main container fades in
                animateCardsIn(); 
                
                sessionStorage.setItem("introPlayed", "true");
            }, 100);

        }, 1000);
    }, 3000);
}

if (navType === "reload") {
    sessionStorage.removeItem("introPlayed");
    playIntro();
} else if (navType === "back_forward" || sessionStorage.getItem("introPlayed") === "true") {
    skipIntro();
} else {
    playIntro();
}

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        skipIntro();
    }
});

/* =========================================
   PART 2: THE CINEMATIC HOUSE TRANSITIONS
   ========================================= */
const houseData = {
    'stark': { 
        title: 'Winter Is Coming', 
        subtitle: 'Welcome to Winterfell', 
        route: '/text-story', 
        colorClass: 'stark-text',
        bgImage: "url('/static/winterfell.png')" 
    },
    'targaryen': { 
        title: 'Daenerys ', 
        subtitle: 'Meet the Mother of Dragons', 
        route: '/photo-story', 
        colorClass: 'targaryen-text',
        bgImage: "url('/static/mother.png')" 
    },
    'lannister': { 
        title: 'Power is Power', 
        subtitle: 'When you play the game of thrones, you win or you die. There is no middle ground.', 
        route: '/reel', /* Ensure your Flask route points to reel.html */
        colorClass: 'lannister-text', 
        bgImage: "url('/static/king.png')" /* Save a picture of the Red Keep or Iron Throne here! */
    },
    'tyrell': { 
        title: 'Growing Strong', 
        subtitle: '"Are you a sheep? No. You\'re a dragon. Be a dragon."', 
        route: '/magazine', 
        colorClass: 'tyrell-text',
        bgImage: "url('/static/high.png')" /* Save a lush, sunny castle/garden image here! */
    },
    'baratheon': { 
        title: 'Ours Is The Fury!', 
        subtitle: '"We do not choose our destinies... yet we must do our duty."', 
        route: '/template', 
        colorClass: 'baratheon-text', 
        bgImage: "url('/static/stone.png')" /* Save a dark, stormy castle picture here! */
    },
    'martell': { 
        title: 'Unbowed, Unbent, Unbroken', 
        subtitle: '"The gods let us choose our weapons."', 
        route: '/assignment', 
        colorClass: 'martell-text', 
        bgImage: "url('/static/dorne.png')" /* Save a picture of a desert or Sunspear here! */
    }
};

document.querySelectorAll(".card").forEach(card => {
    card.addEventListener("click", () => {
        let clickedHouse = null;
        for (let house in houseData) {
            if (card.classList.contains(house)) {
                clickedHouse = house;
                break;
            }
        }

        if (clickedHouse) {
            const overlay = document.getElementById("transition-overlay");
            const titleEl = document.getElementById("transition-title");
            const subtitleEl = document.getElementById("transition-subtitle");
            const data = houseData[clickedHouse];

            if (data.bgImage !== "none") {
                overlay.style.backgroundImage = data.bgImage;
            } else {
                overlay.style.backgroundImage = "none";
            }

            titleEl.innerText = data.title;
            titleEl.className = data.colorClass;
            subtitleEl.innerText = data.subtitle;
            subtitleEl.className = data.colorClass;

            overlay.classList.add("active");

            setTimeout(() => {
                window.location.href = data.route;
            }, 4000); 
        }
    });
});