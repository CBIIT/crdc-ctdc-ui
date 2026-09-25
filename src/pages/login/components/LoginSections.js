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

export function LoginAccordionList({
  classes,
  accordions,
  accordionStartIndex = 0,
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
        const accordionIndex = accordionStartIndex + index;
        const isOpen = Boolean(openAccordions[accordionIndex]);
        const key = item.id || `${item.title || "item"}-${index}`;

        return (
          <LoginAccordionItem
            key={key}
            classes={classes}
            item={item}
            isOpen={isOpen}
            onToggle={() => onToggleAccordion(accordionIndex)}
            arrowOpenIcon={arrowOpenIcon}
            arrowClosedIcon={arrowClosedIcon}
            externalLinkIcon={externalLinkIcon}
            bodyClassName={
              item.variant === "links" || item.linkStyle
                ? classes.Link
                : undefined
            }
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
      {item.title && (
        <Typography
          variant="h3"
          component="h3"
          className={classes.SubsectionTitle}
          style={{ marginTop: 0, marginBottom: 0 }}
        >
          {item.title}
        </Typography>
      )}
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

function RasLoginAction({ classes, section, rasAuthorizeUrl }) {
  return (
    <Box className={classes.LoginButtonContainer}>
      <Button
        variant="outlined"
        className={classes.LoginButtonRas}
        onClick={() => {
          window.location.href = rasAuthorizeUrl;
        }}
      >
        {section.buttonText}
      </Button>
    </Box>
  );
}

function LoginContentSection({
  classes,
  item,
  action,
  externalLinkIcon,
}) {
  const contentClassName = item.linkStyle ? classes.Link : undefined;

  return (
    <Box className={classes.LoginSectionBody}>
      <Box className={classes.SectionContentRow}>
        <Box className={classes.SectionTextWrapper}>
          <LoginContentBlock
            classes={classes}
            item={item}
            externalLinkIcon={externalLinkIcon}
            className={contentClassName}
          />
        </Box>
        {action}
      </Box>
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

function createContentItem(content, extraFields = {}) {
  return {
    type: "content",
    item: {
      content,
      ...extraFields,
    },
  };
}

function createAccordionGroup(accordions) {
  return {
    type: "accordions",
    accordions: Array.isArray(accordions) ? accordions : [],
  };
}

function isContentGroup(item) {
  return Boolean(
    item &&
      !Array.isArray(item.accordions) &&
      (Array.isArray(item.content) || item.bodyMarkdown),
  );
}

// Section content is the display sequence: plain blocks are batched together,
// titled content groups render as separate text sections, and accordion groups
// render through the shared accordion list.
function getContentItems(content = []) {
  const contentItems = [];
  let pendingContent = [];

  const pushPendingContent = () => {
    if (pendingContent.length === 0) return;

    contentItems.push(createContentItem(pendingContent));
    pendingContent = [];
  };

  content.forEach((item) => {
    if (item && Array.isArray(item.accordions)) {
      pushPendingContent();
      contentItems.push(createAccordionGroup(item.accordions));
      return;
    }

    if (isContentGroup(item)) {
      pushPendingContent();
      contentItems.push(createContentItem(item.content || [], {
        bodyMarkdown: item.bodyMarkdown,
        title: item.title,
        linkStyle: item.variant === "links" || item.linkStyle,
      }));
      return;
    }

    pendingContent.push(item);
  });

  pushPendingContent();

  return contentItems;
}

function getSectionItems(section) {
  const contentItems = getContentItems(section.content);

  if (contentItems.length > 0) {
    return contentItems;
  }

  if (section.bodyMarkdown) {
    return [
      createContentItem([], {
        bodyMarkdown: section.bodyMarkdown,
      }),
    ];
  }

  return [];
}

export function getSectionAccordions(section) {
  return getSectionItems(section).flatMap((item) =>
    (item.type === "accordions" ? item.accordions : []));
}

function getFieldOrder(section, fieldNames) {
  const keys = Object.keys(section);
  const fieldIndex = keys.findIndex((key) => fieldNames.includes(key));

  return fieldIndex === -1 ? Number.MAX_SAFE_INTEGER : fieldIndex;
}

function getOrderedComponents(section, components) {
  // Preserve YAML key order so content editors can move Help panel blocks
  // without frontend changes.
  return components
    .filter((component) => component.enabled)
    .map((component) => ({
      ...component,
      order: getFieldOrder(section, component.keys),
    }))
    .sort((firstComponent, secondComponent) =>
      firstComponent.order - secondComponent.order);
}

export function LoginSectionBox({
  classes,
  section,
  rasAuthorizeUrl,
  openAccordions = {},
  onToggleAccordion = () => {},
  arrowOpenIcon,
  arrowClosedIcon,
  externalLinkIcon,
}) {
  const sectionItems = getSectionItems(section);
  let contentIndex = 0;
  let accordionStartIndex = 0;

  return (
    <Box className={classes.LoginSectionBox}>
      <Box className={classes.LoginSectionHeader}>
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

      {sectionItems.map((sectionItem, sectionItemIndex) => {
        if (sectionItem.type === "content") {
          const action = section.type === "rasLogin" && contentIndex === 0
            ? (
              <RasLoginAction
                classes={classes}
                section={section}
                rasAuthorizeUrl={rasAuthorizeUrl}
              />
            )
            : null;
          contentIndex += 1;

          return (
            <LoginContentSection
              key={`content-${sectionItemIndex}`}
              classes={classes}
              item={sectionItem.item}
              action={action}
              externalLinkIcon={externalLinkIcon}
            />
          );
        }

        const currentAccordionStartIndex = accordionStartIndex;
        accordionStartIndex += sectionItem.accordions.length;

        return (
          <LoginAccordionList
            key={`accordions-${sectionItemIndex}`}
            classes={classes}
            accordions={sectionItem.accordions}
            accordionStartIndex={currentAccordionStartIndex}
            openAccordions={openAccordions}
            onToggleAccordion={onToggleAccordion}
            arrowOpenIcon={arrowOpenIcon}
            arrowClosedIcon={arrowClosedIcon}
            externalLinkIcon={externalLinkIcon}
          />
        );
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
  const contactButtonTarget = contact.target || undefined;
  const contactButtonRel = contact.rel ||
    (contactButtonTarget && contactButtonTarget !== "_self"
      ? "noopener noreferrer"
      : undefined);
  const orderedComponents = getOrderedComponents(help, [
    {
      type: "content",
      enabled: hasContent(help),
      keys: ["content", "bodyMarkdown"],
    },
    {
      type: "tutorial",
      enabled: Boolean(
        tutorial.title || hasContent(tutorial) || tutorial.videoUrl,
      ),
      keys: ["tutorial"],
    },
    {
      type: "contact",
      enabled: Boolean(
        contact.title || hasContent(contact) || contact.buttonText,
      ),
      keys: ["contact"],
    },
  ]);

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

        {orderedComponents.map((component) => {
          if (component.type === "content") {
            return (
              <Box key="content" className={classes.HelpContentSection}>
                <LoginMarkdownContent
                  content={help.content}
                  markdown={help.bodyMarkdown}
                  classes={classes}
                  paragraphClassName={classes.SidebarText}
                  linkIcon={externalLinkIcon}
                />
              </Box>
            );
          }

          if (component.type === "tutorial") {
            return (
              <Box key="tutorial" className={classes.TutorialSection}>
                {tutorial.title && (
                  <Typography
                    variant="h3"
                    component="h3"
                    className={classes.SidebarTitle}
                  >
                    {tutorial.title}
                  </Typography>
                )}
                <LoginMarkdownContent
                  content={tutorial.content}
                  markdown={tutorial.bodyMarkdown}
                  classes={classes}
                  paragraphClassName={classes.SidebarText}
                  linkIcon={externalLinkIcon}
                />

                {tutorial.videoUrl && (
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
                )}
              </Box>
            );
          }

          return (
            <Box key="contact" className={classes.ContactSection}>
              {contact.title && (
                <Typography
                  variant="h3"
                  component="h3"
                  className={classes.SidebarTitle}
                >
                  {contact.title}
                </Typography>
              )}
              <LoginMarkdownContent
                content={contact.content}
                markdown={contact.bodyMarkdown}
                classes={classes}
                paragraphClassName={classes.SidebarText}
                linkIcon={externalLinkIcon}
              />
              {contact.buttonText && (
                <Button
                  variant="outlined"
                  className={classes.ContactButton}
                  href={contact.href || undefined}
                  target={contactButtonTarget}
                  rel={contactButtonRel}
                >
                  {contact.buttonText}
                </Button>
              )}
            </Box>
          );
        })}
      </Box>
    </Grid>
  );
}
