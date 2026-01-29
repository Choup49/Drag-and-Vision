
import React, { useState } from 'react';
import { CHALLENGES, TRANSLATIONS } from '../constants';
import { Challenge, Language } from '../types';
import { Lock, CheckCircle, ArrowRight, Lightbulb, PlayCircle, PlusCircle, Save } from 'lucide-react';
import { getChallengeHint } from '../services/geminiService';

interface ChallengeModeProps {
    language: Language;
    onEnterChallengeWorkspace: (challenge: Challenge) => void;
    userChallenges: Challenge[];
    onSaveChallenge: (c: Challenge) => void;
    allChallengesWithStatus?: Challenge[]; 
}

const ChallengeMode: React.FC<ChallengeModeProps> = ({ language, onEnterChallengeWorkspace, userChallenges, onSaveChallenge, allChallengesWithStatus }) => {
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [hint, setHint] = useState<string>('');
  const [loadingHint, setLoadingHint] = useState(false);
  const [mode, setMode] = useState<'LIST' | 'CREATOR'>('LIST');
  
  // Creator State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newObjs, setNewObjs] = useState('');

  // Filters
  const [diffFilter, setDiffFilter] = useState<string>('All');
  const [themeFilter, setThemeFilter] = useState<string>('All');

  const t = TRANSLATIONS[language];

  const handleStart = (challenge: Challenge) => {
    setActiveChallenge(challenge);
    setHint('');
  };

  const handleCreateChallenge = () => {
    if (!newTitle || !newDesc) return;
    const newChallenge: Challenge = {
        id: `custom_ch_${Date.now()}`,
        title: newTitle,
        title_fr: newTitle,
        description: newDesc,
        description_fr: newDesc,
        difficulty: 'Custom',
        theme: 'Creative',
        objectives: newObjs.split('\n').filter(l => l.trim()),
        objectives_fr: newObjs.split('\n').filter(l => l.trim()),
        locked: false,
        isUserCreated: true
    };
    onSaveChallenge(newChallenge);
    setMode('LIST');
    setNewTitle('');
    setNewDesc('');
    setNewObjs('');
  };

  const fetchHint = async () => {
    if (!activeChallenge) return;
    setLoadingHint(true);
    const text = await getChallengeHint(activeChallenge.title);
    setHint(text);
    setLoadingHint(false);
  };

  const challengeList = allChallengesWithStatus || [...CHALLENGES, ...userChallenges];

  const filteredChallenges = challengeList.filter(c => {
      if (diffFilter !== 'All' && c.difficulty !== diffFilter) return false;
      if (themeFilter !== 'All' && c.theme !== themeFilter) return false;
      return true;
  });

  const getChallengeTitle = (c: Challenge) => (language === 'fr' && c.title_fr ? c.title_fr : c.title);
  const getChallengeDesc = (c: Challenge) => (language === 'fr' && c.description_fr ? c.description_fr : c.description);
  const getChallengeObjs = (c: Challenge) => (language === 'fr' && c.objectives_fr ? c.objectives_fr : c.objectives);

  if (activeChallenge) {
    return (
      <div className="flex flex-col h-full bg-slate-950 p-8 overflow-y-auto">
        <button 
          onClick={() => setActiveChallenge(null)}
          className="self-start mb-6 flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-medium"
        >
          ← {t.back}
        </button>

        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden max-w-4xl mx-auto w-full shadow-2xl animate-in fade-in slide-in-from-bottom-4">
          <div className="p-8 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                    activeChallenge.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                    activeChallenge.difficulty === 'Normal' ? 'bg-yellow-500/20 text-yellow-400' :
                    activeChallenge.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {activeChallenge.difficulty.toUpperCase()}
                  </span>
                  <span className="text-slate-500 text-sm font-mono">Theme: {activeChallenge.theme}</span>
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">{getChallengeTitle(activeChallenge)}</h1>
                <p className="text-slate-400 text-lg">{getChallengeDesc(activeChallenge)}</p>
              </div>
            </div>
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-500" />
                {t.objectives}
              </h3>
              <ul className="space-y-4">
                {getChallengeObjs(activeChallenge).map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-4 p-4 bg-slate-950/50 rounded-lg border border-slate-800/50">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-slate-700 flex items-center justify-center text-slate-700 text-xs font-bold mt-0.5">
                      {idx + 1}
                    </div>
                    <span className="text-slate-300">{obj}</span>
                  </li>
                ))}
              </ul>
              
              <div className="pt-6 border-t border-slate-800">
                <button 
                  onClick={fetchHint}
                  disabled={loadingHint || hint.length > 0}
                  className="flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  <Lightbulb className="w-4 h-4" />
                  {loadingHint ? "..." : t.consultAI}
                </button>
                {hint && (
                  <div className="mt-3 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-200 text-sm leading-relaxed animate-in fade-in slide-in-from-top-2">
                    <span className="font-bold block mb-1 text-purple-400">{t.aiHint}:</span>
                    {hint}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-cyan-500" />
                {t.workspace}
              </h3>
              <div className="flex-1 bg-slate-950 rounded-lg border border-slate-800 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>
                <div className="text-center relative z-10 p-6">
                  <p className="text-slate-500 mb-6 max-w-xs mx-auto">{t.openWorkspace}</p>
                  <button 
                    onClick={() => onEnterChallengeWorkspace(activeChallenge)}
                    className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2 mx-auto hover:scale-105"
                  >
                    Open Editor <ArrowRight className="w-4 h-4"/>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-slate-950 p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t.challenges}</h1>
            <p className="text-slate-400">Master Computer Vision concepts or create your own.</p>
          </div>
          
          <div className="flex gap-4 items-center">
             {mode === 'LIST' ? (
                <button 
                    onClick={() => setMode('CREATOR')}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20"
                >
                    <PlusCircle className="w-4 h-4" /> {t.createChallenge}
                </button>
             ) : (
                <button 
                    onClick={() => setMode('LIST')}
                    className="text-slate-400 hover:text-white px-4 py-2 rounded-lg text-sm font-bold"
                >
                    {t.back}
                </button>
             )}
          </div>
        </div>

        {mode === 'CREATOR' ? (
            <div className="bg-slate-900 p-8 rounded-xl border border-slate-800 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
                 <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                     <PlusCircle className="w-5 h-5 text-purple-400" /> {t.creatorMode}
                 </h2>
                 <div className="space-y-4">
                     <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.challengeTitle}</label>
                         <input 
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                         />
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.challengeDesc}</label>
                         <textarea 
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                            value={newDesc}
                            onChange={(e) => setNewDesc(e.target.value)}
                         />
                     </div>
                     <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.challengeObjs}</label>
                         <textarea 
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                            value={newObjs}
                            onChange={(e) => setNewObjs(e.target.value)}
                         />
                     </div>
                     <button 
                        onClick={handleCreateChallenge}
                        disabled={!newTitle || !newDesc}
                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
                     >
                         <Save className="w-4 h-4" /> {t.saveChallenge}
                     </button>
                 </div>
            </div>
        ) : (
            <>
                {/* Filters */}
                <div className="flex gap-4 mb-6 justify-end">
                    <div className="relative">
                        <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1 ml-1">{t.filterDiff}</label>
                        <select 
                            value={diffFilter} 
                            onChange={(e) => setDiffFilter(e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg p-2.5 pr-8 focus:ring-cyan-500 focus:border-cyan-500 block w-32 appearance-none"
                        >
                            <option value="All">{t.all}</option>
                            <option value="Easy">Easy</option>
                            <option value="Normal">Normal</option>
                            <option value="Hard">Hard</option>
                            <option value="Custom">Custom</option>
                        </select>
                    </div>
                    <div className="relative">
                        <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1 ml-1">{t.filterTheme}</label>
                        <select 
                            value={themeFilter} 
                            onChange={(e) => setThemeFilter(e.target.value)}
                            className="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg p-2.5 pr-8 focus:ring-cyan-500 focus:border-cyan-500 block w-36 appearance-none"
                        >
                            <option value="All">{t.all}</option>
                            <option value="Basic">Basic</option>
                            <option value="Tracking">Tracking</option>
                            <option value="Segmentation">Segmentation</option>
                            <option value="Optimization">Optimization</option>
                            <option value="Creative">Creative</option>
                            <option value="Community">Community</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChallenges.map((challenge) => (
                    <div 
                        key={challenge.id} 
                        className={`group relative bg-slate-900 rounded-xl border border-slate-800 p-6 transition-all duration-300 hover:border-cyan-500/30 hover:shadow-xl hover:-translate-y-1 ${challenge.locked ? 'opacity-60' : ''} ${challenge.isCompleted ? 'border-green-500/50 shadow-green-500/10' : ''}`}
                    >
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                            challenge.difficulty === 'Easy' ? 'bg-green-900/30 text-green-400' :
                            challenge.difficulty === 'Normal' ? 'bg-yellow-900/30 text-yellow-400' :
                            challenge.difficulty === 'Hard' ? 'bg-red-900/30 text-red-400' :
                            'bg-blue-900/30 text-blue-400'
                            }`}>
                            {challenge.difficulty}
                            </span>
                            <span className="px-2 py-1 rounded text-[10px] uppercase font-bold bg-slate-800 text-slate-400">
                                {challenge.theme}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            {challenge.isCompleted && <CheckCircle className="w-5 h-5 text-green-500 absolute top-3 right-3 z-10 animate-in fade-in" />}
                            {challenge.locked && <Lock className="w-4 h-4 text-slate-500" />}
                            {challenge.isUserCreated && <PlusCircle className="w-4 h-4 text-purple-500" />}
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors">
                        {getChallengeTitle(challenge)}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 line-clamp-2 h-10">
                        {getChallengeDesc(challenge)}
                    </p>

                    {challenge.locked ? (
                        <button disabled className="w-full py-2.5 rounded-lg bg-slate-800 text-slate-500 text-sm font-medium cursor-not-allowed border border-slate-700">
                        {t.locked}
                        </button>
                    ) : (
                        <button 
                            onClick={() => handleStart(challenge)}
                            className={`w-full py-2.5 rounded-lg text-sm font-medium border transition-all flex items-center justify-center gap-2 ${
                                challenge.isCompleted 
                                    ? 'bg-green-700/50 border-green-500 text-green-200 hover:bg-green-700/70' 
                                    : 'bg-slate-800 border-slate-700 text-white hover:bg-cyan-600 hover:border-cyan-500'
                            }`}
                        >
                            {challenge.isCompleted ? `${t.replay}` : `${t.start}`} 
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                    </div>
                ))}
                </div>
            </>
        )}
      </div>
    </div>
  );
};

export default ChallengeMode;
