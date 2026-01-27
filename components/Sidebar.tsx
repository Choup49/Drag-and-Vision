
import React, { useState, useEffect } from 'react';
import { ViewState, Language } from '../types';
import { GitMerge, Trophy, Code, Settings, Video, Languages, Stethoscope, Maximize, Minimize } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  language: Language;
  onToggleLanguage: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, language, onToggleLanguage }) => {
  const t = TRANSLATIONS[language];
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const menuItems: { id: ViewState; label: string; icon: React.ElementType }[] = [
    { id: 'STUDIO', label: t.studio, icon: GitMerge },
    { id: 'EDITOR', label: t.createNode, icon: Code },
    { id: 'CHALLENGES', label: t.challenges, icon: Trophy },
    { id: 'CORRECTOR', label: t.corrector, icon: Stethoscope },
  ];

  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3 border-b border-slate-800">
        <div className="p-2 bg-cyan-500/10 rounded-lg">
          <Video className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h1 className="font-bold text-slate-100 tracking-tight">PyVisionLab</h1>
          <p className="text-xs text-slate-500">Studio v2.3</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-cyan-500/10 text-cyan-400'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-2">
        <button 
          onClick={toggleFullscreen}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          <span className="font-medium">{isFullscreen ? t.exitFullscreen : t.fullscreen}</span>
        </button>
        <button 
          onClick={onToggleLanguage}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
        >
          <Languages className="w-5 h-5" />
          <span className="font-medium">{language === 'en' ? 'Français' : 'English'}</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors">
          <Settings className="w-5 h-5" />
          <span className="font-medium">{t.settings}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
