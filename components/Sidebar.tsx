import React from 'react';
import { LayoutDashboard, PlusCircle, Settings, HelpCircle, BarChart3, BookOpen, LogOut } from 'lucide-react';

interface SidebarProps {
  currentView: 'dashboard' | 'new' | 'profile' | 'workspace' | 'analytics';
  onChangeView: (view: 'dashboard' | 'new' | 'profile' | 'analytics') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const mainNav = [
    { id: 'dashboard', label: 'Library', icon: LayoutDashboard },
    { id: 'new', label: 'New Sermon', icon: PlusCircle },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const utilityNav = [
    { id: 'profile', label: 'Settings', icon: Settings },
  ];

  const isActive = (id: string) => {
    if (id === 'dashboard' && currentView === 'workspace') return false;
    if (id === 'new' && currentView === 'workspace') return true;
    return currentView === id;
  };

  return (
    <div className="w-56 bg-white border-r border-bible-200 flex flex-col h-full shrink-0 font-sans">
      {/* Brand */}
      <div className="h-14 flex items-center px-4 border-b border-bible-100">
        <div className="flex items-center gap-2">
          <div className="bg-bible-900 text-white p-1.5 rounded">
            <BookOpen className="h-4 w-4" />
          </div>
          <span className="font-semibold text-bible-900 text-sm">Preachr</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 flex flex-col py-4 px-3">
        {/* Main Nav */}
        <div className="space-y-1">
          <div className="px-2 mb-2 text-[10px] font-medium text-bible-400 uppercase tracking-wider">Menu</div>
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                  isActive(item.id)
                    ? 'bg-bible-100 text-bible-900 font-medium' 
                    : 'text-bible-600 hover:bg-bible-50 hover:text-bible-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="my-4 h-px bg-bible-100" />

        {/* Utility Nav */}
        <div className="space-y-1">
          <div className="px-2 mb-2 text-[10px] font-medium text-bible-400 uppercase tracking-wider">Settings</div>
          {utilityNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onChangeView(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
                  isActive(item.id)
                    ? 'bg-bible-100 text-bible-900 font-medium' 
                    : 'text-bible-600 hover:bg-bible-50 hover:text-bible-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-bible-600 hover:bg-bible-50 hover:text-bible-900 transition-colors">
            <HelpCircle className="h-4 w-4" />
            <span>Help</span>
          </button>
        </div>
      </div>

      {/* User */}
      <div className="p-3 border-t border-bible-100">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-bible-50 transition-colors cursor-pointer">
          <div className="h-7 w-7 rounded-full bg-bible-200 flex items-center justify-center text-bible-700 text-xs font-medium">
            PR
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-bible-900 truncate">Pastor</p>
          </div>
          <LogOut className="h-3.5 w-3.5 text-bible-400" />
        </div>
      </div>
    </div>
  );
};