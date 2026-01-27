
import os
import json
from flask import Flask, render_template, request, jsonify, send_from_directory
import google.generativeai as genai

# Configuration Flask selon les contraintes
app = Flask(__name__, 
            template_folder='../templates', 
            static_folder='../static',
            static_url_path='/static')

# Configuration de la sécurité (Variable d'environnement)
api_key = os.environ.get("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

@app.route('/')
def index():
    """Sert l'application React via le dossier templates."""
    return render_template('index.html')

@app.route('/api/ai', methods=['POST'])
def ai_proxy():
    """Proxy sécurisé pour les appels Gemini."""
    if not api_key:
        return jsonify({"error": "API Key not configured"}), 500
    
    data = request.json
    prompt = data.get("prompt")
    model_name = data.get("model", "gemini-2.0-flash")
    config = data.get("config", {})

    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(
            prompt,
            generation_config=config
        )
        return jsonify({"text": response.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/static/<path:path>')
def send_static(path):
    """Sert les fichiers statiques (TSX, CSS, etc.)."""
    return send_from_directory(app.static_folder, path)

# Catch-all pour le routage frontend (React Router)
@app.route('/<path:path>')
def catch_all(path):
    return render_template('index.html')
