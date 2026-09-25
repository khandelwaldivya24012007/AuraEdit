// ==========================================
// 🐺 AURA EDIT: STARK WORKSPACE LOGIC
// ==========================================

// --- DOM Elements ---
const inputBox = document.getElementById('story-input');
const wordCount = document.getElementById('word-count');
const textPreview = document.getElementById('story-text');
const container = document.getElementById('story-text-container');
const canvas = document.getElementById('export-target');

// --- 🎬 Cinematic Entry Animation ---
window.onload = function () {
    const panels = document.querySelectorAll('.animated-panel');
    panels.forEach((panel, index) => {
        setTimeout(() => {
            panel.classList.add('visible');
        }, index * 200); 
    });
};

// --- 1. Live Typing Preview ---
inputBox.addEventListener('input', () => {
    textPreview.innerText = inputBox.value || "Your text will appear here...";
    const words = inputBox.value.trim().split(/\s+/).filter(w => w.length > 0);
    wordCount.innerText = words.length;
});

// --- 2. Typography Controls ---
document.getElementById('ctrl-font').addEventListener('change', (e) => {
    container.className = container.className.replace(/(cinzel|playfair|montserrat)/, e.target.value);
});

document.getElementById('ctrl-size').addEventListener('input', (e) => {
    textPreview.style.fontSize = `${e.target.value}px`;
});

document.getElementById('ctrl-spacing').addEventListener('input', (e) => {
    textPreview.style.lineHeight = e.target.value;
});

// --- 3. Layout Controls ---
function setLayout(property, value, btn) {
    container.style[property] = value;
    const group = btn.parentElement.children;
    for(let b of group) b.classList.remove('active');
    btn.classList.add('active');
}

// --- 4. Atmosphere Controls ---
document.getElementById('ctrl-bg').addEventListener('change', (e) => {
    canvas.className = canvas.className.replace(/theme-\w+/, e.target.value);
});

document.getElementById('ctrl-vignette').addEventListener('change', (e) => {
    e.target.checked ? canvas.classList.add('vignette') : canvas.classList.remove('vignette');
});

document.getElementById('ctrl-snow').addEventListener('change', (e) => {
    const snow = document.getElementById('snow-overlay');
    e.target.checked ? snow.classList.add('active') : snow.classList.remove('active');
});

document.getElementById('ctrl-grain').addEventListener('change', (e) => {
    const grain = document.getElementById('grain-overlay');
    e.target.checked ? grain.classList.add('active') : grain.classList.remove('active');
});

// --- 5. Action: Clear Canvas ---
document.getElementById('btn-reset').addEventListener('click', () => {
    inputBox.value = '';
    textPreview.innerText = "Your text will appear here...";
    wordCount.innerText = '0';
});

// ==========================================
// 🔮 API LOGIC: THE OLD GODS (GROQ)
// ==========================================

// --- Action: Summon Story (Generator) ---
document.getElementById('btn-generate').addEventListener('click', async () => {
    const btn = document.getElementById('btn-generate');
    const themeSelect = document.getElementById('story-theme').value;
    
    btn.innerText = "Summoning...";
    btn.disabled = true;

    try {
        const response = await fetch('/api/generate-story', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ theme: themeSelect })
        });
        
        const data = await response.json();
        
        if (data.story) {
            inputBox.value = data.story;
            textPreview.innerText = data.story;
            const words = data.story.trim().split(/\s+/).filter(w => w.length > 0);
            wordCount.innerText = words.length;
        } else if (data.error) {
            alert("Error: " + data.error);
        }
    } catch (error) {
        alert("The raven failed to deliver. Is your Flask server running?");
    } finally {
        btn.innerText = "Summon";
        btn.disabled = false;
    }
});

// --- Action: Auto Format ---
document.getElementById('btn-auto-format').addEventListener('click', async () => {
    const btn = document.getElementById('btn-auto-format');
    const originalText = inputBox.value;
    
    if (!originalText.trim()) return;

    btn.innerText = "Formatting...";
    btn.disabled = true;

    try {
        const response = await fetch('/api/auto-format', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: originalText })
        });
        
        const data = await response.json();
        
        if (data.formatted_text) {
            inputBox.value = data.formatted_text;
            textPreview.innerText = data.formatted_text;
        } else if (data.error) {
            alert("Error: " + data.error);
        }
    } catch (error) {
        alert("The raven failed to deliver. Is your Flask server running?");
    } finally {
        btn.innerText = "✨ Auto Format";
        btn.disabled = false;
    }
});

// ==========================================
// 📸 HTML2CANVAS: DOWNLOAD LOGIC
// ==========================================
document.getElementById('btn-download').addEventListener('click', () => {
    const btn = document.getElementById('btn-download');
    btn.innerText = "Forging Image...";

    html2canvas(canvas, {
        scale: 2, 
        useCORS: true,
        backgroundColor: "#000000" 
    }).then(renderedCanvas => {
        const imgURL = renderedCanvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = 'Stark_Story_' + Date.now() + '.png';
        link.href = imgURL;
        link.click();
        btn.innerText = "Download Story";
    });
});