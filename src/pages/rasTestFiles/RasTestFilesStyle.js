const styles = (theme) => ({
  container: {
    maxWidth: "1800px",
    margin: "0 auto 32px auto",
    padding: "0px 32px 80px",
    fontFamily: 'Lato, "Open Sans", sans-serif',
    [theme.breakpoints.up("md")]: {
      padding: "0px 32px 100px",
    },
  },
  headerBanner: {
    padding: "30px 0 20px 0",
    marginBottom: "24px",
    borderBottom: "2px solid #42779a",
  },
  title: {
    fontFamily: "Inter, sans-serif",
    fontSize: "28px",
    fontWeight: 600,
    color: "#0E4D5D",
    lineHeight: "120%",
  },
  subtitle: {
    fontFamily: "Nunito, sans-serif",
    fontSize: "16px",
    fontWeight: 400,
    color: "#4A4A4A",
    marginTop: "8px",
  },
  tableControls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
    gap: "16px",
    flexWrap: "wrap",
  },
  searchBox: {
    minWidth: "280px",
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      backgroundColor: "#FFFFFF",
    },
  },
  tableWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: "8px",
    boxShadow: "0px 2px 10px 0px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  tableContainer: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    minWidth: "900px",
    borderCollapse: "collapse",
  },
  tableHeaderCell: {
    backgroundColor: "#F0F8FA",
    color: "#13344A",
    fontFamily: "Roboto, sans-serif",
    fontWeight: 600,
    fontSize: "15px",
    borderBottom: "3px solid #42779a",
    padding: "12px 16px",
    whiteSpace: "nowrap",
  },
  tableCell: {
    color: "#13344A",
    fontFamily: "Nunito, sans-serif",
    fontWeight: 400,
    fontSize: "14px",
    padding: "12px 16px",
    borderBottom: "1px solid #EAEAEA",
  },
  tableRow: {
    "&:hover": {
      backgroundColor: "#F8FCFD",
    },
  },
  accessCell: {
    textAlign: "center",
    width: "80px",
  },
  codeTag: {
    fontFamily: "monospace",
    backgroundColor: "#EFEFEF",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "13px",
  },
  badgeOpen: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    fontWeight: 600,
    padding: "3px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    display: "inline-block",
  },
  badgeControlled: {
    backgroundColor: "#FFF3E0",
    color: "#E65100",
    fontWeight: 600,
    padding: "3px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    display: "inline-block",
  },
  pagination: {
    borderTop: "1px solid #EAEAEA",
    padding: "8px 16px",
  },
});

export default styles;
