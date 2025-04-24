import React from 'react';
import classNames from 'classnames';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  footer?: React.ReactNode;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className,
  footer,
  hoverable = false,
}) => {
  return (
    <div
      className={classNames(
        'bg-white rounded-lg shadow-md overflow-hidden border border-secondary-100',
        hoverable && 'transition-all duration-200 hover:shadow-lg hover:-translate-y-1',
        className
      )}
    >
      {(title || subtitle) && (
        <div className="px-4 py-3 border-b border-secondary-100">
          {title && <h3 className="text-lg font-semibold text-secondary-800">{title}</h3>}
          {subtitle && <p className="mt-1 text-sm text-secondary-500">{subtitle}</p>}
        </div>
      )}
      <div className="p-4">{children}</div>
      {footer && (
        <div className="px-4 py-3 bg-secondary-50 border-t border-secondary-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;