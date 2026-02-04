export default () => ({
  container: {
    width: '100%',
    margin: '35px auto 0 auto',
    paddingLeft: '85px',
    paddingRight: '85px',
  },
  paragraph: {
    fontFamily: 'Nunito',
    fontWeight: 400,
    fontStyle: 'Regular',
    fontSize: 16,
    lineHeight: '20px',
    letterSpacing: '0.2px',
    verticalAlign: 'middle',
    color: '#000000',
    width: '50%',

    '@media (max-width: 745px)': {
      width: '100%',
    }
  },
  topDownloadBtn: {
    textAlign: 'right',
  },
  paginatedTableWrapper: {
    overflowY: 'auto',
    marginBottom: '32px',
    borderTop: '3px solid #0E6292',
    borderBottom: '3px solid #0E6292',

  },
});
