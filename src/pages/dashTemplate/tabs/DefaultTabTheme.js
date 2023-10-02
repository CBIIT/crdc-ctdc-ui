export const customTheme = {
  MuiTabs: {
    root: {
      borderBottom: '10px solid #40789c',
    },
  },
  MuiTab: {
    root: {
      marginTop: '15px',
      color: '#6E6E6E',
      height: '45px',
      overflow: 'hidden',
      background: '#EAEAEA',
      borderTop: '1px solid black',
      borderLeft: '1px solid black',
      borderRight: '1px solid black',
      fontWeight: '400',
      lineHeight: '18px',
      letterSpacing: '0.25px',
      marginRight: '10px',
      fontSize: '21px',
      width: '250px',
      textTransform: 'none',
      fontFamily: 'Lato',
      '&.Mui-selected': {
        fontWeight: 'bolder',
        '&.participants': {
          background: '#D7F2EB',
          color: '#11A075',
        },
        '&.biospecimens': {
          background: '#f8c19d',
          color: '#EF660B',
        },
        '&.files': {
          background: '#cfedf9',
          color: '#0dafec',
        },
        '&.MuiTypography-body1': {
          color: 'red',
        },
      },
      '& span.participants_count': {
        marginLeft: '5px',
        fontSize: '14px',
      },
      '& span.biospecimens_count': {
        marginLeft: '5px',
        fontSize: '17px',
      },
      '& span.files_count': {
        marginLeft: '5px',
        fontSize: '17px',
      },
    },
  },
};
