import React from 'react';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost' | 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'default' | 'icon' | 'sm';
}

export const Button = ({
  children,
  className = '',
  variant = 'default',
  size = 'default',
  ...props
}: ButtonProps) => {
  const variantClasses = {
    default: 'bg-blue-600 text-white hover:bg-blue-500',
    ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-white/10',
    primary: 'bg-blue-600 text-white hover:bg-blue-500',
    secondary: 'bg-gray-800 text-white hover:bg-gray-700',
    danger: 'bg-red-600 text-white hover:bg-red-500',
    outline: 'bg-transparent text-gray-900 border border-gray-300 hover:bg-gray-100 dark:text-white dark:border-gray-600 dark:hover:bg-white/10',
  }[variant];

  const sizeClasses = {
    default: 'px-3 py-2 text-sm',
    icon: 'p-2',
    sm: 'px-2 py-1 text-sm',
  }[size];

  return (
    <button
      className={`rounded-2xl inline-flex items-center justify-center gap-2 border border-transparent px-3 py-2 text-sm transition-all duration-300 ease-out shadow-sm hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 ${variantClasses} ${sizeClasses} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;