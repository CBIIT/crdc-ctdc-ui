import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button, Box } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Stats from "../../components/Stats/AllStatsController";
import LockIconSvg from "../../assets/login/lock-icon.svg";
import LockBorderSvg from "../../assets/login/lock-border.svg";
import HelpIconSvg from "../../assets/login/help-icon.svg";

function RASLoginPage(props) {
  const { classes } = props;
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [requestAccessOpen, setRequestAccessOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);

  return (
    <div className={classes.Container}>
      {/* Hero Section */}
      <Box className={classes.HeroSection}>
        <div className={classes.HeroIconWrapper}>
          <img
            src={LockBorderSvg}
            alt="Lock Border"
            className={classes.LockBorder}
          />
          <img src={LockIconSvg} alt="Lock Icon" className={classes.HeroIcon} />
        </div>
        <Typography className={classes.HeroTitle}>Login to the CTDC</Typography>
      </Box>

      {/* Main Content - Two Column Layout */}
      <Grid container className={classes.ContentWrapper}>
        <Grid container spacing={4}>
          {/* Left Column - Combined Login Box */}
          <Grid item xs={12} md>
            <Box className={classes.CombinedLoginBox}>
              {/* RAS Section */}
              <Box className={classes.RasSection}>
                <Typography className={classes.BoxTitle}>
                  Log in with NIH Research Auth Service (RAS)
                </Typography>

                {/* Text + Button row */}
                <Box className={classes.LoginContentRow}>
                  <Box className={classes.RasTextWrapper}>
                    <Typography className={classes.BodyText}>
                      Before accessing CTDC data, you may be required to verify
                      your identity through NIH&apos;s secure Researcher Auth
                      Service (RAS) using Login.gov. This identity verification
                      is required to comply with federal policies governing
                      access to controlled-access data repositories (CADRs).
                      <br />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      If you already have a CTDC account, you must complete
                      identity verification to continue accessing
                      controlled-access data unless you sign in with an NIH
                      account, which does not require this additional
                      verification. Identity verification must be renewed
                      annually.
                    </Typography>
                  </Box>
                  <Box className={classes.LoginButtonContainer}>
                    <Button
                      variant="outlined"
                      className={classes.LoginButtonRas}
                    >
                      Login with RAS
                    </Button>
                  </Box>
                </Box>

                {/* Divider */}
                <Box className={classes.Divider} />

                {/* Collapsible CTDC Verification Process */}
                <Box className={classes.VerificationWrapper}>
                  <Box className={classes.VerificationSection}>
                    <Box
                      className={classes.VerificationHeader}
                      onClick={() => setVerificationOpen(!verificationOpen)}
                    >
                      <Typography className={classes.VerificationTitle}>
                        CTDC Verification Process
                      </Typography>
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 26 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ cursor: "pointer", flexShrink: 0 }}
                      >
                        {verificationOpen ? (
                          <path d="M26 22L16 12L6 22L26 22Z" fill="black" />
                        ) : (
                          <path d="M6 12L16 22L26 12H6Z" fill="black" />
                        )}
                      </svg>
                    </Box>

                    {verificationOpen && (
                      <Typography className={classes.VerificationText}>
                        The verification process typically takes up to 30
                        minutes and requires:
                        <br />
                        &nbsp;&nbsp;A mobile phone with a working camera
                        <br />
                        &nbsp;&nbsp;Your Social Security number
                        <br />
                        &nbsp;&nbsp;A phone number associated with a phone plan
                        in your name
                        <br />
                        &nbsp;&nbsp;One of the following valid government-issued
                        IDs:
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;U.S. driver&apos;s license
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;State-issued ID
                        <br />
                        &nbsp;&nbsp;&nbsp;&nbsp;U.S. passport
                        <br />
                        <br />
                        Before selecting Log in with NIH Research Auth Service
                        (RAS), please gather the required information,
                        identification, and devices. For more information, see
                        the Login.gov Identity Verification Guidelines or the
                        Login.gov Help Center.
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Request Access Section */}
            <Box className={classes.RequestSection}>
              {/* Top section: Title + Access Requirements */}
              <Box className={classes.RequestTopSection}>
                <Typography className={classes.SectionTitle}>
                  Request Access
                </Typography>
                <Box className={classes.VerificationWrapper}>
                  <Box className={classes.VerificationSection}>
                    <Typography
                      className={classes.SubsectionTitle}
                      style={{ marginTop: 0, marginBottom: 0 }}
                    >
                      Access Requirements
                    </Typography>
                    <Typography className={classes.BodyText}>
                      CTDC contains controlled-access research data. To comply
                      with federal security requirements, users must verify
                      their identity and affiliation before they can access the
                      platform.
                      <br />
                      <br />
                      To request CTDC access, you must have:
                      <br />
                      An <strong>NIH account</strong> linked to a{" "}
                      <strong>Login.gov</strong> account with{" "}
                      <strong>NIH Researcher Auth Service (RAS)</strong>{" "}
                      identity verification
                      <br />
                      An <strong>ORCID iD</strong>
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Divider */}
              <Box className={classes.Divider} />

              {/* Collapsible: Instructions to Request Access */}
              <Box className={classes.RequestBottomSection}>
                <Box className={classes.VerificationSection}>
                  <Box
                    className={classes.VerificationHeader}
                    onClick={() => setRequestAccessOpen(!requestAccessOpen)}
                  >
                    <Typography
                      className={classes.SubsectionTitle}
                      style={{ marginTop: 0, marginBottom: 0 }}
                    >
                      Instructions to Request Access
                    </Typography>
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 26 26"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ cursor: "pointer", flexShrink: 0 }}
                    >
                      {requestAccessOpen ? (
                        <path d="M26 22L16 12L6 22L26 22Z" fill="black" />
                      ) : (
                        <path d="M6 12L16 22L26 12H6Z" fill="black" />
                      )}
                    </svg>
                  </Box>
                </Box>

                {requestAccessOpen && (
                  <>
                    <Box className={classes.VerificationWrapper}>
                      <Box className={classes.VerificationSection}>
                        <Typography className={classes.BodyText}>
                          Create a Login.gov or ID.me account. If you do not
                          have an NIH account, also create an eRA Commons
                          account.
                          <br />
                          Complete NIH RAS identity verification. Verify your
                          identity through Login.gov using NIH RAS.
                          <br />
                          Link your accounts. Link your Login.gov account to
                          your eRA Commons account. If you are not an NIH user,
                          create an ORCID iD, link it to your eRA Commons
                          account, and allow up to two business days for
                          processing.
                          <br />
                          Request CTDC access. On the Request SEER Incidence
                          Data page, sign in with your NIH or Login.gov account
                          and complete the Research Plus request application.
                          Review and accept the required data use agreements,
                          then submit your request.
                          <br />
                          <br />
                          Access requests are typically processed within two
                          business days. Once approved, you can sign in to CTDC
                          using your NIH or Login.gov account.
                        </Typography>
                      </Box>
                    </Box>

                    <Box className={classes.VerificationWrapper}>
                      <Box className={classes.VerificationSection}>
                        <Typography
                          className={classes.SubsectionTitle}
                          style={{ marginTop: 0, marginBottom: 0 }}
                        >
                          Documentation
                        </Typography>
                        <Typography className={classes.Link} component="div">
                          eRA Commons Account Creation
                          <br />
                          Request SEER Incidence Data
                          <br />
                          SEER Research Data Use Agreement
                          <br />
                          SEER Treatment Data Limitations
                          <br />
                          CTDC Use Agreement
                        </Typography>
                      </Box>
                    </Box>
                  </>
                )}
              </Box>
            </Box>

            {/* Warning Notice Section */}
            <Box className={classes.WarningSection}>
              <Box className={classes.WarningContent}>
                <Typography className={classes.WarningTitle}>
                  Warning Notice
                </Typography>
                <Box
                  className={classes.WarningToggle}
                  onClick={() => setWarningOpen(!warningOpen)}
                >
                  <Typography className={classes.WarningText}>
                    {warningOpen
                      ? "This warning banner provides privacy and security notices consistent with applicable federal laws, directives, and other federal guidance for accessing this Government system, which includes all devices/storage media attached to this system. This system is provided for Government-authorized use only. Unauthorized or improper use of this system is prohibited and may result in disciplinary action and/or civil and criminal penalties. At any time, and for any lawful Government purpose, the government may monitor, record, and audit your system usage and/or intercept, search and seize any communication or data transiting or stored on this system. Therefore, you have no reasonable expectation of privacy. Any communication or data transiting or stored on this system may be disclosed or used for any lawful Government purpose."
                      : "This warning banner provides privacy and security notices consistent with applicable federal laws ..."}
                  </Typography>
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ cursor: "pointer", flexShrink: 0 }}
                  >
                    {warningOpen ? (
                      <path d="M26 22L16 12L6 22L26 22Z" fill="black" />
                    ) : (
                      <path d="M6 7L16 17L26 7H6Z" fill="black" />
                    )}
                  </svg>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right Column - Help Sidebar */}
          <Grid item xs={12} md className={classes.RightColumn}>
            <Box className={classes.HelpSidebar}>
              {/* Need Help Section */}
              <Box className={classes.HelpHeader}>
                <img
                  src={HelpIconSvg}
                  alt="Help Icon"
                  className={classes.HelpIcon}
                />
                <Typography className={classes.HelpHeaderText}>
                  NEED HELP?
                </Typography>
              </Box>

              {/* Tutorial Section */}
              <Box className={classes.TutorialSection}>
                <Typography className={classes.SidebarTitle}>
                  Creating Accounts to Access CTDC data
                </Typography>
                <Typography className={classes.SidebarText}>
                  This tutorial walks you through the steps involved in
                  acquiring an eRA Commons account, creating a Login.gov account
                  if you don't have one, linking your accounts together, and
                  registering for Research RAS.
                </Typography>

                {/* Video Thumbnail Placeholder */}
                <Box className={classes.VideoThumbnail}>
                  <PlayArrowIcon className={classes.PlayIcon} />
                  <Typography className={classes.VideoText}>
                    Tutorial Video
                  </Typography>
                </Box>
              </Box>

              {/* Contact Section */}
              <Box className={classes.ContactSection}>
                <Typography className={classes.SidebarTitle}>
                  Let us assist you with your CTDC access
                </Typography>
                <Typography className={classes.SidebarText}>
                  If you experience any difficulties with logging in or
                  accessing your account, please reach out to our support team
                  for assistance.
                </Typography>
                <Button variant="outlined" className={classes.ContactButton}>
                  Contact Us
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

const styles = (theme) => ({
  Container: {
    background:
      "linear-gradient(148.75deg, #E6E6E6, #A1D2D5 32.21%, #0E8EB1), linear-gradient(#088CBA, #088CBA)",
    fontFamily: 'Lato, "Open Sans", sans-serif',
    minHeight: "100vh",
    paddingBottom: "60px",
    boxShadow: "0px 4px 20px 0px #00000040 inset",
  },

  // Hero Section Styles
  HeroSection: {
    padding: "30px 92px 50px",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "51px",
    overflow: "hidden",
  },
  HeroIconWrapper: {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "20px",
    width: "103px",
    height: "103px",
    margin: "0 auto 20px",
  },
  LockBorder: {
    position: "absolute",
    width: "103px",
    height: "103px",
    top: 0,
    left: 0,
  },
  HeroIcon: {
    position: "relative",
    width: "101px",
    height: "101px",
    zIndex: 1,
  },
  HeroTitle: {
    fontFamily: "Inter",
    fontSize: "30px",
    fontWeight: 500,
    color: "#004D73",
    marginTop: "10px",
    lineHeight: "32px",
  },

  // Content Wrapper
  ContentWrapper: {
    maxWidth: "1500px",
    margin: "40px auto",
    padding: "0 20px",
  },

  // Combined Login Box Styles
  CombinedLoginBox: {
    backgroundColor: "#F0F8FA",
    borderRadius: "35px",
    padding: "30px 40px 50px",
    marginBottom: "40px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.25)",
    border: "3px solid transparent",
    backgroundImage:
      "linear-gradient(#F0F8FA, #F0F8FA), linear-gradient(180deg, #DAF1FB, #F4FBFE 31.48%, #FFF)",
    backgroundOrigin: "border-box",
    backgroundClip: "padding-box, border-box",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "40px",
  },
  RightColumn: {
    [theme.breakpoints.up("md")]: {
      maxWidth: "361px",
    },
  },
  LoginSection: {
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "25px",
  },
  RasSection: {
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  RasTextWrapper: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "25px",
    minWidth: 0,
  },
  VerificationWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    gap: "100px",
  },
  VerificationSection: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "10px",
  },
  VerificationHeader: {
    alignSelf: "stretch",
    paddingRight: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    cursor: "pointer",
  },
  VerificationTitle: {
    flex: 1,
    fontFamily: "Inter",
    fontSize: "20px",
    fontWeight: 600,
    color: "#000",
    lineHeight: "26px",
  },
  VerificationText: {
    width: "100%",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 400,
    color: "#000",
    lineHeight: "24px",
    letterSpacing: "0.2px",
  },
  Divider: {
    width: "100%",
    height: "0px",
    borderTop: "1px solid #8A8A8A",
    boxSizing: "border-box",
    margin: "25px 0",
  },
  LoginContentRow: {
    alignSelf: "stretch",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },
  LoginTextContent: {
    width: "537px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "17px",
  },
  LoginButtonContainer: {
    display: "flex",
    alignItems: "flex-start",
  },
  BoxTitle: {
    alignSelf: "stretch",
    height: "37px",
    fontFamily: "Inter",
    fontSize: "24px",
    fontWeight: 700,
    color: "#18588E",
    letterSpacing: "-0.02em",
    lineHeight: "106.52%",
    display: "flex",
    alignItems: "center",
  },
  BodyText: {
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 400,
    color: "#000",
    letterSpacing: "0.2px",
    lineHeight: "150%",
    marginBottom: "0px",
  },
  NoteText: {
    alignSelf: "stretch",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 700,
    color: "#000",
    letterSpacing: "0.2px",
    lineHeight: "150%",
  },
  FooterNote: {
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 400,
    color: "#000",
    letterSpacing: "0.2px",
    lineHeight: "150%",
  },
  LoginButtonEra: {
    width: "213px",
    height: "47px",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 500,
    color: "#000000",
    backgroundColor: "#FFFFFF",
    border: "1.25px solid #3795A9",
    borderRadius: "10px",
    padding: "11px 14px",
    gap: "10px",
    textTransform: "none",
    textAlign: "center",
    lineHeight: "24.5px",
    whiteSpace: "nowrap",
    "&:hover": {
      backgroundColor: "#F0F9F7",
      border: "1.25px solid #3795A9",
    },
  },
  LoginButtonRas: {
    width: "215px",
    height: "47px",
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 500,
    color: "#000000",
    backgroundColor: "#FFFFFF",
    border: "1.25px solid #3795A9",
    borderRadius: "10px",
    padding: "11px 53px",
    gap: "10px",
    textTransform: "none",
    textAlign: "center",
    lineHeight: "24.5px",
    whiteSpace: "nowrap",
    "&:hover": {
      backgroundColor: "#F0F9F7",
      border: "1.25px solid #3795A9",
    },
  },

  // Help Sidebar Styles
  HelpSidebar: {
    backgroundColor: "#004D73",
    borderRadius: "35px",
    padding: "20px 30px 40px 30px",
    color: "#FFFFFF",
    minHeight: "925px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.25)",
  },
  HelpHeader: {
    display: "flex",
    alignItems: "center",
    marginBottom: "20px",
    gap: "15px",
  },
  HelpIcon: {
    width: "52px",
    height: "52px",
  },
  HelpHeaderText: {
    fontFamily: "Nunito",
    fontSize: "18px",
    fontWeight: 600,
    color: "white",
    textTransform: "uppercase",
    letterSpacing: "0.9px",
    lineHeight: "19.17px",
  },
  TutorialSection: {
    marginBottom: "50px",
  },
  SidebarTitle: {
    fontFamily: "Inter",
    fontSize: "24px",
    fontWeight: 700,
    color: "#8BEAFB",
    marginBottom: "5px",
    lineHeight: "25.57px",
  },
  SidebarText: {
    fontFamily: "Lato",
    fontSize: "16px",
    fontWeight: 400,
    color: "white",
    lineHeight: "21px",
    letterSpacing: "0.2px",
    marginBottom: "17px",
  },
  VideoThumbnail: {
    backgroundColor: "#094A61",
    borderRadius: "8px",
    padding: "40px",
    textAlign: "center",
    marginTop: "16px",
    cursor: "pointer",
    position: "relative",
    border: "2px solid #0A6D8A",
    "&:hover": {
      backgroundColor: "#0A5670",
    },
  },
  PlayIcon: {
    fontSize: "48px",
    color: "#FFFFFF",
    marginBottom: "8px",
  },
  VideoText: {
    fontFamily: "Lato",
    fontSize: "14px",
    fontWeight: 500,
    color: "#FFFFFF",
  },
  ContactSection: {
    marginTop: "40px",
  },
  ContactButton: {
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 500,
    color: "#000",
    backgroundColor: "#FFF",
    border: "1.3px solid #3795A9",
    borderRadius: "10px",
    padding: "11px 53px",
    textTransform: "none",
    marginTop: "16px",
    width: "100%",
    lineHeight: "24.5px",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.9)",
      border: "1.3px solid #3795A9",
    },
  },

  // Request Access Section
  RequestSection: {
    padding: "30px 40px 40px 40px",
    marginTop: "40px",
    backgroundColor: "#F0F8FA",
    borderRadius: "35px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.25)",
    outline: "3px #F4FBFE solid",
    outlineOffset: "-3px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  RequestTopSection: {
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "15px",
  },
  RequestBottomSection: {
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "15px",
  },
  SectionTitle: {
    alignSelf: "stretch",
    height: "37px",
    fontFamily: "Inter",
    fontSize: "24px",
    fontWeight: 700,
    color: "#18588E",
    lineHeight: "25.57px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  SubsectionTitle: {
    fontFamily: "Inter",
    fontSize: "20px",
    fontWeight: 600,
    color: "black",
    marginTop: "17px",
    marginBottom: "17px",
    lineHeight: "26px",
  },
  DocumentationList: {
    fontFamily: "Roboto",
    fontSize: "16px",
    listStyleType: "none",
    paddingLeft: "0px",
    "& li": {
      marginBottom: "4px",
    },
  },
  Link: {
    color: "#990099",
    textDecoration: "underline",
    fontWeight: 400,
    cursor: "pointer",
    letterSpacing: "0.2px",
    lineHeight: "24px",
    "&:hover": {
      textDecoration: "underline",
    },
  },

  // Warning Section
  WarningSection: {
    width: "100%",
    padding: "30px 40px",
    marginTop: "40px",
    backgroundColor: "#F4FBFE",
    borderRadius: "35px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.25)",
    outline: "3px #BA1F40 solid",
    outlineOffset: "-3px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "40px",
    boxSizing: "border-box",
  },
  WarningContent: {
    flex: "1 1 0",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "15px",
  },
  WarningToggle: {
    alignSelf: "stretch",
    paddingRight: "10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    cursor: "pointer",
  },
  WarningTitle: {
    fontFamily: "Inter",
    fontSize: "20px",
    fontWeight: 600,
    color: "#BA1F40",
    lineHeight: "26px",
  },
  WarningText: {
    flex: 1,
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 400,
    color: "black",
    lineHeight: "24px",
    letterSpacing: "0.2px",
  },
});

export default withStyles(styles)(RASLoginPage);
