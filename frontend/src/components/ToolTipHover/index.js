import React, { useState } from 'react';

function ToolTipHover({ text, children }) {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => {
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  return (
    <div
      onMouseOver={showTooltip}
      onMouseOut={hideTooltip}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      {children}
      {isVisible && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'white',
            color: 'black',
            padding: '5px',
            borderRadius: '5px',
            fontSize: '12px',
            zIndex:'2',
            width:'300px',
            boxShadow:'3px 3px 5px rgba(0, 0, 0, 0.3)'
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}
 export default ToolTipHover;
