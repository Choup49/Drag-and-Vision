
import React, { useState } from 'react';
import { analyzeAndFixCode, transpileToCpp } from '../services/geminiService';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { Stethoscope, Check, Copy, Loader2, AlertTriangle, FileCode, Hammer, Zap, Activity, Scale, Trash2, Gauge, ClipboardCheck, ArrowRight, Info } from 'lucide-react';

interface CodeCorrectorProps {
    language: Language;
}

const CodeCorrector: React.FC<CodeCorrectorProps> = ({ language }) => {
    const [inputCode, setInputCode] = useState('');
    const [mode, setMode] = useState<'FIX' | 'CPP'>('FIX');
    const [fixResult, setFixResult] = useState<{ fixedCode: string; explanation: string } | null>(null);
    const [cppResult, setCppResult] = useState<{ cppCode: string; cmakeCode: string; explanation: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    
    // Optimization Preference State (1 = Accuracy/Quality, 10 = Speed/FPS)
    const [optimizationPref, setOptimizationPref] = useState(5);

    const t = TRANSLATIONS[language];

    const handleAction = async () => {
        if (!inputCode.trim()) return;
        setLoading(true);
        if (mode === 'FIX') {
            const res = await analyzeAndFixCode(inputCode, optimizationPref);
            setFixResult(res);
        } else {
            const res = await transpileToCpp(inputCode);
            setCppResult(res);
        }
        setLoading(false);
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const currentResult = mode === 'FIX' ? fixResult : cppResult;
    const resultText = mode === 'FIX' 
        ? fixResult?.fixedCode 
        : `// --- main.cpp ---\n${cppResult?.cppCode}\n\n# --- CMakeLists.txt ---\n${cppResult?.cmakeCode}`;

    const getPrefDescription = () => {
        if (optimizationPref <= 4) return t.optDescQuality;
        if (optimizationPref >= 7) return t.optDescSpeed;
        return t.optDescBalanced;
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 p-6 overflow-hidden">
             {/* HEADER */}
             <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3 mb-1">
                        <div className="p-2 bg-gradient-to-br from-cyan-600 to-blue-600 rounded-lg shadow-lg shadow-cyan-900/20">
                            {mode === 'FIX' ? <Zap className="w-6 h-6 text-white" /> : <Hammer className="w-6 h-6 text-white" />}
                        </div>
                        {t.correctorTitle}
                    </h1>
                    <p className="text-slate-400 text-sm max-w-xl">{t.correctorDesc}</p>
                </div>
                
                <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-800 shadow-inner">
                    <button 
                        onClick={() => { setMode('FIX'); setFixResult(null); }} 
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${mode === 'FIX' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                    >
                        <Zap className="w-4 h-4" />
                        {t.optimize}
                    </button>
                    <button 
                        onClick={() => { setMode('CPP'); setCppResult(null); }} 
                        className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${mode === 'CPP' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
                    >
                        <FileCode className="w-4 h-4" />
                        {t.cppExport}
                    </button>
                </div>
             </div>

             {/* MAIN CONTENT GRID */}
             <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                 
                 {/* LEFT: INPUT */}
                 <div className="flex flex-col bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden group hover:border-slate-700 transition-colors">
                     {/* Toolbar */}
                     <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center backdrop-blur-sm">
                         <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"></span>
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Input Code</span>
                         </div>
                         <div className="flex gap-2">
                             {inputCode && (
                                <button 
                                    onClick={() => setInputCode('')}
                                    className="p-2 hover:bg-red-500/10 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                    title="Clear"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                             )}
                         </div>
                     </div>
                     
                     {/* Editor */}
                     <textarea 
                        className="flex-1 w-full bg-[#0d1117] p-5 text-sm font-mono text-slate-300 resize-none focus:outline-none focus:ring-1 focus:ring-cyan-900/50 leading-relaxed"
                        placeholder={t.pasteCode}
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        spellCheck={false}
                     />

                     {/* Footer Controls (Slider + Action) */}
                     <div className="p-5 bg-slate-800/30 border-t border-slate-800">
                         {mode === 'FIX' && (
                             <div className="mb-6">
                                 <div className="flex justify-between items-center mb-3">
                                     <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                         <Gauge className="w-4 h-4 text-cyan-400" />
                                         {t.optPreference}
                                     </label>
                                     <span className="px-2 py-1 bg-slate-800 rounded text-xs font-mono text-cyan-400 border border-slate-700">
                                         Level {optimizationPref}
                                     </span>
                                 </div>
                                 
                                 {/* Custom Slider UI */}
                                 <div className="relative h-14 flex items-center mb-2">
                                     {/* Track Background */}
                                     <div className="absolute inset-x-0 h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50 shadow-inner">
                                         {/* Gradient: Blue (Quality) -> Purple (Balanced) -> Orange/Red (Speed) */}
                                         <div 
                                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 transition-all duration-300"
                                            style={{ width: `${(optimizationPref / 10) * 100}%` }}
                                         />
                                     </div>
                                     
                                     {/* Interactive Input */}
                                     <input 
                                         type="range" 
                                         min="1" 
                                         max="10" 
                                         step="1"
                                         value={optimizationPref}
                                         onChange={(e) => setOptimizationPref(parseInt(e.target.value))}
                                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                     />

                                     {/* Thumb (Visual Only) */}
                                     <div 
                                         className="absolute h-6 w-6 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.4)] border-2 border-slate-800 pointer-events-none transition-all duration-100 z-10 flex items-center justify-center"
                                         style={{ left: `calc(${((optimizationPref - 1) / 9) * 100}% - 12px)` }}
                                     >
                                         <div className={`w-2 h-2 rounded-full ${optimizationPref > 5 ? 'bg-orange-500' : 'bg-blue-500'}`} />
                                     </div>

                                     {/* Ticks/Labels */}
                                     <div className="absolute top-8 left-0 right-0 flex justify-between text-[10px] font-bold uppercase tracking-wider select-none pointer-events-none">
                                         <span className={`${optimizationPref <= 4 ? "text-blue-400" : "text-slate-600"} transition-colors flex flex-col items-start`}>
                                             {t.quality}
                                             <span className="text-[9px] font-normal opacity-70">Robustness</span>
                                         </span>
                                         <span className={`${optimizationPref > 4 && optimizationPref < 7 ? "text-purple-400" : "text-slate-600"} transition-colors`}>{t.balanced}</span>
                                         <span className={`${optimizationPref >= 7 ? "text-orange-400" : "text-slate-600"} transition-colors flex flex-col items-end`}>
                                             {t.speed}
                                             <span className="text-[9px] font-normal opacity-70">Max FPS</span>
                                         </span>
                                     </div>
                                 </div>
                                 
                                 {/* Dynamic Helper Text */}
                                 <div className="mt-4 p-2.5 rounded-lg bg-slate-800/50 border border-slate-700/50 flex items-start gap-2 animate-in fade-in">
                                     <Info className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                     <p className="text-xs text-slate-300 leading-tight">
                                        {getPrefDescription()}
                                     </p>
                                 </div>
                             </div>
                         )}

                         <button 
                            onClick={handleAction}
                            disabled={loading || !inputCode}
                            className={`w-full py-4 rounded-xl text-sm font-bold text-white shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                                mode === 'FIX' 
                                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-900/20' 
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-900/20'
                            }`}
                         >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                            {loading ? (mode === 'FIX' ? t.analyzing : t.transpiling) : (mode === 'FIX' ? t.analyzeBtn : t.transpileBtn)}
                         </button>
                     </div>
                 </div>

                 {/* RIGHT: OUTPUT */}
                 <div className="flex flex-col bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden relative group hover:border-slate-700 transition-colors">
                     <div className="p-4 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center backdrop-blur-sm">
                         <span className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-2">
                            {mode === 'FIX' ? <Zap className="w-3 h-3" /> : <FileCode className="w-3 h-3" />} 
                            {mode === 'FIX' ? t.fixedCode : 'C++ / CMake'}
                         </span>
                         {currentResult && (
                            <button 
                                onClick={() => handleCopy(resultText || '')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${
                                    copied 
                                    ? 'bg-green-500 text-white shadow-green-500/20' 
                                    : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-cyan-500/20'
                                }`}
                            >
                                {copied ? <ClipboardCheck className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                {copied ? 'COPIED!' : 'COPY CODE'}
                            </button>
                         )}
                     </div>
                     
                     {currentResult ? (
                         <div className="flex-1 flex flex-col min-h-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                             <div className="flex-1 overflow-auto bg-[#0d1117] relative custom-scrollbar">
                                <div className="absolute top-2 right-2 px-2 py-1 rounded bg-slate-800/50 text-[10px] text-slate-500 font-mono">
                                    {mode === 'FIX' ? 'Python' : 'C++'}
                                </div>
                                <pre className="p-6 text-sm font-mono text-green-100/90 whitespace-pre-wrap leading-relaxed selection:bg-green-900/30">
                                    {resultText}
                                </pre>
                             </div>
                             
                             <div className="p-5 bg-slate-800/30 border-t border-slate-800 max-h-48 overflow-y-auto">
                                 <h4 className="text-xs font-bold text-cyan-400 uppercase mb-2 flex items-center gap-2">
                                     <Activity className="w-3 h-3" /> {t.explanation}
                                 </h4>
                                 <div className="text-sm text-slate-300 space-y-1.5 leading-relaxed">
                                     {(mode === 'FIX' ? fixResult?.explanation : cppResult?.explanation)?.split('\n').map((line, i) => (
                                         <p key={i}>{line}</p>
                                     ))}
                                 </div>
                             </div>
                         </div>
                     ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-slate-600 p-8 text-center bg-[#0d1117]/50">
                             <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-700/50">
                                <AlertTriangle className="w-8 h-8 opacity-40" />
                             </div>
                             <p className="text-sm font-medium text-slate-500">
                                 {loading ? "Processing your request..." : "Enter code and click optimize to see results"}
                             </p>
                         </div>
                     )}
                     
                     {/* Loading Overlay */}
                     {loading && (
                         <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                             <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mb-3" />
                             <p className="text-cyan-400 font-bold animate-pulse">
                                 {mode === 'FIX' ? 'Analyzing & Refactoring...' : 'Transpiling to C++...'}
                             </p>
                         </div>
                     )}
                 </div>
             </div>
        </div>
    );
};

export default CodeCorrector;
