// RAS (NIH Researcher Auth Service) login page
import React, { useState } from "react";
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

function getLoginAccordions(ras, verification) {
  if (Array.isArray(ras.accordions) && ras.accordions.length > 0) {
    return ras.accordions;
  }

  if (verification.title || verification.bodyMarkdown || verification.content) {
    return [verification];
  }

  return [];
}

function hasSectionContent(section) {
  return Boolean(
    section &&
      (section.title ||
        section.bodyMarkdown ||
        (Array.isArray(section.content) && section.content.length > 0)),
  );
}

function getLegacyContentBoxGroups(requestAccess) {
  const groups = [
    requestAccess.accessRequirements,
    {
      ...requestAccess.instructions,
      collapsible: true,
    },
    {
      ...requestAccess.documentation,
      variant: "links",
    },
  ];

  return groups.filter(hasSectionContent);
}

function getLegacySections(content) {
  const ras = content.ras || {};
  const verification = content.verification || {};
  const requestAccess = content.requestAccess || {};
  const sections = [];

  if (
    hasSectionContent(ras) ||
    (Array.isArray(ras.accordions) && ras.accordions.length > 0) ||
    hasSectionContent(verification)
  ) {
    sections.push({
      ...ras,
      id: "ras-login",
      type: "rasLogin",
      accordions: getLoginAccordions(ras, verification),
    });
  }

  if (
    requestAccess.title ||
    hasSectionContent(requestAccess) ||
    getLegacyContentBoxGroups(requestAccess).length > 0
  ) {
    sections.push({
      id: "request-access",
      type: "contentBox",
      title: requestAccess.title,
      content: requestAccess.content,
      bodyMarkdown: requestAccess.bodyMarkdown,
      groups: getLegacyContentBoxGroups(requestAccess),
    });
  }

  return sections;
}

function getLoginSections(content) {
  if (Array.isArray(content.sections) && content.sections.length > 0) {
    return content.sections;
  }

  return getLegacySections(content);
}

function getSectionKey(section, index) {
  return section.id || `${section.type || "section"}-${index}`;
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
  const sections = getLoginSections(content);
  const [loginAccordionsOpen, setLoginAccordionsOpen] = useState({});
  const [contentGroupsOpen, setContentGroupsOpen] = useState({});
  const [warningOpen, setWarningOpen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const toggleLoginAccordion = (sectionKey, index) => {
    setLoginAccordionsOpen((openItems) => ({
      ...openItems,
      [sectionKey]: {
        ...openItems[sectionKey],
        [index]: !(openItems[sectionKey] && openItems[sectionKey][index]),
      },
    }));
  };
  const toggleContentGroup = (sectionKey, index) => {
    setContentGroupsOpen((openItems) => ({
      ...openItems,
      [sectionKey]: {
        ...openItems[sectionKey],
        [index]: !(openItems[sectionKey] && openItems[sectionKey][index]),
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
                      onToggle={(accordionIndex) =>
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
                    openGroups={contentGroupsOpen[sectionKey] || {}}
                    onToggleGroup={(groupIndex) =>
                      toggleContentGroup(sectionKey, groupIndex)}
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
