
---
title: Drag-and-Vision
emoji: 👁️
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# Drag-and-Vision

Application d'analyse d'images interactive utilisant **Google Gemini 1.5 Flash** et déployée via Docker sur Hugging Face Spaces.

### Configuration
N'oubliez pas d'ajouter votre `GOOGLE_API_KEY` dans les **Settings > Variables and Secrets** de votre Hugging Face Space.

### Utilisation locale
1. `pip install -r requirements.txt`
2. `export GOOGLE_API_KEY=votre_cle`
3. `python app.py`
