
import React, { useState } from 'react';
import { analyzeAndFixCode, transpileToCpp } from '../services/geminiService';
import { TRANSLATIONS } from '../constants';
import { Language } from '../types';
import { Stethoscope, ArrowRight, Check, Copy, Loader2, AlertTriangle, FileCode, Hammer, Zap, Activity, Scale } from 'lucide-react';

interface CodeCorrectorProps {
    language: Language;
}

const CodeCorrector: React.FC<CodeCorrectorProps> = ({ language }) => {
    const [inputCode, setInputCode] = useState('');
    const [mode, setMode] = useState<'FIX' | 'CPP'>('FIX');
    const [fixResult, setFixResult] = useState<{ fixedCode: string; explanation: string } | null>(null);
    const [cppResult, setCppResult] = useState<{ cppCode: string; cmakeCode: string; explanation: string } | null>(null);
    const [loading, setLoading] = useState(false);
    
    // Optimization Preference State (1 = Quality, 10 = Speed)
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

    return (
        <div className="h-full flex flex-col bg-slate-950 p-6 overflow-hidden">
             <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Zap className="w-6 h-6 text-cyan-400" /> {t.correctorTitle}
                    </h1>
                    <p className="text-slate-400">{t.correctorDesc}</p>
                </div>
                <div className="bg-slate-900 rounded-lg p-1 flex border border-slate-700">
                    <button 
                        onClick={() => setMode('FIX')} 
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === 'FIX' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        {t.optimize}
                    </button>
                    <button 
                        onClick={() => setMode('CPP')} 
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === 'CPP' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        {t.cppExport}
                    </button>
                </div>
             </div>

             <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                 {/* Input Side */}
                 <div className="flex flex-col bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
                     <div className="p-3 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                         <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Input Python</span>
                         <button 
                            onClick={handleAction}
                            disabled={loading || !inputCode}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-1.5 rounded-md text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-2"
                         >
                            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : mode === 'FIX' ? <Zap className="w-3 h-3" /> : <Hammer className="w-3 h-3" />}
                            {loading ? (mode === 'FIX' ? t.analyzing : t.transpiling) : (mode === 'FIX' ? t.analyzeBtn : t.transpileBtn)}
                         </button>
                     </div>
                     
                     {/* Optimizer Slider (Only in FIX mode) */}
                     {mode === 'FIX' && (
                         <div className="px-4 py-3 bg-slate-800/30 border-b border-slate-800">
                             <div className="flex justify-between items-end mb-2">
                                 <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.optPreference}</label>
                                 <span className={`text-xs font-bold ${optimizationPref > 5 ? 'text-green-400' : optimizationPref < 5 ? 'text-blue-400' : 'text-yellow-400'}`}>
                                     {optimizationPref > 5 ? t.speed : optimizationPref < 5 ? t.quality : t.balanced}
                                 </span>
                             </div>
                             <div className="relative h-6 flex items-center">
                                <Activity className="absolute left-0 w-4 h-4 text-blue-500" />
                                <Scale className="absolute left-1/2 -translate-x-1/2 w-4 h-4 text-yellow-500 opacity-50" />
                                <Zap className="absolute right-0 w-4 h-4 text-green-500" />
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="10" 
                                    step="1"
                                    value={optimizationPref}
                                    onChange={(e) => setOptimizationPref(parseInt(e.target.value))}
                                    className="w-full mx-6 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110"
                                />
                             </div>
                             <div className="flex justify-between text-[10px] text-slate-500 mt-1 px-6">
                                 <span>1</span>
                                 <span>5</span>
                                 <span>10</span>
                             </div>
                         </div>
                     )}

                     <textarea 
                        className="flex-1 w-full bg-[#0d1117] p-4 text-sm font-mono text-slate-300 resize-none focus:outline-none"
                        placeholder={t.pasteCode}
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        spellCheck={false}
                     />
                 </div>

                 {/* Output Side */}
                 <div className="flex flex-col bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden relative">
                     <div className="p-3 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                         <span className="text-xs font-bold text-green-400 uppercase tracking-wider flex items-center gap-2">
                            {mode === 'FIX' ? <Check className="w-3 h-3" /> : <FileCode className="w-3 h-3" />} 
                            {mode === 'FIX' ? t.fixedCode : 'C++ / CMake'}
                         </span>
                         {(mode === 'FIX' && fixResult) && (
                            <button 
                                onClick={() => navigator.clipboard.writeText(fixResult.fixedCode)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                         )}
                         {(mode === 'CPP' && cppResult) && (
                            <button 
                                onClick={() => navigator.clipboard.writeText(cppResult.cppCode)}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                         )}
                     </div>
                     
                     {(mode === 'FIX' ? fixResult : cppResult) ? (
                         <div className="flex-1 flex flex-col min-h-0">
                             <div className="flex-1 overflow-auto bg-[#0d1117] relative">
                                <pre className="p-4 text-sm font-mono text-green-100/90 whitespace-pre-wrap">
                                    {mode === 'FIX' ? fixResult?.fixedCode : 
                                     `// --- main.cpp ---\n${cppResult?.cppCode}\n\n# --- CMakeLists.txt ---\n${cppResult?.cmakeCode}`}
                                </pre>
                             </div>
                             <div className="p-4 bg-slate-800/50 border-t border-slate-700 max-h-48 overflow-y-auto">
                                 <h4 className="text-xs font-bold text-cyan-400 uppercase mb-2">{t.explanation}</h4>
                                 <div className="text-sm text-slate-300 space-y-1">
                                     {(mode === 'FIX' ? fixResult?.explanation : cppResult?.explanation)?.split('\n').map((line, i) => (
                                         <p key={i}>{line}</p>
                                     ))}
                                 </div>
                             </div>
                         </div>
                     ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-slate-600 p-8 text-center">
                             <AlertTriangle className="w-12 h-12 mb-4 opacity-20" />
                             <p className="text-sm">Waiting for action...</p>
                         </div>
                     )}
                 </div>
             </div>
        </div>
    );
};

export default CodeCorrector;
