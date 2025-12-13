import React, { useState } from 'react';
import { Users, Plus, X, Share2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: 'editor' | 'viewer';
  addedAt: string;
}

interface TeamSharingProps {
  sermonId: string;
  teamMembers: TeamMember[];
  onAddMember: (email: string, role: 'editor' | 'viewer') => void;
  onRemoveMember: (memberId: string) => void;
}

export const TeamSharing: React.FC<TeamSharingProps> = ({
  sermonId,
  teamMembers,
  onAddMember,
  onRemoveMember,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'editor' | 'viewer'>('viewer');
  const [error, setError] = useState('');

  const handleAddMember = () => {
    if (!email.trim()) {
      setError('Please enter an email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (teamMembers.some(m => m.email === email)) {
      setError('This person is already a team member');
      return;
    }

    onAddMember(email, role);
    setEmail('');
    setRole('viewer');
    setError('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Users className="h-3.5 w-3.5" />
        Team ({teamMembers.length})
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-bible-200 flex items-center justify-between">
              <h3 className="font-semibold text-bible-900 flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Team Sharing
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-bible-500 hover:text-bible-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              {/* Add Member Form */}
              <div className="space-y-3 pb-4 border-b border-bible-200">
                <div>
                  <label className="block text-sm font-medium text-bible-700 mb-1">
                    Add Team Member
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    placeholder="associate@church.com"
                    className="w-full px-3 py-2 border border-bible-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-bible-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-bible-700 mb-1">
                    Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'editor' | 'viewer')}
                    className="w-full px-3 py-2 border border-bible-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-bible-900"
                  >
                    <option value="viewer">Viewer (Read-only)</option>
                    <option value="editor">Editor (Can edit)</option>
                  </select>
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">
                    {error}
                  </div>
                )}

                <Button
                  size="sm"
                  onClick={handleAddMember}
                  className="w-full"
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Member
                </Button>
              </div>

              {/* Team Members List */}
              <div>
                <h4 className="text-sm font-medium text-bible-700 mb-2">
                  Team Members ({teamMembers.length})
                </h4>
                {teamMembers.length === 0 ? (
                  <p className="text-sm text-bible-500">No team members yet</p>
                ) : (
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {teamMembers.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-2 bg-bible-50 rounded"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-bible-900 truncate">
                            {member.name || member.email}
                          </p>
                          <p className="text-xs text-bible-500">
                            {member.role === 'editor' ? '✏️ Editor' : '👁️ Viewer'} • Added {formatDate(member.addedAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => onRemoveMember(member.id)}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-bible-200 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
