export default (theme) => ({
  // ---- Page container ----
  container: {
    fontFamily: 'Raleway, sans-serif',
    paddingLeft: '32px',
    paddingRight: '32px',
    maxWidth: '1800px',
    margin: '0 auto',
  },

  // ---- Header ----
  header: {
    paddingLeft: '35px',
    paddingTop: '31px',
    borderBottom: '12px solid #106856',
    height: '118px',
    margin: 'auto',
    position: 'relative',
  },
  logo: {
    float: 'left',
    width: '94px',
    marginTop: '-75px',
    marginLeft: '-68px',
    position: 'absolute',
  },
  headerTitle: {
    margin: 'auto',
    float: 'left',
    marginLeft: '95px',
    marginTop: '6px',
  },
  headerMainSubTitle: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '26px',
    color: '#274FA6',
    lineHeight: '31px',
    letterSpacing: '-0.02em',
    paddingLeft: '8px',
  },
  headerMainTitle: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '26px',
    color: '#274FA6',
    paddingLeft: '3px',
    lineHeight: '31px',
    letterSpacing: '-0.02em',
  },
  headerParticipantLabel: {
    fontWeight: 400,
    color: '#274FA6',
  },
  headerArrow: {
    fontWeight: 400,
    color: '#274FA6',
  },
  headerParticipantId: {
    fontWeight: 700,
    color: '#274FA6',
  },

  // ---- Breadcrumb ----
  breadCrumb: {
    position: 'relative',
    zIndex: 1,
    marginLeft: '2px',
    marginTop: '5px',
    marginBottom: '20px',
  },

  // ---- Info panel: outer wrapper ----
  infoPanelContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    marginTop: '28px',
    marginBottom: '10px',
    width: '100%',
  },

  // ---- Info panel: each third-width section ----
  infoPanelSection: {
    flex: 1,
    padding: '10px 45px 60px',
    background: '#FFFFFF',
    borderRight: '1px solid #AEAEAE',
    '&:last-child': {
      borderRight: 'none',
    },
  },
  infoPanelSectionTitle: {
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '18px',
    color: '#1D9A8F',
    textTransform: 'uppercase',
    lineHeight: '100%',
    letterSpacing: '0',
    marginBottom: '20px',
  },

  // ---- Info panel: each field row ----
  infoPanelRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '6px',
    paddingLeft: '10px',
  },
  infoPanelLabel: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontStyle: 'bold',
    fontSize: '16px',
    color: '#004D73',
    textTransform: 'uppercase',
    letterSpacing: '-1%',
    lineHeight: '22px',
    minWidth: '185px',
    width: '185px',
    flexShrink: 0,
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  infoPanelValue: {
    paddingLeft: '15px',
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '22px',
    color: '#4B4B4B',
  },

  // ---- Table sections ----
  tableSection: {
    paddingBottom: '0px',
    backgroundColor: '#E1EEEC',
    marginLeft: '-32px',
    marginRight: '-32px',
    paddingLeft: '32px',
    paddingRight: '32px',
    position: 'relative',
    paddingTop: '51px',
  },
  tableWrapper: {
    // Title + icons share the same row: title is absolute-left, toolbar defines row height
    '& .downloadAndColumnView': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      minHeight: 'unset',
      height: '56px',
      padding: '0 15px 0 0',
      backgroundColor: '#E1EEEC',
    },
    // Header cells
    '& .MuiTableCell-head': {
      fontFamily: 'Roboto',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '100%',
      letterSpacing: '0%',
      color: '#13344A',
      paddingLeft: '20px',
    },
    // Body cells
    '& .MuiTableCell-body': {
      fontFamily: 'Nunito',
      fontWeight: 400,
      fontSize: '16px',
      color: '#13344A',
    },
    backgroundColor: '#FFFFFF',
  },
  tableSectionTitle: {
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '20px',
    color: '#000000',
    position: 'absolute',
    top: 0,
    left: '52px',
    height: '56px',
    display: 'flex',
    alignItems: 'center',
    zIndex: 1,
    paddingTop: '70px',
  },

  // ---- Button row below each table ----
  tableButtonRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    gap: '6px',
    paddingTop: '12px',
    paddingBottom: '180px',
    paddingRight: '29px',
    backgroundColor: '#E1EEEC',
  },
  biospecimenButtonRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    gap: '6px',
    paddingTop: '12px',
    paddingBottom: '28px',
    paddingRight: '29px',
    backgroundColor: '#E1EEEC',
  },

  emptyTableMessage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 0',
    fontFamily: 'Nunito',
    fontWeight: 400,
    fontSize: '16px',
    color: '#13344A',
  },

  // Teal solid cart button
  cartButton: {
    backgroundColor: '#06846A',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '14px',
    textTransform: 'uppercase',
    padding: '7px 16px',
    width: '214px',
    height: '46px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#177A72',
    },
    '&.Mui-disabled': {
      backgroundColor: '#06846A',
      color: '#FFFFFF',
      cursor: 'not-allowed',
    },
  },

  // Outlined teal JBrowse button
  jbrowseButton: {
    backgroundColor: '#FFFFFF',
    width: 'fit-content',
    color: '#09557B',
    fontFamily: 'Lato',
    fontWeight: 400,
    fontSize: '16px',
    fontStyle: 'Regular',
    textTransform: 'none',
    lineHeight: '16px',
    letterSpacing: '0.03em',
    padding: '5px 14px',
    borderRadius: '3px',
    border: '1px solid #09557B',
    cursor: 'not-allowed',
    opacity: 0.7,
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    height: '46px',
  },
  jbrowseIcon: {
    width: 'fit-content',
    height: 'fit-content',
    padding: '0px 7px',
  },

  // Small question-mark icon next to buttons
  questionMarkIcon: {
    fontSize: '18px',
    color: '#000000',
    cursor: 'pointer',
    verticalAlign: 'top',
    marginRight: '10px',
  },

  // ---- Tooltip styling ----
  tooltipBody: {
    backgroundColor: '#FFFFFF',
    color: '#004D73',
    fontSize: '12px',
    fontWeight: '600',
    fontFamily: 'Lato, sans-serif',
    padding: '8px 12px',
    borderRadius: '4px',
    maxWidth: '220px',
    boxShadow: '0px 0px 12px rgba(0, 0, 0, 0.2)',
    border: '1px solid #afafaf',
  },

  // ---- Misc shared ----
  root: {
    fontFamily: '"Open Sans", sans-serif',
    fontSize: '9px',
    letterSpacing: '0.025em',
    color: '#000',
    background: '#f3f3f3',
  },
  fakeToolbar: {
    ...theme.mixins.toolbar,
  },
  content: {
    fontSize: '12px',
  },
});
