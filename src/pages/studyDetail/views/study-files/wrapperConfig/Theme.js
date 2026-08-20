export const customTheme = {
  MuiContainer: {
    root: {
      "&.container_footer": {
        paddingTop: "18px",
        paddingLeft: "12px",
        textAlign: "left",
      },
      "& img": {
        width: "12px",
        height: "12px",
        verticalAlign: "top",
        marginLeft: "4px",
      },
    },
  },
  MuiButton: {
    root: {
      backgroundColor: "#06846A",
      color: "#FFFFFF",
      fontFamily: "Roboto",
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "14px",
      textTransform: "uppercase",
      padding: "16px 22px",
      width: "fit-content",
      height: "46px",
      borderRadius: "10px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#046D57",
      },
      "&.Mui-disabled": {
        backgroundColor: "#06846A",
        color: "#FFFFFF",
        opacity: 0.5,
      },
      "&.add_selected_button": {
        backgroundColor: "#06846A",
        textTransform: "uppercase",
      },
    },
    text: {
      padding: "16px 22px",
    },
  },
};
