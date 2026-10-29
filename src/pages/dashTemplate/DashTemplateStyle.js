export default () => ({
  // Match the centered error presentation used by Study Details.
  errorContainer: {
    padding: '40px',
    margin: '20px auto',
    maxWidth: '1000px',
    textAlign: 'center',
    fontFamily: 'Nunito',
    fontSize: '16px',
    color: '#000',
  },
  errorTitle: {
    color: '#d32f2f',
    marginBottom: '16px',
  },
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
