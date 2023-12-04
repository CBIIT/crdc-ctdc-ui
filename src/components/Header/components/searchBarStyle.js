import { makeStyles } from '@material-ui/core';

/**
 * Custom styling classes for the SearchBar component
 *
 * @typedef {object}
 */
export const CUSTOM_STYLES = makeStyles({
  root: {
    zIndex: 99999,
    '& .MuiAutocomplete-listbox': {
      borderRadius: '8px',
      fontFamily: 'Lato',
      fontSize: '12px',
      color: '#142D64',
      fontWeight: 500,
      border: '1px solid black',
      padding: '0px',

      '& li': {
        // list item specific styling
        borderBottom: '1px solid #3B68CB',
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
        backgroundColor: '#0088FF',
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
    height: '32px',
    // border: '1px solid #71767A',
    '& .MuiAutocomplete-inputRoot[class*="Mui-focused"]': {
      borderColor: 'transparent', // Set border color to transparent when focused
      outline: '0.25rem solid #2491ff',
    },
    '& .MuiAutocomplete-inputRoot': {
      height: '32px',
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
    color: '#618299',
    fontWeight: '600',
    fontFamily: 'Open Sans',
    lineHeight: '26px',
    fontSize: '15px',
  },
  inputAdornedEnd: {
    padding: '0 8px !important',
  },
  textFieldRoot: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '0',
      '& fieldset': {
        border: '1px solid #71767A'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#2491ff',
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
  searchButton: {
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
  },
  searchContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto auto',
    alignItems: 'center',
    // marginTop: '32px',
  },
});

export default CUSTOM_STYLES;