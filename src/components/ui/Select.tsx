import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className, fullWidth = true, ...props }, ref) => {
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
          <select
            ref={ref}
            className={classNames(
              'block w-full pl-3 pr-10 py-2 text-base border-secondary-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 rounded-md appearance-none',
              error && 'border-error-300 focus:border-error-500 focus:ring-error-500',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <ChevronDown size={16} className="text-secondary-400" />
          </div>
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

Select.displayName = 'Select';

export default Select;