export default () => ({
  container: {
    maxWidth: "1736px",
    margin: "0 auto",
    padding: "22px 50px 40px 50px",
  },
  tableWrapper: {
    backgroundColor: "#FFFFFF",
    position: "relative",
    "& .downloadAndColumnView": {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      minHeight: "44px",
      maxHeight: "44px",
      height: "44px",
      padding: "0 15px 0 0",
    },
  },
  studyFilesDescription: {
    marginTop: "16px",
    position: "absolute",
    fontFamily: "Nunito",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "16px",
    letterSpacing: "0.2px",
    color: "#000000",
  },
});
