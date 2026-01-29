
import React, { useState, useRef } from 'react';
import { AVAILABLE_NODES, TRANSLATIONS } from '../constants';
import { PipelineNode, PipelineConnection, NodeType, NodeDefinition, Position, Language, Challenge, DroidCamConfig } from '../types';
import { 
    Plus, Trash2, Download, X, Zap, FileVideo, Camera, Cpu, Layers, 
    ZoomIn, ZoomOut, RotateCcw, Settings2, Eye, UploadCloud, Loader2 
} from 'lucide-react';
import { parsePythonToPipeline } from '../services/geminiService';

const GRID_SIZE = 20;

interface PipelineStudioProps {
    customNodes: NodeDefinition[];
    language: Language;
    activeChallenge?: Challenge | null;
    onExitChallenge?: () => void;
    onChallengeComplete?: (challengeId: string) => void;
    onImportCommunityNode?: (node: NodeDefinition) => void;
}

const NodeConfigModal: React.FC<{ node: PipelineNode; language: Language; onClose: () => void; onSave: (nodeId: string, params: any) => void }> = ({ node, language, onClose, onSave }) => {
    const t = TRANSLATIONS[language];
    const [droidCamConfig, setDroidCamConfig] = useState<DroidCamConfig>(node.params.droidCam || { ip: '192.168.1.10', port: '4747' });

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-xl w-full max-w-lg border border-slate-700 shadow-2xl p-6 animate-in zoom-in-95">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><Settings2 className="w-5 h-5 text-cyan-400" /> {t.droidCamConfig}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="space-y-4">
                    <p className="text-sm text-slate-300">{t.droidCamHelp}</p>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.ipAddress}</label>
                        <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 font-mono" value={droidCamConfig.ip} onChange={(e) => setDroidCamConfig({...droidCamConfig, ip: e.target.value})} />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.port}</label>
                        <input className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 font-mono" value={droidCamConfig.port} onChange={(e) => setDroidCamConfig({...droidCamConfig, port: e.target.value})} />
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 text-sm text-slate-400">Cancel</button>
                    <button onClick={() => { onSave(node.uuid, { droidCam: droidCamConfig }); onClose(); }} className="px-6 py-2 bg-cyan-600 text-white rounded font-bold">{t.saveConfig}</button>
                </div>
            </div>
        </div>
    );
};

const PipelineStudio: React.FC<PipelineStudioProps> = ({ customNodes, language, activeChallenge }) => {
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
  const [linkingSourceId, setLinkingSourceId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const allNodes = [...AVAILABLE_NODES, ...customNodes];
  const t = TRANSLATIONS[language];

  const handleZoom = (delta: number) => setZoom(z => Math.min(Math.max(z + delta, 0.2), 3));
  const addNode = (defId: string) => {
    const newNode: PipelineNode = {
      uuid: crypto.randomUUID(),
      defId,
      position: { x: (200 - pan.x) / zoom, y: (200 - pan.y) / zoom },
      params: {}
    };
    setNodes([...nodes, newNode]);
  };

  const getExecutionOrder = () => {
    const sources = nodes.filter(n => allNodes.find(d => d.id === n.defId)?.type === NodeType.SOURCE);
    if (sources.length === 0) return [];
    const order: string[] = [];
    const visited = new Set<string>();
    const queue = [sources[0].uuid];
    while (queue.length > 0) {
        const id = queue.shift()!;
        if (visited.has(id)) continue;
        visited.add(id);
        order.push(id);
        connections.filter(c => c.sourceNodeId === id).forEach(c => queue.push(c.targetNodeId));
    }
    return order;
  };

  const generatePython = () => {
    const order = getExecutionOrder();
    if (order.length === 0) { setGeneratedCode("# Error: No sequence found."); setShowCode(true); return; }
    let code = "import cv2\nimport numpy as np\n";
    const imports = new Set<string>();
    order.forEach(id => allNodes.find(d => d.id === nodes.find(n => n.uuid === id)!.defId)?.requiredImports?.forEach(i => imports.add(i)));
    imports.forEach(i => { if (!code.includes(`import ${i}`)) code += `import ${i}\n`; });

    code += "\n# Setup\n";
    order.forEach(id => {
        const node = nodes.find(n => n.uuid === id)!;
        const def = allNodes.find(d => d.id === node.defId)!;
        if (def.pythonTemplate.includes("# Setup")) {
            let s = def.pythonTemplate.split("# Process")[0].replace(/{id}/g, id.split('-')[0]);
            if (node.defId === 'src_droidcam') s = s.replace(/{ip}/g, node.params.droidCam?.ip || '').replace(/{port}/g, node.params.droidCam?.port || '');
            code += s + "\n";
        }
    });

    code += "\nwhile True:\n";
    order.forEach(id => {
        const node = nodes.find(n => n.uuid === id)!;
        const def = allNodes.find(d => d.id === node.defId)!;
        const input = connections.find(c => c.targetNodeId === id) ? `frame_${connections.find(c => c.targetNodeId === id)!.sourceNodeId.split('-')[0]}` : "frame_IN";
        const output = `frame_${id.split('-')[0]}`;
        let p = def.pythonTemplate.includes("# Process") ? def.pythonTemplate.split("# Process")[1] : def.pythonTemplate;
        p = p.replace(/{input}/g, input).replace(/{output}/g, output).replace(/{id}/g, id.split('-')[0]);
        code += p.split('\n').map(l => "    " + l).join('\n') + "\n";
    });
    code += "    if cv2.waitKey(1) & 0xFF == ord('q'): break\ncap.release()\ncv2.destroyAllWindows()";
    setGeneratedCode(code);
    setShowCode(true);
  };

  const getIcon = (defId: string) => {
    const def = allNodes.find(d => d.id === defId);
    if (def?.type === NodeType.SOURCE) return <Camera className="w-5 h-5" />;
    if (def?.type === NodeType.AI) return <Zap className="w-5 h-5" />;
    if (def?.type === NodeType.OUTPUT) return <Eye className="w-5 h-5" />;
    return <Cpu className="w-5 h-5" />;
  };

  return (
    <div className="flex h-full bg-slate-950 overflow-hidden">
      {configNodeId && <NodeConfigModal node={nodes.find(n => n.uuid === configNodeId)!} language={language} onClose={() => setConfigNodeId(null)} onSave={(id, p) => setNodes(nodes.map(n => n.uuid === id ? {...n, params: p} : n))} />}
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20 shadow-xl">
        <div className="p-4 border-b border-slate-800"><h2 className="font-bold text-slate-200 flex items-center gap-2"><Layers className="w-4 h-4 text-cyan-400" /> {t.library}</h2></div>
        <div className="flex gap-1 p-2 bg-slate-900/50">
             {['Core', 'OpenCV', 'MediaPipe', 'Custom'].map(lib => <button key={lib} onClick={() => setSelectedLibrary(lib)} className={`flex-1 py-1.5 text-[9px] uppercase font-bold rounded transition-all ${selectedLibrary === lib ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-500'}`}>{lib}</button>)}
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {allNodes.filter(n => n.library === selectedLibrary).map(node => (
            <div key={node.id} onClick={() => addNode(node.id)} className="group flex items-center gap-3 p-3 rounded-lg border border-slate-800 bg-slate-800/30 hover:border-cyan-500/50 cursor-pointer">
              <div className="p-2 rounded bg-cyan-500/10 text-cyan-400">{getIcon(node.id)}</div>
              <div className="flex-1 overflow-hidden">
                <div className="text-sm font-medium text-slate-200 truncate">{language === 'fr' ? node.name_fr : node.name}</div>
              </div>
              <Plus className="w-4 h-4 text-slate-600 group-hover:text-cyan-400" />
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 relative bg-[#0b1121]" ref={containerRef} 
        onMouseMove={(e) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const x = (e.clientX - rect.left - pan.x) / zoom;
                const y = (e.clientY - rect.top - pan.y) / zoom;
                setMousePos({ x, y });
                if (draggingNode) setNodes(nodes.map(n => n.uuid === draggingNode ? { ...n, position: { x: x - dragOffset.x, y: y - dragOffset.y } } : n));
                if (isPanning) setPan(p => ({ x: p.x + (e.clientX - panStart.x), y: p.y + (e.clientY - panStart.y) }));
                if (isPanning) setPanStart({ x: e.clientX, y: e.clientY });
            }
        }} 
        onMouseDown={(e) => { if (e.target === e.currentTarget) { setIsPanning(true); setPanStart({ x: e.clientX, y: e.clientY }); } }}
        onMouseUp={() => { setDraggingNode(null); setIsPanning(false); setLinkingSourceId(null); }}>
        <div className="absolute top-4 right-4 flex gap-3 z-30">
             <button onClick={() => setShowImport(true)} className="px-4 py-2 bg-slate-800 text-white rounded-lg flex items-center gap-2 border border-slate-700"><UploadCloud className="w-4 h-4" /> {t.importBtn}</button>
             <button onClick={generatePython} className="px-4 py-2 bg-cyan-600 text-white rounded-lg flex items-center gap-2 shadow-cyan-500/20"><Download className="w-4 h-4" /> {t.export}</button>
        </div>
        <div className="w-full h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
            <svg className="absolute overflow-visible pointer-events-none">
                {connections.map(c => {
                    const s = nodes.find(n => n.uuid === c.sourceNodeId); const t = nodes.find(n => n.uuid === c.targetNodeId);
                    if (!s || !t) return null;
                    return <path key={c.id} d={`M ${s.position.x + 180} ${s.position.y + 40} C ${s.position.x + 240} ${s.position.y + 40}, ${t.position.x - 60} ${t.position.y + 40}, ${t.position.x} ${t.position.y + 40}`} stroke="#64748b" strokeWidth="2" fill="none" className="cursor-pointer hover:stroke-red-500" onClick={() => setConnections(connections.filter(con => con.id !== c.id))} />;
                })}
                {linkingSourceId && <path d={`M ${nodes.find(n => n.uuid === linkingSourceId)!.position.x + 180} ${nodes.find(n => n.uuid === linkingSourceId)!.position.y + 40} L ${mousePos.x} ${mousePos.y}`} stroke="#06b6d4" strokeWidth="2" strokeDasharray="5,5" fill="none" />}
            </svg>
            {nodes.map(n => {
                const def = allNodes.find(d => d.id === n.defId)!;
                return <div key={n.uuid} className={`absolute w-[180px] bg-slate-900 border-2 rounded-lg p-3 shadow-xl ${def.type === NodeType.SOURCE ? 'border-green-500/50' : 'border-cyan-500/50'}`} style={{ left: n.position.x, top: n.position.y }} onMouseDown={(e) => { e.stopPropagation(); setDraggingNode(n.uuid); const rect = containerRef.current!.getBoundingClientRect(); setDragOffset({ x: (e.clientX - rect.left - pan.x) / zoom - n.position.x, y: (e.clientY - rect.top - pan.y) / zoom - n.position.y }); }}>
                    <div className="flex items-center gap-2 mb-2 font-bold text-xs">{getIcon(n.defId)} {language === 'fr' ? def.name_fr : def.name}</div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono">
                        {def.inputs > 0 && <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center cursor-crosshair" onMouseUp={() => linkingSourceId && linkingSourceId !== n.uuid && setConnections([...connections, { id: crypto.randomUUID(), sourceNodeId: linkingSourceId, targetNodeId: n.uuid }])}><div className="w-1.5 h-1.5 bg-slate-600 rounded-full" /></div>}
                        <div className="flex gap-1">
                            {n.defId === 'src_droidcam' && <button onClick={() => setConfigNodeId(n.uuid)} className="hover:text-cyan-400"><Settings2 className="w-3 h-3"/></button>}
                            <button onClick={() => { setNodes(nodes.filter(nd => nd.uuid !== n.uuid)); setConnections(connections.filter(c => c.sourceNodeId !== n.uuid && c.targetNodeId !== n.uuid)); }} className="hover:text-red-400"><Trash2 className="w-3 h-3"/></button>
                        </div>
                        {def.outputs > 0 && <div className="w-4 h-4 rounded-full border border-cyan-500 flex items-center justify-center cursor-crosshair" onMouseDown={(e) => { e.stopPropagation(); setLinkingSourceId(n.uuid); }}><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" /></div>}
                    </div>
                </div>;
            })}
        </div>
        {showCode && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-8 backdrop-blur-sm">
              <div className="bg-slate-900 rounded-xl w-full max-w-2xl border border-slate-700 shadow-2xl flex flex-col h-3/4 overflow-hidden">
                  <div className="p-4 border-b border-slate-800 flex justify-between items-center"><h2 className="font-bold flex items-center gap-2"><FileVideo className="w-5 h-5 text-cyan-400" /> {t.generated}</h2><button onClick={() => setShowCode(false)} className="text-slate-400"><X className="w-6 h-6" /></button></div>
                  <pre className="flex-1 bg-[#0d1117] p-6 text-xs font-mono text-slate-300 overflow-auto">{generatedCode}</pre>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PipelineStudio;
