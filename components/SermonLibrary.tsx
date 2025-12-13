import React, { useEffect, useState } from 'react';
import { getSermons, deleteSermon, getProfile } from '../services/storageService';
import { SavedSermon, UserProfile } from '../types';
import { Button } from './ui/Button';
import { Trash2, ArrowRight, BookOpen, MoreHorizontal, FileText, TrendingUp, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';

interface SermonLibraryProps {
  onOpenSermon: (sermon: SavedSermon) => void;
  onNewSermon: () => void;
}

export const SermonLibrary: React.FC<SermonLibraryProps> = ({ onOpenSermon, onNewSermon }) => {
  const [sermons, setSermons] = useState<SavedSermon[]>([]);
  const [profile, setProfile] = useState<UserProfile>({ name: '', churchName: '' });

  useEffect(() => {
    setSermons(getSermons());
    setProfile(getProfile());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this sermon?')) {
      deleteSermon(id);
      setSermons(getSermons());
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-bible-50 p-6 lg:p-8 font-sans">
      {/* Hero Banner Section */}
      <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-r from-bible-800 to-bible-700 shadow-xl shadow-bible-900/5 text-white">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sparkles className="h-48 w-48 text-white" />
        </div>
        <div className="relative z-10 p-8 lg:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-bible-300 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider bg-white/10 px-2 py-1 rounded">Dashboard</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-3">
              Welcome, {profile.name ? profile.name.split(' ')[0] : 'Pastor'}.
            </h1>
            <p className="text-bible-200 max-w-lg text-sm lg:text-base leading-relaxed font-light">
              Ready to prepare your next message? You have <span className="font-semibold text-white">{sermons.length}</span> active research projects in your library.
            </p>
          </div>
          <div className="flex shrink-0">
             <Button onClick={onNewSermon} className="bg-white text-bible-900 hover:bg-bible-50 border-none shadow-md px-6 py-3 h-auto text-sm font-bold">
                <Sparkles className="h-4 w-4 mr-2 text-orange-500" /> Start New Sermon
             </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
         <div className="bg-white p-6 rounded-xl border border-bible-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <span className="text-bible-500 text-xs font-bold uppercase tracking-wider">Total Projects</span>
                <div className="p-2 bg-bible-50 rounded-lg">
                     <BookOpen className="h-4 w-4 text-bible-600" />
                </div>
            </div>
            <div className="flex items-end gap-3">
                <span className="text-4xl font-serif font-bold text-bible-900">{sermons.length}</span>
                <span className="flex items-center text-xs font-medium text-green-700 bg-green-50 border border-green-100 px-2 py-1 rounded-full mb-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> Active
                </span>
            </div>
         </div>

         <div className="bg-white p-6 rounded-xl border border-bible-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <span className="text-bible-500 text-xs font-bold uppercase tracking-wider">Est. Time Saved</span>
                <div className="p-2 bg-bible-50 rounded-lg">
                     <TrendingUp className="h-4 w-4 text-bible-600" />
                </div>
            </div>
             <div className="flex items-end gap-3">
                <span className="text-4xl font-serif font-bold text-bible-900">{sermons.length * 5}h</span>
                <span className="flex items-center text-xs font-medium text-bible-500 bg-bible-50 border border-bible-100 px-2 py-1 rounded-full mb-1">
                    Research hours
                </span>
            </div>
         </div>

         <div className="bg-gradient-to-br from-white to-orange-50/50 p-6 rounded-xl border border-bible-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <span className="text-bible-500 text-xs font-bold uppercase tracking-wider">Next Sunday</span>
                <MoreHorizontal className="h-4 w-4 text-bible-400" />
            </div>
             <div className="flex flex-col gap-1 mt-1">
                <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Upcoming</span>
                <span className="text-lg font-bold text-bible-900 font-serif">Sunday Service</span>
                <span className="text-xs text-bible-500">Preparation in progress</span>
            </div>
         </div>
      </div>

      {/* Recent Messages Table */}
      <div className="bg-white border border-bible-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-bible-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
            <div>
                <h3 className="text-lg font-bold text-bible-900 font-serif">Recent Research</h3>
                <p className="text-sm text-bible-500 mt-1">Manage your ongoing sermon preparations</p>
            </div>
            <div className="flex gap-2">
                 <input 
                    type="text" 
                    placeholder="Search messages..." 
                    className="text-sm border border-bible-200 rounded-lg px-4 py-2 bg-bible-50 text-bible-900 focus:outline-none focus:border-bible-400 focus:bg-white w-full sm:w-64 transition-all shadow-sm"
                />
            </div>
        </div>

        {sermons.length === 0 ? (
           <div className="text-center py-20 bg-bible-50/30">
               <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-bible-100 shadow-sm">
                 <BookOpen className="h-8 w-8 text-bible-300" />
               </div>
               <h4 className="text-base font-semibold text-bible-900">No sermons drafted yet</h4>
               <p className="text-sm text-bible-500 mt-2 mb-6 max-w-xs mx-auto">Your library is empty. Start a new research project to see it appear here.</p>
               <Button onClick={onNewSermon} variant="primary">Create First Sermon</Button>
           </div>
        ) : (
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-bible-50 border-b border-bible-100 text-xs uppercase text-bible-500 font-bold tracking-wider">
                        <tr>
                            <th className="px-6 py-4 w-12 text-center">
                                <input type="checkbox" className="rounded border-bible-300 text-bible-600 focus:ring-bible-500" />
                            </th>
                            <th className="px-6 py-4">Sermon Topic</th>
                            <th className="px-6 py-4">Language</th>
                            <th className="px-6 py-4">Created</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-bible-100">
                        {sermons.map((sermon) => (
                            <tr key={sermon.id} className="hover:bg-bible-50/60 transition-colors group cursor-pointer" onClick={() => onOpenSermon(sermon)}>
                                <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                                    <input type="checkbox" className="rounded border-bible-300 text-bible-600 focus:ring-bible-500" />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-lg bg-bible-100 flex items-center justify-center text-bible-600 shrink-0 border border-bible-200">
                                            <FileText className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-bible-900 group-hover:text-bible-700 font-serif text-base">{sermon.scripture}</p>
                                            <p className="text-xs text-bible-500">{sermon.title || 'Untitled Project'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold ${sermon.language === 'Tamil' ? 'bg-orange-50 text-orange-700 border border-orange-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                                        {sermon.language}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-bible-600 font-medium">
                                    {new Date(sermon.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td className="px-6 py-4">
                                     <div className="flex items-center gap-2">
                                        <div className="w-20 h-1.5 bg-bible-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-bible-400 w-1/3 rounded-full"></div>
                                        </div>
                                        <span className="text-xs text-bible-500 font-medium">Draft</span>
                                     </div>
                                </td>
                                <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                    <div className="flex items-center justify-end gap-2">
                                        <Button variant="secondary" size="sm" onClick={() => onOpenSermon(sermon)} className="h-8 shadow-sm">
                                            Open
                                        </Button>
                                        <button 
                                            className="p-2 text-bible-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                            onClick={(e) => handleDelete(sermon.id, e)}
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )}
      </div>
    </div>
  );
};