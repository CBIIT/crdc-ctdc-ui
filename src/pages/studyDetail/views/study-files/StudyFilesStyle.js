export default () => ({
  container: {
    // maxWidth: "1736px",
    width: "100%",
    margin: "22px auto 100px auto",
    padding: "0px 85px",
 
  },
  tableWrapper: {
    backgroundColor: "#FFFFFF",
    position: "relative",
  },
  studyFilesDescription: {
    marginTop: "14px",
    position: "absolute",
    fontFamily: "Nunito",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "16px",
    letterSpacing: "0.2px",
    color: "#000000",
    // switch position into relative once the screen size is below 850px
    "@media (max-width: 850px)": {
      position: "relative",
    },
  },
  customTooltip: {
    backgroundColor: "#ffffff",
    maxWidth: '220px',
    borderRadius: '5px',
    border: '.2px solid #C3C3C3',
    boxShadow: '0px 4px 10px 0px #00000040',
    fontFamily: 'Open Sans',
    color: '#223D4C',
    fontSize: '13px',
    fontWeight: 600,
    lineHeight: '19px',
    letterSpacing: '0em',
    textAlign: 'left',
    padding: '10px 15px',
    position: 'relative',
  },
});
