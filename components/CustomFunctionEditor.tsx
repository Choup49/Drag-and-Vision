
import React, { useState } from 'react';
import { generatePythonCode } from '../services/geminiService';
import { Code, Sparkles, Box, ArrowRight, Loader2, PenTool } from 'lucide-react';
import { NodeDefinition, NodeType, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface CustomFunctionEditorProps {
    onNodeCreated: (node: NodeDefinition) => void;
    language: Language;
}

const CustomFunctionEditor: React.FC<CustomFunctionEditorProps> = ({ onNodeCreated, language }) => {
  const [mode, setMode] = useState<'AI' | 'MANUAL'>('AI');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [manualCode, setManualCode] = useState(`class CustomNode:\n    def process(self, input_frame):\n        # ${TRANSLATIONS[language].classTemplate}\n        output = input_frame\n        return output`);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  
  const t = TRANSLATIONS[language];

  const handleCreate = async () => {
    if (!name.trim()) return;
    
    let finalCode = '';
    let finalDesc = description;

    if (mode === 'AI') {
        if (!description.trim()) return;
        setIsGenerating(true);
        setError('');
        
        const codeBody = await generatePythonCode(description);
        
        if (codeBody.startsWith('# Error')) {
            setError("Failed to generate valid code. Please try a different description.");
            setIsGenerating(false);
            return;
        }
        finalCode = codeBody;
    } else {
        // Manual mode: we just wrap the code in the template structure for the studio
        finalCode = manualCode;
        if (!finalDesc) finalDesc = "Custom Manual Node";
    }

    const newNode: NodeDefinition = {
        id: `custom_${Date.now()}`,
        name: name,
        name_fr: name,
        type: NodeType.CUSTOM,
        description: finalDesc,
        description_fr: finalDesc,
        category: 'custom',
        library: 'Custom',
        pythonClass: 'CustomFunc',
        pythonTemplate: mode === 'AI' ? `
# Custom Node: ${name}
# Logic: ${description}
${finalCode}
` : `
# Custom Node: ${name}
# Manual Implementation
# Note: In a real export, this would be a class method.
# For this script generator, we assume the user wrote linear execution lines or we adapt it.
# If user wrote 'class ...', we might need to adjust. For now, we wrap it loosely.
${manualCode}
`,
        requiredImports: ['cv2', 'numpy as np'],
        inputs: 1,
        outputs: 1
    };

    onNodeCreated(newNode);
    setIsGenerating(false);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-950 p-8">
      <div className="max-w-lg w-full bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        
        <div className="p-8 border-b border-slate-800 text-center relative">
            <div className="absolute top-4 right-4 flex bg-slate-800 rounded-lg p-1">
                 <button onClick={() => setMode('AI')} className={`p-2 rounded ${mode === 'AI' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}><Sparkles className="w-4 h-4"/></button>
                 <button onClick={() => setMode('MANUAL')} className={`p-2 rounded ${mode === 'MANUAL' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}><PenTool className="w-4 h-4"/></button>
            </div>
            <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {mode === 'AI' ? <Sparkles className="w-8 h-8 text-purple-400" /> : <PenTool className="w-8 h-8 text-blue-400" />}
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{mode === 'AI' ? t.genNode : t.manualMode}</h2>
            <p className="text-slate-400 text-sm">{mode === 'AI' ? t.descNode : "Write your own Python VisionNode class."}</p>
        </div>

        <div className="p-8 space-y-6">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.nodeName}</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Box className="h-4 w-4 text-slate-500" />
                    </div>
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="MyNode"
                        className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-lg leading-5 bg-slate-950 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all"
                    />
                </div>
            </div>

            {mode === 'AI' ? (
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.nodeLogic}</label>
                    <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        placeholder="e.g., Detect all red circles in the image and draw a green rectangle around them."
                        className="block w-full p-3 border border-slate-700 rounded-lg leading-relaxed bg-slate-950 text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm transition-all resize-none"
                    />
                </div>
            ) : (
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Python Code</label>
                    <textarea 
                        value={manualCode}
                        onChange={(e) => setManualCode(e.target.value)}
                        rows={8}
                        className="block w-full p-3 border border-slate-700 rounded-lg font-mono text-xs leading-relaxed bg-[#0d1117] text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    />
                </div>
            )}

            {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-xs">
                    {error}
                </div>
            )}

            <button 
                onClick={handleCreate}
                disabled={isGenerating || !name || (mode === 'AI' && !description)}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${mode === 'AI' ? 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 focus:ring-cyan-500' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 focus:ring-blue-500'}`}
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" /> {t.generating}
                    </>
                ) : (
                    <>
                        {mode === 'AI' ? <Sparkles className="w-5 h-5" /> : <Code className="w-5 h-5" />} {t.generateBtn}
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default CustomFunctionEditor;
