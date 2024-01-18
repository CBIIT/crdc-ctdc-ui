import React, { useEffect, useState } from 'react';
import { Alert, styled } from '@mui/material';

const StyledAlert = styled(Alert, {
  shouldForwardProp: (prop) => prop !== "bgColor"
})(({ bgColor }) => ({
  color: '#ffffff',
  backgroundColor: bgColor || '#5D53F6',
  width: '535px',
  boxSizing: 'border-box',
  minHeight: '50px',
  borderColor: bgColor || 'none',
  boxShadow: '-4px 8px 27px 4px rgba(27,28,28,0.09)',
  justifyContent: 'center',
  zIndex: '1100',
  position: 'fixed',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  userSelect: 'none',
}));

const GenericAlert = ({
  open,
  children,
  severity = "success"
}) => {
  const [bgColor, setBgColor] = useState(null);

  useEffect(() => {
    let newBgColor;
    switch (severity) {
      case "success":
        newBgColor = "#5D53F6";
        break;
      case "error":
        newBgColor = "#E74040";
        break;
      default:
        newBgColor = "#5D53F6";
        break;
    }

    setBgColor(newBgColor);
  }, [severity]);

  if (!open) return null;

  return (
    <StyledAlert severity={severity} bgColor={bgColor} icon={false}>
      {children}
    </StyledAlert>
  );
};

export default GenericAlert;
