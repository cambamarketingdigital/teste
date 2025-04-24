import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between py-4 px-4 md:px-6 mb-4 border-b border-secondary-200 bg-white">
      <div>
        <h1 className="text-2xl font-bold text-secondary-900">{title}</h1>
        {subtitle && <p className="mt-1 text-secondary-500">{subtitle}</p>}
      </div>
      
      {actions && <div className="mt-4 md:mt-0">{actions}</div>}
    </div>
  );
};

export default PageHeader;