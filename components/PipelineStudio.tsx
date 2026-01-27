
import React, { useState, useRef, useEffect } from 'react';
import { AVAILABLE_NODES, TRANSLATIONS, MOCK_COMMUNITY_NODES } from '../constants';
import { PipelineNode, PipelineConnection, NodeType, NodeDefinition, Position, Language, OptimizerConfig, Challenge, ApiConfig, DroidCamConfig, OnnxConfig, LogicConfig } from '../types';
import { Plus, Trash2, Download, X, Zap, Move, FileVideo, Camera, Cpu, Box, Layers, ZoomIn, ZoomOut, RotateCcw, Info, Settings2, CheckCircle, AlertCircle, Play, Map, Globe, DownloadCloud, Eye, Network, Sparkles, Brain, Gauge, ImageIcon, Wifi, UploadCloud, Loader2, Binary } from 'lucide-react';
import { validateChallengeSolution, parsePythonToPipeline } from '../services/geminiService';

const GRID_SIZE = 20;

interface PipelineStudioProps {
    customNodes: NodeDefinition[];
    language: Language;
    activeChallenge?: Challenge | null;
    onExitChallenge?: () => void;
    onImportCommunityNode?: (node: NodeDefinition) => void;
    onChallengeComplete?: (challengeId: string) => void;
}

interface NodeConfigModalProps {
    node: PipelineNode;
    language: Language;
    onClose: () => void;
    onSave: (nodeId: string, params: any) => void;
}

const NodeConfigModal: React.FC<NodeConfigModalProps> = ({ node, language, onClose, onSave }) => {
    const t = TRANSLATIONS[language];
    
    // API Config State
    const [apiConfig, setApiConfig] = useState<ApiConfig>(node.params.apiConfig || {
        url: 'http://localhost:5000/api',
        method: 'POST',
        headers: [],
        timeout: 5,
        sendImage: false,
        imageResizeWidth: 640,
        asyncMode: true
    });
    
    // DroidCam Config State
    const [droidCamConfig, setDroidCamConfig] = useState<DroidCamConfig>(node.params.droidCam || {
        ip: '192.168.1.10',
        port: '4747'
    });

    // ONNX Config State
    const [onnxConfig, setOnnxConfig] = useState<OnnxConfig>(node.params.onnx || {
        modelPath: 'model.onnx'
    });

    // Logic Config State
    const [logicConfig, setLogicConfig] = useState<LogicConfig>(node.params.logic || {
        inputKey: 'hand_landmarks',
        inputKeyA: 'point_a',
        inputKeyB: 'point_b',
        index: 8,
        operation: 'add',
        comparator: '>',
        threshold: 0.5,
        outputKey: 'result_val',
        triggerKey: 'is_active'
    });

    const [newHeaderKey, setNewHeaderKey] = useState('');
    const [newHeaderVal, setNewHeaderVal] = useState('');

    const addHeader = () => {
        if (!newHeaderKey || !newHeaderVal) return;
        setApiConfig(c => ({
            ...c,
            headers: [...c.headers, { id: crypto.randomUUID(), key: newHeaderKey, value: newHeaderVal, isSecret: false }]
        }));
        setNewHeaderKey('');
        setNewHeaderVal('');
    };

    const removeHeader = (id: string) => {
        setApiConfig(c => ({ ...c, headers: c.headers.filter(h => h.id !== id) }));
    };

    const handleSave = () => {
        const params: any = { ...node.params };
        if (node.defId === 'net_http') params.apiConfig = apiConfig;
        if (node.defId === 'src_droidcam') params.droidCam = droidCamConfig;
        if (node.defId === 'comm_onnx') params.onnx = onnxConfig;
        if (node.defId.startsWith('logic_')) params.logic = logicConfig;
        onSave(node.uuid, params);
        onClose();
    };
    
    const isApiNode = node.defId === 'net_http';
    const isDroidCamNode = node.defId === 'src_droidcam';
    const isOnnxNode = node.defId === 'comm_onnx';
    const isLogicNode = node.defId.startsWith('logic_');

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-xl w-full max-w-lg border border-slate-700 shadow-2xl p-6 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        {isApiNode ? <Network className="w-5 h-5 text-cyan-400" /> : isLogicNode ? <Binary className="w-5 h-5 text-purple-400" /> : <Settings2 className="w-5 h-5 text-cyan-400" />} 
                        {isApiNode ? t.apiConfig : isDroidCamNode ? t.droidCamConfig : isOnnxNode ? t.onnxConfig : isLogicNode ? t.logic : t.settings}
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                    {isDroidCamNode && (
                        <div className="space-y-4">
                            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-4">
                                <div className="flex items-start gap-3">
                                    <Wifi className="w-5 h-5 text-cyan-400 mt-1" />
                                    <p className="text-sm text-slate-300">{t.droidCamHelp}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.ipAddress}</label>
                                <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none font-mono" value={droidCamConfig.ip} onChange={(e) => setDroidCamConfig({...droidCamConfig, ip: e.target.value})} placeholder="192.168.x.x" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.port}</label>
                                <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none font-mono" value={droidCamConfig.port} onChange={(e) => setDroidCamConfig({...droidCamConfig, port: e.target.value})} placeholder="4747" />
                            </div>
                        </div>
                    )}

                    {isOnnxNode && (
                        <div className="space-y-4">
                             <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.modelPath}</label>
                                <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none font-mono" value={onnxConfig.modelPath} onChange={(e) => setOnnxConfig({...onnxConfig, modelPath: e.target.value})} placeholder="path/to/model.onnx" />
                            </div>
                        </div>
                    )}

                    {isLogicNode && (
                        <div className="space-y-4">
                            {/* Input Keys */}
                            {node.defId !== 'logic_math' && node.defId !== 'logic_dist' && node.defId !== 'logic_counter' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.logic_input_key}</label>
                                    <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white font-mono" value={logicConfig.inputKey} onChange={(e) => setLogicConfig({...logicConfig, inputKey: e.target.value})} />
                                </div>
                            )}

                            {(node.defId === 'logic_math' || node.defId === 'logic_dist') && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.logic_input_key} A</label>
                                        <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white font-mono" value={logicConfig.inputKeyA} onChange={(e) => setLogicConfig({...logicConfig, inputKeyA: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.logic_input_key} B</label>
                                        <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white font-mono" value={logicConfig.inputKeyB} onChange={(e) => setLogicConfig({...logicConfig, inputKeyB: e.target.value})} />
                                    </div>
                                </div>
                            )}

                            {node.defId === 'logic_counter' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Trigger Key (Bool)</label>
                                    <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white font-mono" value={logicConfig.triggerKey} onChange={(e) => setLogicConfig({...logicConfig, triggerKey: e.target.value})} />
                                </div>
                            )}

                            {/* Node Specific Params */}
                            {node.defId === 'logic_selector' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.logic_index}</label>
                                    <input type="number" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" value={logicConfig.index} onChange={(e) => setLogicConfig({...logicConfig, index: parseInt(e.target.value)})} />
                                </div>
                            )}

                            {node.defId === 'logic_math' && (
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.logic_op}</label>
                                    <select className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" value={logicConfig.operation} onChange={(e) => setLogicConfig({...logicConfig, operation: e.target.value as any})}>
                                        <option value="add">Add (+)</option>
                                        <option value="sub">Subtract (-)</option>
                                        <option value="mul">Multiply (*)</option>
                                        <option value="div">Divide (/)</option>
                                    </select>
                                </div>
                            )}

                            {node.defId === 'logic_check' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.logic_comparator}</label>
                                        <select className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" value={logicConfig.comparator} onChange={(e) => setLogicConfig({...logicConfig, comparator: e.target.value as any})}>
                                            <option value=">">&gt;</option>
                                            <option value="<">&lt;</option>
                                            <option value="==">==</option>
                                            <option value="!=">!=</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.logic_threshold}</label>
                                        <input type="number" step="0.1" className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white" value={logicConfig.threshold} onChange={(e) => setLogicConfig({...logicConfig, threshold: parseFloat(e.target.value)})} />
                                    </div>
                                </div>
                            )}

                            {/* Output Key */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.logic_output_key}</label>
                                <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white font-mono" value={logicConfig.outputKey} onChange={(e) => setLogicConfig({...logicConfig, outputKey: e.target.value})} />
                            </div>
                        </div>
                    )}

                    {isApiNode && (
                        <>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="col-span-3">
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.url}</label>
                                <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none" value={apiConfig.url} onChange={(e) => setApiConfig({...apiConfig, url: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.method}</label>
                                <select className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none" value={apiConfig.method} onChange={(e) => setApiConfig({...apiConfig, method: e.target.value as any})}><option>POST</option><option>GET</option><option>PUT</option></select>
                            </div>
                        </div>
                        <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                             <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.headers}</label>
                             <div className="space-y-2 mb-3">
                                 {apiConfig.headers.map(h => (
                                     <div key={h.id} className="flex items-center gap-2 text-sm">
                                         <span className="font-mono text-cyan-400 bg-slate-900 px-2 py-1 rounded border border-slate-700">{h.key}</span>
                                         <span className="text-slate-400">=</span>
                                         <span className="font-mono text-slate-300 truncate max-w-[120px]">{h.isSecret ? '••••••' : h.value}</span>
                                         <button onClick={() => removeHeader(h.id)} className="ml-auto text-red-400 hover:text-red-300"><X className="w-3 h-3"/></button>
                                     </div>
                                 ))}
                             </div>
                             <div className="flex gap-2">
                                 <input placeholder={t.key} className="flex-1 bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white" value={newHeaderKey} onChange={e => setNewHeaderKey(e.target.value)} />
                                 <input placeholder={t.value} type="password" className="flex-1 bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-white" value={newHeaderVal} onChange={e => setNewHeaderVal(e.target.value)} />
                                 <button onClick={addHeader} className="bg-cyan-600 text-white px-2 rounded hover:bg-cyan-500 text-xs font-bold">{t.addHeader}</button>
                             </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <label className="flex items-center gap-3 p-3 bg-slate-800/30 rounded border border-slate-800 cursor-pointer hover:border-cyan-500/50">
                                <input type="checkbox" checked={apiConfig.sendImage} onChange={(e) => setApiConfig({...apiConfig, sendImage: e.target.checked})} className="w-4 h-4 rounded border-slate-600 text-cyan-600 bg-slate-900" />
                                <span className="text-sm font-medium text-slate-300">{t.sendImage}</span>
                            </label>
                             <label className="flex items-center gap-3 p-3 bg-slate-800/30 rounded border border-slate-800 cursor-pointer hover:border-cyan-500/50">
                                <input type="checkbox" checked={apiConfig.asyncMode} onChange={(e) => setApiConfig({...apiConfig, asyncMode: e.target.checked})} className="w-4 h-4 rounded border-slate-600 text-cyan-600 bg-slate-900" />
                                <span className="text-sm font-medium text-slate-300">{t.asyncMode}</span>
                            </label>
                        </div>
                        </>
                    )}
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400 hover:text-white font-medium">Cancel</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-bold shadow-lg shadow-cyan-500/20">{t.saveConfig}</button>
                </div>
            </div>
        </div>
    );
};


const PipelineStudio: React.FC<PipelineStudioProps> = ({ customNodes, language, activeChallenge, onExitChallenge, onImportCommunityNode, onChallengeComplete }) => {
  const [nodes, setNodes] = useState<PipelineNode[]>([]);
  const [connections, setConnections] = useState<PipelineConnection[]>([]);
  const [selectedLibrary, setSelectedLibrary] = useState<string>('Core');
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  
  const [configNodeId, setConfigNodeId] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [importCode, setImportCode] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState<Position>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Position>({ x: 0, y: 0 });
  
  const allNodes = [...AVAILABLE_NODES, ...customNodes];
  const t = TRANSLATIONS[language];

  const [linkingSourceId, setLinkingSourceId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });

  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<{success: boolean, message: string, hint?: string} | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY * 0.001;
    setZoom(z => Math.min(Math.max(z + delta, 0.2), 3.0));
  };

  const handleZoom = (delta: number) => {
    setZoom(prev => Math.min(Math.max(prev + delta, 0.2), 3.0));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      if (e.target === e.currentTarget) {
          setIsPanning(true);
          setPanStart({ x: e.clientX, y: e.clientY });
      }
  };

  const addNode = (defId: string) => {
    const rect = containerRef.current?.getBoundingClientRect();
    const centerX = rect ? (rect.width / 2 - pan.x) / zoom : 200;
    const centerY = rect ? (rect.height / 2 - pan.y) / zoom : 200;

    const newNode: PipelineNode = {
      uuid: crypto.randomUUID(),
      defId,
      position: { x: centerX - 90 + (Math.random() * 40), y: centerY - 40 + (Math.random() * 40) },
      params: {}
    };
    setNodes([...nodes, newNode]);
  };

  const removeNode = (uuid: string) => {
    setNodes(nodes.filter(n => n.uuid !== uuid));
    setConnections(connections.filter(c => c.sourceNodeId !== uuid && c.targetNodeId !== uuid));
  };

  const updateNodeParams = (uuid: string, newParams: any) => {
      setNodes(nodes.map(n => n.uuid === uuid ? { ...n, params: { ...n.params, ...newParams } } : n));
  };

  const getNodeDef = (defId: string) => allNodes.find(n => n.id === defId) || MOCK_COMMUNITY_NODES.find(n => n.id === defId);

  const handleMouseDown = (e: React.MouseEvent, uuid: string) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    const node = nodes.find(n => n.uuid === uuid);
    if (node) {
        setDraggingNode(uuid);
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const mouseX = (e.clientX - rect.left - pan.x) / zoom;
            const mouseY = (e.clientY - rect.top - pan.y) / zoom;
            setDragOffset({ x: mouseX - node.position.x, y: mouseY - node.position.y });
        }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        if (isPanning) {
            const dx = e.clientX - panStart.x;
            const dy = e.clientY - panStart.y;
            setPan(p => ({ x: p.x + dx, y: p.y + dy }));
            setPanStart({ x: e.clientX, y: e.clientY });
            return;
        }
        const x = (e.clientX - rect.left - pan.x) / zoom;
        const y = (e.clientY - rect.top - pan.y) / zoom;
        setMousePos({ x, y });
        if (draggingNode) {
            setNodes(nodes.map(n => n.uuid === draggingNode ? { ...n, position: { x: x - dragOffset.x, y: y - dragOffset.y } } : n));
        }
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
    setLinkingSourceId(null);
    setIsPanning(false);
  };

  const startConnection = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    setLinkingSourceId(nodeId);
  };

  const completeConnection = (e: React.MouseEvent, targetNodeId: string) => {
    e.stopPropagation();
    if (e.button !== 0) return;
    if (linkingSourceId && linkingSourceId !== targetNodeId) {
        const exists = connections.some(c => c.sourceNodeId === linkingSourceId && c.targetNodeId === targetNodeId);
        if (!exists) {
             const targetNode = nodes.find(n => n.uuid === targetNodeId);
             const targetDef = targetNode ? getNodeDef(targetNode.defId) : null;
             if (targetDef && targetDef.inputs > 0) {
                 setConnections([...connections, { id: crypto.randomUUID(), sourceNodeId: linkingSourceId, targetNodeId }]);
             }
        }
    }
    setLinkingSourceId(null);
  };

  const deleteConnection = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setConnections(connections.filter(c => c.id !== id));
  };

  const generatePython = () => {
    let code = `import cv2\nimport numpy as np\n`;
    const hasApiNode = nodes.some(n => n.defId === 'net_http');
    if (hasApiNode) code += `import requests\nimport json\nimport base64\nimport threading\n`;

    const imports = new Set<string>();
    nodes.forEach(n => getNodeDef(n.defId)?.requiredImports?.forEach(imp => imports.add(imp)));
    imports.forEach(imp => {
        if (!code.includes(`import ${imp}`)) {
            if (imp.includes(' as ')) code += `import ${imp}\n`;
            else if (!['cv2', 'numpy', 'requests', 'json', 'base64', 'threading'].includes(imp)) code += `import ${imp}\n`;
        }
    });

    if (hasApiNode) {
        code += `\n# --- API HELPER ---\ndef send_api_request(url, method, headers, payload):\n    try:\n        if method == 'POST': requests.post(url, json=payload, headers=headers, timeout=5)\n        elif method == 'GET': requests.get(url, params=payload, headers=headers, timeout=5)\n        elif method == 'PUT': requests.put(url, json=payload, headers=headers, timeout=5)\n    except Exception as e: print(f"API Error: {e}")\n`;
    }

    code += `\n# --- PIPELINE SETUP ---\npipeline_data = {}\n`;

    const sourceNodes = nodes.filter(n => getNodeDef(n.defId)?.type === NodeType.SOURCE);
    if (sourceNodes.length === 0) { setGeneratedCode("# Error: No Source Node found."); setShowCode(true); return; }

    const mainSource = sourceNodes[0];
    const queue: string[] = [mainSource.uuid];
    const visited = new Set<string>();
    const executionOrder: string[] = [];

    while (queue.length > 0) {
        const currentId = queue.shift()!;
        if (visited.has(currentId)) continue;
        visited.add(currentId);
        executionOrder.push(currentId);
        connections.filter(c => c.sourceNodeId === currentId).forEach(c => queue.push(c.targetNodeId));
    }

    // SETUP GENERATION
    executionOrder.forEach(uuid => {
        const node = nodes.find(n => n.uuid === uuid)!;
        const def = getNodeDef(node.defId)!;
        const nodeIdShort = uuid.split('-')[0];
        
        if (def.pythonTemplate.includes("# Setup")) {
             let setupPart = def.pythonTemplate.split("# Process")[0];
             setupPart = setupPart.split('{id}').join(nodeIdShort);
             if (def.id === 'src_droidcam') {
                 const ip = node.params.droidCam?.ip || '192.168.1.10';
                 const port = node.params.droidCam?.port || '4747';
                 setupPart = setupPart.replace('{ip}', ip).replace('{port}', port);
             }
             code += setupPart + "\n";
        }
    });

    code += `\nwhile True:\n`;
    
    executionOrder.forEach(uuid => {
        const node = nodes.find(n => n.uuid === uuid)!;
        const def = getNodeDef(node.defId)!;
        const nodeIdShort = uuid.split('-')[0];
        const incoming = connections.find(c => c.targetNodeId === uuid);
        const inputVar = incoming ? `frame_${incoming.sourceNodeId.split('-')[0]}` : `frame_${nodeIdShort}_IN`;
        const outputVar = `frame_${nodeIdShort}`;
        
        if (def.id === 'net_http') {
             const conf = node.params.apiConfig;
             const headers = conf?.headers ? `{${conf.headers.map(h => `'${h.key}': '${h.value}'`).join(', ')}}` : '{}';
             code += `\n    # API Node\n    payload = {'pipeline_data': pipeline_data.copy()}\n`;
             if (conf?.sendImage) {
                 code += `    _, buffer = cv2.imencode('.jpg', ${inputVar})\n`;
                 code += `    payload['image'] = base64.b64encode(buffer).decode('utf-8')\n`;
             }
             if (conf?.asyncMode) code += `    threading.Thread(target=send_api_request, args=('${conf.url}', '${conf.method}', ${headers}, payload)).start()\n`;
             else code += `    send_api_request('${conf.url}', '${conf.method}', ${headers}, payload)\n`;
             code += `    ${outputVar} = ${inputVar}\n`;
             return;
        }

        let nodeCode = def.pythonTemplate.includes("# Process") ? def.pythonTemplate.split("# Process")[1] : def.pythonTemplate;
        
        // Parameter Injection
        const logic = (node.params.logic || {}) as Partial<LogicConfig>;
        nodeCode = nodeCode.split('{inputKey}').join(logic.inputKey || 'hand_landmarks');
        nodeCode = nodeCode.split('{keyA}').join(logic.inputKeyA || 'point_a');
        nodeCode = nodeCode.split('{keyB}').join(logic.inputKeyB || 'point_b');
        nodeCode = nodeCode.split('{outputKey}').join(logic.outputKey || 'result');
        nodeCode = nodeCode.split('{index}').join((logic.index || 0).toString());
        nodeCode = nodeCode.split('{thresh}').join((logic.threshold || 0).toString());
        nodeCode = nodeCode.split('{comp}').join(logic.comparator || '>');
        nodeCode = nodeCode.split('{op}').join(logic.operation || 'add');
        nodeCode = nodeCode.split('{triggerKey}').join(logic.triggerKey || 'is_active');
        nodeCode = nodeCode.split('{id}').join(nodeIdShort);
        nodeCode = nodeCode.split('{input}').join(inputVar);
        nodeCode = nodeCode.split('{output}').join(outputVar);
        
        const indentedCode = nodeCode.split('\n').map(line => line.trim() ? `    ${line}` : '').join('\n');
        code += `\n    # ${def.name}\n${indentedCode}\n`;
    });

    code += `\n    if cv2.waitKey(1) & 0xFF == ord('q'): break\n`;
    if (['src_webcam', 'src_file', 'src_droidcam'].includes(mainSource.defId)) code += `cap.release()\n`;
    code += `cv2.destroyAllWindows()\n`;

    setGeneratedCode(code);
    setShowCode(true);
  };

  const handleValidate = async () => {
      if (!activeChallenge) return;
      setIsValidating(true);
      setValidationResult(null);
      const result = await validateChallengeSolution(activeChallenge, nodes, connections, allNodes);
      setValidationResult(result);
      setIsValidating(false);
      if (result.success && onChallengeComplete) onChallengeComplete(activeChallenge.id);
  };

  const handleImport = async () => {
      if (!importCode.trim()) return;
      setIsImporting(true);
      const result = await parsePythonToPipeline(importCode);
      if (result.nodes.length > 0) { setNodes(result.nodes); setConnections(result.connections); setShowImport(false); }
      else alert("Failed to parse code.");
      setIsImporting(false);
  };

  const getIcon = (type: NodeType, lib: string) => {
      if (type === NodeType.SOURCE) return <Camera className="w-5 h-5" />;
      if (type === NodeType.OUTPUT) return <Eye className="w-5 h-5" />;
      if (lib === 'MediaPipe') return <Zap className="w-5 h-5" />;
      if (lib === 'Logic') return <Binary className="w-5 h-5" />;
      if (lib === 'Community') return <Globe className="w-5 h-5" />;
      if (lib === 'Connectivity') return <Network className="w-5 h-5" />;
      if (lib === 'GenAI') return <Brain className="w-5 h-5" />;
      return <Cpu className="w-5 h-5" />;
  };

  const getNodeColor = (type: NodeType, lib: string) => {
    if (type === NodeType.SOURCE) return 'border-green-500/50 bg-slate-900';
    if (type === NodeType.OUTPUT) return 'border-orange-500/50 bg-slate-900';
    if (lib === 'MediaPipe') return 'border-purple-500/50 bg-slate-900';
    if (lib === 'Logic') return 'border-indigo-500/50 bg-slate-900';
    if (lib === 'GenAI') return 'border-amber-500/50 bg-slate-900';
    return 'border-cyan-500/50 bg-slate-900';
  };

  const libraries = activeChallenge ? ['Core', 'OpenCV', 'MediaPipe', 'Logic'] : ['Core', 'OpenCV', 'MediaPipe', 'Logic', 'Custom', 'Community', 'Connectivity', 'GenAI'];

  return (
    <div className="flex h-full bg-slate-950 overflow-hidden">
      {configNodeId && <NodeConfigModal node={nodes.find(n => n.uuid === configNodeId)!} language={language} onClose={() => setConfigNodeId(null)} onSave={updateNodeParams} />}

      <div className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col z-20 shadow-xl">
        <div className="p-4 border-b border-slate-800 bg-slate-900">
            <h2 className="font-bold text-slate-200 mb-1 flex items-center gap-2"><Layers className="w-4 h-4 text-cyan-400" /> {t.library}</h2>
        </div>
        <div className="flex flex-wrap gap-1 p-2 border-b border-slate-800 bg-slate-900/50">
             {libraries.map(lib => (
                 <button key={lib} onClick={() => setSelectedLibrary(lib)} className={`flex-1 px-1 py-2 text-[9px] uppercase font-bold rounded-md transition-all ${selectedLibrary === lib ? 'bg-cyan-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{lib}</button>
             ))}
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-900">
          {(selectedLibrary === 'Community' ? MOCK_COMMUNITY_NODES : allNodes.filter(n => n.library === selectedLibrary)).map(node => (
            <div key={node.id} onClick={() => selectedLibrary === 'Community' && onImportCommunityNode ? onImportCommunityNode(node) : addNode(node.id)} className="group flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-800/30 hover:bg-slate-800 hover:border-cyan-500/50 cursor-pointer transition-all hover:translate-x-1">
              <div className={`p-2 rounded-md ${node.type === NodeType.SOURCE ? 'bg-green-500/20 text-green-400' : node.library === 'MediaPipe' ? 'bg-purple-500/20 text-purple-400' : node.library === 'Logic' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                 {getIcon(node.type, node.library)}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium text-slate-200 truncate">{language === 'fr' && node.name_fr ? node.name_fr : node.name}</div>
                <div className="text-[10px] text-slate-500 truncate">{language === 'fr' && node.description_fr ? node.description_fr : node.description}</div>
              </div>
              <Plus className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 opacity-0 group-hover:opacity-100 transition-all" />
            </div>
          ))}
        </div>
      </div>

      <div className={`flex-1 relative bg-[#0b1121] overflow-hidden ${isPanning ? 'cursor-grabbing' : 'cursor-grab'}`} ref={containerRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseDown={handleCanvasMouseDown} onWheel={handleWheel}>
        <div className="absolute bottom-4 left-4 flex gap-2 z-30 bg-slate-900 border border-slate-700 rounded-lg p-1 shadow-xl">
            <button onClick={() => handleZoom(0.1)} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-400"><ZoomIn className="w-5 h-5" /></button>
            <div className="text-[10px] text-center text-slate-600 font-mono flex items-center justify-center px-2">{Math.round(zoom * 100)}%</div>
            <button onClick={() => handleZoom(-0.1)} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-400"><ZoomOut className="w-5 h-5" /></button>
            <button onClick={resetView} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-cyan-400 border-l border-slate-800"><RotateCcw className="w-4 h-4" /></button>
        </div>

        <div className="w-full h-full origin-top-left transition-transform duration-75 ease-linear" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ width: `${100000}px`, height: `${100000}px`, transform: `translate(-50000px, -50000px)`, backgroundImage: `radial-gradient(#334155 1px, transparent 1px)`, backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px` }} />
            <svg className="absolute overflow-visible pointer-events-none z-0" style={{ top: 0, left: 0 }}>
                {connections.map(conn => {
                    const source = nodes.find(n => n.uuid === conn.sourceNodeId);
                    const target = nodes.find(n => n.uuid === conn.targetNodeId);
                    if (!source || !target) return null;
                    const startX = source.position.x + 180; const startY = source.position.y + 40; const endX = target.position.x; const endY = target.position.y + 40;
                    return <g key={conn.id} className="group pointer-events-auto cursor-pointer" onClick={(e) => deleteConnection(e, conn.id)}>
                        <path d={`M ${startX} ${startY} C ${startX+60} ${startY}, ${endX-60} ${endY}, ${endX} ${endY}`} stroke="#334155" strokeWidth="5" fill="none" className="group-hover:stroke-red-500/30" />
                        <path d={`M ${startX} ${startY} C ${startX+60} ${startY}, ${endX-60} ${endY}, ${endX} ${endY}`} stroke="#64748b" strokeWidth="2" fill="none" className="group-hover:stroke-red-400" />
                    </g>;
                })}
                {linkingSourceId && <path d={`M ${nodes.find(n => n.uuid === linkingSourceId)!.position.x + 180} ${nodes.find(n => n.uuid === linkingSourceId)!.position.y + 40} L ${mousePos.x} ${mousePos.y}`} stroke="#06b6d4" strokeWidth="2" strokeDasharray="5,5" fill="none" />}
            </svg>
            {nodes.map(node => {
                const def = getNodeDef(node.defId); if (!def) return null;
                const isConfigurable = def.id === 'net_http' || def.id === 'src_droidcam' || def.id === 'comm_onnx' || def.library === 'Logic';
                return <div key={node.uuid} className={`absolute w-[180px] rounded-lg shadow-xl select-none group z-10 ${getNodeColor(def.type, def.library)} border-2 bg-opacity-95 backdrop-blur-sm`} style={{ left: node.position.x, top: node.position.y }} onMouseDown={(e) => handleMouseDown(e, node.uuid)}>
                     <div className="p-3 flex items-center gap-3 bg-black/20 border-b border-white/5 rounded-t-md relative">
                        {getIcon(def.type, def.library)}
                        <span className="font-bold text-xs text-slate-200 truncate flex-1">{language === 'fr' && def.name_fr ? def.name_fr : def.name}</span>
                        {isConfigurable && <button onClick={(e) => { e.stopPropagation(); setConfigNodeId(node.uuid); }} className="text-slate-500 hover:text-cyan-400 p-1 hover:bg-slate-800 rounded"><Settings2 className="w-3 h-3" /></button>}
                        <button onClick={(e) => { e.stopPropagation(); removeNode(node.uuid); }} className="text-slate-500 hover:text-red-400 p-1 hover:bg-slate-800 rounded"><Trash2 className="w-3 h-3" /></button>
                    </div>
                    <div className="p-2 bg-slate-900/90 rounded-b-md"><span className="text-[10px] text-slate-500 font-mono">{def.library}</span></div>
                    {def.inputs > 0 && <div className="absolute top-[35px] -left-3 w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-600 hover:border-cyan-400 flex items-center justify-center z-20 cursor-crosshair" onMouseUp={(e) => completeConnection(e, node.uuid)}><div className="w-2 h-2 rounded-full bg-slate-500" /></div>}
                    {def.outputs > 0 && <div className="absolute top-[35px] -right-3 w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-600 hover:border-cyan-400 flex items-center justify-center z-20 cursor-crosshair" onMouseDown={(e) => startConnection(e, node.uuid)}><div className="w-2 h-2 rounded-full bg-cyan-500" /></div>}
                </div>;
            })}
        </div>

        <div className="absolute top-4 right-4 flex gap-3 z-30">
             <button onClick={() => setShowImport(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg shadow-lg font-medium border border-slate-700"><UploadCloud className="w-4 h-4 text-cyan-400" /> {t.importBtn}</button>
             <button onClick={generatePython} className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg shadow-lg shadow-cyan-500/20 font-medium"><Download className="w-4 h-4" /> {t.export}</button>
        </div>

        {showImport && (
             <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                 <div className="bg-slate-900 rounded-2xl w-full max-w-2xl border border-slate-700 p-6 animate-in zoom-in-95">
                     <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-white flex items-center gap-2"><UploadCloud className="w-6 h-6 text-purple-400" /> {t.import}</h3><button onClick={() => setShowImport(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button></div>
                     <textarea value={importCode} onChange={(e) => setImportCode(e.target.value)} className="w-full h-48 bg-[#0d1117] text-slate-300 font-mono text-xs p-4 rounded-lg border border-slate-700 mb-4 resize-none" placeholder="import cv2..." />
                     <div className="flex justify-end gap-3"><button onClick={() => setShowImport(false)} className="px-4 py-2 text-sm text-slate-400">Cancel</button><button onClick={handleImport} disabled={isImporting || !importCode} className="px-6 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded font-bold disabled:opacity-50">{isImporting ? <Loader2 className="w-4 h-4 animate-spin"/> : t.importBtn}</button></div>
                 </div>
             </div>
        )}

        {showCode && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8 backdrop-blur-sm">
              <div className="bg-slate-900 rounded-2xl w-full max-w-3xl border border-slate-700 shadow-2xl flex flex-col max-h-full overflow-hidden">
                  <div className="p-6 border-b border-slate-800 flex justify-between items-center"><h2 className="text-xl font-bold text-white flex items-center gap-2"><FileVideo className="w-6 h-6 text-cyan-400" /> {t.generated}</h2><button onClick={() => setShowCode(false)} className="text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition-all"><X className="w-6 h-6" /></button></div>
                  <div className="relative flex-1 bg-[#0d1117] overflow-auto p-6"><pre className="font-mono text-sm text-slate-300 leading-relaxed select-text">{generatedCode}</pre></div>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineStudio;
