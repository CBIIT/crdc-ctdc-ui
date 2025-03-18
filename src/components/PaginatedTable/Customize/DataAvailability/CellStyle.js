export default () => ({
  dataAvailIndicator: {
    textAlign: 'center',
  },
  dataAvailIndicatorIcon: {
    color: '#4E71CB',
    height: '13px',
    width: '13px',
  },
  dalIcon: {
    width: '25px',
  },
  dataAvailIndicatorImage: {
    height: '20px',
    width: '20px',
  },
  crdcLinkStyle: {
    color: '#A520A5',
    textDecoration: 'none',
  },
  crdcApiFailed: {
    color: '#A520A5',
  },
  defaultDalTooltip: {
    maxWidth: 'none',
    padding: '10px 15px !important',
    margin: '0px',
    border: '1px solid #CECECE',
    borderRadius: '5px',
    boxShadow: '0px 4px 10px 0px #00000040',

    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontSize: '13px',
    lineHeight: '19px',
    letterSspacing: '0%',
  },
  legend: {
    zIndex: '1000',
  },
  crdcLinks: {
    textAlign: 'left',

    listStyle: 'none',
    padding: '0px',
    margin: '0px'
  },
  crdcLinksLi: {
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'center',

    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontSize: '13px',
    lineHeight: '19px',
    letterSpacing: '0%',
  },

  legendTooltip: {
    position: 'relative',
    bottom: '0.5em',
  },
  link: {
    textDecoration: 'underline',
    fontFamily: 'Open Sans',
    fontSize: '15px',
    fontWeight: 'bold',
    color: '#DC762F',
    lineSpacing: '19pt',
    float: 'left',
    marginRight: '5px',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});
