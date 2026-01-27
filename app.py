
import os
from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from PIL import Image
import io

app = Flask(__name__)

# Configuration de la sécurité via variable d'environnement
api_key = os.environ.get("GOOGLE_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
else:
    print("WARNING: GOOGLE_API_KEY not found in environment variables.")

# Initialisation du modèle Gemini
model = genai.GenerativeModel("gemini-1.5-flash")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'image' not in request.files:
        return jsonify({"error": "Aucune image reçue"}), 400
    
    file = request.files['image']
    prompt = request.form.get('prompt', 'Analyse cette image en détail.')

    try:
        # Lecture et conversion de l'image pour PIL
        img_bytes = file.read()
        img = Image.open(io.BytesIO(img_bytes))
        
        # Appel à Gemini
        response = model.generate_content([prompt, img])
        
        return jsonify({
            "analysis": response.text,
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Écoute sur l'hôte et le port requis par Hugging Face
    app.run(host='0.0.0.0', port=7860)
