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
    <div className={`flex flex-col rounded-xl border border-bible-200 bg-white text-bible-900 shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${className}`}>
      {(title || icon || action) && (
        <div className="flex flex-row items-center justify-between space-y-0 px-5 py-4 border-b border-bible-100 bg-white rounded-t-xl shrink-0">
          <div className="flex items-center gap-2.5">
            {icon && <span className="text-bible-500">{icon}</span>}
            {title && <h3 className="font-sans text-sm font-bold uppercase tracking-wide text-bible-900">{title}</h3>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className={`p-5 ${scrollable ? 'flex-1 overflow-y-auto min-h-0' : ''}`}>
        {children}
      </div>
    </div>
  );
};