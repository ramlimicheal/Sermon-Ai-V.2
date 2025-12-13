import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  size = 'md',
  className = '', 
  disabled, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bible-500/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";
  
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 py-2 text-sm",
    lg: "h-12 px-6 text-base",
  };

  const variants = {
    // Solid dark for primary actions - High contrast
    primary: "bg-bible-900 text-white hover:bg-black shadow-[0_1px_2px_rgba(0,0,0,0.1)] border border-transparent",
    
    // White with border for secondary - Clear distinction from background
    secondary: "bg-white text-bible-800 border border-bible-200 hover:bg-bible-50 hover:border-bible-300 shadow-[0_1px_2px_rgba(0,0,0,0.05)]",
    
    // Transparent with border
    outline: "border border-bible-300 bg-transparent text-bible-700 hover:bg-bible-50 hover:text-bible-900",
    
    // Minimalist for icons/text only
    ghost: "text-bible-500 hover:bg-bible-100/50 hover:text-bible-900",
  };

  return (
    <button 
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : null}
      {children}
    </button>
  );
};