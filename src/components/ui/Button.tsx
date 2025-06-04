import React from 'react';
import { cn } from '../../lib/utils';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactNode;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-500': variant === 'primary',
            'bg-secondary-400 text-white hover:bg-secondary-500 focus-visible:ring-secondary-400': variant === 'secondary',
            'border border-text-secondary bg-bg-card-light hover:bg-gray-100 hover:text-text-primary focus-visible:ring-primary-500 dark:border-gray-600 dark:bg-bg-card-dark dark:hover:bg-gray-700': variant === 'outline',
            'hover:bg-gray-100 hover:text-text-primary focus-visible:ring-primary-500 dark:hover:bg-gray-800': variant === 'ghost',
            'text-primary-500 underline-offset-4 hover:underline focus-visible:ring-primary-500': variant === 'link',
            'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500': variant === 'danger',
            'h-9 px-3 text-sm': size === 'sm',
            'h-10 px-4 py-2': size === 'md',
            'h-11 px-8 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';