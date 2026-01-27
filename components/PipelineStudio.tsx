
import React, { useState, useRef, useEffect } from 'react';
import { AVAILABLE_NODES, TRANSLATIONS, MOCK_COMMUNITY_NODES } from '../constants';
import { PipelineNode, PipelineConnection, NodeType, NodeDefinition, Position, Language, OptimizerConfig, Challenge, ApiConfig, DroidCamConfig, OnnxConfig, LogicConfig } from '../types';
import { Plus, Trash2, Download, X, Zap, Move, FileVideo, Camera, Cpu, Box, Layers, ZoomIn, ZoomOut, RotateCcw, Info, Settings2, CheckCircle, AlertCircle, Play, Map, Globe, DownloadCloud, Eye, Network, Sparkles, Brain, Gauge, ImageIcon, Wifi, UploadCloud, Loader2, Binary, Server } from 'lucide-react';
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
