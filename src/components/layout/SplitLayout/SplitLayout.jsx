import React from 'react';

const SplitLayout = ({ children }) => {
  return (
    <div className="split-layout">
      <div className="split-left">
        {children}
      </div>
      <div className="split-right">
        <div className="hero-content">
          <h1>Explore the world's leading design portfolios.</h1>
          <p>
            Millions of designers and agencies around the world showcase their portfolio
            work on Flowbite - the home to the world's best design and creative professionals.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', position: 'relative', width: '100px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fca5a5', position: 'absolute', left: '0' }}></div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#fde047', position: 'absolute', left: '16px' }}></div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#86efac', position: 'absolute', left: '32px' }}></div>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#93c5fd', position: 'absolute', left: '48px' }}></div>
            </div>
            {/* <span style={{ fontSize: '0.875rem' }}>Over <strong>15.7k</strong> Happy Customers</span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitLayout;
