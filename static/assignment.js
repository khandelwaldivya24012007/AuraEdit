// DOM Elements
const btnGenerate = document.getElementById('btn-generate');
const btnExport = document.getElementById('btn-export');
const inLanguage = document.getElementById('in-language');
const inPrompt = document.getElementById('in-prompt');
const outCode = document.getElementById('out-code');
const outTitle = document.getElementById('out-title');
const prompt = inPrompt.value;
const language = inLanguage.value;
const difficulty = document.getElementById('in-difficulty').value;
const mode = document.getElementById('in-mode').value; // Grab the Generation Mode
const canvas = document.getElementById('canvas-container');

// 1. Generate Code API Call
// 1. Generate & Append API Call
// Global Tab Trackers
let currentTabIndex = 0;
let totalTabs = 0;

// 1. Generate & Append API Call
btnGenerate.addEventListener('click', async () => {
    const prompt = inPrompt.value;
    const language = inLanguage.value;
    const difficulty = document.getElementById('in-difficulty').value;
    const mode = document.getElementById('in-mode').value;
    const canvas = document.getElementById('canvas-container');

    if (!prompt) {
        alert("Please enter an assignment prompt first.");
        return;
    }

    btnGenerate.innerText = "Compiling...";
    btnGenerate.disabled = true;

    try {
        const response = await fetch('/api/generate-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt, language: language, difficulty: difficulty })
        });
        
        const data = await response.json();
        
        if (data.code) {
            const codeMatch = data.code.match(/\[CODE_START\]([\s\S]*?)\[CODE_END\]/);
            const outMatch = data.code.match(/\[OUTPUT_START\]([\s\S]*?)\[OUTPUT_END\]/);
            
            let cleanCode = codeMatch ? codeMatch[1].trim() : "Error parsing code.";
            let cleanOutput = outMatch ? outMatch[1].trim() : "Execution finished.";
            cleanCode = cleanCode.replace(/```[a-zA-Z]*\n?/g, '').replace(/```/g, '').trim();

            const langMap = { "Python": "python", "C++": "cpp", "Java": "java", "C": "c", "JavaScript": "javascript" };
            const uniqueId = 'code-' + Math.random().toString(36).substr(2, 9);

            // If Single mode, wipe everything
            if (mode === "single") {
                canvas.innerHTML = '';
                currentTabIndex = 0;
                totalTabs = 0;
            }

           // 1. Check if this is the first tab
            let isFirstTab = (totalTabs === 0);
            
            // 2. Main Header (Wrapped to protect it from slicing)
            let headerHTML = isFirstTab ? `
                <div class="avoid-this" style="margin-bottom: 10px;">
                    <h1 class="doc-title" id="out-title" style="color: #8a1c1c; font-family: serif; border-bottom: 2px solid #8a1c1c; padding-bottom: 5px; margin-top: 0;">Assignment Workspace</h1>
                    <p class="doc-desc" style="font-weight: bold;">Generated Solutions:</p>
                </div>
            ` : '';

            // 3. The Ironclad Page Break Trigger
            let pageBreakHTML = !isFirstTab ? `<div class="force-page-break"></div>` : '';

            // 4. Construct the Tab with strict "avoid-this" wrappers
            const newTab = `
                <div class="tab-pane" id="tab-${totalTabs}" style="display: block;">
                    ${pageBreakHTML}
                    ${headerHTML}
                    <div class="assignment-block">
                        
                        <div class="avoid-this">
                            <div class="question-heading" style="margin-top: 10px; margin-bottom: 10px;">Q: ${prompt}</div>
                        </div>
                        
                        <div class="code-block" style="text-align: left; padding: 15px; border-radius: 6px; overflow-x: auto;">
                            <!-- line-height 1.5 prevents code lines from being sliced horizontally -->
                            <pre style="margin: 0; font-family: 'Fira Code', monospace; line-height: 1.5;"><code id="${uniqueId}" class="language-${langMap[language]}" style="white-space: pre-wrap; background: transparent; padding: 0;">${cleanCode.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
                        </div>

                        <div class="avoid-this">
                            <div class="output-heading" style="margin-top: 20px; margin-bottom: 10px;">Output</div>
                        </div>

                        <div class="avoid-this">
                            <div class="terminal-window" style="margin-bottom: 20px;">
                                <div class="terminal-header">PS C:\\Users\\Divya&gt; .\\run_${langMap[language]}.exe</div>
                                <div class="terminal-body">${cleanOutput.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            `;

            // Inject the new tab and update trackers
            canvas.insertAdjacentHTML('beforeend', newTab);
            hljs.highlightElement(document.getElementById(uniqueId));
            
            currentTabIndex = totalTabs;
            totalTabs++;
            updateTabControls();

        } else {
            alert("Failed to compile.");
        }
    } catch (error) {
        alert("Server communication failed.");
    } finally {
        btnGenerate.innerText = "Generate Code";
        btnGenerate.disabled = false;
        inPrompt.value = ""; 
    }
});
// ==========================================
// 📄 PDF EXPORT ENGINE
// ==========================================


btnExport.addEventListener('click', () => {
    const canvas = document.querySelector('.pdf-canvas');
    
    // 1. Temporarily unhide ALL tabs so html2pdf can see them
    const allTabs = document.querySelectorAll('.tab-pane');
    allTabs.forEach(tab => tab.style.display = 'block');

    // 2. Remove scroll limits
    const originalHeight = canvas.style.height;
    const originalOverflow = canvas.style.overflowY;
    canvas.style.height = 'auto';
    canvas.style.overflowY = 'visible';

  // 3. Strict PDF Settings with explicit Anti-Slicing rules
    const opt = {
        margin:       0.4, 
        filename:     'AuraEdit_Assignment.pdf',
        image:        { type: 'jpeg', quality: 1.0 },
        html2canvas:  { scale: 2, useCORS: true }, 
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak:    { 
            mode: ['css', 'legacy'], 
            before: '.force-page-break', // Forces new questions to new pages
            avoid: '.avoid-this'         // STRICTLY prevents the guillotine from slicing text inside these divs
        } 
    };

    btnExport.innerText = "Forging PDF...";
    btnExport.disabled = true;

    // 4. Generate the un-broken PDF
    html2pdf().set(opt).from(canvas).save().then(() => {
        // 5. Instantly restore everything!
        canvas.style.height = originalHeight || '650px'; 
        canvas.style.overflowY = originalOverflow || 'auto';
        
        // Hide all tabs except the one the user was currently looking at
        allTabs.forEach((tab, index) => {
            tab.style.display = (index === currentTabIndex) ? 'block' : 'none';
        });
        
        btnExport.innerText = "Export to PDF";
        btnExport.disabled = false;
    }).catch(err => {
        console.error("PDF Generation Failed:", err);
        btnExport.innerText = "Export Failed";
        btnExport.disabled = false;
    });
});
// ==========================================
// 🎛️ TAB NAVIGATION CONTROLS
// ==========================================
function updateTabControls() {
    const controls = document.getElementById('tab-controls');
    const indicator = document.getElementById('tab-indicator');
    const btnPrev = document.getElementById('btn-prev-tab');
    const btnNext = document.getElementById('btn-next-tab');

    if (totalTabs > 1) {
        controls.style.display = 'flex'; // Show slider if there's more than 1 question
        indicator.innerText = `Question ${currentTabIndex + 1} of ${totalTabs}`;
        btnPrev.disabled = (currentTabIndex === 0);
        btnNext.disabled = (currentTabIndex === totalTabs - 1);
    } else {
        controls.style.display = 'none'; // Hide slider for single questions
    }
}

document.getElementById('btn-prev-tab').addEventListener('click', () => {
    if (currentTabIndex > 0) {
        document.getElementById(`tab-${currentTabIndex}`).style.display = 'none';
        currentTabIndex--;
        document.getElementById(`tab-${currentTabIndex}`).style.display = 'block';
        updateTabControls();
    }
});

document.getElementById('btn-next-tab').addEventListener('click', () => {
    if (currentTabIndex < totalTabs - 1) {
        document.getElementById(`tab-${currentTabIndex}`).style.display = 'none';
        currentTabIndex++;
        document.getElementById(`tab-${currentTabIndex}`).style.display = 'block';
        updateTabControls();
    }
});


