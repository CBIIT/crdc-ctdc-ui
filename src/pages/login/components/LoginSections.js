import React from "react";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import ContentImage, { getAsset } from "./ContentImage";
import LoginMarkdownContent from "./LoginMarkdownContent";
import ToggleHeader, { ToggleArrow } from "./ToggleHeader";

function handleActivation(callback) {
  return (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback();
    }
  };
}

export function LoginHero({ classes, assets, hero }) {
  return (
    <Box className={classes.HeroSection}>
      <div className={classes.HeroIconWrapper}>
        <ContentImage
          asset={getAsset(assets, "lockBorder")}
          fallbackAlt="Lock Border"
          className={classes.LockBorder}
        />
        <ContentImage
          asset={getAsset(assets, "lockIcon")}
          fallbackAlt="Lock Icon"
          className={classes.HeroIcon}
        />
      </div>
      <Typography variant="h1" component="h1" className={classes.HeroTitle}>
        {hero.title}
      </Typography>
    </Box>
  );
}

export function RasLoginSection({
  classes,
  ras,
  rasAuthorizeUrl,
  externalLinkIcon,
}) {
  return (
    <Box className={classes.RasSection}>
      <Typography
        variant="h2"
        component="h2"
        className={classes.BoxTitle}
      >
        {ras.title}
      </Typography>

      <Box className={classes.LoginContentRow}>
        <Box className={classes.RasTextWrapper}>
          <LoginMarkdownContent
            markdown={ras.bodyMarkdown}
            classes={classes}
            linkIcon={externalLinkIcon}
          />
        </Box>
        <Box className={classes.LoginButtonContainer}>
          <Button
            variant="outlined"
            className={classes.LoginButtonRas}
            disabled={!rasAuthorizeUrl}
            onClick={() => {
              if (rasAuthorizeUrl) {
                window.location.href = rasAuthorizeUrl;
              }
            }}
          >
            {ras.buttonText}
          </Button>
          {!rasAuthorizeUrl && (
            <Typography className={classes.BodyText} role="alert">
              {ras.unavailableText}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export function LoginAccordionList({
  classes,
  accordions,
  openAccordions,
  onToggle,
  arrowOpenIcon,
  arrowClosedIcon,
  externalLinkIcon,
}) {
  if (!accordions || accordions.length === 0) return null;

  return (
    <Box className={classes.AccordionList}>
      {accordions.map((accordion, index) => {
        const isOpen = Boolean(openAccordions[index]);
        const key = accordion.id || `${accordion.title || "accordion"}-${index}`;

        return (
          <Box className={classes.AccordionItem} key={key}>
            <ToggleHeader
              classes={classes}
              headerClassName={classes.AccordionHeader}
              title={accordion.title}
              titleClassName={classes.AccordionTitle}
              isOpen={isOpen}
              onToggle={() => onToggle(index)}
              openIcon={arrowOpenIcon}
              closedIcon={arrowClosedIcon}
            />

            {isOpen && (
              <Box className={classes.AccordionText}>
                <LoginMarkdownContent
                  markdown={accordion.bodyMarkdown}
                  classes={classes}
                  orderedListClassName={classes.orderedListNumeric}
                  alphaOrderedListClassName={classes.orderedListAlpha}
                  unorderedListClassName={classes.nestedList}
                  linkIcon={externalLinkIcon}
                />
              </Box>
            )}
          </Box>
        );
      })}
    </Box>
  );
}

export function RequestAccessSection({
  classes,
  requestAccess,
  accessRequirements,
  requestInstructions,
  documentation,
  requestAccessOpen,
  onToggle,
  arrowOpenIcon,
  arrowClosedIcon,
  externalLinkIcon,
}) {
  return (
    <Box className={classes.RequestSection}>
      <Box className={classes.RequestTopSection}>
        <Typography
          variant="h2"
          component="h2"
          className={classes.SectionTitle}
        >
          {requestAccess.title}
        </Typography>
        <Box className={classes.VerificationWrapper}>
          <Box className={classes.VerificationSection}>
            <Typography
              variant="h3"
              component="h3"
              className={classes.SubsectionTitle}
              style={{ marginTop: 0, marginBottom: 0 }}
            >
              {accessRequirements.title}
            </Typography>
            <LoginMarkdownContent
              markdown={accessRequirements.bodyMarkdown}
              classes={classes}
              linkIcon={externalLinkIcon}
            />
          </Box>
        </Box>
      </Box>

      <Box className={classes.Divider} />

      <Box className={classes.RequestBottomSection}>
        <Box className={classes.VerificationSection}>
          <ToggleHeader
            classes={classes}
            title={requestInstructions.title}
            titleClassName={classes.SubsectionTitle}
            titleStyle={{ marginTop: 0, marginBottom: 0 }}
            isOpen={requestAccessOpen}
            onToggle={onToggle}
            openIcon={arrowOpenIcon}
            closedIcon={arrowClosedIcon}
          />
        </Box>

        {requestAccessOpen && (
          <>
            <Box className={classes.VerificationWrapper}>
              <Box className={classes.VerificationSection}>
                <Typography className={classes.BodyText} component="div">
                  <LoginMarkdownContent
                    markdown={requestInstructions.bodyMarkdown}
                    classes={classes}
                    orderedListClassName={classes.orderedListNumeric}
                    linkIcon={externalLinkIcon}
                  />
                </Typography>
              </Box>
            </Box>

            <Box className={classes.VerificationWrapper}>
              <Box className={classes.VerificationSection}>
                <Typography
                  variant="h3"
                  component="h3"
                  className={classes.SubsectionTitle}
                  style={{ marginTop: 0, marginBottom: 0 }}
                >
                  {documentation.title}
                </Typography>
                <Box className={classes.Link}>
                  <LoginMarkdownContent
                    markdown={documentation.bodyMarkdown}
                    classes={classes}
                    linkIcon={externalLinkIcon}
                  />
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export function WarningNotice({
  classes,
  warning,
  warningOpen,
  onToggle,
  arrowOpenIcon,
  arrowClosedIcon,
  externalLinkIcon,
}) {
  return (
    <Box className={classes.WarningSection}>
      <Box className={classes.WarningContent}>
        <Typography
          variant="h2"
          component="h2"
          className={classes.WarningTitle}
        >
          {warning.title}
        </Typography>
        <Box
          className={classes.WarningToggle}
          role="button"
          tabIndex={0}
          aria-expanded={warningOpen}
          onClick={onToggle}
          onKeyDown={handleActivation(onToggle)}
        >
          <LoginMarkdownContent
            markdown={warning.bodyMarkdown}
            classes={classes}
            paragraphClassName={`${classes.WarningText} ${!warningOpen ? classes.WarningTextCollapsed : ""}`}
            linkIcon={externalLinkIcon}
          />
          <ToggleArrow
            isOpen={warningOpen}
            openIcon={arrowOpenIcon}
            closedIcon={arrowClosedIcon}
          />
        </Box>
      </Box>
    </Box>
  );
}

export function HelpSidebar({
  classes,
  assets,
  help,
  tutorial,
  contact,
  videoPlaying,
  onPlayVideo,
  externalLinkIcon,
}) {
  return (
    <Grid item xs={12} md className={classes.RightColumn}>
      <Box
        component="aside"
        className={classes.HelpSidebar}
        aria-label={help.ariaLabel}
      >
        <Box className={classes.HelpHeader}>
          <ContentImage
            asset={getAsset(assets, "helpIcon")}
            fallbackAlt="Help Icon"
            className={classes.HelpIcon}
          />
          <Typography
            variant="h2"
            component="h2"
            className={classes.HelpHeaderText}
          >
            {help.headerText}
          </Typography>
        </Box>

        <Box className={classes.TutorialSection}>
          <Typography
            variant="h3"
            component="h3"
            className={classes.SidebarTitle}
          >
            {tutorial.title}
          </Typography>
          <LoginMarkdownContent
            markdown={tutorial.bodyMarkdown}
            classes={classes}
            paragraphClassName={classes.SidebarText}
            linkIcon={externalLinkIcon}
          />

          <Box className={classes.VideoThumbnail}>
            {videoPlaying ? (
              <video
                src={tutorial.videoUrl}
                className={classes.VideoImage}
                controls
                autoPlay
              >
                <track kind="captions" />
              </video>
            ) : (
              <>
                <ContentImage
                  asset={getAsset(assets, "videoThumbnail")}
                  fallbackAlt="Tutorial Video"
                  className={classes.VideoImage}
                />
                <Box
                  className={classes.PlayOverlay}
                  role="button"
                  tabIndex={0}
                  aria-label={tutorial.playButtonAriaLabel}
                  onClick={onPlayVideo}
                  onKeyDown={handleActivation(onPlayVideo)}
                >
                  <ContentImage
                    asset={getAsset(assets, "playIcon")}
                    fallbackAlt="Play"
                    className={classes.PlayIcon}
                  />
                </Box>
              </>
            )}
          </Box>
        </Box>

        <Box className={classes.ContactSection}>
          <Typography
            variant="h3"
            component="h3"
            className={classes.SidebarTitle}
          >
            {contact.title}
          </Typography>
          <LoginMarkdownContent
            markdown={contact.bodyMarkdown}
            classes={classes}
            paragraphClassName={classes.SidebarText}
            linkIcon={externalLinkIcon}
          />
          <Button
            variant="outlined"
            className={classes.ContactButton}
            href={contact.href || undefined}
            target={contact.target || undefined}
            rel={contact.rel || undefined}
          >
            {contact.buttonText}
          </Button>
        </Box>
      </Box>
    </Grid>
  );
}
