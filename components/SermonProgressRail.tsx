import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Lightbulb,
  FileText,
  PenTool,
  Presentation as PresentationIcon,
  Share2,
  Check,
  Circle,
  ChevronRight,
} from 'lucide-react';

export type SermonStage = 
  | 'exegesis'
  | 'bigIdea'
  | 'outline'
  | 'manuscript'
  | 'slides'
  | 'podium'
  | 'repurpose';

interface StageConfig {
  id: SermonStage;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
  description: string;
}

const stages: StageConfig[] = [
  {
    id: 'exegesis',
    label: 'Exegesis',
    shortLabel: 'Study',
    icon: <BookOpen className="h-4 w-4" />,
    description: 'Research and understand the passage',
  },
  {
    id: 'bigIdea',
    label: 'Big Idea',
    shortLabel: 'Idea',
    icon: <Lightbulb className="h-4 w-4" />,
    description: 'Identify the central message',
  },
  {
    id: 'outline',
    label: 'Outline',
    shortLabel: 'Plan',
    icon: <FileText className="h-4 w-4" />,
    description: 'Structure your sermon',
  },
  {
    id: 'manuscript',
    label: 'Manuscript',
    shortLabel: 'Write',
    icon: <PenTool className="h-4 w-4" />,
    description: 'Write your sermon notes',
  },
  {
    id: 'slides',
    label: 'Slides',
    shortLabel: 'Slides',
    icon: <PresentationIcon className="h-4 w-4" />,
    description: 'Create presentation slides',
  },
  {
    id: 'podium',
    label: 'Podium',
    shortLabel: 'Preach',
    icon: <PresentationIcon className="h-4 w-4" />,
    description: 'Deliver your sermon',
  },
  {
    id: 'repurpose',
    label: 'Repurpose',
    shortLabel: 'Share',
    icon: <Share2 className="h-4 w-4" />,
    description: 'Transform into other content',
  },
];

interface SermonProgressRailProps {
  currentStage: SermonStage;
  completedStages: SermonStage[];
  onStageClick?: (stage: SermonStage) => void;
  variant?: 'horizontal' | 'vertical' | 'compact';
  className?: string;
}

export const SermonProgressRail: React.FC<SermonProgressRailProps> = ({
  currentStage,
  completedStages,
  onStageClick,
  variant = 'horizontal',
  className = '',
}) => {
  const getStageStatus = (stageId: SermonStage) => {
    if (completedStages.includes(stageId)) return 'completed';
    if (stageId === currentStage) return 'current';
    return 'upcoming';
  };

  const currentIndex = stages.findIndex((s) => s.id === currentStage);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1 ${className}`}>
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.id);
          return (
            <React.Fragment key={stage.id}>
              <button
                onClick={() => onStageClick?.(stage.id)}
                className={`group relative flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                  status === 'completed'
                    ? 'bg-green-100 text-green-600'
                    : status === 'current'
                    ? 'bg-bible-100 text-bible-700 ring-2 ring-bible-300'
                    : 'bg-gray-100 text-gray-400'
                } ${onStageClick ? 'cursor-pointer hover:scale-110' : ''}`}
                title={stage.label}
              >
                {status === 'completed' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  stage.icon
                )}
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {stage.label}
                </div>
              </button>
              {index < stages.length - 1 && (
                <div
                  className={`w-4 h-0.5 ${
                    index < currentIndex ? 'bg-green-300' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.id);
          return (
            <div key={stage.id} className="flex items-start gap-3">
              {/* Line and dot */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => onStageClick?.(stage.id)}
                  className={`flex items-center justify-center w-8 h-8 rounded-full transition-all ${
                    status === 'completed'
                      ? 'bg-green-100 text-green-600'
                      : status === 'current'
                      ? 'bg-bible-100 text-bible-700 ring-2 ring-bible-300'
                      : 'bg-gray-100 text-gray-400'
                  } ${onStageClick ? 'cursor-pointer hover:scale-110' : ''}`}
                >
                  {status === 'completed' ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    stage.icon
                  )}
                </button>
                {index < stages.length - 1 && (
                  <div
                    className={`w-0.5 h-8 ${
                      index < currentIndex ? 'bg-green-300' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <div
                  className={`text-sm font-medium ${
                    status === 'current'
                      ? 'text-bible-900'
                      : status === 'completed'
                      ? 'text-green-700'
                      : 'text-gray-500'
                  }`}
                >
                  {stage.label}
                </div>
                <div className="text-xs text-gray-500">{stage.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal variant (default)
  return (
    <div className={`flex items-center ${className}`}>
      {stages.map((stage, index) => {
        const status = getStageStatus(stage.id);
        return (
          <React.Fragment key={stage.id}>
            <button
              onClick={() => onStageClick?.(stage.id)}
              className={`group flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
                status === 'current'
                  ? 'bg-bible-50'
                  : 'hover:bg-gray-50'
              } ${onStageClick ? 'cursor-pointer' : ''}`}
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                  status === 'completed'
                    ? 'bg-green-100 text-green-600'
                    : status === 'current'
                    ? 'bg-bible-100 text-bible-700 ring-2 ring-bible-300 ring-offset-2'
                    : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                }`}
              >
                {status === 'completed' ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  >
                    <Check className="h-5 w-5" />
                  </motion.div>
                ) : (
                  stage.icon
                )}
              </div>
              <span
                className={`text-xs font-medium ${
                  status === 'current'
                    ? 'text-bible-700'
                    : status === 'completed'
                    ? 'text-green-600'
                    : 'text-gray-500'
                }`}
              >
                {stage.shortLabel}
              </span>
            </button>

            {index < stages.length - 1 && (
              <div className="flex-1 flex items-center px-1">
                <div
                  className={`h-0.5 w-full rounded ${
                    index < currentIndex
                      ? 'bg-green-300'
                      : 'bg-gray-200'
                  }`}
                />
                <ChevronRight
                  className={`h-4 w-4 -ml-1 ${
                    index < currentIndex ? 'text-green-400' : 'text-gray-300'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// Mini progress indicator for header
export const SermonProgressMini: React.FC<{
  currentStage: SermonStage;
  completedStages: SermonStage[];
}> = ({ currentStage, completedStages }) => {
  const currentIndex = stages.findIndex((s) => s.id === currentStage);
  const progress = ((completedStages.length) / stages.length) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-bible-500 to-bible-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs text-gray-500">
        {completedStages.length}/{stages.length}
      </span>
    </div>
  );
};
