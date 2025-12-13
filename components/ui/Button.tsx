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
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bible-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-11 px-6 text-sm",
  };

  const variants = {
    // Solid dark - primary actions
    primary: "bg-bible-900 text-white hover:bg-bible-800",
    
    // Light background - secondary actions
    secondary: "bg-bible-100 text-bible-900 hover:bg-bible-200",
    
    // Border only
    outline: "border border-bible-200 bg-white text-bible-700 hover:bg-bible-50 hover:text-bible-900",
    
    // No background
    ghost: "text-bible-600 hover:bg-bible-100 hover:text-bible-900",
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