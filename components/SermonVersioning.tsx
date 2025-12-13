import React, { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, Copy, Trash2 } from 'lucide-react';
import { SermonVersion } from '@/types';
import { Button } from '@/components/ui/Button';

interface SermonVersioningProps {
  versions: SermonVersion[];
  currentVersionId?: string;
  onSelectVersion: (versionId: string) => void;
  onDeleteVersion: (versionId: string) => void;
  onRestoreVersion: (versionId: string) => void;
}

export const SermonVersioning: React.FC<SermonVersioningProps> = ({
  versions,
  currentVersionId,
  onSelectVersion,
  onDeleteVersion,
  onRestoreVersion,
}) => {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!versions || versions.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-bible-200 pt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-bible-50 rounded transition-colors"
      >
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-bible-500" />
          <span className="text-sm font-medium text-bible-700">Version History</span>
          <span className="text-xs text-bible-500">({versions.length})</span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-bible-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-bible-500" />
        )}
      </button>

      {expanded && (
        <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
          {versions.map((version, index) => (
            <div
              key={version.id}
              className={`p-3 rounded-md border transition-colors cursor-pointer ${
                currentVersionId === version.id
                  ? 'bg-bible-100 border-bible-300'
                  : 'bg-white border-bible-200 hover:bg-bible-50'
              }`}
              onClick={() => onSelectVersion(version.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-bible-700">
                      v{versions.length - index}
                    </span>
                    <span className="text-xs text-bible-500">
                      {formatDate(version.createdAt)}
                    </span>
                  </div>
                  {version.changeDescription && (
                    <p className="text-xs text-bible-600 mt-1 line-clamp-2">
                      {version.changeDescription}
                    </p>
                  )}
                  <p className="text-xs text-bible-500 mt-1">
                    {version.content.length} characters
                  </p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRestoreVersion(version.id);
                    }}
                    className="p-1 hover:bg-bible-200 rounded transition-colors"
                    title="Restore this version"
                  >
                    <Copy className="h-3.5 w-3.5 text-bible-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteVersion(version.id);
                    }}
                    className="p-1 hover:bg-red-100 rounded transition-colors"
                    title="Delete this version"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
