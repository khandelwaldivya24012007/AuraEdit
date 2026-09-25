from flask import Flask, render_template, request, jsonify
from PIL import Image, ImageEnhance, ImageFilter
import os
from openai import OpenAI
from dotenv import load_dotenv

# 🔒 This secretly loads your GROQ_API_KEY from your .env file!
load_dotenv()

app = Flask(__name__)

UPLOAD_FOLDER = "uploads"
OUTPUT_FOLDER = "outputs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return render_template("aura.html")

@app.route("/upload", methods=["POST"])
def upload():
    files = request.files.getlist("photos")
    style = request.form.get("style")
    output_images = []

    for file in files:
        path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(path)
        img = Image.open(path)

        if style == "soft":
            img = img.filter(ImageFilter.GaussianBlur(1))
            img = ImageEnhance.Brightness(img).enhance(1.2)
        elif style == "dark":
            img = ImageEnhance.Brightness(img).enhance(0.7)

        output_path = os.path.join(OUTPUT_FOLDER, "edited_" + file.filename)
        img.save(output_path)
        output_images.append(output_path)
        
    return jsonify({"images": output_images})

@app.route("/text-story")
def text_story():
    return render_template("text_story.html")

# ==========================================
# 🐺 API 1: THE TEXT FORMATTER
# ==========================================
@app.route("/api/auto-format", methods=["POST"])
def auto_format():
    data = request.get_json()
    user_text = data.get('text', '')

    if not user_text:
        return jsonify({'formatted_text': ''})

    groq_api_key = os.environ.get("GROQ_API_KEY")
    
    # Connect to Groq's super-fast servers
    client = OpenAI(
        api_key=groq_api_key, 
        base_url="https://api.groq.com/openai/v1"
    ) 

    try:
        response = client.chat.completions.create(
            model="llama3-8b-8192",
            messages=[
                {
                    "role": "system", 
                    "content": "You are an aesthetic text formatter. Take the user's text and format it into short, poetic lines suitable for a moody Instagram story. Add double line breaks between stanzas. DO NOT change, add, or remove any words. ONLY adjust the line breaks and spacing."
                },
                {"role": "user", "content": user_text}
            ],
            temperature=0.3 
        )
        
        formatted_text = response.choices[0].message.content
        return jsonify({'formatted_text': formatted_text})

    except Exception as e:
        print(f"API Error: {e}")
        return jsonify({'error': 'Failed to format text'}), 500

# ==========================================
# 🔮 API 2: THE AI STORY GENERATOR
# ==========================================
@app.route("/api/generate-story", methods=["POST"])
def generate_story():
    data = request.get_json()
    theme = data.get('theme', 'minimalist')

    # 🚀 NEW: Modern, versatile AI templates!
    prompts = {
        "minimalist": "Write a 2-line minimalist, aesthetic quote about moving forward and letting go. Do not use hashtags or emojis.",
        "cyberpunk": "Write a short, moody 3-line cyberpunk description of a neon city in the rain. Make it sound cinematic. Do not use hashtags.",
        "ethereal": "Write a hauntingly beautiful 4-line poem about stars falling into the ocean. Do not use hashtags or emojis.",
        "motivational": "Write a punchy, modern 3-line motivational quote for an entrepreneur. Make it sound sophisticated, not cheesy. No hashtags."
    }
    
    selected_prompt = prompts.get(theme, prompts["minimalist"])
    groq_api_key = os.environ.get("GROQ_API_KEY")

    client = OpenAI(
        api_key=groq_api_key, 
        base_url="https://api.groq.com/openai/v1"
    ) 

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a premium AI copywriter generating aesthetic text for an Instagram story. Keep it under 40 words. Use dramatic line breaks."
                },
                {"role": "user", "content": selected_prompt}
            ],
            temperature=0.7 
        )
        
        generated_text = response.choices[0].message.content
        return jsonify({'story': generated_text})

    except Exception as e:
        print(f"API Error: {e}")
        return jsonify({'error': 'Failed to generate story'}), 500
    
# ==========================================
# 💻 API 4: THE ADAPTIVE ASSIGNMENT COMPILER (NETWORK BYPASS)
# ==========================================
@app.route("/api/generate-code", methods=["POST"])
def generate_code():
    data = request.get_json()
    prompt = data.get('prompt')
    language = data.get('language')
    difficulty = data.get('difficulty', 'medium')

    if not prompt or not language:
        return jsonify({'error': 'Missing prompt or language'}), 400

    # 🎯 Tiered Strategy Prompts
    if difficulty == "easy":
        system_instruction = (
            f"You are a computer science helper generating beginner-level academic code solutions in {language}. "
            f"Write the absolute simplest, most direct script possible. "
            f"1. Do NOT wrap the code inside functions or classes unless requested.\n"
            f"2. For C++, ALWAYS include 'using namespace std;' and write standard code inside int main().\n"
        )
    elif difficulty == "hard":
        system_instruction = (
            f"You are an expert systems engineer writing highly optimized, production-grade solutions in {language}. "
            f"Implement clean, modular code architecture utilizing ideal data structures. "
        )
    else: 
        system_instruction = (
            f"You are an AI assistant crafting clean, structured academic assignment answers in {language}. "
            f"Organize the codebase logically using manageable functions. "
        )


   # 🛑 THE LOCKDOWN + TERMINAL SIMULATOR
    system_instruction += (
        "\nCRITICAL RULE: You must simulate the code execution. Return your response in this EXACT format with no other text:\n"
        "[CODE_START]\n<pure executable code here>\n[CODE_END]\n"
        "[OUTPUT_START]\n<what the console would print if this ran>\n[OUTPUT_END]"
    )

    # 🚀 The Bypass: Using 'requests' instead of 'openai'
    groq_api_key = os.environ.get("GROQ_API_KEY")
    
    headers = {
        "Authorization": f"Bearer {groq_api_key}",
        "Content-Type": "application/json"
    }
    
    payload = {
    "model": "openai/gpt-oss-20b",
        "messages": [
            {"role": "system", "content": system_instruction},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2
    }

    try:
        # Firing the request directly!
        response = requests.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
        
        # If Groq returns an error (like an invalid API key), this catches it
        if response.status_code != 200:
            print(f"Groq API Error: {response.text}")
            return jsonify({'error': 'AI server rejected the request'}), 502
            
        generated_code = response.json()['choices'][0]['message']['content']
        return jsonify({'code': generated_code})

    except Exception as e:
        print(f"Code API Error: {e}")
        return jsonify({'error': 'Failed to compile code'}), 500
    
# ==========================================
# OTHER ROUTES
# ==========================================
@app.route("/photo-story")
def photo_story():
    return render_template("photo_story.html")

@app.route("/reel")
def reel():
    return render_template("reel.html")

@app.route("/magazine")
def magazine():
    return render_template("magazine.html")

@app.route("/template")
def template():
    return render_template("template.html")

@app.route("/assignment")
def assignment():
    return render_template("assignment.html")



import requests
import io
import base64

# ====================================================
# 🎨 API 3: THE IMAGE GENERATOR (HUGGING FACE)
# ====================================================
@app.route("/api/generate-image", methods=["POST"])
def generate_image():
    data = request.get_json()
    prompt = data.get('prompt', 'A cinematic magazine cover background')

    # The specific model we are calling
    API_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0"
    headers = {"Authorization": f"Bearer {os.environ.get('HF_TOKEN')}"}

    try:
        # Request the image from Hugging Face
        response = requests.post(API_URL, headers=headers, json={"inputs": prompt})
        
        if response.status_code != 200:
            return jsonify({'error': 'AI is busy, try again in a moment'}), 503

        # Convert the raw image data into a Base64 string so the browser can read it
        image_bytes = response.content
        base64_image = base64.b64encode(image_bytes).decode('utf-8')
        
        return jsonify({'image_url': f"data:image/png;base64,{base64_image}"})

    except Exception as e:
        print(f"Image API Error: {e}")
        return jsonify({'error': 'Failed to forge image'}), 500


# ====================================================
# 🚀 START THE ENGINE (THIS MUST BE THE VERY LAST THING)
# ====================================================
if __name__ == "__main__":
    app.run(debug=True)