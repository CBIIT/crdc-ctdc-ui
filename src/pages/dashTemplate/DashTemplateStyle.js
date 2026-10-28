export default () => ({
  dashboardContainer: {
    backgroundColor: '#FFFFFF',
  },
  content: {
    display: 'flex',
    maxWidth: '1800px',
    margin: 'auto',
    padding: '0 32px',
  },
  sideBar: {
    width: '300px',
    maxHeight: '1300px',
    overflowX: 'hidden',
    backgroundColor: 'transparent',
    borderLeft: 'thin solid #B1B1B1',
    overflow: 'auto',
    zIndex: '99',
  },
  rightContent: {
    width: 'calc(100% - 300px)',
    position: 'relative',
    borderRight: 'thin solid #B1B1B1',
    borderLeft: 'thin solid #B1B1B1',
  },
});
