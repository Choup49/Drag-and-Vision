
import React, { useState, useRef } from 'react';
import { AVAILABLE_NODES, TRANSLATIONS } from '../constants';
import { PipelineNode, PipelineConnection, NodeType, NodeDefinition, Position, Language, Challenge, DroidCamConfig } from '../types';
import { 
    Plus, Trash2, Download, X, Zap, FileVideo, Camera, Cpu, Layers, 
    ZoomIn, ZoomOut, RotateCcw, Settings2, Eye, UploadCloud, Loader2, PlayCircle, CheckCircle, AlertOctagon, GitBranch 
} from 'lucide-react';
import { parsePythonToPipeline, validateChallengeSolution } from '../services/geminiService';

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

const PipelineStudio: React.FC<PipelineStudioProps> = ({ customNodes, language, activeChallenge, onExitChallenge, onChallengeComplete }) => {
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
  
  // Updated Linking State to include handle type
  const [linkingSource, setLinkingSource] = useState<{ id: string, handle: 'main' | 'true' | 'false' } | null>(null);
  const [mousePos, setMousePos] = useState<Position>({ x: 0, y: 0 });
  const [showCode, setShowCode] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  
  // Verification State
  const [isVerifying, setIsVerifying] = useState(false);
  const [validationResult, setValidationResult] = useState<{success: boolean, message: string, hint?: string} | null>(null);

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

  /**
   * RECURSIVE GRAPH TRAVERSAL
   * Handles branching (if/else) and Python indentation properly.
   */
  const traverseGraph = (currentNodeId: string, visited: Set<string>, indentLevel: number): string => {
    if (visited.has(currentNodeId)) return ""; // Avoid cycles
    visited.add(currentNodeId);

    const node = nodes.find(n => n.uuid === currentNodeId);
    if (!node) return "";
    const def = allNodes.find(d => d.id === node.defId);
    if (!def) return "";

    const indent = "    ".repeat(indentLevel);
    let codeBlock = "";

    // 1. Determine Inputs
    // Find connection pointing TO this node
    const incomingConn = connections.find(c => c.targetNodeId === currentNodeId);
    // Standard input variable name or default 'frame_IN'
    const inputVar = incomingConn ? `frame_${incomingConn.sourceNodeId.split('-')[0]}` : "frame_IN";
    // Output variable name for this node
    const outputVar = `frame_${currentNodeId.split('-')[0]}`;
    const idShort = currentNodeId.split('-')[0];

    // 2. Generate Code for Current Node
    if (def.type === NodeType.LOGIC) {
        // Logic Node (e.g., If Face Detected)
        // Only supports Python Template that starts with control flow keyword (if, for)
        let line = def.pythonTemplate
            .replace(/{input}/g, inputVar)
            .replace(/{output}/g, outputVar)
            .replace(/{id}/g, idShort);
        
        codeBlock += `${indent}${line}\n`;

        // 3. Handle Branching (True/False)
        const trueConn = connections.find(c => c.sourceNodeId === currentNodeId && c.sourceHandle === 'true');
        const falseConn = connections.find(c => c.sourceNodeId === currentNodeId && c.sourceHandle === 'false');

        if (trueConn) {
             codeBlock += traverseGraph(trueConn.targetNodeId, visited, indentLevel + 1);
        } else {
             codeBlock += `${indent}    pass\n`;
        }

        if (falseConn) {
            codeBlock += `${indent}else:\n`;
            codeBlock += traverseGraph(falseConn.targetNodeId, visited, indentLevel + 1);
        }

    } else {
        // Standard Process/AI Node
        if (def.pythonTemplate.includes("# Process")) {
            let p = def.pythonTemplate.split("# Process")[1];
            p = p.replace(/{input}/g, inputVar).replace(/{output}/g, outputVar).replace(/{id}/g, idShort);
            
            // Handle multi-line templates with proper indentation
            const lines = p.split('\n').filter(l => l.trim() !== '');
            lines.forEach(l => {
                codeBlock += `${indent}${l.trim()}\n`;
            });
        } else {
             let line = def.pythonTemplate
                .replace(/{input}/g, inputVar)
                .replace(/{output}/g, outputVar)
                .replace(/{id}/g, idShort);
             codeBlock += `${indent}${line}\n`;
        }

        // 3. Continue to Next Node (Standard linear flow or main output)
        const nextConn = connections.find(c => c.sourceNodeId === currentNodeId && (!c.sourceHandle || c.sourceHandle === 'main'));
        if (nextConn) {
            codeBlock += traverseGraph(nextConn.targetNodeId, visited, indentLevel);
        }
    }

    return codeBlock;
  };

  const generatePython = () => {
    // Find Source Nodes (Roots)
    const sources = nodes.filter(n => allNodes.find(d => d.id === n.defId)?.type === NodeType.SOURCE);
    if (sources.length === 0) { setGeneratedCode("# Error: No source node (Webcam/File) found."); setShowCode(true); return; }

    let code = "import cv2\nimport numpy as np\n";
    
    // Collect Imports
    const imports = new Set<string>();
    nodes.forEach(n => {
        const def = allNodes.find(d => d.id === n.defId);
        def?.requiredImports?.forEach(i => imports.add(i));
    });
    imports.forEach(i => { if (!code.includes(`import ${i}`)) code += `import ${i}\n`; });

    code += "\n# Setup\n";
    
    // Generate Setup Block (Iterate all nodes for setup part)
    nodes.forEach(n => {
        const def = allNodes.find(d => d.id === n.defId);
        if (def && def.pythonTemplate.includes("# Setup")) {
             let s = def.pythonTemplate.split("# Process")[0].replace(/{id}/g, n.uuid.split('-')[0]);
             if (n.defId === 'src_droidcam') s = s.replace(/{ip}/g, n.params.droidCam?.ip || '').replace(/{port}/g, n.params.droidCam?.port || '');
             code += s + "\n";
        }
    });

    code += "\nwhile True:\n";
    
    // Traverse Graph starting from Source(s)
    const visited = new Set<string>();
    sources.forEach(source => {
        // Special case for Source Nodes inside the loop: usually just 'read()'
        const def = allNodes.find(d => d.id === source.defId);
        const outputVar = `frame_${source.uuid.split('-')[0]}`;
        
        let readLine = "";
        if (def?.pythonTemplate.includes("# Process")) {
             let p = def.pythonTemplate.split("# Process")[1];
             readLine = p.replace(/{output}/g, outputVar).replace(/{id}/g, source.uuid.split('-')[0]);
        }
        
        // Indent source read
        readLine.split('\n').filter(l => l.trim()).forEach(l => {
            code += `    ${l.trim()}\n`;
        });

        // Start traversal from connected children
        const children = connections.filter(c => c.sourceNodeId === source.uuid);
        children.forEach(child => {
             code += traverseGraph(child.targetNodeId, visited, 1);
        });
    });

    code += "    if cv2.waitKey(1) & 0xFF == ord('q'): break\ncap.release()\ncv2.destroyAllWindows()";
    setGeneratedCode(code);
    setShowCode(true);
  };

  const handleVerify = async () => {
      if (!activeChallenge) return;
      setIsVerifying(true);
      const result = await validateChallengeSolution(activeChallenge, nodes, connections);
      setIsVerifying(false);
      setValidationResult(result);
      if (result.success && onChallengeComplete) {
          onChallengeComplete(activeChallenge.id);
      }
  };

  const getIcon = (defId: string) => {
    const def = allNodes.find(d => d.id === defId);
    if (def?.type === NodeType.SOURCE) return <Camera className="w-5 h-5" />;
    if (def?.type === NodeType.AI) return <Zap className="w-5 h-5" />;
    if (def?.type === NodeType.LOGIC) return <GitBranch className="w-5 h-5" />;
    if (def?.type === NodeType.OUTPUT) return <Eye className="w-5 h-5" />;
    return <Cpu className="w-5 h-5" />;
  };

  // Helper for starting a connection
  const startConnection = (e: React.MouseEvent, nodeId: string, handle: 'main' | 'true' | 'false') => {
      e.stopPropagation();
      setLinkingSource({ id: nodeId, handle });
  };

  return (
    <div className="flex h-full bg-slate-950 overflow-hidden relative">
      {/* Verification Modal */}
      {validationResult && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in">
              <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl relative">
                  <button onClick={() => setValidationResult(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                      <X className="w-6 h-6"/>
                  </button>
                  <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${validationResult.success ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                      {validationResult.success ? <CheckCircle className="w-10 h-10 text-green-500" /> : <AlertOctagon className="w-10 h-10 text-red-500" />}
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{validationResult.success ? t.success : t.fail}</h2>
                  <p className="text-slate-300 mb-6">{validationResult.message}</p>
                  
                  {!validationResult.success && validationResult.hint && (
                      <div className="bg-slate-800/50 p-4 rounded-lg mb-6 text-sm text-yellow-300 border border-yellow-500/30">
                          <strong>{t.aiHint}:</strong> {validationResult.hint}
                      </div>
                  )}

                  <div className="flex gap-4 justify-center">
                      <button onClick={() => setValidationResult(null)} className="px-6 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 font-bold">
                          {validationResult.success ? t.finish : t.retry}
                      </button>
                      {validationResult.success && onExitChallenge && (
                          <button onClick={onExitChallenge} className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-500 font-bold shadow-lg shadow-green-500/20">
                              {t.back}
                          </button>
                      )}
                  </div>
              </div>
          </div>
      )}

      {configNodeId && <NodeConfigModal node={nodes.find(n => n.uuid === configNodeId)!} language={language} onClose={() => setConfigNodeId(null)} onSave={(id, p) => setNodes(nodes.map(n => n.uuid === id ? {...n, params: p} : n))} />}
      
      <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col z-20 shadow-xl">
        <div className="p-4 border-b border-slate-800">
            {activeChallenge ? (
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <button onClick={onExitChallenge} className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-wider hover:underline">← {t.back}</button>
                    </div>
                    <h2 className="font-bold text-yellow-400 flex items-center gap-2 text-sm line-clamp-1">
                         {language === 'fr' && activeChallenge.title_fr ? activeChallenge.title_fr : activeChallenge.title}
                    </h2>
                </div>
            ) : (
                <h2 className="font-bold text-slate-200 flex items-center gap-2"><Layers className="w-4 h-4 text-cyan-400" /> {t.library}</h2>
            )}
        </div>
        <div className="flex gap-1 p-2 bg-slate-900/50">
             {['Core', 'OpenCV', 'MediaPipe', 'Logic', 'Custom'].map(lib => <button key={lib} onClick={() => setSelectedLibrary(lib)} className={`flex-1 py-1.5 text-[9px] uppercase font-bold rounded transition-all ${selectedLibrary === lib ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-500'}`}>{lib}</button>)}
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
        onMouseUp={() => { setDraggingNode(null); setIsPanning(false); setLinkingSource(null); }}>
        <div className="absolute top-4 right-4 flex gap-3 z-30">
             {activeChallenge ? (
                 <button 
                    onClick={handleVerify} 
                    disabled={isVerifying}
                    className="px-6 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 text-white rounded-lg flex items-center gap-2 shadow-lg shadow-orange-500/20 font-bold transition-all"
                 >
                    {isVerifying ? <Loader2 className="w-4 h-4 animate-spin"/> : <CheckCircle className="w-4 h-4" />} 
                    {isVerifying ? t.verifying : t.verify}
                 </button>
             ) : (
                 <>
                    <button onClick={() => setShowImport(true)} className="px-4 py-2 bg-slate-800 text-white rounded-lg flex items-center gap-2 border border-slate-700 hover:bg-slate-700 transition-colors"><UploadCloud className="w-4 h-4" /> {t.importBtn}</button>
                    <button onClick={generatePython} className="px-4 py-2 bg-cyan-600 text-white rounded-lg flex items-center gap-2 shadow-cyan-500/20 hover:bg-cyan-500 transition-colors"><Download className="w-4 h-4" /> {t.export}</button>
                 </>
             )}
        </div>
        <div className="w-full h-full" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: '0 0' }}>
            <svg className="absolute overflow-visible pointer-events-none">
                {connections.map(c => {
                    const s = nodes.find(n => n.uuid === c.sourceNodeId); const t = nodes.find(n => n.uuid === c.targetNodeId);
                    if (!s || !t) return null;
                    
                    // Visual adjustment for handles
                    let startY = s.position.y + 40;
                    let color = "#64748b"; // default slate
                    if (c.sourceHandle === 'true') { startY = s.position.y + 25; color = "#22c55e"; } // Green
                    if (c.sourceHandle === 'false') { startY = s.position.y + 55; color = "#ef4444"; } // Red

                    return <path key={c.id} d={`M ${s.position.x + 180} ${startY} C ${s.position.x + 240} ${startY}, ${t.position.x - 60} ${t.position.y + 40}, ${t.position.x} ${t.position.y + 40}`} stroke={color} strokeWidth="2" fill="none" className="cursor-pointer hover:stroke-white" onClick={() => setConnections(connections.filter(con => con.id !== c.id))} />;
                })}
                {linkingSource && (
                     <path d={`M ${nodes.find(n => n.uuid === linkingSource.id)!.position.x + 180} ${nodes.find(n => n.uuid === linkingSource.id)!.position.y + (linkingSource.handle === 'true' ? 25 : linkingSource.handle === 'false' ? 55 : 40)} L ${mousePos.x} ${mousePos.y}`} stroke={linkingSource.handle === 'true' ? '#22c55e' : linkingSource.handle === 'false' ? '#ef4444' : '#06b6d4'} strokeWidth="2" strokeDasharray="5,5" fill="none" />
                )}
            </svg>
            {nodes.map(n => {
                const def = allNodes.find(d => d.id === n.defId)!;
                return <div key={n.uuid} className={`absolute w-[180px] bg-slate-900 border-2 rounded-lg p-3 shadow-xl ${def.type === NodeType.SOURCE ? 'border-green-500/50' : def.type === NodeType.LOGIC ? 'border-purple-500/50' : 'border-cyan-500/50'}`} style={{ left: n.position.x, top: n.position.y }} onMouseDown={(e) => { e.stopPropagation(); setDraggingNode(n.uuid); const rect = containerRef.current!.getBoundingClientRect(); setDragOffset({ x: (e.clientX - rect.left - pan.x) / zoom - n.position.x, y: (e.clientY - rect.top - pan.y) / zoom - n.position.y }); }}>
                    <div className="flex items-center gap-2 mb-2 font-bold text-xs">{getIcon(n.defId)} {language === 'fr' ? def.name_fr : def.name}</div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono relative h-4">
                        {def.inputs > 0 && <div className="absolute left-[-18px] top-1 w-4 h-4 rounded-full border border-slate-600 bg-slate-900 flex items-center justify-center cursor-crosshair z-10" onMouseUp={() => linkingSource && linkingSource.id !== n.uuid && setConnections([...connections, { id: crypto.randomUUID(), sourceNodeId: linkingSource.id, targetNodeId: n.uuid, sourceHandle: linkingSource.handle }])}><div className="w-1.5 h-1.5 bg-slate-600 rounded-full" /></div>}
                        
                        <div className="flex gap-1 ml-2">
                            {n.defId === 'src_droidcam' && <button onClick={() => setConfigNodeId(n.uuid)} className="hover:text-cyan-400"><Settings2 className="w-3 h-3"/></button>}
                            <button onClick={() => { setNodes(nodes.filter(nd => nd.uuid !== n.uuid)); setConnections(connections.filter(c => c.sourceNodeId !== n.uuid && c.targetNodeId !== n.uuid)); }} className="hover:text-red-400"><Trash2 className="w-3 h-3"/></button>
                        </div>
                        
                        {/* Logic Nodes have 2 outputs, others have 1 */}
                        {def.type === NodeType.LOGIC ? (
                            <div className="absolute right-[-18px] top-[-8px] flex flex-col gap-1">
                                <div title="True" className="w-4 h-4 rounded-full border border-green-500 bg-slate-900 flex items-center justify-center cursor-crosshair z-10" onMouseDown={(e) => startConnection(e, n.uuid, 'true')}><div className="w-1.5 h-1.5 bg-green-500 rounded-full" /></div>
                                <div title="False" className="w-4 h-4 rounded-full border border-red-500 bg-slate-900 flex items-center justify-center cursor-crosshair z-10" onMouseDown={(e) => startConnection(e, n.uuid, 'false')}><div className="w-1.5 h-1.5 bg-red-500 rounded-full" /></div>
                            </div>
                        ) : def.outputs > 0 && (
                            <div className="absolute right-[-18px] top-1 w-4 h-4 rounded-full border border-cyan-500 bg-slate-900 flex items-center justify-center cursor-crosshair z-10" onMouseDown={(e) => startConnection(e, n.uuid, 'main')}><div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" /></div>
                        )}
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
