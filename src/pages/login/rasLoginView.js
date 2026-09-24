// RAS (NIH Researcher Auth Service) login page
import React, { useEffect, useMemo, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Box } from "@material-ui/core";
import styles from "./rasLoginStyles";
import { getAsset } from "./components/ContentImage";
import {
  ContentBoxSection,
  HelpSidebar,
  LoginAccordionList,
  LoginHero,
  RasLoginSection,
  WarningNotice,
} from "./components/LoginSections";

function getLoginSections(content) {
  return Array.isArray(content.sections) ? content.sections : [];
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

function getDefaultOpenSectionAccordions(sections, sectionType) {
  return sections.reduce((openSections, section, index) => {
    if (section.type !== sectionType) return openSections;

    return {
      ...openSections,
      [getSectionKey(section, index)]: getDefaultOpenAccordions(
        section.accordions,
      ),
    };
  }, {});
}

function RASLoginPage(props) {
  const { classes, content = {}, rasAuthorizeUrl = "" } = props;
  const assets = content.assets || {};
  const arrowOpenIcon = getAsset(assets, "arrowOpen");
  const arrowClosedIcon = getAsset(assets, "arrowClosed");
  const externalLinkIcon = getAsset(assets, "externalLinkIcon");
  const hero = content.hero || {};
  const warning = content.warning || {};
  const help = content.help || {};
  const tutorial = help.tutorial || {};
  const contact = help.contact || {};
  const sections = useMemo(() => getLoginSections(content), [content]);
  const [loginAccordionsOpen, setLoginAccordionsOpen] = useState(() =>
    getDefaultOpenSectionAccordions(sections, "rasLogin"));
  const [contentAccordionsOpen, setContentAccordionsOpen] = useState(() =>
    getDefaultOpenSectionAccordions(sections, "contentBox"));
  const [warningOpen, setWarningOpen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    setLoginAccordionsOpen(
      getDefaultOpenSectionAccordions(sections, "rasLogin"),
    );
    setContentAccordionsOpen(
      getDefaultOpenSectionAccordions(sections, "contentBox"),
    );
  }, [sections]);

  const toggleLoginAccordion = (sectionKey, index) => {
    setLoginAccordionsOpen((openAccordions) => ({
      ...openAccordions,
      [sectionKey]: {
        ...openAccordions[sectionKey],
        [index]: !(
          openAccordions[sectionKey] && openAccordions[sectionKey][index]
        ),
      },
    }));
  };
  const toggleContentAccordion = (sectionKey, index) => {
    setContentAccordionsOpen((openAccordions) => ({
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

              if (section.type === "rasLogin") {
                return (
                  <Box className={classes.CombinedLoginBox} key={sectionKey}>
                    <RasLoginSection
                      classes={classes}
                      ras={section}
                      rasAuthorizeUrl={rasAuthorizeUrl}
                      externalLinkIcon={externalLinkIcon}
                    />

                    <LoginAccordionList
                      classes={classes}
                      accordions={section.accordions}
                      openAccordions={loginAccordionsOpen[sectionKey] || {}}
                      onToggleAccordion={(accordionIndex) =>
                        toggleLoginAccordion(sectionKey, accordionIndex)}
                      arrowOpenIcon={arrowOpenIcon}
                      arrowClosedIcon={arrowClosedIcon}
                      externalLinkIcon={externalLinkIcon}
                    />
                  </Box>
                );
              }

              if (section.type === "contentBox") {
                return (
                  <ContentBoxSection
                    key={sectionKey}
                    classes={classes}
                    section={section}
                    openAccordions={
                      contentAccordionsOpen[sectionKey] || {}
                    }
                    onToggleAccordion={(accordionIndex) =>
                      toggleContentAccordion(sectionKey, accordionIndex)}
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
