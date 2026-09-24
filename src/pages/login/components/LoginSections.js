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
            content={ras.content}
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
  openAccordions = {},
  onToggleAccordion = () => {},
  arrowOpenIcon,
  arrowClosedIcon,
  externalLinkIcon,
}) {
  const accordionItems = Array.isArray(accordions) ? accordions : [];

  if (accordionItems.length === 0) return null;

  return (
    <Box className={classes.AccordionList}>
      {accordionItems.map((item, index) => {
        const isOpen = Boolean(openAccordions[index]);
        const key = item.id || `${item.title || "item"}-${index}`;

        return (
          <LoginAccordionItem
            key={key}
            classes={classes}
            item={item}
            isOpen={isOpen}
            onToggle={() => onToggleAccordion(index)}
            arrowOpenIcon={arrowOpenIcon}
            arrowClosedIcon={arrowClosedIcon}
            externalLinkIcon={externalLinkIcon}
          />
        );
      })}
    </Box>
  );
}

function isCollapsible(item) {
  return item.collapsible !== false;
}

function LoginAccordionItem({
  classes,
  item,
  isOpen,
  onToggle,
  arrowOpenIcon,
  arrowClosedIcon,
  externalLinkIcon,
  bodyClassName,
}) {
  const accordionTextClassName = bodyClassName
    ? `${classes.AccordionText} ${bodyClassName}`
    : classes.AccordionText;
  const itemIsCollapsible = isCollapsible(item);
  const itemIsOpen = itemIsCollapsible ? isOpen : true;

  return (
    <Box className={classes.AccordionItem}>
      {itemIsCollapsible ? (
        <ToggleHeader
          classes={classes}
          headerClassName={classes.AccordionHeader}
          title={item.title}
          titleClassName={classes.AccordionTitle}
          isOpen={itemIsOpen}
          onToggle={onToggle}
          openIcon={arrowOpenIcon}
          closedIcon={arrowClosedIcon}
        />
      ) : item.title && (
        <Box className={classes.AccordionHeader}>
          <Typography
            variant="h3"
            component="h3"
            className={classes.AccordionTitle}
          >
            {item.title}
          </Typography>
        </Box>
      )}

      {itemIsOpen && (
        <Box className={accordionTextClassName}>
          <LoginMarkdownContent
            content={item.content}
            markdown={item.bodyMarkdown}
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
}

function LoginContentBlock({
  classes,
  item,
  externalLinkIcon,
  className,
}) {
  return (
    <Box className={className}>
      <LoginMarkdownContent
        content={item.content}
        markdown={item.bodyMarkdown}
        classes={classes}
        orderedListClassName={classes.orderedListNumeric}
        alphaOrderedListClassName={classes.orderedListAlpha}
        linkIcon={externalLinkIcon}
      />
    </Box>
  );
}

function hasContent(item) {
  return Boolean(
    item &&
      ((Array.isArray(item.content) && item.content.length > 0) ||
        item.bodyMarkdown),
  );
}

function getContentOrder(section) {
  const keys = Object.keys(section);
  const contentIndex = keys.findIndex((key) =>
    key === "content" || key === "bodyMarkdown");

  return contentIndex === -1 ? Number.MAX_SAFE_INTEGER : contentIndex;
}

function getOrderedContentBoxComponents(section, accordions) {
  const keys = Object.keys(section);
  const components = [];

  if (hasContent(section)) {
    components.push({
      type: "content",
      order: getContentOrder(section),
    });
  }

  if (accordions.length > 0) {
    const accordionIndex = keys.indexOf("accordions");

    components.push({
      type: "accordions",
      order: accordionIndex === -1
        ? Number.MAX_SAFE_INTEGER
        : accordionIndex,
    });
  }

  return components.sort((firstComponent, secondComponent) =>
    firstComponent.order - secondComponent.order);
}

export function ContentBoxSection({
  classes,
  section,
  openAccordions = {},
  onToggleAccordion = () => {},
  arrowOpenIcon,
  arrowClosedIcon,
  externalLinkIcon,
}) {
  const accordions = Array.isArray(section.accordions)
    ? section.accordions
    : [];
  const orderedComponents = getOrderedContentBoxComponents(
    section,
    accordions,
  );

  return (
    <Box className={classes.RequestSection}>
      <Box className={classes.RequestTopSection}>
        {section.title && (
          <Typography
            variant="h2"
            component="h2"
            className={classes.SectionTitle}
          >
            {section.title}
          </Typography>
        )}
      </Box>

      {orderedComponents.map((component, componentIndex) => {
        if (component.type === "content") {
          return (
            <Box
              key="content"
              className={classes.RequestBottomSection}
            >
              <Box className={classes.VerificationWrapper}>
                <Box className={classes.VerificationSection}>
                  <LoginContentBlock
                    classes={classes}
                    item={section}
                    externalLinkIcon={externalLinkIcon}
                  />
                </Box>
              </Box>
            </Box>
          );
        }

        const hasPreviousContent = orderedComponents
          .slice(0, componentIndex)
          .some((orderedComponent) => orderedComponent.type === "content");

        return accordions.map((accordion, index) => {
          const accordionKey =
            accordion.id || `${accordion.title || "accordion"}-${index}`;
          const accordionIsCollapsible = isCollapsible(accordion);
          const isOpen = Boolean(openAccordions[index]);
          const useLinkStyle =
            accordion.variant === "links" || accordion.linkStyle;
          const previousAccordion = accordions[index - 1];
          const previousAccordionIsCollapsible =
            previousAccordion && isCollapsible(previousAccordion);
          const isNextToAccordion =
            accordionIsCollapsible || previousAccordionIsCollapsible;
          const shouldShowDivider =
            !isNextToAccordion && (hasPreviousContent || index > 0);

          return (
            <React.Fragment key={accordionKey}>
              {shouldShowDivider && <Box className={classes.Divider} />}

              <Box className={classes.RequestBottomSection}>
                {accordionIsCollapsible ? (
                  <Box className={classes.AccordionList}>
                    <LoginAccordionItem
                      classes={classes}
                      item={accordion}
                      isOpen={isOpen}
                      onToggle={() => onToggleAccordion(index)}
                      arrowOpenIcon={arrowOpenIcon}
                      arrowClosedIcon={arrowClosedIcon}
                      externalLinkIcon={externalLinkIcon}
                      bodyClassName={useLinkStyle ? classes.Link : undefined}
                    />
                  </Box>
                ) : (
                  <Box className={classes.VerificationWrapper}>
                    <Box className={classes.VerificationSection}>
                      {accordion.title && (
                        <Typography
                          variant="h3"
                          component="h3"
                          className={classes.SubsectionTitle}
                          style={{ marginTop: 0, marginBottom: 0 }}
                        >
                          {accordion.title}
                        </Typography>
                      )}

                      {hasContent(accordion) && (
                        <LoginContentBlock
                          classes={classes}
                          item={accordion}
                          externalLinkIcon={externalLinkIcon}
                          className={useLinkStyle ? classes.Link : undefined}
                        />
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            </React.Fragment>
          );
        });
      })}
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
            content={warning.content}
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
            content={tutorial.content}
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
            content={contact.content}
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
