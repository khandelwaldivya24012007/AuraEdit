\# 🏰 AuraEdit



> \*\*Forge your story. Shape your vision. Create your realm.\*\*



AuraEdit is an immersive, Game of Thrones-inspired creative content generation suite that brings multiple storytelling and content-creation tools together into a single cinematic workspace.



The project combines traditional frontend technologies with AI-powered generation to help users create stories, edit images, generate reels, design magazines, build templates, and generate programming assignments.



\---



\## ✨ Overview



AuraEdit transforms ordinary content creation into a themed creative experience inspired by the Great Houses of Westeros.



Each creative tool is represented by a different House, with its own visual identity and purpose.



\### The Six Realms of Creation



| House | Realm | Purpose |

|---|---|---|

| 🐺 \*\*House Stark\*\* | Text → Story | Create and format cinematic text stories |

| 🐉 \*\*House Targaryen\*\* | Photo → Story | Apply atmospheric effects and image transformations |

| 🦁 \*\*House Lannister\*\* | AI Reel Generator | Combine images, audio and transitions into reels |

| 🌹 \*\*House Tyrell\*\* | Personal Magazine | Create cinematic digital magazine covers |

| 🦌 \*\*House Baratheon\*\* | Template Designer | Design structured visual templates |

| ☀️ \*\*House Martell\*\* | Assignment Maker | Generate and format programming assignments |



\---



\# 🏰 Creative Realms



\## 🐺 House Stark — Text → Story



\### Aura AI Canvas



A cinematic typography and storytelling environment designed for creating visually engaging text-based stories.



Features include:



\- Live text editing

\- Story formatting

\- Cinematic typography

\- Real-time preview

\- AI-assisted text formatting

\- Aesthetic line and paragraph arrangement



The backend provides an AI-powered text formatter that restructures user content into short, poetic lines while preserving the original words.



\---



\## 🐉 House Targaryen — Photo → Story



\### Forge Your Vision



A photo-processing environment for transforming ordinary images into atmospheric visual stories.



Features include:



\- Multiple image uploads

\- Image processing using Pillow

\- Brightness adjustment

\- Soft blur effect

\- Dark cinematic effect

\- Output image generation

\- Game of Thrones-inspired visual styles



\---



\## 🦁 House Lannister — AI Reel Generator



\### Hear Me Roar



A visual reel creation environment designed for combining multiple images with audio and transition styles.



The interface provides a foundation for creating short cinematic visual sequences.



Planned/ongoing development includes expanding automated reel generation and media processing capabilities.



\---



\## 🌹 House Tyrell — Personal Magazine



\### The Reach Editorial



A magazine-style content creation environment featuring:



\- Cinematic editorial layouts

\- Custom typography

\- Magazine cover composition

\- Dynamic text placement

\- Image-based visual storytelling

\- Cinzel-inspired typography



\---



\## 🦌 House Baratheon — Template Designer



\### Forge Your Structure



A template-building environment for creating structured visual layouts.



Features include:



\- Grid-based layouts

\- Minimalist design structures

\- Custom content positioning

\- Visual template planning

\- Responsive layout foundations



\---



\## ☀️ House Martell — Assignment Maker



\### Choose Your Weapon



An AI-assisted programming assignment generator designed to transform programming prompts into structured assignment documents.



The backend can:



\- Accept programming prompts

\- Generate code using AI

\- Support multiple programming languages

\- Generate simulated console output

\- Format code for presentation

\- Prepare content for PDF export



The frontend uses syntax highlighting and document-generation tools to create polished assignment documents.



\---



\# 🤖 AI Integration



AuraEdit currently integrates external AI services for different creative workflows.



\### Groq



Used for AI-powered text generation and formatting.



Current AI workflows include:



\- Automatic text formatting

\- AI story generation

\- Programming code generation



The application communicates with Groq through its OpenAI-compatible API.



\### Hugging Face



Used for AI image generation.



The image-generation workflow uses a Stable Diffusion model through the Hugging Face inference API.



\---



\# 🛠️ Technology Stack



\## Backend



\- \*\*Python\*\*

\- \*\*Flask\*\*

\- \*\*Pillow\*\*

\- \*\*OpenAI Python SDK\*\*

\- \*\*python-dotenv\*\*

\- \*\*Requests\*\*



\## Frontend



\- \*\*HTML5\*\*

\- \*\*CSS3\*\*

\- \*\*JavaScript ES6\*\*

\- \*\*CSS Flexbox\*\*

\- \*\*CSS Grid\*\*

\- \*\*Glassmorphism\*\*

\- \*\*Google Fonts\*\*



\## External Libraries / APIs



\- \*\*Groq API\*\*

\- \*\*Hugging Face Inference API\*\*

\- \*\*html2pdf.js\*\*

\- \*\*highlight.js\*\*



\---



\# 🏗️ Architecture



AuraEdit follows a lightweight Flask-based architecture.



```text

&#x20;                   ┌─────────────────────┐

&#x20;                   │      AuraEdit       │

&#x20;                   │   Creative Suite    │

&#x20;                   └──────────┬──────────┘

&#x20;                              │

&#x20;               ┌──────────────┴──────────────┐

&#x20;               │                             │

&#x20;       ┌───────▼────────┐           ┌────────▼───────┐

&#x20;       │    Frontend     │           │     Backend    │

&#x20;       │ HTML/CSS/JS     │◄─────────►│     Flask      │

&#x20;       └───────┬────────┘           └────────┬────────┘

&#x20;               │                             │

&#x20;      ┌────────┴────────┐          ┌─────────┴─────────┐

&#x20;      │                 │          │                   │

&#x20;  User Interface   Media Tools   Groq API       Hugging Face

&#x20;      │                 │          │                   │

&#x20;      └─────────────────┴──────────┴───────────────────┘

AuraEdit/

│

├── aura.py

│

├── requirements.txt

├── .gitignore

├── .env.example

│

├── static/

│   ├── assignment.css

│   ├── assignment.js

│   ├── aura.css

│   ├── aura.js

│   ├── magazine.css

│   ├── magazine.js

│   ├── photo\_story.css

│   ├── reel.css

│   ├── template.css

│   ├── text\_story.css

│   ├── text\_story.js

│   │

│   └── \*.png

│

├── templates/

│   ├── aura.html

│   ├── assignment.html

│   ├── magazine.html

│   ├── photo\_story.html

│   ├── reel.html

│   ├── template.html

│   └── text\_story.html

│

├── uploads/

│

└── outputs/

