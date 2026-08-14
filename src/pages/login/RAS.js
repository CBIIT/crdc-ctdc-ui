import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button, Box } from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Stats from "../../components/Stats/AllStatsController";
import LockIconSvg from "../../assets/login/lock-icon.svg";
import LockBorderSvg from "../../assets/login/lock-border.svg";
import HelpIconSvg from "../../assets/login/help-icon.svg";

function RASLoginPage(props) {
  const { classes } = props;

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
          <Grid item xs={12} md={8}>
            <Box className={classes.CombinedLoginBox}>
              {/* eRA Commons Section */}
              <Box className={classes.LoginSection}>
                <Typography className={classes.BoxTitle}>
                  Log in with eRA Commons
                </Typography>
                <Box className={classes.LoginContentRow}>
                  <Box className={classes.LoginTextContent}>
                    <Typography
                      className={classes.BodyText}
                      style={{ marginBottom: "8px" }}
                    >
                      Click on the button below to go to the NIH Login page.
                    </Typography>
                    <Typography className={classes.BodyText}>
                      Enter your eRA Commons credentials.
                    </Typography>
                    <Typography
                      className={classes.NoteText}
                      style={{ marginTop: "12px" }}
                    >
                      <strong>Note:</strong> Logging in with another identity
                      provider will not grant access.
                    </Typography>
                  </Box>
                  <Box className={classes.LoginButtonContainer}>
                    <Button
                      variant="outlined"
                      className={classes.LoginButtonEra}
                    >
                      Login with eRA Commons
                    </Button>
                  </Box>
                </Box>
              </Box>

              {/* Divider */}
              <Box className={classes.Divider} />

              {/* RAS Section */}
              <Box className={classes.LoginSection}>
                <Typography className={classes.BoxTitle}>
                  Log in with NIH Research Auth Service (RAS)
                </Typography>
                <Box className={classes.LoginContentRow}>
                  <Box className={classes.LoginTextContent}>
                    <Typography className={classes.BodyText}>
                      Before accessing CTDC data, you may be required to verify
                      your identity through NIH's secure Researcher Auth Service
                      (RAS) using Login.gov. This identity verification is
                      required to comply with federal policies governing access
                      to controlled-access data repositories (CADRs).
                    </Typography>

                    <Typography className={classes.BodyText}>
                      If you already have a CTDC account, you must complete
                      identity verification to continue accessing
                      controlled-access data unless you sign in with an NIH
                      account, which does not require this additional
                      verification. Identity verification must be renewed
                      annually.
                    </Typography>

                    <Typography className={classes.BodyText}>
                      The verification process typically takes up to 30 minutes
                      and requires:
                    </Typography>

                    <Typography
                      className={classes.BodyText}
                      component="div"
                      style={{ marginBottom: "4px", marginTop: "4px" }}
                    >
                      • A mobile phone with a working camera
                    </Typography>
                    <Typography
                      className={classes.BodyText}
                      component="div"
                      style={{ marginBottom: "4px" }}
                    >
                      • Your Social Security number
                    </Typography>
                    <Typography
                      className={classes.BodyText}
                      component="div"
                      style={{ marginBottom: "4px" }}
                    >
                      • A phone number associated with a phone plan in your name
                    </Typography>
                    <Typography
                      className={classes.BodyText}
                      component="div"
                      style={{ marginBottom: "4px" }}
                    >
                      • One of the following valid government-issued IDs:
                    </Typography>
                    <Typography
                      className={classes.BodyText}
                      component="div"
                      style={{ marginLeft: "20px", marginBottom: "4px" }}
                    >
                      • U.S. driver's license
                    </Typography>
                    <Typography
                      className={classes.BodyText}
                      component="div"
                      style={{ marginLeft: "20px", marginBottom: "4px" }}
                    >
                      • State-issued ID
                    </Typography>
                    <Typography
                      className={classes.BodyText}
                      component="div"
                      style={{ marginLeft: "20px", marginBottom: "12px" }}
                    >
                      • U.S. passport
                    </Typography>

                    <Typography className={classes.FooterNote}>
                      Before selecting Log in with NIH Research Auth Service
                      (RAS), please gather the required information,
                      identification, and devices. For more information, see the
                      Login.gov Identity Verification Guidelines or the
                      Login.gov Help Center.
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
              </Box>
            </Box>

            {/* Request Access Section */}
            <Box className={classes.RequestSection}>
              <Typography className={classes.SectionTitle}>
                Request Access
              </Typography>

              <Typography className={classes.SubsectionTitle}>
                Access Requirements
              </Typography>

              <Typography className={classes.BodyText}>
                CTDC contains controlled-access research data. To comply with
                federal security requirements, users must verify their identity
                and affiliation before they can access the platform.
              </Typography>

              <Typography className={classes.BodyText}>
                To request CTDC access, you must have:
              </Typography>

              <ul className={classes.BodyText} style={{ marginTop: "8px" }}>
                <li>
                  An <strong>NIH account</strong>, or an{" "}
                  <strong>eRA Commons account</strong> linked to a{" "}
                  <strong>Login.gov account</strong> with{" "}
                  <strong>NIH Researcher Auth Service (RAS)</strong> identity
                  verification
                </li>
                <li>
                  An <strong>ORCID iD</strong>
                </li>
              </ul>

              <Typography className={classes.SubsectionTitle}>
                Request Access
              </Typography>

              <ol className={classes.InstructionList}>
                <li>Create a Login.gov or ID.me account.</li>
                <li>
                  If you do not have an NIH account, also create an eRA Commons
                  account.
                </li>
                <li>
                  Complete NIH RAS identity verification. Verify your identity
                  through Login.gov using NIH RAS.
                  <Typography
                    className={classes.BodyText}
                    style={{ marginTop: "8px", marginLeft: "20px" }}
                  >
                    Link your Login.gov account to your eRA Commons account. If
                    you are not an NIH user, create an ORCID iD for your eRA
                    Commons account, and allow up to two business days for
                    processing.
                  </Typography>
                </li>
                <li>
                  Request CTDC access. On the Request SEER Incidence Data page,
                  sign in with your NIH or Login.gov account and complete the
                  Research Plus request application. Review and accept the
                  required data use agreement, then submit your request.
                </li>
              </ol>

              <Typography
                className={classes.BodyText}
                style={{ marginTop: "16px" }}
              >
                Access requests are typically processed within two business
                days. Once approved, you can sign in to CTDC using your NIH or
                Login.gov account.
              </Typography>

              <Typography className={classes.SubsectionTitle}>
                Documentation
              </Typography>

              <ul className={classes.DocumentationList}>
                <li>
                  <span className={classes.Link} role="button" tabIndex={0}>
                    eRA Commons Account Creation
                  </span>
                </li>
                <li>
                  <span className={classes.Link} role="button" tabIndex={0}>
                    Request SEER Incidence Data
                  </span>
                </li>
                <li>
                  <span className={classes.Link} role="button" tabIndex={0}>
                    SEER Research Data Use Agreement
                  </span>
                </li>
                <li>
                  <span className={classes.Link} role="button" tabIndex={0}>
                    SEER Treatment Data Limitations
                  </span>
                </li>
                <li>
                  <span className={classes.Link} role="button" tabIndex={0}>
                    CTDC Use Agreement
                  </span>
                </li>
              </ul>
            </Box>

            {/* Warning Notice Section */}
            <Box className={classes.WarningSection}>
              <Typography className={classes.WarningTitle}>
                Warning Notice
              </Typography>
              <Typography className={classes.WarningText}>
                This warning banner provides privacy and security notices
                consistent with applicable federal laws, directives, and other
                federal guidance for accessing this Government system, which
                includes (1) this computer network, (2) all computers connected
                to this network, and (3) all devices and storage media attached
                to this network or to a computer on this network. This system is
                provided for Government-authorized use only. Unauthorized or
                improper use of this system is prohibited and may result in
                disciplinary action and/or civil and criminal penalties. At any
                time, and for any lawful Government purpose, the government may
                monitor, record, and audit your system usage and/or intercept,
                search and seize any communication or data transiting or stored
                on this system. Therefore, you have no reasonable expectation of
                privacy. Any communication or data transiting or stored on this
                system may be disclosed or used for any lawful Government
                purpose.
              </Typography>
            </Box>
          </Grid>

          {/* Right Column - Help Sidebar */}
          <Grid item xs={12} md={4}>
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
    maxWidth: "1200px",
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
  LoginSection: {
    alignSelf: "stretch",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "25px",
  },
  Divider: {
    width: "797px",
    height: "1px",
    position: "relative",
    borderTop: "1px solid #D8D8D8",
    boxSizing: "border-box",
    alignSelf: "center",
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
    outline: "3px #DAF1FB solid",
    outlineOffset: "-3px",
  },
  SectionTitle: {
    fontFamily: "Inter",
    fontSize: "24px",
    fontWeight: 700,
    color: "#18588E",
    marginBottom: "25px",
    lineHeight: "25.57px",
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
    padding: "30px 40px",
    marginTop: "40px",
    backgroundColor: "transparent",
    borderRadius: "35px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.25)",
    outline: "3px #DAF1FB solid",
    outlineOffset: "-3px",
  },
  WarningTitle: {
    fontFamily: "Inter",
    fontSize: "20px",
    fontWeight: 600,
    color: "#BA1F40",
    marginBottom: "17px",
    lineHeight: "26px",
  },
  WarningText: {
    fontFamily: "Roboto",
    fontSize: "16px",
    fontWeight: 400,
    color: "black",
    lineHeight: "24px",
    letterSpacing: "0.2px",
  },
});

export default withStyles(styles)(RASLoginPage);
