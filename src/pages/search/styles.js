const buttonRoot = {
  height: '56px',
  fontSize: '16px',
  marginRight: '20px',
  textTransform: 'none',
  '@media (min-width: 800px)': {
    marginRight: '33px',
  },
  '@media (min-width: 1000px)': {
    marginRight: '68px',
  }
};

const styles = () => ({
  'global_search_tab_label_1': {
    border: '1px solid black'
  },
  allText: {
    marginLeft: '8px',
  },
  subjectTab: {
    color: '#142D64',
  },
  indicator: {
    backgroundColor: '#142D64',
    height: '4px',
  },
  tabContainter: {
    display: 'flex',
    maxWidth: '840px',
    height: '56px',
    margin: '0 auto',
    '& .MuiTab-root': {
      padding: '0px'
    }
  },
  tabColor: { color: '#142D64' },
  allButton: {
    ...buttonRoot,
    width: '64px',
    minWidth: 'fit-content',
  },
  participantButton: {
    ...buttonRoot,
    width: '126px',
    minWidth: '126px',
  },
  biospecimenButton: {
    ...buttonRoot,
    minWidth: '140px',
  },
  aboutButton: {
    ...buttonRoot,
    width: '95px',
    minWidth: '95px',
  },
  modelButton: {
    height: '56px',
    fontSize: '16px',
    textTransform: 'none',
    width: '81px',
    minWidth: '81px',
  },
  input: {
    borderRadius: '8px',
    borderColor: '#616161',
    color: '#747474',
    fontFamily: 'Lato',
    fontSize: '25px',
  },
  heroArea: {
    width: '100%',
    height: '185px',
    background: '#285A6C',
  },
  searchTitle: {
    color: '#B4E2F5',
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSize: '24px',
    lineHeight: '31.47px',
    margin: '0px 0px 15px 0px',
    textAlign: 'center',
  },
  autocomplete: {
    margin: '0 auto',
    width: '700px',
    '& .MuiAutocomplete-inputRoot[class*="Mui-focused"]': {
      outline: '4px solid #3395CA',
    },
    '&:hover .MuiAutocomplete-inputRoot': {
      outline: '4px solid #3395CA',
    },
    '@media (max-width: 750px)': {
      width: '400px',
    }
  },
  chipSection: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: '10px',
    },
  },
  enterIcon: {
    height: '12px',
    margin: '0px 18px 0px 6px',
  },
  button: {
    borderRadius: '30px',
    width: '100px',
    lineHeight: '37px',
    fontSize: '16px',
    textTransform: 'uppercase',
    fontFamily: 'Lato',
    color: '#000',
    backgroundColor: '#fff',
    marginTop: '32px',
    marginBottom: '32px',
    marginRight: '24px',
    borderWidth: '1px',
    borderColor: 'black',
  },
  bodyContainer: {
    background: '#FFFFFF',
    color: '#000000',
    fontSize: '15px',
    lineHeight: '22px',
    marginBottom: '108px',
    '& .MuiTabPanel-root': {
      padding: '0px !important',
    },
  },
  width1100: {
    maxWidth: '1100px',
    margin: '0px auto 0px auto',
  },
  searchItem: {
    minHeight: '100px',
    padding: '16px',
  },
  backdrop: {
    // position: 'absolute',
    zIndex: 99999,
    background: 'rgba(0, 0, 0, 0.1)',
  },
  filterIcon: {
    height: '0.86rem',
    margin: '0px 16px 0px 6px',
    display: 'inline-flex',
    verticalAlign: 'middle',
  },
  textFieldRoot: {
    '& .MuiOutlinedInput-root': {
      background: '#fff',
      paddingLeft: '12px',
      paddingTop: '2px',
      paddingBottom: '3px',
      color: '#1B1B1B',
      fontFamily: 'Roboto, Lato',
      fontSize: '16px',
      borderRadius: '0px',
      '& fieldset': {
        border: '1px solid #067CA5',
      },
      '&.Mui-focused fieldset': {
        border: '.5px solid #1B1B1B',
      },
    },
    '& .MuiOutlinedInput-input': {
      '&::placeholder': {
        fontFamily: 'Roboto, lato',
        color: '#225987', // Placeholder text color
      },
    },
  },
  // Popper
  root: {
    marginTop: '-5px',
    zIndex: 1100,
    '& .MuiPaper-root': {
      borderRadius: 0,
    },
    '& .MuiAutocomplete-listbox': {
      fontFamily: 'Roboto, Lato',
      fontSize: '16px',
      color: '#1B1B1B',
      fontWeight: 500,
      border: '.5px solid #1B1B1B',
      padding: '0px',
      '& li': {
        // list item specific styling
      },
      '& :hover': {
        color: 'white',
        backgroundColor: '#007BBD',
      },
    },
  },
  searchIcon: {
    height: '22px',
    margin: '0px 6px 0px 6px',
  },
  searchIconSpan: {
    cursor: 'pointer',
    zIndex: 40,
  },
  clearIcon: {
    height: '18px',
  },
  filterByIconContainer: {
    marginRight: '12px',
  },
  filterByIcon: {
    color: '#142D64',
    verticalAlign: 'middle',
  },
  filterByTextContainer: {
    marginRight: '60px',
    fontSize: '16px',
    lineHeight: '16px',
    color: '#142D64',
    '@media (max-width: 1000px)': {
      marginRight: '30px',
    }
  },
  totalResults: {
    color: '#225987',
    fontFamily: 'Roboto',
    fontSize: '20px',
    fontWeight: 400,
    lineHeight: '31px',
    letterSpacing: '0.02em',
    textAlign: 'left',
    paddingLeft: '16px',
    maxWidth: '959px',
    margin: '11px auto 2px auto'
  },
  totalCount: {
    fontFamily: 'Roboto',
  },
  subsection: {
    borderBottom: '1px solid #8A8A8A',
    paddingBottom: '22px',
    paddingTop: '22px',
  },
  subsectionBody: {
    padding: '0px 16px',
    maxWidth: '959px',
    minWidth: '500px',
  },
  paginationContainer: {
    paddingBottom: '0px',
  },
  noData: {
    margin: 'auto',
    textAlign: 'center',
  },
});

export default styles;
