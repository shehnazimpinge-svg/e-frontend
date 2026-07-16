import React from 'react';
import './Loader.css';

const Loader = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      width: '100vw', 
      height: '100vh', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      zIndex: 9999,
      backgroundColor: 'rgba(255, 255, 255, 0.6)'
    }}>
      <div className="loader"></div>
    </div>
  );
};

export default Loader;
