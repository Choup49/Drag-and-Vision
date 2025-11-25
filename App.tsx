
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import PipelineStudio from './components/PipelineStudio';
import ChallengeMode from './components/ChallengeMode';
import CustomFunctionEditor from './components/CustomFunctionEditor';
import CodeCorrector from './components/CodeCorrector';
import { ViewState, NodeDefinition, Language, Challenge } from './types';
import { CHALLENGES } from './constants';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('STUDIO');
  const [language, setLanguage] = useState<Language>('en');
  const [customNodes, setCustomNodes] = useState<NodeDefinition[]>([]);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [userChallenges, setUserChallenges] = useState<Challenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<Record<string, { date: string }>>({});

  const handleCustomNodeCreated = (node: NodeDefinition) => {
    setCustomNodes(prev => [...prev, node]);
    setCurrentView('STUDIO'); 
  };

  const handleImportCommunityNode = (node: NodeDefinition) => {
      // Clone the node to avoid reference issues
      const importedNode = { ...node, id: `imported_${Date.now()}` };
      setCustomNodes(prev => [...prev, importedNode]);
  };

  const handleEnterChallengeWorkspace = (challenge: Challenge) => {
      setActiveChallenge(challenge);
      setCurrentView('CHALLENGE_WORKSPACE');
  };

  const handleExitChallenge = () => {
      setActiveChallenge(null);
      setCurrentView('CHALLENGES');
  };

  const handleChallengeComplete = (challengeId: string) => {
      setCompletedChallenges(prev => ({
          ...prev,
          [challengeId]: { date: new Date().toISOString() }
      }));
  };

  const getChallengesWithStatus = () => {
      return [...CHALLENGES, ...userChallenges].map(c => ({
          ...c,
          isCompleted: !!completedChallenges[c.id],
          completionDate: completedChallenges[c.id]?.date || null
      }));
  };

  const renderContent = () => {
    switch (currentView) {
      case 'STUDIO':
        return <PipelineStudio 
            customNodes={customNodes} 
            language={language}
            onImportCommunityNode={handleImportCommunityNode}
        />;
      case 'CHALLENGES':
        return <ChallengeMode 
            language={language} 
            onEnterChallengeWorkspace={handleEnterChallengeWorkspace} 
            userChallenges={getChallengesWithStatus().filter(c => c.isUserCreated)}
            allChallengesWithStatus={getChallengesWithStatus()} // Pass full list with status
            onSaveChallenge={(c) => setUserChallenges([...userChallenges, c])}
        />;
      case 'EDITOR':
        return <CustomFunctionEditor onNodeCreated={handleCustomNodeCreated} language={language} />;
      case 'CORRECTOR':
        return <CodeCorrector language={language} />;
      case 'CHALLENGE_WORKSPACE':
        return (
            <PipelineStudio 
                key="challenge-workspace"
                customNodes={[]} // No custom nodes in challenge mode
                language={language}
                activeChallenge={activeChallenge}
                onExitChallenge={handleExitChallenge}
                onChallengeComplete={handleChallengeComplete}
            />
        );
      default:
        return <PipelineStudio customNodes={customNodes} language={language} />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
      <Sidebar 
        currentView={currentView === 'CHALLENGE_WORKSPACE' ? 'CHALLENGES' : currentView} 
        onChangeView={(view) => {
            if (currentView === 'CHALLENGE_WORKSPACE' && view !== 'CHALLENGES') {
                setActiveChallenge(null);
            }
            setCurrentView(view);
        }} 
        language={language}
        onToggleLanguage={() => setLanguage(l => l === 'en' ? 'fr' : 'en')}
      />
      <main className="flex-1 overflow-hidden relative">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
