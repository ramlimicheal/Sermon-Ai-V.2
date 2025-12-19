import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  GripVertical, 
  Plus, 
  Trash2, 
  Type, 
  Quote, 
  List, 
  BookOpen, 
  Lightbulb,
  Target,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Copy,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export type BlockType = 
  | 'heading' 
  | 'paragraph' 
  | 'scripture' 
  | 'illustration' 
  | 'application' 
  | 'quote' 
  | 'bullet-list'
  | 'transition';

export interface SermonBlock {
  id: string;
  type: BlockType;
  content: string;
  metadata?: {
    reference?: string;
    source?: string;
    audience?: string;
  };
}

interface BlockEditorProps {
  blocks: SermonBlock[];
  onChange: (blocks: SermonBlock[]) => void;
  onInsertFromAI?: (blockId: string, type: BlockType) => void;
}

const blockTypeConfig: Record<BlockType, { 
  icon: React.ReactNode; 
  label: string; 
  placeholder: string;
  color: string;
}> = {
  heading: { 
    icon: <Type className="h-4 w-4" />, 
    label: 'Heading', 
    placeholder: 'Section heading...',
    color: 'border-l-blue-500'
  },
  paragraph: { 
    icon: <Type className="h-4 w-4" />, 
    label: 'Paragraph', 
    placeholder: 'Write your content...',
    color: 'border-l-gray-300'
  },
  scripture: { 
    icon: <BookOpen className="h-4 w-4" />, 
    label: 'Scripture', 
    placeholder: 'Enter scripture text...',
    color: 'border-l-amber-500'
  },
  illustration: { 
    icon: <Lightbulb className="h-4 w-4" />, 
    label: 'Illustration', 
    placeholder: 'Add an illustration or story...',
    color: 'border-l-purple-500'
  },
  application: { 
    icon: <Target className="h-4 w-4" />, 
    label: 'Application', 
    placeholder: 'Practical application point...',
    color: 'border-l-green-500'
  },
  quote: { 
    icon: <Quote className="h-4 w-4" />, 
    label: 'Quote', 
    placeholder: 'Add a quote...',
    color: 'border-l-rose-500'
  },
  'bullet-list': { 
    icon: <List className="h-4 w-4" />, 
    label: 'Bullet List', 
    placeholder: 'List item (one per line)...',
    color: 'border-l-indigo-500'
  },
  transition: { 
    icon: <MessageSquare className="h-4 w-4" />, 
    label: 'Transition', 
    placeholder: 'Transition to next point...',
    color: 'border-l-cyan-500'
  },
};

const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

interface BlockItemProps {
  block: SermonBlock;
  onUpdate: (id: string, content: string, metadata?: SermonBlock['metadata']) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onChangeType: (id: string, type: BlockType) => void;
  onInsertFromAI?: (blockId: string, type: BlockType) => void;
  isFirst: boolean;
  isLast: boolean;
}

const BlockItem: React.FC<BlockItemProps> = ({ 
  block, 
  onUpdate, 
  onDelete, 
  onDuplicate,
  onChangeType,
  onInsertFromAI,
  isFirst,
  isLast 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showTypeMenu, setShowTypeMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const config = blockTypeConfig[block.type];

  return (
    <Reorder.Item
      value={block}
      id={block.id}
      className="group"
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`relative bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow ${config.color} border-l-4`}
      >
        {/* Block Header */}
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
          {/* Drag Handle */}
          <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="h-4 w-4" />
          </div>
          
          {/* Block Type Selector */}
          <div className="relative">
            <button
              onClick={() => setShowTypeMenu(!showTypeMenu)}
              className="flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {config.icon}
              <span>{config.label}</span>
              <ChevronDown className="h-3 w-3" />
            </button>
            
            {showTypeMenu && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[160px]">
                {Object.entries(blockTypeConfig).map(([type, cfg]) => (
                  <button
                    key={type}
                    onClick={() => {
                      onChangeType(block.id, type as BlockType);
                      setShowTypeMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs hover:bg-gray-50 ${
                      block.type === type ? 'bg-gray-50 text-gray-900' : 'text-gray-600'
                    }`}
                  >
                    {cfg.icon}
                    <span>{cfg.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Metadata (for scripture reference, quote source, etc.) */}
          {(block.type === 'scripture' || block.type === 'quote') && (
            <input
              type="text"
              value={block.metadata?.reference || block.metadata?.source || ''}
              onChange={(e) => onUpdate(block.id, block.content, { 
                ...block.metadata, 
                [block.type === 'scripture' ? 'reference' : 'source']: e.target.value 
              })}
              placeholder={block.type === 'scripture' ? 'Reference (e.g., John 3:16)' : 'Source'}
              className="flex-1 text-xs text-gray-500 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-400"
            />
          )}
          
          <div className="flex-1" />
          
          {/* AI Insert Button */}
          {onInsertFromAI && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onInsertFromAI(block.id, block.type)}
            >
              <Sparkles className="h-3 w-3 mr-1 text-amber-500" />
              AI Fill
            </Button>
          )}
          
          {/* Expand/Collapse */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
          
          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            
            {showMoreMenu && (
              <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                <button
                  onClick={() => {
                    onDuplicate(block.id);
                    setShowMoreMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
                >
                  <Copy className="h-3 w-3" />
                  Duplicate
                </button>
                <button
                  onClick={() => {
                    onDelete(block.id);
                    setShowMoreMenu(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Block Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3">
                {block.type === 'heading' ? (
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) => onUpdate(block.id, e.target.value)}
                    placeholder={config.placeholder}
                    className="w-full text-lg font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-400"
                  />
                ) : (
                  <textarea
                    value={block.content}
                    onChange={(e) => onUpdate(block.id, e.target.value)}
                    placeholder={config.placeholder}
                    rows={block.type === 'bullet-list' ? 4 : 3}
                    className="w-full text-sm text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-gray-400 resize-none leading-relaxed"
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Reorder.Item>
  );
};

export const BlockEditor: React.FC<BlockEditorProps> = ({ blocks, onChange, onInsertFromAI }) => {
  const [showAddMenu, setShowAddMenu] = useState(false);

  const handleAddBlock = useCallback((type: BlockType) => {
    const newBlock: SermonBlock = {
      id: generateId(),
      type,
      content: '',
      metadata: {},
    };
    onChange([...blocks, newBlock]);
    setShowAddMenu(false);
  }, [blocks, onChange]);

  const handleUpdateBlock = useCallback((id: string, content: string, metadata?: SermonBlock['metadata']) => {
    onChange(blocks.map(block => 
      block.id === id ? { ...block, content, metadata: metadata || block.metadata } : block
    ));
  }, [blocks, onChange]);

  const handleDeleteBlock = useCallback((id: string) => {
    onChange(blocks.filter(block => block.id !== id));
  }, [blocks, onChange]);

  const handleDuplicateBlock = useCallback((id: string) => {
    const index = blocks.findIndex(block => block.id === id);
    if (index !== -1) {
      const blockToDuplicate = blocks[index];
      const newBlock: SermonBlock = {
        ...blockToDuplicate,
        id: generateId(),
      };
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      onChange(newBlocks);
    }
  }, [blocks, onChange]);

  const handleChangeBlockType = useCallback((id: string, type: BlockType) => {
    onChange(blocks.map(block => 
      block.id === id ? { ...block, type } : block
    ));
  }, [blocks, onChange]);

  return (
    <div className="h-full flex flex-col">
      {/* Editor Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Type className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Sermon Editor</span>
          <span className="text-xs text-gray-400">({blocks.length} blocks)</span>
        </div>
        
        {/* Add Block Button */}
        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="h-8"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Block
          </Button>
          
          {showAddMenu && (
            <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20 min-w-[200px]">
              <div className="px-3 py-1 text-xs font-medium text-gray-400 uppercase">Block Types</div>
              {Object.entries(blockTypeConfig).map(([type, cfg]) => (
                <button
                  key={type}
                  onClick={() => handleAddBlock(type as BlockType)}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span className={`p-1.5 rounded ${cfg.color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
                    {cfg.icon}
                  </span>
                  <div className="text-left">
                    <div className="font-medium">{cfg.label}</div>
                    <div className="text-xs text-gray-400">{cfg.placeholder}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Blocks List */}
      <div className="flex-1 overflow-y-auto p-4">
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Type className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Start Your Sermon</h3>
            <p className="text-sm text-gray-500 mb-6 max-w-sm">
              Add blocks to build your sermon structure. Use headings, paragraphs, scripture, illustrations, and more.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {['heading', 'paragraph', 'scripture'].map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddBlock(type as BlockType)}
                >
                  {blockTypeConfig[type as BlockType].icon}
                  <span className="ml-1.5">{blockTypeConfig[type as BlockType].label}</span>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <Reorder.Group
            axis="y"
            values={blocks}
            onReorder={onChange}
            className="space-y-3"
          >
            {blocks.map((block, index) => (
              <BlockItem
                key={block.id}
                block={block}
                onUpdate={handleUpdateBlock}
                onDelete={handleDeleteBlock}
                onDuplicate={handleDuplicateBlock}
                onChangeType={handleChangeBlockType}
                onInsertFromAI={onInsertFromAI}
                isFirst={index === 0}
                isLast={index === blocks.length - 1}
              />
            ))}
          </Reorder.Group>
        )}
        
        {/* Quick Add at Bottom */}
        {blocks.length > 0 && (
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowAddMenu(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add another block
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlockEditor;
