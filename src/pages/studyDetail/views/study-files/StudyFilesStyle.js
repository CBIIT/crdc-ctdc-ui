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
});
