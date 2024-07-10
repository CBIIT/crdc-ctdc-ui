import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  const mdBreakpoint = '@media (min-width: 750px)';
  const lgBreakpoint = '@media (min-width: 1000px)';

  return {
    card: {
      '&:last-child $hrContainer': {
        display: 'none',
      },
      [lgBreakpoint]: {
        minWidth: '959px',
        width: '959px',
      },
      maxWidth: '800px',
      padding: '0px',
    },
    indexContainer: {
      fontFamily: 'Roboto',
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '16px',
      letterSpacing: '0px',
      textAlign: 'left',
      color: '#747474',
      width: '25px',
      [mdBreakpoint]: {
        width: '49px',
      }
    },
    infoContainer: {
      display: 'flex',
      flexDirection: 'column',
      margin: '0px',
      padding: '0px',
    },
    keyAndValueRow: {
      display: 'flex',
      margin: '0px',
      padding: '0px',
    },
    row: {
      display: 'flex',
      flexDirection: 'column', // For smaller screens, stack items vertically
      margin: '0px',
      padding: '0px',
      [lgBreakpoint]: {  // For larger screens, change to row layout
        flexDirection: 'row',
      },
    },
    column: {
      flex: 1,
      margin: '0px',
      padding: '0px',
      [lgBreakpoint]: {  // For larger screens, allow for two columns
        flexBasis: '50%',
      },
    },
    leftColumn: {
      [lgBreakpoint]: { 
        marginLeft: '20px',
      },
    },
    titleRow: {
      marginBottom: '5px',
    },
    titleKey: {
      margin: '0px',
      padding: '6px 5px 6px 5px',
      borderRadius: '2px',
      gap: '10px',
      fontFamily: 'Roboto',
      fontSize: '12px',
      fontWeight: '400px',
      lineHeight: '12px',
      color: '#092630',
      backgroundColor: '#BEF2E5',
    },
    titleValue: {
      margin: '0px',
      padding: '0px',
      marginLeft: '10px',
      fontFamily: 'Inter',
      fontSize: '18px',
      fontWeight: 500,
      lineHeight: '22px',
      letterSpacing: '0px',
      textAlign: 'left',
      color: '#004D73',
    },

    key: {
      fontFamily: 'Roboto',
      fontSize: '14px',
      fontWeight: 700,
      lineHeight: '21px',
      letterSpacing: '0px',
      textAlign: 'left',
      width: '135px',
      minWidth: '135px',
      margin: '0px 0px 0px 3px',
      padding: '0px',
      textTransform: 'uppercase'
    },
    value: {
      fontFamily: 'Roboto',
      fontSize: '16px',
      fontWeight: '400px',
      lineHeight: '24px',
      letterSpacing: '0px',
      textAlign: 'left',
      margin: '0px',
      paddingLeft: '31px',
      marginTop: '-2px',
    },
    hrContainer: {
      paddingTop: '10px',
      paddingBottom: '10px',
      maxWidth: '800px',
      marginLeft: '18px',
      [mdBreakpoint]: {
        marginLeft: '36px',
      },
      [lgBreakpoint]: {
        marginLeft: '36px',
        width: '925px',
        minWidth: '925px',
      },
    },
    hr: {
      width: '100%', 
      border: '1px solid #E7EEF5',
      margin: '10px 0px',
      padding: '0px',
    },
  }
});

export default useStyles;
