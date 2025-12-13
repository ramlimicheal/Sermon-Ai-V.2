import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  scrollable?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  title, 
  icon, 
  action,
  scrollable = true 
}) => {
  return (
    <div className={`flex flex-col rounded-lg border border-bible-200 bg-white ${className}`}>
      {(title || icon || action) && (
        <div className="flex flex-row items-center justify-between px-4 py-3 border-b border-bible-100 shrink-0">
          <div className="flex items-center gap-2">
            {icon && <span className="text-bible-500">{icon}</span>}
            {title && <h3 className="text-sm font-medium text-bible-900">{title}</h3>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`p-4 ${scrollable ? 'flex-1 overflow-y-auto min-h-0' : ''}`}>
        {children}
      </div>
    </div>
  );
};