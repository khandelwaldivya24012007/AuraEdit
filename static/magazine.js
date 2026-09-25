// ==========================================
// AURA EDIT: MASTER MAGAZINE LOGIC
// ==========================================

// --- 1. Memory & State ---
let currentProjectId = null;
let currentPageIndex = 0;

let activeMagazine = {
    title: "Highgarden",
    pages: [{
        headline: "Growing Strong",
        snippet: "Your story begins here...",
        bgUrl: "", // Blank paper by default
        font: "'Cinzel', serif",
        border: "border-royal"
    }]
};

// --- DOM Elements ---
const viewHub = document.getElementById('view-hub');
const viewEditor = document.getElementById('view-editor');
const projectGrid = document.getElementById('project-grid');
const inTitle = document.getElementById('in-title');
const outTitle = document.getElementById('out-title');
const outHeadline = document.getElementById('out-headline');
const outSnippet = document.getElementById('out-snippet');
const outBg = document.getElementById('out-bg');
const pageIndicator = document.getElementById('page-indicator');

// --- 2. The Royal Archives (Hub) ---
function loadArchives() {
    const archives = JSON.parse(localStorage.getItem('aura_archives')) || [];
    
    // Always render the + button first
    projectGrid.innerHTML = `
        <div class="mag-card mag-card-new" onclick="openEditor(null)">
            <div class="new-icon">+</div>
            <h3 style="font-family: 'Cinzel', serif; color: #d4af37; margin:0;">Forge New Issue</h3>
        </div>
    `;

    // Render saved projects
    archives.forEach((mag, index) => {
        const card = document.createElement('div');
        card.className = 'mag-card';
        card.innerHTML = `
            <div onclick="openEditor(${index})">
                <h3 class="card-title">${mag.title}</h3>
                <span class="card-date">${mag.date}</span>
                <p style="color: #8c9e8e; font-size: 12px; margin-top: 15px;">
                    ${mag.pages[0].headline.substring(0, 40)}...
                </p>
            </div>
            <button class="btn-delete" onclick="deleteProject(${index}, event)">Discard Issue</button>
        `;
        projectGrid.appendChild(card);
    });
}

function openEditor(projectId) {
    viewHub.style.display = 'none';
    viewEditor.style.display = 'block';
    currentProjectId = projectId;

    if (projectId === null) {
        // Start a brand new magazine
        activeMagazine = {
            title: "Highgarden",
            pages: [{
                headline: "Growing Strong",
                snippet: "Your story begins here...",
                bgUrl: "", 
                font: "'Cinzel', serif",
                border: "border-royal"
            }]
        };
        currentPageIndex = 0;
    } else {
        // Load existing magazine
        const archives = JSON.parse(localStorage.getItem('aura_archives')) || [];
        activeMagazine = archives[projectId];
        currentPageIndex = 0;
    }
    
    inTitle.value = activeMagazine.title;
    outTitle.innerText = activeMagazine.title;
    renderCurrentPage();
}

function deleteProject(index, event) {
    event.stopPropagation();
    if(confirm("Burn this issue in the royal fires?")) {
        let archives = JSON.parse(localStorage.getItem('aura_archives')) || [];
        archives.splice(index, 1);
        localStorage.setItem('aura_archives', JSON.stringify(archives));
        loadArchives();
    }
}

// --- 3. Page Rendering Engine ---
function renderCurrentPage() {
    const page = activeMagazine.pages[currentPageIndex];
    const overlay = document.querySelector('.mag-overlay');
    
    outHeadline.innerText = page.headline;
    outSnippet.innerText = page.snippet;
    
    // Handle Images & Smart Text Colors
    if (page.bgUrl && page.bgUrl !== "") {
        outBg.src = page.bgUrl;
        outBg.style.display = "block";
        overlay.style.background = "linear-gradient(to bottom, rgba(251, 249, 244, 0.8) 0%, rgba(251, 249, 244, 0) 30%, rgba(0,0,0,0.8) 100%)";
        outHeadline.style.color = "#ffffff";
        outSnippet.style.color = "#fbf9f4";
    } else {
        outBg.src = "";
        outBg.style.display = "none";
        overlay.style.background = "transparent";
        outHeadline.style.color = "#08120b";
        outSnippet.style.color = "#1a2a20";
    }

    // Apply Fonts & Borders
    outHeadline.style.fontFamily = page.font;
    document.getElementById('in-font').value = page.font;
    overlay.className = `mag-overlay ${page.border}`;
    document.getElementById('in-border').value = page.border;

    // Update Page Numbers
    if(pageIndicator) {
        pageIndicator.innerText = `Page ${currentPageIndex + 1} of ${activeMagazine.pages.length}`;
    }
}

// --- 4. Event Listeners ---

// Live Title
inTitle.addEventListener('input', () => {
    outTitle.innerText = inTitle.value || "Magazine";
    activeMagazine.title = inTitle.value;
});

// Pagination Arrows
document.getElementById('btn-add-page').addEventListener('click', () => {
    activeMagazine.pages.push({
        headline: "New Chapter",
        snippet: "A new scene unfolds...",
        bgUrl: "",
        font: "'Cinzel', serif",
        border: "border-royal"
    });
    currentPageIndex = activeMagazine.pages.length - 1;
    renderCurrentPage();
});

document.getElementById('btn-prev-page').addEventListener('click', () => {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        renderCurrentPage();
    }
});

document.getElementById('btn-next-page').addEventListener('click', () => {
    if (currentPageIndex < activeMagazine.pages.length - 1) {
        currentPageIndex++;
        renderCurrentPage();
    }
});

// Customization Adjustments
document.getElementById('in-font').addEventListener('change', (e) => {
    activeMagazine.pages[currentPageIndex].font = e.target.value;
    renderCurrentPage();
});

document.getElementById('in-border').addEventListener('change', (e) => {
    activeMagazine.pages[currentPageIndex].border = e.target.value;
    renderCurrentPage();
});

document.getElementById('btn-discard-img').addEventListener('click', () => {
    activeMagazine.pages[currentPageIndex].bgUrl = "";
    renderCurrentPage();
});

// Navigation & Saving
document.getElementById('btn-back-hub').addEventListener('click', () => {
    viewEditor.style.display = 'none';
    viewHub.style.display = 'flex';
    loadArchives();
});

document.getElementById('btn-save').addEventListener('click', () => {
    const btn = document.getElementById('btn-save');
    let archives = JSON.parse(localStorage.getItem('aura_archives')) || [];
    
    // Add date to the save file
    activeMagazine.date = new Date().toLocaleDateString();

    if (currentProjectId === null) {
        archives.push(activeMagazine);
        currentProjectId = archives.length - 1;
    } else {
        archives[currentProjectId] = activeMagazine;
    }

    localStorage.setItem('aura_archives', JSON.stringify(archives));
    
    btn.innerText = "Saved!";
    btn.style.color = "#4CAF50";
    setTimeout(() => { 
        btn.innerText = "Save Draft"; 
        btn.style.color = "#d4af37";
    }, 2000);
});

// --- 5. AI Generators ---
document.getElementById('btn-ai-text').addEventListener('click', async () => {
    const btn = document.getElementById('btn-ai-text');
    const concept = document.getElementById('in-story').value;
    if (!concept) { alert("Please write a concept first!"); return; }

    btn.innerText = "Summoning...";
    btn.disabled = true;

    try {
        const response = await fetch('/api/generate-story', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ theme: 'custom', prompt: `Write a short, dramatic magazine headline and a 2-sentence teaser snippet based on this concept: ${concept}. Do not use hashtags.` })
        });
        const data = await response.json();
        if (data.story) {
            const lines = data.story.split('\n').filter(line => line.trim() !== '');
            activeMagazine.pages[currentPageIndex].headline = lines[0] || "A Tale Untold";
            activeMagazine.pages[currentPageIndex].snippet = lines.slice(1).join(' ') || data.story;
            renderCurrentPage();
        }
    } catch (error) {
        alert("The ravens failed to deliver the text.");
    } finally {
        btn.innerText = "Summon Story (AI)";
        btn.disabled = false;
    }
});

document.getElementById('btn-ai-img').addEventListener('click', async () => {
    const btn = document.getElementById('btn-ai-img');
    const concept = document.getElementById('in-story').value || "beautiful royal garden";
    const style = document.getElementById('in-style').value;
    
    btn.innerText = "Painting Cover...";
    btn.disabled = true;

    try {
        const fullPrompt = `${concept}, ${style}, 8k resolution, highly detailed masterpiece`;
        const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: fullPrompt })
        });
        const data = await response.json();
        if (data.image_url) {
            activeMagazine.pages[currentPageIndex].bgUrl = data.image_url;
            renderCurrentPage();
        }
    } catch (error) {
        alert("The artist failed to paint.");
    } finally {
        btn.innerText = "Paint Cover Art (AI)";
        btn.disabled = false;
    }
});

// --- 6. Publish (Single Page for now) ---
document.getElementById('btn-publish').addEventListener('click', () => {
    const element = document.getElementById('export-canvas');
    const btn = document.getElementById('btn-publish');
    btn.innerText = "Forging PDF...";
    
    const opt = {
        margin: 0,
        filename: activeMagazine.title + '_Draft.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'px', format: [450, 636], orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        btn.innerText = "Publish Issue";
    });
});

// Ignite the Engine!
loadArchives();