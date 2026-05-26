export const customTheme = {
  MuiContainer: {
    root: {
      "&.container_footer": {
        paddingTop: "10px",
        textAlign: "left",
      },
      "& img": {
        width: "10px",
        height: "10px",
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
  MuiTooltip: {
    tooltip: {
      maxWidth: "240px",
    },
  },
};
