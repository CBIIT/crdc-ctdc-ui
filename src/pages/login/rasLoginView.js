/**
 * RAS (NIH Researcher Auth Service) login page shell.
 * Purpose: hold UI state for YAML-driven sections, warning disclosure, and
 * tutorial playback while keeping editable copy in loginView.yaml.
 * Assumptions: section order, accordion order, and Help panel order come from
 * the YAML. The controller may pass a bundled fallback payload if YAML loading
 * fails, and this shell displays that fallback without blocking authentication.
 */
import React, { useEffect, useMemo, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Box, Grid, Typography } from "@material-ui/core";
import styles from "./rasLoginStyles";
import { getAsset } from "./components/ContentImage";
import {
  getSectionAccordions,
  HelpSidebar,
  LoginHero,
  LoginSectionBox,
  WarningNotice,
} from "./components/LoginSections";

const RENDERABLE_SECTION_TYPES = ["rasLogin", "contentBox"];

function getLoginSections(loginContent) {
  return Array.isArray(loginContent.sections) ? loginContent.sections : [];
}

function getSectionKey(section = {}, index) {
  return section.id || `${section.type || "section"}-${index}`;
}

function isRenderableSection(section) {
  return Boolean(section && RENDERABLE_SECTION_TYPES.includes(section.type));
}

function getInitiallyOpenAccordions(accordions = []) {
  // Accordions are closed by default unless the YAML explicitly sets
  // defaultOpen: true. Non-collapsible rows render open outside this map.
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

function getInitiallyOpenSectionAccordions(sections) {
  return sections.reduce((openSections, section, index) => {
    if (!isRenderableSection(section)) {
      return openSections;
    }

    return {
      ...openSections,
      [getSectionKey(section, index)]: getInitiallyOpenAccordions(
        getSectionAccordions(section),
      ),
    };
  }, {});
}

function getInitiallyOpenWarning(warning) {
  return Boolean(warning && warning.defaultOpen === true);
}

function hasBlocks(item) {
  return Boolean(
    item &&
      Array.isArray(item.blocks) &&
      item.blocks.length > 0,
  );
}

function hasWarningContent(warning) {
  return Boolean(warning && (warning.title || hasBlocks(warning)));
}

function hasHelpContent(help) {
  const tutorial = (help && help.tutorial) || {};
  const contact = (help && help.contact) || {};

  return Boolean(
    help && (
      help.headerText ||
      hasBlocks(help) ||
      tutorial.title ||
      hasBlocks(tutorial) ||
      tutorial.videoUrl ||
      contact.title ||
      hasBlocks(contact) ||
      contact.buttonText
    ),
  );
}

function ContentLoadNotice({ classes, contentLoadError, onDismiss }) {
  if (!contentLoadError) return null;

  const notice = contentLoadError.notice ||
    "Some content could not be loaded.";
  const message = contentLoadError.message ||
    "The page is showing a saved local version because the remote content could not be reached.";

  return (
    <Box className={classes.ContentLoadNotice} role="alert">
      <Typography
        component="p"
        className={classes.ContentLoadNoticeText}
      >
        <strong>{notice}</strong> {message}
      </Typography>
      <button
        type="button"
        className={classes.ContentLoadNoticeDismiss}
        aria-label="Dismiss content load notice"
        onClick={onDismiss}
      >
        ×
      </button>
    </Box>
  );
}

function RASLoginPage(props) {
  const {
    classes,
    loginContent = {},
    rasAuthorizeUrl = "",
    contentLoadError,
  } = props;
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
    getInitiallyOpenSectionAccordions(sections));
  const [warningOpen, setWarningOpen] = useState(() =>
    getInitiallyOpenWarning(warning));
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [contentNoticeDismissed, setContentNoticeDismissed] =
    useState(false);

  useEffect(() => {
    setSectionAccordionsOpen(getInitiallyOpenSectionAccordions(sections));
  }, [sections]);

  useEffect(() => {
    setWarningOpen(getInitiallyOpenWarning(warning));
  }, [warning]);

  useEffect(() => {
    setContentNoticeDismissed(false);
  }, [contentLoadError]);

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
      {!contentNoticeDismissed && (
        <ContentLoadNotice
          classes={classes}
          contentLoadError={contentLoadError}
          onDismiss={() => setContentNoticeDismissed(true)}
        />
      )}

      <LoginHero classes={classes} assets={assets} hero={hero} />

      <Grid container className={classes.ContentWrapper}>
        <Grid container className={classes.ColumnContainer}>
          <Grid item xs={12} md className={classes.LeftColumn}>
            {sections.map((section, index) => {
              const sectionKey = getSectionKey(section, index);

              if (isRenderableSection(section)) {
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

            {hasWarningContent(warning) && (
              <WarningNotice
                classes={classes}
                warning={warning}
                warningOpen={warningOpen}
                onToggle={() => setWarningOpen((value) => !value)}
                arrowOpenIcon={arrowOpenIcon}
                arrowClosedIcon={arrowClosedIcon}
                externalLinkIcon={externalLinkIcon}
              />
            )}
          </Grid>

          {hasHelpContent(help) && (
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
          )}
        </Grid>
      </Grid>
    </div>
  );
}

export default withStyles(styles)(RASLoginPage);
