// RAS (NIH Researcher Auth Service) login page
import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Box } from "@material-ui/core";
import styles from "./rasLoginStyles";
import { getAsset } from "./components/ContentImage";
import {
  HelpSidebar,
  LoginAccordionList,
  LoginHero,
  RasLoginSection,
  RequestAccessSection,
  WarningNotice,
} from "./components/LoginSections";

function getLoginAccordions(ras, verification) {
  if (Array.isArray(ras.accordions) && ras.accordions.length > 0) {
    return ras.accordions;
  }

  if (verification.title || verification.bodyMarkdown || verification.content) {
    return [verification];
  }

  return [];
}

function RASLoginPage(props) {
  const { classes, content = {}, rasAuthorizeUrl = "" } = props;
  const assets = content.assets || {};
  const arrowOpenIcon = getAsset(assets, "arrowOpen");
  const arrowClosedIcon = getAsset(assets, "arrowClosed");
  const externalLinkIcon = getAsset(assets, "externalLinkIcon");
  const hero = content.hero || {};
  const ras = content.ras || {};
  const verification = content.verification || {};
  const requestAccess = content.requestAccess || {};
  const warning = content.warning || {};
  const help = content.help || {};
  const accessRequirements = requestAccess.accessRequirements || {};
  const requestInstructions = requestAccess.instructions || {};
  const documentation = requestAccess.documentation || {};
  const tutorial = help.tutorial || {};
  const contact = help.contact || {};
  const loginAccordions = getLoginAccordions(ras, verification);
  const [loginAccordionsOpen, setLoginAccordionsOpen] = useState({});
  const [requestAccessOpen, setRequestAccessOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const toggleLoginAccordion = (index) => {
    setLoginAccordionsOpen((openItems) => ({
      ...openItems,
      [index]: !openItems[index],
    }));
  };

  return (
    <div className={classes.Container}>
      <LoginHero classes={classes} assets={assets} hero={hero} />

      <Grid container className={classes.ContentWrapper}>
        <Grid container className={classes.ColumnContainer}>
          <Grid item xs={12} md className={classes.LeftColumn}>
            <Box className={classes.CombinedLoginBox}>
              <RasLoginSection
                classes={classes}
                ras={ras}
                rasAuthorizeUrl={rasAuthorizeUrl}
                externalLinkIcon={externalLinkIcon}
              />

              <LoginAccordionList
                classes={classes}
                accordions={loginAccordions}
                openAccordions={loginAccordionsOpen}
                onToggle={toggleLoginAccordion}
                arrowOpenIcon={arrowOpenIcon}
                arrowClosedIcon={arrowClosedIcon}
                externalLinkIcon={externalLinkIcon}
              />
            </Box>

            <RequestAccessSection
              classes={classes}
              requestAccess={requestAccess}
              accessRequirements={accessRequirements}
              requestInstructions={requestInstructions}
              documentation={documentation}
              requestAccessOpen={requestAccessOpen}
              onToggle={() => setRequestAccessOpen((value) => !value)}
              arrowOpenIcon={arrowOpenIcon}
              arrowClosedIcon={arrowClosedIcon}
              externalLinkIcon={externalLinkIcon}
            />

            <WarningNotice
              classes={classes}
              warning={warning}
              warningOpen={warningOpen}
              onToggle={() => setWarningOpen((value) => !value)}
              arrowOpenIcon={arrowOpenIcon}
              arrowClosedIcon={arrowClosedIcon}
              externalLinkIcon={externalLinkIcon}
            />
          </Grid>

          <HelpSidebar
            classes={classes}
            assets={assets}
            help={help}
            tutorial={tutorial}
            contact={contact}
            videoPlaying={videoPlaying}
            onPlayVideo={() => setVideoPlaying(true)}
            externalLinkIcon={externalLinkIcon}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default withStyles(styles)(RASLoginPage);
