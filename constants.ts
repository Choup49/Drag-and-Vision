
import { Challenge, NodeDefinition, NodeType } from './types';

export const TRANSLATIONS = {
  en: {
    studio: 'Pipeline Studio',
    createNode: 'Create Node',
    challenges: 'Challenges',
    corrector: 'Code Optimizer',
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
    correctorTitle: 'Code Optimizer',
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
    apiConfig: 'API Node Configuration',
    url: 'Endpoint URL',
    method: 'Method',
    headers: 'Headers',
    addHeader: 'Add Header',
    key: 'Key',
    value: 'Value',
    sendImage: 'Send Image (Base64)',
    resize: 'Resize Width (px)',
    asyncMode: 'Async Mode (Non-blocking)',
    saveConfig: 'Save Configuration',
    connectivity: 'Connectivity',
    genai: 'GenAI / VLM',
    optPreference: 'Optimization Preference',
    quality: 'Max Quality (Accuracy)',
    speed: 'Max FPS (Speed)',
    balanced: 'Balanced (50/50)',
    droidCamConfig: 'DroidCam Configuration',
    ipAddress: 'IP Address',
    port: 'Port',
    droidCamHelp: 'Use the DroidCam app on your phone. Enter the IP/Port shown.',
    onnxConfig: 'ONNX Model Configuration',
    modelPath: 'Model File Path (.onnx)',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit Fullscreen',
    logic: 'Logic Nodes',
    logic_selector: 'Item Selector',
    logic_math: 'Math Operator',
    logic_dist: 'Measure Distance',
    logic_check: 'Logic Check',
    logic_counter: 'Event Counter',
    logic_input_key: 'Input Key',
    logic_output_key: 'Output Key',
    logic_index: 'Item Index',
    logic_threshold: 'Threshold',
    logic_comparator: 'Comparator',
    logic_op: 'Operation',
  },
  fr: {
    studio: 'Studio Pipeline',
    createNode: 'Créer un Node',
    challenges: 'Défis',
    corrector: 'Optimiseur de Code',
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
    correctorTitle: 'Optimiseur de Code',
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
    optPreference: 'Préférence d\'Optimisation',
    quality: 'Qualité Max (Précision)',
    speed: 'FPS Max (Vitesse)',
    balanced: 'Équilibré (50/50)',
    droidCamConfig: 'Configuration DroidCam',
    ipAddress: 'Adresse IP',
    port: 'Port',
    droidCamHelp: 'Utilisez l\'app DroidCam sur votre téléphone. Entrez l\'IP/Port affiché.',
    onnxConfig: 'Configuration Modèle ONNX',
    modelPath: 'Chemin du fichier (.onnx)',
    fullscreen: 'Plein Écran',
    exitFullscreen: 'Quitter Plein Écran',
    logic: 'Nodes Logiques',
    logic_selector: 'Sélecteur d\'Élément',
    logic_math: 'Opérateur Math',
    logic_dist: 'Mesure Distance',
    logic_check: 'Test Logique',
    logic_counter: 'Compteur d\'Événements',
    logic_input_key: 'Clé Entrée',
    logic_output_key: 'Clé Sortie',
    logic_index: 'Index Elément',
    logic_threshold: 'Seuil',
    logic_comparator: 'Comparateur',
    logic_op: 'Opération',
  }
};

export const AVAILABLE_NODES: NodeDefinition[] = [
  // --- SOURCES ---
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
# Process
ret, {output} = cap.read()
if not ret: break`,
    requiredImports: ['cv2'],
    inputs: 0,
    outputs: 1
  },
  { 
    id: 'src_droidcam', 
    name: 'DroidCam', 
    name_fr: 'DroidCam',
    type: NodeType.SOURCE, 
    description: 'Connect via IP/Wifi', 
    description_fr: 'Connecter via IP/Wifi',
    category: 'input',
    library: 'Core',
    pythonClass: 'cv2.VideoCapture',
    pythonTemplate: `
# Setup
cap = cv2.VideoCapture("http://{ip}:{port}/video")
# Process
ret, {output} = cap.read()
if not ret: break`,
    requiredImports: ['cv2'],
    inputs: 0,
    outputs: 1
  },

  // --- LOGIC PACK ---
  {
    id: 'logic_selector',
    name: 'Item Selector',
    name_fr: 'Sélecteur d\'Élément',
    type: NodeType.UTILITY,
    description: 'Extract specific item from a list (e.g. Landmark 8)',
    description_fr: 'Extraire un élément d\'une liste (ex: Landmark n°8)',
    category: 'logic',
    library: 'Logic',
    pythonClass: 'ItemSelector',
    pythonTemplate: `
if '{inputKey}' in pipeline_data and pipeline_data['{inputKey}'] is not None:
    try:
        pipeline_data['{outputKey}'] = pipeline_data['{inputKey}'][{index}]
    except:
        pass
{output} = {input}`,
    inputs: 1,
    outputs: 1
  },
  {
    id: 'logic_dist',
    name: 'Measure Distance',
    name_fr: 'Mesure Distance',
    type: NodeType.UTILITY,
    description: 'Euclidean distance between two points',
    description_fr: 'Distance Euclidienne entre deux points',
    category: 'logic',
    library: 'Logic',
    pythonClass: 'MeasureDistance',
    pythonTemplate: `
if '{keyA}' in pipeline_data and '{keyB}' in pipeline_data:
    pa = pipeline_data['{keyA}']
    pb = pipeline_data['{keyB}']
    if hasattr(pa, 'x') and hasattr(pb, 'x'): # MediaPipe Object
        dist = np.linalg.norm(np.array([pa.x, pa.y]) - np.array([pb.x, pb.y]))
    else: # Generic List/Array
        dist = np.linalg.norm(np.array(pa[:2]) - np.array(pb[:2]))
    pipeline_data['{outputKey}'] = dist
{output} = {input}`,
    inputs: 1,
    outputs: 1
  },
  {
    id: 'logic_math',
    name: 'Math Operator',
    name_fr: 'Opérateur Math',
    type: NodeType.UTILITY,
    description: 'Basic arithmetic on data packet values',
    description_fr: 'Arithmétique de base sur les données',
    category: 'logic',
    library: 'Logic',
    pythonClass: 'MathOperator',
    pythonTemplate: `
if '{keyA}' in pipeline_data and '{keyB}' in pipeline_data:
    a, b = pipeline_data['{keyA}'], pipeline_data['{keyB}']
    if '{op}' == 'add': res = a + b
    elif '{op}' == 'sub': res = a - b
    elif '{op}' == 'mul': res = a * b
    elif '{op}' == 'div': res = a / b if b != 0 else 0
    pipeline_data['{outputKey}'] = res
{output} = {input}`,
    inputs: 1,
    outputs: 1
  },
  {
    id: 'logic_check',
    name: 'Logic Check',
    name_fr: 'Test Logique',
    type: NodeType.UTILITY,
    description: 'Compare value against threshold',
    description_fr: 'Comparer une valeur à un seuil',
    category: 'logic',
    library: 'Logic',
    pythonClass: 'LogicCheck',
    pythonTemplate: `
if '{inputKey}' in pipeline_data:
    val = pipeline_data['{inputKey}']
    res = False
    if '{comp}' == '>': res = val > {thresh}
    elif '{comp}' == '<': res = val < {thresh}
    elif '{comp}' == '==': res = val == {thresh}
    elif '{comp}' == '!=': res = val != {thresh}
    pipeline_data['{outputKey}'] = res
{output} = {input}`,
    inputs: 1,
    outputs: 1
  },
  {
    id: 'logic_counter',
    name: 'Event Counter',
    name_fr: 'Compteur d\'Événements',
    type: NodeType.UTILITY,
    description: 'Count transitions from False to True',
    description_fr: 'Compte les passages de Faux à Vrai (front montant)',
    category: 'logic',
    library: 'Logic',
    pythonClass: 'EventCounter',
    pythonTemplate: `
# Setup_{id}
counter_{id} = 0
last_state_{id} = False

# Process
if '{triggerKey}' in pipeline_data:
    current = pipeline_data['{triggerKey}']
    if current and not last_state_{id}:
        counter_{id} += 1
    last_state_{id} = current
    pipeline_data['{outputKey}'] = counter_{id}
    cv2.putText({output}, f"Count: {counter_{id}}", (50, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)
{output} = {input}`,
    inputs: 1,
    outputs: 1
  },

  // --- MEDIAPIPE ---
  {
    id: 'mp_hands',
    name: 'Hand Tracking',
    name_fr: 'Suivi des Mains',
    type: NodeType.AI,
    description: 'Detect hand landmarks with MediaPipe',
    description_fr: 'Détecter les mains avec MediaPipe',
    category: 'ai',
    library: 'MediaPipe',
    pythonClass: 'mp.solutions.hands',
    pythonTemplate: `
# Setup
import mediapipe as mp
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.5)
mp_draw = mp.solutions.drawing_utils

# Process
{output} = {input}.copy()
results = hands.process(cv2.cvtColor({input}, cv2.COLOR_BGR2RGB))
if results.multi_hand_landmarks:
    pipeline_data['hand_landmarks'] = results.multi_hand_landmarks[0].landmark
    for hand_lms in results.multi_hand_landmarks:
        mp_draw.draw_landmarks({output}, hand_lms, mp_hands.HAND_CONNECTIONS)
else:
    pipeline_data['hand_landmarks'] = None`,
    requiredImports: ['cv2', 'mediapipe as mp'],
    inputs: 1,
    outputs: 1
  },

  // --- OUTPUTS ---
  { 
    id: 'out_screen', 
    name: 'Display Window', 
    name_fr: 'Fenêtre Affichage',
    type: NodeType.OUTPUT, 
    description: 'Show result in a window', 
    description_fr: 'Afficher dans une fenêtre',
    category: 'output',
    library: 'Core',
    pythonClass: 'cv2.imshow',
    pythonTemplate: `cv2.imshow("PyVision Output", {input})`,
    requiredImports: ['cv2'],
    inputs: 1,
    outputs: 0
  }
];

export const CHALLENGES: Challenge[] = [
  {
    id: 'ch_squats',
    title: 'Squat Counter',
    title_fr: 'Compteur de Squats',
    difficulty: 'Medium',
    theme: 'Tracking',
    description: 'Use Pose Tracking and Logic nodes to count repetitions of squats.',
    description_fr: 'Utilisez le suivi de pose et les nodes logiques pour compter les squats.',
    objectives: ['Detect pose landmarks', 'Measure distance between hip and knee', 'Trigger counter when below threshold'],
    objectives_fr: ['Détecter la pose', 'Mesurer distance hanche-genou', 'Incrémenter quand on descend'],
    locked: false
  }
];

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
  }
];
