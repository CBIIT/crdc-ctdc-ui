export default (theme) => ({
  headerItems: {
    width: '250px',
    float: 'right',
  },
  headerItemAccessionId: {
    paddingTop: '10px',
    '& span': {
      margin: '40px 20px',
      color: '#5e8ca5',
    },
  },
  embargoIcon: {
    position: 'absolute',
    color: 'white',
    top: '-12px',
    backgroundColor: '#de7328',
  },
  embargo: {
    color: '#BB2040',
    float: 'right',
    background: '#F6F4F4',
    width: '220px',
    height: '33px',
    marginTop: '25px',
    fontWight: 'bolder',
    paddingLeft: '15px',
    paddingRight: '15px',
    paddingTop: '4px',
    textAlign: 'center',
    border: '3px solid #BB2040',
    '& p': {
      display: 'inline ! important',
      fontWeight: '600',
      width: '122px',
      fontSize: '13px',
      marginTop: '3px',
    },
  },
  pending: {
    color: '#6D6E71',
    float: 'right',
    background: '#fff6f6',
    width: '220px',
    height: '33px',
    marginTop: '25px',
    fontWight: 'bolder',
    paddingLeft: '15px',
    paddingRight: '14px',
    paddingTop: '3px',
    textAlign: 'center',
    fontFamily: 'Open Sans',
    border: '3px solid #F3A933',
    '& p': {
      display: 'inline ! important',
      fontWeight: '600',
      width: '122px',
      fontSize: '13px',
      marginTop: '3px',
    },
  },
  embargoFileIcon: {
    width: '20px',
    float: 'right',
    marginLeft: '5px',
  },
  headerBar: {
    fontWeight: '10',
    color: '#5e8ca5',
    margin: '0px 15px 0 15px',
  },
  headerAccessionItem: {
    borderRadius: '100px',
    border: '2px solid',
    textAlign: 'center',
    padding: '0 16px',
    background: 'rgb(203 226 238 / 11%)',
    fontSize: '15px',
  },
  accessionLabel: {
    fontSize: '14px',
    fontWeight: '900',
    color: '#5e8ca5',
  },
  accessionValue: {
    fontSize: '13px',
    fontWeight: '800',
  },
  paddingLeft8: {
    paddingLeft: '8px',
  },
  paddingBottm17: {
    paddingBottm: '17px',
  },
  tabPrimaryColor: {
    color: '#81a6b9',
    fontWeight: '700',
  },
  tabHighlightColor: {
    color: '#0B3556',
    fontWeight: '700',
    borderBottom: '5px solid rgb(53, 185, 235)',
  },
  hrLine: {
    marginTop: '-2px',
    marginBottom: '0',
    borderTop: '1px solid #000000',
  },
  container: {
    paddingTop: '42px',
    fontFamily: 'Raleway, sans-serif',
    paddingLeft: '32px',
    paddingRight: '32px',
  },
  content: {
    fontSize: '12px',
  },
  warning: {
    color: theme.palette.warning.main,
  },
  paper: {
    textAlign: 'center',
  },
  fakeToolbar: {
    ...theme.mixins.toolbar,
  },
  root: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '9px',
    letterSpacing: '0.025em',
    color: '#000',
    background: '#f3f3f3',
  },
  header: {
    paddingLeft: '35px',
    paddingTop: '31px',
    borderBottom: '#4B619A 12px solid',
    height: '118px',
    margin: 'auto',
  },
  headerTitle: {
    margin: 'auto',
    float: 'left',
    marginLeft: '100px',
    width: 'calc(100% - 465px)',
  },
  headerMainTitle: {
    fontFamily: theme.custom.fontFamilyInter,
    fontWeight: 400,
    fontSize: '24px',
    color: '#274FA6',
    paddingLeft: '3px',
    lineHeight: '31.47px',
    letterSpacing: '-2%',
  },
  headerMainSubTitle: {
    fontWeight: 600,
    paddingLeft: '8px',
  },
  headerSubTitleCate: {
    fontFamily: theme.custom.fontFamilyInter,
    fontWeight: '400',
    fontSize: '16px',
    color: '#274FA6',
    paddingLeft: '3px',
    paddingRight: '200px',
    lineHeight: '21.78px',
    letterSpacing: '-2%',
    marginTop: '4px',
  },
  lowLetterSpace: {
    color: '#606061',
    fontWeight: '400',
    fontFamily: 'Sans-Serif',
    textTransform: 'uppercase',
    fontSize: '14px',
    paddingLeft: '3px',
    lineHeight: '17px',
    textOverflow: 'ellipsis',
    paddingRight: '200px',
    letterSpacing: '0.01em',
    marginBottom: '-9px',
  },
  breadCrumb: {
    marginLeft: '-3px',
  },
  borderRight: {
    borderRight: '#81a6b9 1px solid',
  },
  headerSubTitleContent: {
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: theme.custom.fontFamilyRaleway,
    textTransform: 'uppercase',
    letterSpacing: '0.023em',
    fontSize: '14pt',
  },

  headerButton: {
    fontFamily: theme.custom.fontFamilySans,
    // border: '3px solid #81a6b9',
    marginTop: '10px',
    float: 'right',
    width: '254px',
    height: '47px',
    textAlign: 'center',
    background: '#E7E5E5',
    paddingTop: '14px',
    paddingBottom: '10px',
    paddingLeft: '15px', 
    paddingRight: '15px',
    // padding: '12px, 15px, 10px, 15px',
  },
  headerButtonLinkSpan: {
    display: 'inherit',
    height: '15px',
    marginTop: '-2px',
  },
  headerButtonLinkText: {
    fontFamily: theme.custom.fontFamilyRaleway,
    fontWeight: 600,
    color: '#717171',
    fontSize: '16px',
  },
  headerButtonLinkNumber: {
    fontFamily: theme.custom.fontFamilyInter,
    fontSize: '16px',
    fontWeight: 600,
    paddingBottom: '2px',
    margin: '0',
    display: 'inherit',
    marginRight: '10px',
    borderBottom: '3px solid #990099'
  },
  logo: {
    position: 'absolute',
    float: 'left',
    width: '94px',
    top: '253px',
    left: '-1px'
  },
  detailContainer: {
    margin: 'auto',
    paddingTop: '30px',
    paddingLeft: '50px',
    paddingRight: '50px',
    fontFamily: theme.custom.fontFamilySans,
    letterSpacing: '0.014em',
    color: '#000000',
    size: '12px',
    lineHeight: '23px',
  },
  headerButtonLink: {
    textDecoration: 'none',
    lineHeight: '14px',
    fontSize: '12px',
    fontWeight: 'bold',
    position: 'relative',
    top: '2px',
    color: '#990099',
    '&:hover': {
      textDecoration: 'none',
    },
  },
  button: {
    borderRadius: '22px',
    padding: '0 22px',
    width: '150px',
    height: '35px',
    lineHeight: '14px',
    fontSize: '10px',
    color: '#ffffff',
    textTransform: 'uppercase',
    backgroundColor: '#ff8a00',
    fontFamily: theme.custom.fontFamilySans,
    '&:hover': {
      backgroundColor: '#ff8a00',
    },
  },
  title: {
    color: '#0296c9',
    fontFamily: theme.custom.fontFamilySans,
    fontSize: '12px',
    letterSpacing: '0.017em',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
