import React, { forwardRef } from 'react';
import classNames from 'classnames';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    leftIcon, 
    rightIcon, 
    className, 
    fullWidth = true,
    ...props 
  }, ref) => {
    return (
      <div className={classNames('mb-4', fullWidth ? 'w-full' : '')}>
        {label && (
          <label 
            htmlFor={props.id} 
            className="block text-sm font-medium text-secondary-700 mb-1"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={classNames(
              'shadow-sm rounded-md w-full border focus:ring-2 focus:ring-offset-0 transition-colors',
              leftIcon ? 'pl-10' : 'pl-3',
              rightIcon ? 'pr-10' : 'pr-3',
              error
                ? 'border-error-300 text-error-900 placeholder-error-300 focus:border-error-500 focus:ring-error-500'
                : 'border-secondary-300 focus:border-primary-500 focus:ring-primary-500',
              'py-2 text-secondary-900 placeholder-secondary-400',
              className
            )}
            {...props}
          />
          
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <p className={classNames(
            'mt-1 text-sm',
            error ? 'text-error-600' : 'text-secondary-500'
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;