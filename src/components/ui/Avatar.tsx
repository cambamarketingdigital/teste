import React from 'react';
import classNames from 'classnames';

interface AvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  initials,
  size = 'md',
  status,
  className,
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const statusClasses = {
    online: 'bg-success-500',
    offline: 'bg-secondary-300',
    busy: 'bg-error-500',
    away: 'bg-warning-500',
  };

  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  return (
    <div className={classNames('relative inline-block', className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={classNames(
            'rounded-full object-cover',
            sizeClasses[size]
          )}
        />
      ) : (
        <div
          className={classNames(
            'rounded-full flex items-center justify-center bg-primary-100 text-primary-800 font-medium',
            sizeClasses[size]
          )}
        >
          {initials?.slice(0, 2) || alt.slice(0, 1)}
        </div>
      )}
      
      {status && (
        <span
          className={classNames(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            statusClasses[status],
            statusSizeClasses[size]
          )}
        />
      )}
    </div>
  );
};

export default Avatar;