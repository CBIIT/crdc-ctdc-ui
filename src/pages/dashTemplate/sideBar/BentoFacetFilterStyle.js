export default () => ({
  clearAllButtonRoot: {
    margin: 'auto',
  },
  customButton: {
    borderRadius: '9px',
    maxWidth: '30px',
    maxHeight: '30px',
    minWidth: '30px',
    minHeight: '30px',
    marginTop: '0px',
    fontSize: 9,
    textTransform: 'none',
    color: '#3d4241',
    marginLeft: '0px',
    '&:hover': {
      backgroundColor: '#566672',
      color: 'white',
    },
  },
  floatRight: {
    margin: '7px 0px 7px 6px',
  },
  resetText: {
    marginTop: '0px',
    marginLeft: '8px',
    color: '#0E6292',
    fontSize: 14,
  },
  resetTextDisabled: {
    marginTop: '0px',
    marginLeft: '8px',
    color: '#4E575F',
    fontSize: 14,
  },
  cases: {
    height: '5px',
  },
  Cases: {
    height: '5px',
    margin: '0px',
    backgroundColor: '#0d8461',
  },
  Samples: {
    height: '5px',
    margin: '0px',
    backgroundColor: '#10beff',
  },
  Files: {
    height: '5px',
    margin: '0px',
    backgroundColor: '#e636e4',
  },
  sectionSummaryText: {
    fontSize: '14px',
    flexShrink: '0',
    fontFamily: 'Open Sans',
    fontWeight: '600',
    lineHeight: '1',
    marginLeft: '5px',
    letterSpacing: '0',
    overflowWrap: 'break-word',
    // textTransform: 'uppercase',
  },
  dropDownIconSubSection: {
    marginLeft: '0px',
    fill: '#000000',
  },
  customExpansionPanelSummaryRoot: {
    flexDirection: 'row-reverse',
    paddingLeft: 4,
  },
  customExpansionPanelSummaryRootView: {
    flexDirection: 'row-reverse',
    paddingLeft: 8,
  },
  sectionSummaryTextContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 2,
    fontFamily: 'Open Sans, Lato',
    fontSize: 16, // 20
    fontWeight: 300,
    marginLeft: 3,
    color: '#000000',
  },
  CasesCheckbox: {
    color: '#10A075',
  },
  CasesCheckedIcon: {
    color: '#10A075',
  },
  checkboxRoot: {
    marginLeft: '5px',
    height: 12,
  },
  panelDetailText: {
    color: '#323232',
    fontFamily: 'Nunito',
    fontSize: '14px',
    fontWeight: '200',
  },
  panelSubjectText: {
    color: '#323232',
    fontFamily: 'Nunito',
    fontSize: '14px',
    marginRight: '0px',
  },
  "activeFacetFilter_by_Participants": {
    color: '#076448',
  },
  "activeFacetFilter_by_Biospecimens": {
    color: '#843806',
  },
  "activeFacetFilter_by_Data_Files": {
    color: '#005A7A',
  },
  searchContainer: {
    paddingTop: '15px',
    margin: '0 2px',
    marginRight: 6,
  },
  findCaseButton: {
    marginLeft: '0px', // 105px
    backgroundColor: '#10A075',
    boxSizing: 'border-box',
    height: 30,
    width: 40,
    border: '1.25px solid #0D8461',
    cursor: 'pointer',
    borderRadius: 11,
    display: 'flex',
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  findCaseIcon: {
    width: 17,
    height: 17,
  },
  uploadButton: {
    boxSizing: 'border-box',
    fontWeight: '400',
    height: 32,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#10A075',
    color: '#fff',
    border: '1px solid #0D8461',
    borderRadius: 10,
    fontFamily: 'Lato',
    fontSize: 11,
    boxShadow: 'none',
    paddingLeft: 16,
    paddingRight: 12,
    '&:hover': {
      backgroundColor: '#10A075',
    },
  },
  iconSpan: {
    marginTop: '5.2px',
  },
  uploadIcon: {
    height: 19,
    width: 19,
  },
  customListPadding: {
    paddingTop: 8,
  },
  customDivider: {
    backgroundColor: '#B1B1B1',
    height: '2px',
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 6,
  },
});
