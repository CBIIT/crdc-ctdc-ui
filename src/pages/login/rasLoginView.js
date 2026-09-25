// RAS (NIH Researcher Auth Service) login page
import React, { useEffect, useMemo, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import styles from "./rasLoginStyles";
import { getAsset } from "./components/ContentImage";
import {
  getSectionAccordions,
  HelpSidebar,
  LoginHero,
  LoginSectionBox,
  WarningNotice,
} from "./components/LoginSections";

function getLoginSections(loginContent) {
  return Array.isArray(loginContent.sections) ? loginContent.sections : [];
}

function getSectionKey(section, index) {
  return section.id || `${section.type || "section"}-${index}`;
}

function getDefaultOpenAccordions(accordions = []) {
  const accordionList = Array.isArray(accordions) ? accordions : [];

  return accordionList.reduce((openAccordions, accordion, index) => {
    if (
      accordion &&
      accordion.collapsible !== false &&
      accordion.defaultOpen === true
    ) {
      return {
        ...openAccordions,
        [index]: true,
      };
    }

    return openAccordions;
  }, {});
}

function getDefaultOpenSectionAccordions(sections) {
  return sections.reduce((openSections, section, index) => {
    if (section.type !== "rasLogin" && section.type !== "contentBox") {
      return openSections;
    }

    return {
      ...openSections,
      [getSectionKey(section, index)]: getDefaultOpenAccordions(
        getSectionAccordions(section),
      ),
    };
  }, {});
}

function getDefaultOpenWarning(warning) {
  return Boolean(warning && warning.defaultOpen === true);
}

function RASLoginPage(props) {
  const { classes, loginContent = {}, rasAuthorizeUrl = "" } = props;
  const assets = loginContent.assets || {};
  const arrowOpenIcon = getAsset(assets, "arrowOpen");
  const arrowClosedIcon = getAsset(assets, "arrowClosed");
  const externalLinkIcon = getAsset(assets, "externalLinkIcon");
  const hero = loginContent.hero || {};
  const warning = loginContent.warning || {};
  const help = loginContent.help || {};
  const tutorial = help.tutorial || {};
  const contact = help.contact || {};
  const sections = useMemo(
    () => getLoginSections(loginContent),
    [loginContent],
  );
  const [sectionAccordionsOpen, setSectionAccordionsOpen] = useState(() =>
    getDefaultOpenSectionAccordions(sections));
  const [warningOpen, setWarningOpen] = useState(() =>
    getDefaultOpenWarning(warning));
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    setSectionAccordionsOpen(getDefaultOpenSectionAccordions(sections));
  }, [sections]);

  useEffect(() => {
    setWarningOpen(getDefaultOpenWarning(warning));
  }, [warning]);

  const toggleSectionAccordion = (sectionKey, index) => {
    setSectionAccordionsOpen((openAccordions) => ({
      ...openAccordions,
      [sectionKey]: {
        ...openAccordions[sectionKey],
        [index]: !(
          openAccordions[sectionKey] && openAccordions[sectionKey][index]
        ),
      },
    }));
  };

  return (
    <div className={classes.Container}>
      <LoginHero classes={classes} assets={assets} hero={hero} />

      <Grid container className={classes.ContentWrapper}>
        <Grid container className={classes.ColumnContainer}>
          <Grid item xs={12} md className={classes.LeftColumn}>
            {sections.map((section, index) => {
              const sectionKey = getSectionKey(section, index);

              if (
                section.type === "rasLogin" ||
                section.type === "contentBox"
              ) {
                return (
                  <LoginSectionBox
                    key={sectionKey}
                    classes={classes}
                    section={section}
                    rasAuthorizeUrl={rasAuthorizeUrl}
                    openAccordions={sectionAccordionsOpen[sectionKey] || {}}
                    onToggleAccordion={(accordionIndex) =>
                      toggleSectionAccordion(sectionKey, accordionIndex)}
                    arrowOpenIcon={arrowOpenIcon}
                    arrowClosedIcon={arrowClosedIcon}
                    externalLinkIcon={externalLinkIcon}
                  />
                );
              }

              return null;
            })}

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
