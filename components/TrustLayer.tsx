import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Quote,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Shield,
  CheckCircle,
  AlertCircle,
  Info,
  Copy,
  Check,
  Bookmark,
} from 'lucide-react';

export interface Citation {
  id: string;
  type: 'scripture' | 'commentary' | 'book' | 'article' | 'website';
  reference: string;
  text?: string;
  author?: string;
  source?: string;
  url?: string;
  year?: string;
  verified?: boolean;
}

export interface VerseCard {
  reference: string;
  text: string;
  translation: string;
}

interface CitationBadgeProps {
  citation: Citation;
  onClick?: () => void;
}

export const CitationBadge: React.FC<CitationBadgeProps> = ({ citation, onClick }) => {
  const typeIcons = {
    scripture: <BookOpen className="h-3 w-3" />,
    commentary: <Quote className="h-3 w-3" />,
    book: <BookOpen className="h-3 w-3" />,
    article: <ExternalLink className="h-3 w-3" />,
    website: <ExternalLink className="h-3 w-3" />,
  };

  const typeColors = {
    scripture: 'bg-blue-50 text-blue-700 border-blue-200',
    commentary: 'bg-purple-50 text-purple-700 border-purple-200',
    book: 'bg-amber-50 text-amber-700 border-amber-200',
    article: 'bg-green-50 text-green-700 border-green-200',
    website: 'bg-gray-50 text-gray-700 border-gray-200',
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border transition-all hover:scale-105 ${typeColors[citation.type]}`}
    >
      {typeIcons[citation.type]}
      <span>{citation.reference}</span>
      {citation.verified && (
        <CheckCircle className="h-3 w-3 text-green-500" />
      )}
    </button>
  );
};

interface VerseCardComponentProps {
  verse: VerseCard;
  onInsert?: () => void;
  onBookmark?: () => void;
}

export const VerseCardComponent: React.FC<VerseCardComponentProps> = ({
  verse,
  onInsert,
  onBookmark,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(`${verse.reference} - ${verse.text}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 bg-gradient-to-br from-bible-50 to-white border border-bible-200 rounded-lg shadow-sm"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-bible-600" />
          <span className="font-semibold text-bible-900">{verse.reference}</span>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
          {verse.translation}
        </span>
      </div>
      <p className="text-gray-700 text-sm leading-relaxed italic mb-3">
        "{verse.text}"
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 text-green-500" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </button>
        {onInsert && (
          <button
            onClick={onInsert}
            className="flex items-center gap-1 px-2 py-1 text-xs text-bible-600 hover:text-bible-900 hover:bg-bible-50 rounded transition-colors"
          >
            Insert into sermon
          </button>
        )}
        {onBookmark && (
          <button
            onClick={onBookmark}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
          >
            <Bookmark className="h-3 w-3" />
            Save
          </button>
        )}
      </div>
    </motion.div>
  );
};

interface SourceAttributionProps {
  citations: Citation[];
  expanded?: boolean;
}

export const SourceAttribution: React.FC<SourceAttributionProps> = ({
  citations,
  expanded: initialExpanded = false,
}) => {
  const [expanded, setExpanded] = useState(initialExpanded);

  if (citations.length === 0) return null;

  return (
    <div className="mt-4 border-t border-gray-100 pt-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Shield className="h-3.5 w-3.5" />
        <span>{citations.length} source{citations.length > 1 ? 's' : ''} cited</span>
        {expanded ? (
          <ChevronUp className="h-3.5 w-3.5" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2">
              {citations.map((citation) => (
                <div
                  key={citation.id}
                  className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg text-xs"
                >
                  <CitationBadge citation={citation} />
                  <div className="flex-1">
                    {citation.author && (
                      <span className="font-medium">{citation.author}</span>
                    )}
                    {citation.source && (
                      <span className="text-gray-500">
                        {citation.author ? ', ' : ''}
                        {citation.source}
                      </span>
                    )}
                    {citation.year && (
                      <span className="text-gray-400"> ({citation.year})</span>
                    )}
                    {citation.text && (
                      <p className="text-gray-600 mt-1 italic">"{citation.text}"</p>
                    )}
                  </div>
                  {citation.url && (
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface TheologicalGuardrailProps {
  denomination?: string;
  tradition?: string;
  warnings?: string[];
}

export const TheologicalGuardrail: React.FC<TheologicalGuardrailProps> = ({
  denomination,
  tradition,
  warnings = [],
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex items-center gap-2 text-xs">
      <div className="flex items-center gap-1.5 px-2 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
        <Shield className="h-3 w-3" />
        <span>Aligned with {denomination || tradition || 'your tradition'}</span>
      </div>

      {warnings.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 px-2 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-200"
          >
            <AlertCircle className="h-3 w-3" />
            <span>{warnings.length} note{warnings.length > 1 ? 's' : ''}</span>
          </button>

          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-full mt-1 left-0 w-64 p-3 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
              >
                <div className="text-xs space-y-2">
                  {warnings.map((warning, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Info className="h-3.5 w-3.5 text-amber-500 mt-0.5 shrink-0" />
                      <span className="text-gray-600">{warning}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

interface AIOutputWithTrustProps {
  content: string;
  citations?: Citation[];
  denomination?: string;
  tradition?: string;
  onInsertContent?: (content: string) => void;
}

export const AIOutputWithTrust: React.FC<AIOutputWithTrustProps> = ({
  content,
  citations = [],
  denomination,
  tradition,
  onInsertContent,
}) => {
  return (
    <div className="space-y-3">
      {/* Trust indicators */}
      <div className="flex items-center justify-between">
        <TheologicalGuardrail denomination={denomination} tradition={tradition} />
        {onInsertContent && (
          <button
            onClick={() => onInsertContent(content)}
            className="text-xs text-bible-600 hover:text-bible-800 font-medium"
          >
            Insert into sermon →
          </button>
        )}
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none">
        {content}
      </div>

      {/* Inline citations */}
      {citations.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {citations.slice(0, 5).map((citation) => (
            <CitationBadge key={citation.id} citation={citation} />
          ))}
          {citations.length > 5 && (
            <span className="text-xs text-gray-500">
              +{citations.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Full source attribution */}
      <SourceAttribution citations={citations} />
    </div>
  );
};

// Demo citations for mock data
export const generateMockCitations = (scripture: string): Citation[] => [
  {
    id: '1',
    type: 'scripture',
    reference: scripture,
    text: 'Primary passage',
    verified: true,
  },
  {
    id: '2',
    type: 'commentary',
    reference: 'Matthew Henry',
    author: 'Matthew Henry',
    source: 'Commentary on the Whole Bible',
    year: '1706',
    verified: true,
  },
  {
    id: '3',
    type: 'book',
    reference: 'Carson, D.A.',
    author: 'D.A. Carson',
    source: 'The Gospel According to John',
    year: '1991',
    verified: true,
  },
  {
    id: '4',
    type: 'commentary',
    reference: 'Spurgeon',
    author: 'Charles Spurgeon',
    source: 'Treasury of David',
    year: '1885',
    verified: true,
  },
];
