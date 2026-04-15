import React from 'react';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  // Render children directly — no exit/enter animation delay
  // Individual pages handle their own entrance animations via animate-fadeUp etc.
  return (
    <div className="page-transition page-enter">
      {children}
    </div>
  );
};

export default PageTransition;
