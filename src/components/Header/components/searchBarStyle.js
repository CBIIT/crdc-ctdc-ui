import { makeStyles } from '@material-ui/core';

/**
 * Custom styling classes for the SearchBar component
 *
 * @typedef {object}
 */
export const CUSTOM_STYLES = makeStyles({
  // Popper
  root: {
    marginTop: '-6px',
    zIndex: 1100,
    '& .MuiPaper-root': {
      borderRadius: 0,
    },
    '& .MuiAutocomplete-listbox': {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#1B1B1B',
      fontWeight: 500,
      border: '.5px solid #1B1B1B',
      padding: '0px',
      '& li': {
        // list item specific styling
        '&:nth-last-child(1)': {
          borderBottom: 'none',
          fontSize: '14px',
          color: 'black',
          backgroundColor: '#ECECEC',
          '& :hover': {
            color: 'black',
            backgroundColor: '#ECECEC',
            pointerEvents: 'none',
          },
        },
      },
      '& :hover': {
        color: 'white',
        backgroundColor: '#007BBD',
      },
    },
  },
  backdrop: {
    zIndex: 99999,
    background: 'rgba(0, 0, 0, 0.1)',
  },
  autocomplete: {
    margin: '0 auto',
    width: '260px',
    '& .MuiAutocomplete-inputRoot[class*="Mui-focused"]': {
      borderColor: 'transparent', // Set border color to transparent when focused
      outline: '3px solid #2491ff',
    },
    '& .MuiAutocomplete-inputRoot': {
      height: '32px', // Default Height for desktop
      '@media (max-width: 1024px)': {
        height: '43px', // Height for tablets and below
      },
      '& .MuiAutocomplete-input': {
        padding: '0px 4px',
      },
    },
  },
  enterIcon: {
    height: '12px',
    margin: '0px 18px 0px 6px',
  },
  inputRoot: {
    color: '#1b1b1b',
    fontFamily: 'Roboto, Lato, Open Sans',
    lineHeight: '26px',
    fontSize: '15px',
  },
  inputAdornedEnd: {
    padding: '0 8px !important',
  },
  textFieldRoot: {
    '& .MuiOutlinedInput-root': {
      color: '#1B1B1B',
      borderRadius: '0',
      '& fieldset': {
        border: '1px solid #71767A',
        borderRight: '0px'
      },
      '&.Mui-focused fieldset': {
        border: '.5px solid #1B1B1B',
        borderTop: '1px solid #1B1B1B',
        borderRight: '0px'
      },
    },
    '& .MuiOutlinedInput-input': {
      '&::placeholder': {
        fontFamily: 'Roboto, lato',
        color: '#225987', // Placeholder text color
      },
    },
  },
  searchIconSpan: {
    color: '#4A8ECB',
    stroke: '#4A8ECB',
    strokeWidth: '1.1px',
    marginRight: '8px',
    cursor: 'pointer',
  },
  clearIcon: {
    height: '10px',
  },
  searchButton: {
    zIndex: '1',
    height: '32px',
    fontFamily: 'Open Sans',
    fontWeight: 700,
    fontSize: '1rem',
    lineHeight: '33px',
    textAlign: 'center',
    color: '#FFFFFF',
    background: '#3A75BD',
    padding: '0 13px',
    borderRadius: '0px 5px 5px 0px',
    '&:hover': {
      cursor: 'pointer',
      background: '#004971',
    },
     // Style for tablets and below
    '@media (max-width: 1024px)': {
      height: '43px',
      padding: '10px 14px',
      maxWidth: '48px',
    },
  },
  searchContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
  },
});

export default CUSTOM_STYLES;