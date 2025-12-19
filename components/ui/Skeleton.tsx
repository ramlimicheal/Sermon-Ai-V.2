import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  animation = 'pulse',
}) => {
  const baseStyles = 'bg-gray-200';
  
  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: '',
    rounded: 'rounded-lg',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: '',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width || (variant === 'circular' ? height : '100%'),
    height: height || (variant === 'text' ? '1rem' : '100%'),
  };

  if (animation === 'wave') {
    return (
      <div
        className={`${baseStyles} ${variantStyles[variant]} ${className} overflow-hidden relative`}
        style={style}
      >
        <motion.div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
          animate={{ translateX: ['−100%', '100%'] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`}
      style={style}
    />
  );
};

// Pre-built skeleton patterns for common use cases
export const CommentarySkeleton: React.FC = () => (
  <div className="space-y-4 p-4">
    <div className="flex items-center gap-2">
      <Skeleton variant="circular" width={24} height={24} />
      <Skeleton width="40%" height={20} />
    </div>
    <div className="space-y-2">
      <Skeleton width="100%" />
      <Skeleton width="95%" />
      <Skeleton width="88%" />
    </div>
    <div className="space-y-2 pt-2">
      <Skeleton width="30%" height={16} />
      <Skeleton width="100%" />
      <Skeleton width="92%" />
      <Skeleton width="85%" />
    </div>
    <div className="space-y-2 pt-2">
      <Skeleton width="35%" height={16} />
      <Skeleton width="100%" />
      <Skeleton width="78%" />
    </div>
  </div>
);

export const IllustrationsSkeleton: React.FC = () => (
  <div className="space-y-4 p-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="p-3 border border-gray-100 rounded-lg space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton variant="rounded" width={60} height={20} />
          <Skeleton width="50%" height={18} />
        </div>
        <Skeleton width="100%" />
        <Skeleton width="90%" />
        <Skeleton width="70%" />
      </div>
    ))}
  </div>
);

export const OutlineSkeleton: React.FC = () => (
  <div className="space-y-4 p-4">
    <Skeleton width="60%" height={24} />
    <div className="space-y-3 pl-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton variant="circular" width={20} height={20} />
            <Skeleton width="45%" height={18} />
          </div>
          <div className="pl-7 space-y-1">
            <Skeleton width="80%" />
            <Skeleton width="65%" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const CardSkeleton: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="p-4 border border-gray-200 rounded-lg space-y-3">
    <div className="flex items-center justify-between">
      <Skeleton width="40%" height={20} />
      <Skeleton variant="circular" width={24} height={24} />
    </div>
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} width={`${100 - i * 10}%`} />
      ))}
    </div>
  </div>
);

export const SermonCardSkeleton: React.FC = () => (
  <div className="p-4 border border-gray-200 rounded-lg space-y-3 hover:shadow-sm transition-shadow">
    <div className="flex items-start justify-between">
      <div className="space-y-2 flex-1">
        <Skeleton width="70%" height={20} />
        <Skeleton width="40%" height={14} />
      </div>
      <Skeleton variant="rounded" width={60} height={24} />
    </div>
    <div className="flex items-center gap-4 pt-2">
      <Skeleton width={80} height={14} />
      <Skeleton width={60} height={14} />
      <Skeleton width={70} height={14} />
    </div>
  </div>
);

export const TableRowSkeleton: React.FC<{ columns?: number }> = ({ columns = 4 }) => (
  <div className="flex items-center gap-4 py-3 border-b border-gray-100">
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton key={i} width={`${100 / columns}%`} height={16} />
    ))}
  </div>
);

export const AvatarSkeleton: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 32,
    md: 40,
    lg: 56,
  };
  return <Skeleton variant="circular" width={sizes[size]} height={sizes[size]} />;
};

export const ButtonSkeleton: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: { width: 60, height: 32 },
    md: { width: 80, height: 36 },
    lg: { width: 100, height: 44 },
  };
  return <Skeleton variant="rounded" width={sizes[size].width} height={sizes[size].height} />;
};

// Loading state wrapper with skeleton
interface LoadingStateProps {
  isLoading: boolean;
  skeleton: React.ReactNode;
  children: React.ReactNode;
  minHeight?: string | number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  isLoading,
  skeleton,
  children,
  minHeight,
}) => {
  if (isLoading) {
    return <div style={{ minHeight }}>{skeleton}</div>;
  }
  return <>{children}</>;
};
