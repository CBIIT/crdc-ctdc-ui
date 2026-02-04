import React from 'react';

const TabPanel = ({
  children,
  value,
  index,
  maxWidth,
}) => (
  <div
    role="tabpanel"
    hidden={value !== index}
  >
    <div style={{ maxWidth, margin: "0 auto" }}>{children}</div>
  </div>
);

export default TabPanel;
