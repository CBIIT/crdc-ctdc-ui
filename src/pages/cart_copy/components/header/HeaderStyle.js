const PRIMARY_BLUE_COLOR = '#067CA5';
const SECONDARY_GREEN_COLOR = '#08A383';
const DARKER_GREEN_COLOR = '#0B7867';


export default () => ({
  cartHeader: {
    width: '100%',
    height: '77px',
    borderBottom: '10px solid #067CA5',
  },
  cartHeaderLogo: {
    position: 'relative',
    display: 'flex',
    lineHeight: '31.47px',
    fontSize: '26px',
    color: SECONDARY_GREEN_COLOR,
    fontFamily: 'Inter',
    fontWeight: '600',
    letterSpacing: '-0.02em',
    textAlign: 'left',
    marginRight: '0px',

    // border: '1px solid green',

  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    paddingTop: '10px',
    // Add responsiveness for small screens
    '@media (max-width: 717px)': {
      paddingTop: '0px',
    },
  },
  pageTitle: {
    maginLeft: '10px',
    // border: '1px solid blue',
    whiteSpace: 'nowrap',
    marginRight: '41px'
  },
  container: {
    padding: "30px 30px",
  },
  logo: {
    position: 'absolute',
    width: '98px',
    marginRight: '15px',
    zIndex: '100',
    top: '-15px',
    // border: '1px solid black',
  },
  header: {

  },
  divider: {
    height: '3px',
    background: '#686F7F',
    marginTop: '-17px',
    width: '100%',
    zIndex: '0',
  },
  readMeBtn: {
  },
  readMeBtnRoot: {
    boxShadow: 'none',
    background: DARKER_GREEN_COLOR,
    borderRadius: '10px',
    height: '46px',
    '&:hover': {
      backgroundColor: DARKER_GREEN_COLOR,
      boxShadow: 'none',
    },
    padding: '11px 20px 11px 22px'
  },
  readMeBtnLabel: {
    color: '#ffffff',
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 500,
    fontStyle: 'normal',
    textAlign: 'left',
    lineHeight: '16px',
    // border:' 1px solid blue'
  },
  readmeEndIcon: {
    marginLeft: '70px',
  },
  actionContainer: {
    padding: '0px 40px',
  },
  actionBtn: {
    textAlign: 'right',
    paddingRight: '29px',
    marginBottom: '10px',
    height: '65px',
  },
});

