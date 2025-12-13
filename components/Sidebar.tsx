import React from 'react';
import { LayoutDashboard, PlusCircle, User, BookOpen, LogOut, Search, Settings, HelpCircle, ChevronRight } from 'lucide-react';

interface SidebarProps {
  currentView: 'dashboard' | 'new' | 'profile' | 'workspace';
  onChangeView: (view: 'dashboard' | 'new' | 'profile') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const mainNav = [
    { id: 'dashboard', label: 'Home', icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: 'new', label: 'New Sermon', icon: <PlusCircle className="h-4 w-4" /> },
  ];

  const utilityNav = [
    { id: 'profile', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
  ];

  const isActive = (id: string) => {
    if (id === 'dashboard' && currentView === 'workspace') return false; // Dashboard isn't active when in workspace
    if (id === 'new' && currentView === 'workspace') return true; // Keep 'New' active or maybe none? Let's generic it.
    return currentView === id;
  };

  return (
    <div className="w-64 bg-white border-r border-bible-200 flex flex-col h-full shrink-0 transition-all duration-300 font-sans">
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-bible-100/50">
        <div className="flex items-center gap-2 text-bible-900">
          <div className="bg-bible-900 text-white p-1.5 rounded-md">
             <BookOpen className="h-5 w-5" />
          </div>
          <span className="font-serif font-bold text-lg tracking-tight">SermonAI</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto py-6 px-4 space-y-8">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-bible-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full pl-9 pr-4 py-2 bg-bible-50 border border-bible-200 rounded-lg text-sm text-bible-700 focus:outline-none focus:ring-2 focus:ring-bible-200 transition-all placeholder:text-bible-400"
          />
        </div>

        {/* Main Navigation */}
        <div className="space-y-1">
          <div className="px-2 mb-2 text-xs font-semibold text-bible-400 uppercase tracking-wider">Main</div>
          {mainNav.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as any)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all group ${
                isActive(item.id)
                  ? 'bg-bible-100 text-bible-900 font-medium' 
                  : 'text-bible-500 hover:bg-bible-50 hover:text-bible-700'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Utility Navigation */}
        <div className="space-y-1">
          <div className="px-2 mb-2 text-xs font-semibold text-bible-400 uppercase tracking-wider">Utility</div>
          {utilityNav.map((item) => (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id as any)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md transition-all group ${
                isActive(item.id)
                  ? 'bg-bible-100 text-bible-900 font-medium' 
                  : 'text-bible-500 hover:bg-bible-50 hover:text-bible-700'
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </div>
            </button>
          ))}
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-bible-500 hover:bg-bible-50 hover:text-bible-700 transition-all">
             <HelpCircle className="h-4 w-4" />
             <span className="text-sm">Support</span>
          </button>
        </div>
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-bible-100">
        <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-bible-50 transition-colors text-left">
           <div className="h-8 w-8 rounded-full bg-bible-200 flex items-center justify-center text-bible-700 font-bold text-xs">
              PR
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-bible-900 truncate">Pastor Rev.</p>
              <p className="text-xs text-bible-500 truncate">pastor@church.org</p>
           </div>
           <LogOut className="h-4 w-4 text-bible-400" />
        </button>
      </div>
    </div>
  );
};