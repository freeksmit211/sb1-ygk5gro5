import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <a 
      href="https://www.simotech.co.za"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img 
        src="https://storage.googleapis.com/websitenielimages/images/simotech/logo-fin.png"
        alt="Simotech" 
        className={className}
        style={{ 
          objectFit: 'contain',
          maxWidth: '100%',
          height: 'auto'
        }}
        onError={(e) => {
          console.error('Logo failed to load:', e);
          // Fallback to text if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          const fallback = document.createElement('span');
          fallback.textContent = 'SIMOTECH';
          fallback.className = className + ' text-2xl font-bold text-blue-600';
          target.parentNode?.appendChild(fallback);
        }}
      />
    </a>
  );
};

export default Logo;