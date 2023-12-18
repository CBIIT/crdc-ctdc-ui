const styles = () => ({
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
  },
  tabColor: { color: '#142D64' },
  buttonRoot: {
    height: '56px',
    fontSize: '16px',
    minWidth: 'min-content',
    // padding: '0px',
    marginRight: '63px',
    // minWidth: '200px',
    padding: '0px, 10px',
    textTransform: 'none',
    // border: '.5px solid red'
  },
  notchedOutline: {

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
    // border: '1px solid red', 
    fontSize: '24px',
    lineHeight: '31.47px',
    margin: '0px 0px 15px 0px'
  },
  autocomplete: {
    margin: '0 auto',
    // paddingTop: '66px',
    // border: '1px solid yellow', 
    '& .MuiAutocomplete-inputRoot[class*="Mui-focused"]': {
      outline: '4px solid #3395CA',
    },
    '&:hover .MuiAutocomplete-inputRoot': {
      outline: '4px solid #3395CA',
    },
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
    color: 'red',
  },
  searchIconSpan: {
    cursor: 'pointer',
    zIndex: 40,
  },
  clearIcon: {
    height: '18px',
    margin: '-8px 4px 0px 19px',
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
  },
});

export default styles;
