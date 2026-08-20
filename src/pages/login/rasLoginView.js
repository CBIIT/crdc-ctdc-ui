// RAS (NIH Researcher Auth Service) login page
import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button, Box } from "@material-ui/core";
import LockIconSvg from "../../assets/login/lock-icon.svg";
import LockBorderSvg from "../../assets/login/lock-border.svg";
import HelpIconSvg from "../../assets/login/help-icon.svg";
import VideoThumbnailImg from "../../assets/login/CTDC_Tutorial_Video_Placeholder.png";
import PlayIconSvg from "../../assets/login/video_play_icon_large.svg";
import UpArrowSvg from "../../assets/login/up_arrow.svg";
import DownArrowSvg from "../../assets/login/down_arrow.svg";
import env from "../../utils/env";
import styles from "./rasLoginStyles";

function ToggleArrow({ isOpen }) {
  return (
    <img
      src={isOpen ? UpArrowSvg : DownArrowSvg}
      alt={isOpen ? "Collapse" : "Expand"}
      style={{
        cursor: "pointer",
        flexShrink: 0,
        // width: "2px",
        // height: "26px",
      }}
    />
  );
}

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
        <Grid container className={classes.ColumnContainer}>
          {/* Left Column - Combined Login Box */}
          <Grid item xs={12} md className={classes.LeftColumn}>
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
                      <br />
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
                      onClick={() => {
                        console.log(
                          "[RAS login] Redirecting to RAS authorize URL",
                          {
                            hasAuthorizeUrl: Boolean(
                              env.REACT_APP_RAS_AUTHORIZE_URL,
                            ),
                            authorizeUrlStartsWith:
                              env.REACT_APP_RAS_AUTHORIZE_URL?.split("?")[0],
                          },
                        );
                        // TODO: Remove hardcoded fallback URL after devops configures REACT_APP_RAS_AUTHORIZE_URL
                        const rasUrl =
                          env.REACT_APP_RAS_AUTHORIZE_URL ||
                          "https://stsstg.nih.gov/auth/oauth/v2/authorize?client_id=b0714287-43ee-479f-b151-8e58f3622899&response_type=code&redirect_uri=https%3A%2F%2Fclinical-dev.datacommons.cancer.gov%2Fapi%2Fauth%2Fcallback&scope=openid%20profile%20email%20ga4gh_passport_v1%20researcher_role%20federated_identities_ial2%20federated_identities%20federated_sources%20source";
                        window.location.href = rasUrl;
                      }}
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
                      <ToggleArrow isOpen={verificationOpen} />
                    </Box>

                    {verificationOpen && (
                      <Box className={classes.VerificationText}>
                        <Typography className={classes.BodyText}>
                          The verification process typically takes up to 30
                          minutes and requires:
                        </Typography>
                        <ol className={classes.orderedListAlpha}>
                          <li>A mobile phone with a working camera</li>
                          <li>Your Social Security number</li>
                          <li>
                            A phone number associated with a phone plan in your
                            name
                          </li>
                          <li>
                            One of the following valid government-issued IDs:
                            <ul className={classes.nestedList}>
                              <li>U.S. driver&apos;s license</li>
                              <li>State-issued ID</li>
                              <li>U.S. passport</li>
                            </ul>
                          </li>
                        </ol>
                        <Typography className={classes.BodyText}>
                          Before selecting Log in with NIH Research Auth Service
                          (RAS), please gather the required information,
                          identification, and devices. For more information, see
                          the Login.gov Identity Verification Guidelines or the
                          Login.gov Help Center.
                        </Typography>
                      </Box>
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
                      <ul className={classes.unorderedList}>
                        <li>
                          An <strong>NIH account</strong> linked to a{" "}
                          <strong>Login.gov</strong> account with{" "}
                          <strong>NIH Researcher Auth Service (RAS)</strong>{" "}
                          identity verification
                        </li>
                        <li>
                          An <strong>ORCID iD</strong>
                        </li>
                      </ul>
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
                    <ToggleArrow isOpen={requestAccessOpen} />
                  </Box>
                </Box>

                {requestAccessOpen && (
                  <>
                    <Box className={classes.VerificationWrapper}>
                      <Box className={classes.VerificationSection}>
                        <Typography className={classes.BodyText}>
                          <ol className={classes.orderedListNumeric}>
                            <li>
                              Create a Login.gov or ID.me account. If you do not
                              have an NIH account, also create an eRA Commons
                              account.
                            </li>
                            <li>
                              Complete NIH RAS identity verification. Verify
                              your identity through Login.gov using NIH RAS.
                            </li>
                            <li>
                              Link your accounts. Link your Login.gov account to
                              your eRA Commons account. If you are not an NIH
                              user, create an ORCID iD, link it to your eRA
                              Commons account, and allow up to two business days
                              for processing.
                            </li>
                            <li>
                              Request CTDC access. On the Request SEER Incidence
                              Data page, sign in with your NIH or Login.gov
                              account and complete the Research Plus request
                              application. Review and accept the required data
                              use agreements, then submit your request.
                            </li>
                          </ol>
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
                          <ul className={classes.unorderedList}>
                            <li>eRA Commons Account Creation</li>
                            <li>Request SEER Incidence Data</li>
                            <li>SEER Research Data Use Agreement</li>
                            <li>SEER Treatment Data Limitations</li>
                            <li>CTDC Use Agreement</li>
                          </ul>
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
                  <Typography
                    className={`${classes.WarningText} ${!warningOpen ? classes.WarningTextCollapsed : ""}`}
                  >
                    This warning banner provides privacy and security notices
                    consistent with applicable federal laws, directives, and
                    other federal guidance for accessing this Government system,
                    which includes all devices/storage media attached to this
                    system. This system is provided for Government-authorized
                    use only. Unauthorized or improper use of this system is
                    prohibited and may result in disciplinary action and/or
                    civil and criminal penalties. At any time, and for any
                    lawful Government purpose, the government may monitor,
                    record, and audit your system usage and/or intercept, search
                    and seize any communication or data transiting or stored on
                    this system. Therefore, you have no reasonable expectation
                    of privacy. Any communication or data transiting or stored
                    on this system may be disclosed or used for any lawful
                    Government purpose.
                  </Typography>
                  <ToggleArrow isOpen={warningOpen} />
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
                  This tutorial explains the steps involved in creating a Login.gov account,
                  linking those accounts together, and registering for Research Plus.
                </Typography>

                {/* Video Thumbnail */}
                <Box className={classes.VideoThumbnail}>
                  <img
                    src={VideoThumbnailImg}
                    alt="Tutorial Video"
                    className={classes.VideoImage}
                  />
                  <Box className={classes.PlayOverlay}>
                    <img
                      src={PlayIconSvg}
                      alt="Play"
                      className={classes.PlayIcon}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Contact Section */}
              <Box className={classes.ContactSection}>
                <Typography className={classes.SidebarTitle}>
                  Let us assist you with your login or access issues
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

export default withStyles(styles)(RASLoginPage);
