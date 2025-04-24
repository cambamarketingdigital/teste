import React from 'react';
import classNames from 'classnames';

interface TableProps {
  children: React.ReactNode;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
}

export const Table: React.FC<TableProps> = ({
  children,
  className,
  striped = false,
  hoverable = false,
  bordered = false,
  compact = false,
}) => {
  return (
    <div className="overflow-x-auto">
      <table
        className={classNames(
          'min-w-full divide-y divide-secondary-200',
          bordered && 'border border-secondary-200',
          className
        )}
      >
        {children}
      </table>
    </div>
  );
};

interface THeadProps {
  children: React.ReactNode;
  className?: string;
}

export const THead: React.FC<THeadProps> = ({ children, className }) => {
  return (
    <thead className={classNames('bg-secondary-50', className)}>
      {children}
    </thead>
  );
};

interface TBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const TBody: React.FC<TBodyProps> = ({ children, className }) => {
  return (
    <tbody
      className={classNames(
        'bg-white divide-y divide-secondary-200',
        className
      )}
    >
      {children}
    </tbody>
  );
};

interface TrProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  striped?: boolean;
  isEven?: boolean;
}

export const Tr: React.FC<TrProps> = ({
  children,
  className,
  hoverable,
  striped,
  isEven,
}) => {
  return (
    <tr
      className={classNames(
        hoverable && 'hover:bg-secondary-50',
        striped && isEven && 'bg-secondary-50',
        className
      )}
    >
      {children}
    </tr>
  );
};

interface ThProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  compact?: boolean;
}

export const Th: React.FC<ThProps> = ({
  children,
  className,
  align = 'left',
  compact = false,
}) => {
  return (
    <th
      scope="col"
      className={classNames(
        'text-sm font-semibold text-secondary-900',
        align === 'left' && 'text-left',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        compact ? 'px-3 py-2' : 'px-4 py-3',
        className
      )}
    >
      {children}
    </th>
  );
};

interface TdProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  compact?: boolean;
}

export const Td: React.FC<TdProps> = ({
  children,
  className,
  align = 'left',
  compact = false,
}) => {
  return (
    <td
      className={classNames(
        'text-sm text-secondary-900',
        align === 'left' && 'text-left',
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        compact ? 'px-3 py-2' : 'px-4 py-3',
        className
      )}
    >
      {children}
    </td>
  );
};