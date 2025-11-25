
import { Challenge, NodeDefinition, NodeType } from './types';

export const TRANSLATIONS = {
  en: {
    studio: 'Pipeline Studio',
    createNode: 'Create Node',
    challenges: 'Challenges',
    corrector: 'Code Optimizer', // Renamed
    settings: 'Settings',
    library: 'Node Library',
    export: 'Export Python',
    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    reset: 'Reset',
    copy: 'Copy to Clipboard',
    generated: 'Generated Python Script',
    optimize: 'Optimizer',
    optimizerSettings: 'Performance Settings',
    resScale: 'Resolution Scale',
    frameSkip: 'Frame Skip',
    threading: 'Multi-threading',
    cuda: 'CUDA Acceleration (if available)',
    noNodes: 'No nodes available in',
    dragStart: 'Drag nodes from the library to start building.',
    back: 'Back',
    start: 'Start Challenge',
    replay: 'Replay Challenge',
    locked: 'Locked',
    consultAI: 'Consult AI',
    aiHint: 'AI Hint',
    objectives: 'Objectives',
    workspace: 'Workspace',
    openWorkspace: 'Open Workspace',
    genNode: 'AI Node Generator',
    descNode: 'Describe what you want, and we\'ll code the OpenCV logic for you.',
    nodeName: 'Node Name',
    nodeLogic: 'Description / Logic',
    generateBtn: 'Generate & Add',
    generating: 'Generating...',
    customLib: 'Create one in the "Create Node" tab!',
    dashboard: 'Dashboard', 
    verify: 'Verify Solution',
    verifying: 'Verifying...',
    success: 'Challenge Completed!',
    fail: 'Keep Trying',
    filterDiff: 'Difficulty',
    filterTheme: 'Theme',
    all: 'All',
    missionBrief: 'Mission Brief',
    correctorTitle: 'Code Optimizer', // Renamed
    correctorDesc: 'Refactor, fix, and optimize your Computer Vision pipeline with Gemini Intelligence.',
    pasteCode: 'Paste Python Code...',
    analyzeBtn: 'Optimize Code',
    analyzing: 'Optimizing...',
    fixedCode: 'Optimized Code',
    explanation: 'Optimization Report',
    cppExport: 'C++ Export',
    transpileBtn: 'Transpile to C++',
    transpiling: 'Transpiling...',
    community: 'Community',
    import: 'Import Pipeline',
    importDesc: 'Paste Python code to reverse-engineer it into a visual graph.',
    importBtn: 'Import',
    importing: 'Analyzing AST...',
    creatorMode: 'Creator Mode',
    createChallenge: 'Create Challenge',
    challengeTitle: 'Challenge Title',
    challengeDesc: 'Description',
    challengeObjs: 'Objectives (one per line)',
    saveChallenge: 'Save Challenge',
    manualMode: 'Manual Code',
    aiMode: 'AI Generator',
    classTemplate: '# Write your Python class here',
    // API / Connectivity
    apiConfig: 'API Node Configuration',
    url: 'Endpoint URL',
    method: 'Method',
    headers: 'Headers',
    addHeader: 'Add Header',
    key: 'Key',
    value: 'Value',
    sendImage: 'Send Image (Base64)',
    resize: 'Largeur Redim. (px)',
    asyncMode: 'Async Mode (Non-blocking)',
    saveConfig: 'Save Configuration',
    connectivity: 'Connectivity',
    genai: 'GenAI / VLM',
    // Optimizer Slider
    optPreference: 'Optimization Preference',
    quality: 'Max Quality (Accuracy)',
    speed: 'Max FPS (Speed)',
    balanced: 'Balanced (50/50)',
    // DroidCam
    droidCamConfig: 'DroidCam Configuration',
    ipAddress: 'IP Address',
    port: 'Port',
    droidCamHelp: 'Use the DroidCam app on your phone. Enter the IP/Port shown.',
    // ONNX
    onnxConfig: 'ONNX Model Configuration',
    modelPath: 'Model File Path (.onnx)',
  },
  fr: {
    studio: 'Studio Pipeline',
    createNode: 'Créer un Node',
    challenges: 'Défis',
    corrector: 'Optimiseur de Code', // Renamed
    settings: 'Paramètres',
    library: 'Bibliothèque',
    export: 'Exporter Python',
    zoomIn: 'Zoomer',
    zoomOut: 'Dézoomer',
    reset: 'Réinitialiser',
    copy: 'Copier',
    generated: 'Script Python Généré',
    optimize: 'Optimiseur',
    optimizerSettings: 'Paramètres de Performance',
    resScale: 'Échelle de Résolution',
    frameSkip: 'Saut d\'images',
    threading: 'Multi-threading',
    cuda: 'Accélération CUDA (si dispo)',
    noNodes: 'Aucun node disponible dans',
    dragStart: 'Glissez des nodes depuis la bibliothèque.',
    back: 'Retour',
    start: 'Lancer le défi',
    replay: 'Rejouer le défi',
    locked: 'Verrouillé',
    consultAI: 'Consulter l\'IA',
    aiHint: 'Indice IA',
    objectives: 'Objectifs',
    workspace: 'Espace de travail',
    openWorkspace: 'Ouvrir l\'espace',
    genNode: 'Générateur de Node IA',
    descNode: 'Décrivez ce que vous voulez, nous codons la logique OpenCV.',
    nodeName: 'Nom du Node',
    nodeLogic: 'Description / Logique',
    generateBtn: 'Générer et Ajouter',
    generating: 'Génération...',
    customLib: 'Créez-en un dans l\'onglet "Créer un Node" !',
    dashboard: 'Tableau de bord',
    verify: 'Vérifier la Solution',
    verifying: 'Vérification...',
    success: 'Défi Réussi !',
    fail: 'Essayez encore',
    filterDiff: 'Difficulté',
    filterTheme: 'Thème',
    all: 'Tous',
    missionBrief: 'Ordre de Mission',
    correctorTitle: 'Optimiseur de Code', // Renamed
    correctorDesc: 'Refactorisez, corrigez et optimisez votre pipeline avec l\'Intelligence Gemini.',
    pasteCode: 'Collez le code Python...',
    analyzeBtn: 'Optimiser le Code',
    analyzing: 'Optimisation...',
    fixedCode: 'Code Optimisé',
    explanation: 'Rapport d\'Optimisation',
    cppExport: 'Export C++',
    transpileBtn: 'Convertir en C++',
    transpiling: 'Conversion...',
    community: 'Communauté',
    import: 'Importer Pipeline',
    importDesc: 'Collez du code Python pour le convertir en graphe visuel.',
    importBtn: 'Importer',
    importing: 'Analyse AST...',
    creatorMode: 'Mode Créateur',
    createChallenge: 'Créer un Défi',
    challengeTitle: 'Titre du Défi',
    challengeDesc: 'Description',
    challengeObjs: 'Objectifs (un par ligne)',
    saveChallenge: 'Sauvegarder le Défi',
    manualMode: 'Code Manuel',
    aiMode: 'Générateur IA',
    classTemplate: '# Écrivez votre classe Python ici',
    // API / Connectivity
    apiConfig: 'Configuration API',
    url: 'URL Endpoint',
    method: 'Méthode',
    headers: 'En-têtes',
    addHeader: 'Ajouter',
    key: 'Clé',
    value: 'Valeur',
    sendImage: 'Envoyer Image (Base64)',
    resize: 'Largeur Redim. (px)',
    asyncMode: 'Mode Asynchrone (Non-bloquant)',
    saveConfig: 'Sauvegarder',
    connectivity: 'Connectivité',
    genai: 'GenAI / VLM',
    // Optimizer Slider
    optPreference: 'Préférence d\'Optimisation',
    quality: 'Qualité Max (Précision)',
    speed: 'FPS Max (Vitesse)',
    balanced: 'Équilibré (50/50)',
    // DroidCam
    droidCamConfig: 'Configuration DroidCam',
    ipAddress: 'Adresse IP',
    port: 'Port',
    droidCamHelp: 'Utilisez l\'app DroidCam sur votre téléphone. Entrez l\'IP/Port affiché.',
    // ONNX
    onnxConfig: 'Configuration Modèle ONNX',
    modelPath: 'Chemin du fichier (.onnx)',
  }
};

export const MOCK_COMMUNITY_NODES: NodeDefinition[] = [
  {
    id: 'comm_yolo',
    name: 'YOLOv8 Model',
    name_fr: 'Modèle YOLOv8',
    type: NodeType.AI,
    description: 'Object detection using YOLOv8n',
    description_fr: 'Détection d\'objets avec YOLOv8n',
    category: 'ai',
    library: 'Community',
    pythonClass: 'YOLOv8Node',
    pythonTemplate: `
# Community Node: YOLOv8
from ultralytics import YOLO
model = YOLO('yolov8n.pt')
results = model({input})
{output} = results[0].plot()
`,
    requiredImports: ['cv2', 'ultralytics'],
    inputs: 1,
    outputs: 1
  },
  {
    id: 'comm_classifier',
    name: 'ImageNet Classifier',
    name_fr: 'Classifieur ImageNet',
    type: NodeType.AI,
    description: 'ResNet50 classification',
    description_fr: 'Classification ResNet50',
    category: 'ai',
    library: 'Community',
    pythonClass: 'ResNet50',
    pythonTemplate: `
# Community Node: ResNet Classifier
# Assumes standard preprocessing is done or handled inside
# Logic simplified for demo
{output} = {input} # Placeholder for actual classification overlay
cv2.putText({output}, "Class: Golden Retriever (Mock)", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
`,
    requiredImports: ['cv2', 'tensorflow as tf'],
    inputs: 1,
    outputs: 1
  },
  {
    id: 'comm_onnx',
    name: 'ONNX Loader',
    name_fr: 'Chargeur ONNX',
    type: NodeType.AI,
    description: 'Load generic .onnx model',
    description_fr: 'Charger modèle .onnx générique',
    category: 'ai',
    library: 'Community',
    pythonClass: 'cv2.dnn.readNetFromONNX',
    pythonTemplate: `
# Community Node: ONNX
# Model Path: {modelPath}
net = cv2.dnn.readNetFromONNX("{modelPath}")
blob = cv2.dnn.blobFromImage({input}, 1/255.0, (224, 224), swapRB=True, crop=False)
net.setInput(blob)
preds = net.forward()
{output} = {input}
`,
    requiredImports: ['cv2'],
    inputs: 1,
    outputs: 1
  },
  {
    id: 'comm_qr',
    name: 'QR Reader',
    name_fr: 'Lecteur QR',
    type: NodeType.PROCESS,
    description: 'Detect and decode QR codes',
    description_fr: 'Détecter et décoder les codes QR',
    category: 'transform',
    library: 'Community',
    pythonClass: 'cv2.QRCodeDetector',
    pythonTemplate: `
detector = cv2.QRCodeDetector()
data, bbox, _ = detector.detectAndDecode({input})
{output} = {input}.copy()
if bbox is not None:
    for i in range(len(bbox)):
        cv2.line({output}, tuple(bbox[i][0].astype(int)), tuple(bbox[(i+1)%len(bbox)][0].astype(int)), (0,255,0), 3)
    if data:
        cv2.putText({output}, data, (int(bbox[0][0][0]), int(bbox[0][0][1]-10)), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 2)
`,
    requiredImports: ['cv2'],
    inputs: 1,
    outputs: 1
  }
];

export const AVAILABLE_NODES: NodeDefinition[] = [
  // --- SOURCES (CORE) ---
  { 
    id: 'src_webcam', 
    name: 'Webcam Feed', 
    name_fr: 'Flux Webcam',
    type: NodeType.SOURCE, 
    description: 'Capture from default camera', 
    description_fr: 'Capture depuis la caméra par défaut',
    category: 'input',
    library: 'Core',
    pythonClass: 'cv2.VideoCapture',
    pythonTemplate: `
# Setup
cap = cv2.VideoCapture(0)
if not cap.isOpened(): raise IOError("Cannot open webcam")
# Process
ret, {output} = cap.read()
if not ret: break`,
    requiredImports: ['cv2'],
    inputs: 0,
    outputs: 1
  },
  { 
    id: 'src_droidcam', 
    name: 'DroidCam / IP Cam', 
    name_fr: 'DroidCam / Cam IP',
    type: NodeType.SOURCE, 
    description: 'Connect to phone camera via WiFi', 
    description_fr: 'Connexion caméra téléphone via WiFi',
    category: 'input',
    library: 'Core',
    pythonClass: 'cv2.VideoCapture',
    // Template splitting: Setup is injected at top, Process in loop.
    // {ip} and {port} will be replaced by the generator.
    pythonTemplate: `
# Setup
droidcam_url = "http://{ip}:{port}/video"
cap = cv2.VideoCapture(droidcam_url)
if not cap.isOpened(): print(f"Warning: Could not connect to DroidCam at {droidcam_url}")
# Process
ret, {output} = cap.read()
if not ret: 
    print("Failed to grab frame from DroidCam")
    # Placeholder to prevent crash
    {output} = np.zeros((480, 640, 3), dtype=np.uint8) 
`,
    requiredImports: ['cv2', 'numpy as np'],
    inputs: 0,
    outputs: 1
  },
  { 
    id: 'src_file', 
    name: 'Video File', 
    name_fr: 'Fichier Vidéo',
    type: NodeType.SOURCE, 
    description: 'Load video from local path', 
    description_fr: 'Charger une vidéo locale',
    category: 'input', 
    library: 'Core',
    pythonClass: 'cv2.VideoCapture',
    pythonTemplate: `
# Setup
cap = cv2.VideoCapture("path/to/video.mp4")
# Process
ret, {output} = cap.read()
if not ret: break`,
    requiredImports: ['cv2'],
    inputs: 0,
    outputs: 1
  },
  { 
    id: 'out_screen', 
    name: 'Screen Output', 
    name_fr: 'Sortie Écran',
    type: NodeType.OUTPUT, 
    description: 'Display result window', 
    description_fr: 'Afficher la fenêtre de résultat',
    category: 'output', 
    library: 'Core',
    pythonClass: 'cv2.imshow',
    pythonTemplate: `cv2.imshow('Pipeline Output', {input})`,
    requiredImports: ['cv2'],
    inputs: 1,
    outputs: 0
  },
  {
    id: 'util_optimizer',
    name: 'Vision Optimizer',
    name_fr: 'Optimiseur Vision',
    type: NodeType.UTILITY,
    description: 'Module d\'optimisation des performances (FPS vs Qualité).',
    description_fr: 'Module d\'optimisation des performances (FPS vs Qualité).',
    category: 'utility',
    library: 'Core',
    pythonClass: 'Optimizer',
    pythonTemplate: `
# Vision Optimizer Node
# optimization_slider_value = 50 (Example)
if frame_count % 2 == 0: # Logic dependent on slider value
    {output} = {input}
else:
    # Skip processing for FPS gain
    continue
`,
    requiredImports: ['time'],
    inputs: 1,
    outputs: 1
  },

  // --- CONNECTIVITY ---
  {
    id: 'net_http',
    name: 'HTTP Request',
    name_fr: 'Requête HTTP',
    type: NodeType.UTILITY,
    description: 'Send data/image to API',
    description_fr: 'Envoyer données/image vers API',
    category: 'utility',
    library: 'Connectivity',
    pythonClass: 'requests',
    pythonTemplate: `# HTTP Request Logic Injected by Generator`,
    requiredImports: ['requests', 'json', 'base64', 'threading'],
    inputs: 1,
    outputs: 1
  },

  // --- GENAI (VLM & CREATION) ---
  {
    id: 'genai_vlm',
    name: 'VLM Data Extractor',
    name_fr: 'Extracteur VLM',
    type: NodeType.AI,
    description: 'Utilise un VLM (Gemini/GPT-4o) pour extraire des données structurées d\'une image.',
    description_fr: 'Utilise un VLM (Gemini/GPT-4o) pour extraire des données structurées d\'une image.',
    category: 'ai',
    library: 'GenAI',
    pythonClass: 'GenerativeModel',
    pythonTemplate: `
# VLM Data Extractor
# schema = "Pydantic Schema Object"
# response = model.generate_content([image, "Extract data based on schema"])
{output} = {input} # Pass through image for pipeline continuity
# Data output would be handled separately or logged
print("VLM Extraction: [Mock Data]")
`,
    requiredImports: ['cv2'],
    inputs: 1,
    outputs: 1
  },
  {
    id: 'genai_imagen',
    name: 'Image Generator',
    name_fr: 'Générateur d\'Image',
    type: NodeType.AI,
    description: 'Génère une nouvelle image à partir d\'un prompt textuel (T2I).',
    description_fr: 'Génère une nouvelle image à partir d\'un prompt textuel (T2I).',
    category: 'ai',
    library: 'GenAI',
    pythonClass: 'Imagen',
    pythonTemplate: `
# Image Generator (T2I)
# prompt = "Text Prompt"
# {output} = generate_image(prompt)
# Simulation:
{output} = cv2.applyColorMap({input}, cv2.COLORMAP_JET)
cv2.putText({output}, "AI Generated", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
`,
    requiredImports: ['cv2'],
    inputs: 1,
    outputs: 1
  },

  // --- OPENCV ---
  { 
    id: 'cv_blur', 
    name: 'OpenCV Filter', 
    name_fr: 'Filtre OpenCV',
    type: NodeType.PROCESS, 
    description: 'Applique un filtre classique (ex: Gaussian Blur, Canny Edge).', 
    description_fr: 'Applique un filtre classique (ex: Gaussian Blur, Canny Edge).',
    category: 'transform', 
    library: 'OpenCV',
    pythonClass: 'cv2.GaussianBlur',
    pythonTemplate: `{output} = cv2.GaussianBlur({input}, (15, 15), 0)`,
    requiredImports: ['cv2'],
    inputs: 1,
    outputs: 1
  },
  { 
    id: 'cv_canny', 
    name: 'Canny Edge', 
    name_fr: 'Contours Canny',
    type: NodeType.PROCESS, 
    description: 'Detect structural edges', 
    description_fr: 'Détecter les bords structurels',
    category: 'transform', 
    library: 'OpenCV',
    pythonClass: 'cv2.Canny',
    pythonTemplate: `{output} = cv2.Canny({input}, 100, 200)`,
    requiredImports: ['cv2'],
    inputs: 1,
    outputs: 1
  },
  { 
    id: 'cv_gray', 
    name: 'Grayscale', 
    name_fr: 'Niveaux de gris',
    type: NodeType.PROCESS, 
    description: 'Convert BGR to Gray', 
    description_fr: 'Convertir BGR en Gris',
    category: 'transform', 
    library: 'OpenCV',
    pythonClass: 'cv2.cvtColor',
    pythonTemplate: `{output} = cv2.cvtColor({input}, cv2.COLOR_BGR2GRAY)`,
    requiredImports: ['cv2'],
    inputs: 1,
    outputs: 1
  },
  { 
    id: 'cv_flip', 
    name: 'Flip Image', 
    name_fr: 'Miroir',
    type: NodeType.PROCESS, 
    description: 'Mirror horizontally', 
    description_fr: 'Inverser horizontalement',
    category: 'transform', 
    library: 'OpenCV',
    pythonClass: 'cv2.flip',
    pythonTemplate: `{output} = cv2.flip({input}, 1)`,
    requiredImports: ['cv2'],
    inputs: 1,
    outputs: 1
  },
  { 
    id: 'cv_resize', 
    name: 'Resize', 
    name_fr: 'Redimensionner',
    type: NodeType.PROCESS, 
    description: 'Scale down image by half', 
    description_fr: 'Réduire l\'image de moitié',
    category: 'transform', 
    library: 'OpenCV',
    pythonClass: 'cv2.resize',
    pythonTemplate: `{output} = cv2.resize({input}, (0,0), fx=0.5, fy=0.5)`,
    requiredImports: ['cv2'],
    inputs: 1,
    outputs: 1
  },
  { 
    id: 'cv_thresh', 
    name: 'Binary Threshold', 
    name_fr: 'Seuillage Binaire',
    type: NodeType.PROCESS, 
    description: 'Black & White Segmentation', 
    description_fr: 'Segmentation Noir & Blanc',
    category: 'transform', 
    library: 'OpenCV',
    pythonClass: 'cv2.threshold',
    pythonTemplate: `_, {output} = cv2.threshold({input}, 127, 255, cv2.THRESH_BINARY)`,
    requiredImports: ['cv2'],
    inputs: 1,
    outputs: 1
  },
  { 
    id: 'cv_hsv', 
    name: 'To HSV Color', 
    name_fr: 'Vers HSV',
    type: NodeType.PROCESS, 
    description: 'Convert BGR to HSV', 
    description_fr: 'Convertir BGR vers HSV',
    category: 'transform', 
    library: 'OpenCV',
    pythonClass: 'cv2.cvtColor',
    pythonTemplate: `{output} = cv2.cvtColor({input}, cv2.COLOR_BGR2HSV)`,
    requiredImports: ['cv2'],
    inputs: 1,
    outputs: 1
  },
  { 
    id: 'cv_erode', 
    name: 'Erode', 
    name_fr: 'Érosion',
    type: NodeType.PROCESS, 
    description: 'Erode away boundaries', 
    description_fr: 'Éroder les frontières',
    category: 'transform', 
    library: 'OpenCV',
    pythonClass: 'cv2.erode',
    pythonTemplate: `kernel = np.ones((5,5),np.uint8)\n{output} = cv2.erode({input}, kernel, iterations = 1)`,
    requiredImports: ['cv2', 'numpy as np'],
    inputs: 1,
    outputs: 1
  },
    { 
    id: 'cv_dilate', 
    name: 'Dilate', 
    name_fr: 'Dilatation',
    type: NodeType.PROCESS, 
    description: 'Expand boundaries', 
    description_fr: 'Étendre les frontières',
    category: 'transform', 
    library: 'OpenCV',
    pythonClass: 'cv2.dilate',
    pythonTemplate: `kernel = np.ones((5,5),np.uint8)\n{output} = cv2.dilate({input}, kernel, iterations = 1)`,
    requiredImports: ['cv2', 'numpy as np'],
    inputs: 1,
    outputs: 1
  },

  // --- MEDIAPIPE ---
  { 
    id: 'mp_hands', 
    name: 'Hand Tracking', 
    name_fr: 'Suivi des Mains',
    type: NodeType.AI, 
    description: 'Detect hand skeleton 21 points', 
    description_fr: 'Détecte 21 points du squelette de la main',
    category: 'ai', 
    library: 'MediaPipe',
    pythonClass: 'mp.solutions.hands',
    pythonTemplate: `
# Setup
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(min_detection_confidence=0.5, min_tracking_confidence=0.5)
mp_draw = mp.solutions.drawing_utils

# Process
{output} = {input}.copy()
results = hands.process(cv2.cvtColor({input}, cv2.COLOR_BGR2RGB))
if results.multi_hand_landmarks:
    for hand_landmarks in results.multi_hand_landmarks:
        mp_draw.draw_landmarks({output}, hand_landmarks, mp_hands.HAND_CONNECTIONS)`,
    requiredImports: ['cv2', 'mediapipe as mp'],
    inputs: 1,
    outputs: 1
  },
  { 
    id: 'mp_pose', 
    name: 'Pose Estimation', 
    name_fr: 'Estimation de Pose',
    type: NodeType.AI, 
    description: 'Full body 33 landmarks', 
    description_fr: 'Détecte 33 points du corps entier',
    category: 'ai', 
    library: 'MediaPipe',
    pythonClass: 'mp.solutions.pose',
    pythonTemplate: `
# Setup
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_draw = mp.solutions.drawing_utils

# Process
{output} = {input}.copy()
results = pose.process(cv2.cvtColor({input}, cv2.COLOR_BGR2RGB))
if results.pose_landmarks:
    mp_draw.draw_landmarks({output}, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)`,
    requiredImports: ['cv2', 'mediapipe as mp'],
    inputs: 1,
    outputs: 1
  },
  { 
    id: 'mp_face', 
    name: 'Face Mesh', 
    name_fr: 'Maillage Visage',
    type: NodeType.AI, 
    description: '468 Face Landmarks', 
    description_fr: '468 points de repère du visage',
    category: 'ai', 
    library: 'MediaPipe',
    pythonClass: 'mp.solutions.face_mesh',
    pythonTemplate: `
# Setup
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(max_num_faces=1)
mp_draw = mp.solutions.drawing_utils

# Process
{output} = {input}.copy()
results = face_mesh.process(cv2.cvtColor({input}, cv2.COLOR_BGR2RGB))
if results.multi_face_landmarks:
    for face_landmarks in results.multi_face_landmarks:
        mp_draw.draw_landmarks({output}, face_landmarks, mp_face_mesh.FACEMESH_TESSELATION)`,
    requiredImports: ['cv2', 'mediapipe as mp'],
    inputs: 1,
    outputs: 1
  },
];

const generateChallenges = () => {
  const challenges: Challenge[] = [];
  const difficulties = ['Easy', 'Medium', 'Hard'] as const;
  const themes = ['Basic', 'Tracking', 'Segmentation', 'Optimization', 'Creative'] as const;

  // Manual Definitions for first few to ensure quality
  const bases = [
     { title: "Basic Filter", title_fr: "Filtre Basique", diff: "Easy", theme: "Basic", desc: "Apply a Gaussian Blur.", desc_fr: "Appliquer un flou gaussien." },
     { title: "Edge Detection", title_fr: "Détection de Bords", diff: "Easy", theme: "Basic", desc: "Detect edges using Canny.", desc_fr: "Détecter les bords avec Canny." },
     { title: "Grayscale Video", title_fr: "Vidéo Niveaux de Gris", diff: "Easy", theme: "Basic", desc: "Convert video stream to grayscale.", desc_fr: "Convertir le flux en niveaux de gris." },
     { title: "Flip Mirror", title_fr: "Miroir", diff: "Easy", theme: "Basic", desc: "Create a mirror effect.", desc_fr: "Créer un effet miroir." },
     { title: "Hand Tracking", title_fr: "Suivi Main", diff: "Easy", theme: "Tracking", desc: "Visualize hand landmarks.", desc_fr: "Visualiser les points de la main." },
     { title: "Simple Threshold", title_fr: "Seuillage Simple", diff: "Easy", theme: "Segmentation", desc: "Separate foreground with threshold.", desc_fr: "Séparer l'avant-plan avec un seuil." },
     { title: "Fast Resize", title_fr: "Redimension Rapide", diff: "Easy", theme: "Optimization", desc: "Downscale image for speed.", desc_fr: "Réduire l'image pour la vitesse." },
     { title: "Color Pop", title_fr: "Pop Couleur", diff: "Easy", theme: "Creative", desc: "Convert to HSV.", desc_fr: "Convertir en HSV." },
     { title: "Erode Noise", title_fr: "Éroder le Bruit", diff: "Easy", theme: "Segmentation", desc: "Use erosion to remove noise.", desc_fr: "Utiliser l'érosion pour le bruit." },
     { title: "Binary Mask", title_fr: "Masque Binaire", diff: "Easy", theme: "Segmentation", desc: "Create a binary mask.", desc_fr: "Créer un masque binaire." },

     { title: "Stabilisation Vidéo", title_fr: "Stabilisation Vidéo", diff: "Medium", theme: "Tracking", desc: "Reduce camera shake.", desc_fr: "Réduire les tremblements." },
     { title: "Segmentation Bruitée", title_fr: "Segmentation Bruitée", diff: "Medium", theme: "Segmentation", desc: "Clean masks morphologically.", desc_fr: "Nettoyer les masques morphologiquement." },
     { title: "Face & Hands", title_fr: "Visage & Mains", diff: "Medium", theme: "Tracking", desc: "Track both simultaneously.", desc_fr: "Suivre les deux simultanément." },
     { title: "Skin Detection", title_fr: "Détection Peau", diff: "Medium", theme: "Segmentation", desc: "Segment skin using HSV.", desc_fr: "Segmenter la peau via HSV." },
     { title: "Motion Blur", title_fr: "Flou de Mouvement", diff: "Medium", theme: "Creative", desc: "Simulate motion blur.", desc_fr: "Simuler un flou de mouvement." },
     { title: "Background Remove", title_fr: "Suppression Fond", diff: "Medium", theme: "Segmentation", desc: "Remove background roughly.", desc_fr: "Supprimer grossièrement le fond." },
     { title: "FPS Optimizer", title_fr: "Optimiseur FPS", diff: "Medium", theme: "Optimization", desc: "Maintain >30FPS with blur.", desc_fr: "Maintenir >30FPS avec flou." },
     { title: "Cyberpunk Filter", title_fr: "Filtre Cyberpunk", diff: "Medium", theme: "Creative", desc: "Apply cool color transforms.", desc_fr: "Appliquer des couleurs froides." },
     { title: "Dilation Fix", title_fr: "Correction Dilatation", diff: "Medium", theme: "Segmentation", desc: "Close gaps in edges.", desc_fr: "Fermer les trous dans les bords." },
     { title: "Pipeline Lag", title_fr: "Lag Pipeline", diff: "Medium", theme: "Optimization", desc: "Fix a laggy pipeline.", desc_fr: "Réparer un pipeline lent." },

     { title: "Tracking Optimisé", title_fr: "Suivi Optimisé", diff: "Hard", theme: "Tracking", desc: "Persist ID on occlusion.", desc_fr: "Garder l'ID après occlusion." },
     { title: "Super Resolution", title_fr: "Super Résolution", diff: "Hard", theme: "Optimization", desc: "Upscale using DNN.", desc_fr: "Agrandir avec DNN." },
     { title: "Gesture Control", title_fr: "Contrôle Gestuel", diff: "Hard", theme: "Creative", desc: "Control params with hands.", desc_fr: "Contrôler params avec mains." },
     { title: "Invisible Cloak", title_fr: "Cape Invisibilité", diff: "Hard", theme: "Creative", desc: "Harry Potter effect.", desc_fr: "Effet Harry Potter." },
     { title: "Lane Detection", title_fr: "Détection Voies", diff: "Hard", theme: "Tracking", desc: "Detect road lanes.", desc_fr: "Détecter les voies de route." },
     { title: "Multi-Person Pose", title_fr: "Pose Multi-Perso", diff: "Hard", theme: "Tracking", desc: "Track multiple skeletons.", desc_fr: "Suivre plusieurs squelettes." },
     { title: "Realtime HDR", title_fr: "HDR Temps Réel", diff: "Hard", theme: "Creative", desc: "Simulate HDR effect.", desc_fr: "Simuler effet HDR." },
     { title: "Object Counter", title_fr: "Compteur Objets", diff: "Hard", theme: "Basic", desc: "Count objects passing line.", desc_fr: "Compter objets passant ligne." },
     { title: "Privacy Blur", title_fr: "Flou Vie Privée", diff: "Hard", theme: "Segmentation", desc: "Blur only faces.", desc_fr: "Flouter seulement les visages." },
     { title: "Thread Master", title_fr: "Maître des Threads", diff: "Hard", theme: "Optimization", desc: "Complex threaded pipeline.", desc_fr: "Pipeline threadé complexe." }
  ];

  bases.forEach((b, i) => {
    challenges.push({
        id: `ch_${i}`,
        title: b.title,
        title_fr: b.title_fr,
        difficulty: b.diff as any,
        theme: b.theme as any,
        description: b.desc,
        description_fr: b.desc_fr,
        objectives: ["Build valid pipeline", "Achieve goal", "Optimize FPS"],
        objectives_fr: ["Construire un pipeline valide", "Atteindre l'objectif", "Optimiser FPS"],
        locked: i > 25 
    });
  });

  return challenges;
};

export const CHALLENGES: Challenge[] = generateChallenges();
