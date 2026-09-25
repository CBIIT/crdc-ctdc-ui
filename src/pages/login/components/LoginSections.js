/**
 * Layout components for the YAML-driven login page.
 * Purpose: translate top-level loginView.yaml areas into page regions.
 * Assumptions: each section has one blocks list; repeated sibling content uses
 * list items, rasLogin.buttonText is section-level, and contentBox shares the
 * same section rendering path without a RAS action button.
 */
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
  // Accordion indexes are section-scoped so YAML rows can be reordered without
  // changing state keys outside the current section.
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
}) {
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
        <Box className={classes.AccordionText}>
          <LoginMarkdownContent
            blocks={item.blocks}
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
}) {
  return (
    <Box>
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
        blocks={item.blocks}
        classes={classes}
        orderedListClassName={classes.orderedListNumeric}
        alphaOrderedListClassName={classes.orderedListAlpha}
        linkIcon={externalLinkIcon}
      />
    </Box>
  );
}

function RasLoginAction({ classes, buttonText, rasAuthorizeUrl }) {
  return (
    <Box className={classes.LoginButtonContainer}>
      <Button
        variant="outlined"
        className={classes.LoginButtonRas}
        onClick={() => {
          window.location.href = rasAuthorizeUrl;
        }}
      >
        {buttonText}
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
  return (
    <Box className={classes.LoginSectionBody}>
      <Box className={classes.SectionContentRow}>
        <Box className={classes.SectionTextWrapper}>
          <LoginContentBlock
            classes={classes}
            item={item}
            externalLinkIcon={externalLinkIcon}
          />
        </Box>
        {action}
      </Box>
    </Box>
  );
}

function hasBlocks(item) {
  return Boolean(
    item &&
      Array.isArray(item.blocks) &&
      item.blocks.length > 0,
  );
}

function createBlocksItem(blocks, extraFields = {}) {
  return {
    type: "blocks",
    item: {
      blocks,
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

function isBlockGroup(item) {
  return Boolean(
    item &&
      !Array.isArray(item.accordions) &&
      Array.isArray(item.blocks),
  );
}

// Section blocks are the display sequence: plain blocks are batched together,
// nested block groups render as separate text sections, and accordion groups
// render through the shared accordion list.
function getBlockItems(blocks = []) {
  const blockItems = [];
  let pendingBlocks = [];

  const pushPendingBlocks = () => {
    if (pendingBlocks.length === 0) return;

    blockItems.push(createBlocksItem(pendingBlocks));
    pendingBlocks = [];
  };

  blocks.forEach((item) => {
    if (item && Array.isArray(item.accordions)) {
      pushPendingBlocks();
      blockItems.push(createAccordionGroup(item.accordions));
      return;
    }

    if (isBlockGroup(item)) {
      pushPendingBlocks();
      blockItems.push(createBlocksItem(item.blocks || [], {
        title: item.title,
      }));
      return;
    }

    pendingBlocks.push(item);
  });

  pushPendingBlocks();

  return blockItems;
}

function getSectionItems(section) {
  // Section.blocks is the only editable display sequence for a section.
  // Duplicate sibling blocks keys are invalid YAML and are rejected upstream.
  return getBlockItems(section.blocks);
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
  let actionRendered = false;
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
        if (sectionItem.type === "blocks") {
          const shouldRenderAction = section.type === "rasLogin" &&
            section.buttonText &&
            !actionRendered;
          const action = shouldRenderAction
            ? (
              <RasLoginAction
                classes={classes}
                buttonText={section.buttonText}
                rasAuthorizeUrl={rasAuthorizeUrl}
              />
            )
            : null;

          if (shouldRenderAction) {
            actionRendered = true;
          }

          return (
            <LoginContentSection
              key={`blocks-${sectionItemIndex}`}
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
  const warningIsCollapsible = warning.collapsible !== false;
  const warningIsOpen = warningIsCollapsible ? warningOpen : true;
  const warningTextClassName = `${classes.WarningText} ${
    warningIsCollapsible && !warningIsOpen ? classes.WarningTextCollapsed : ""
  }`;
  const toggleProps = warningIsCollapsible
    ? {
      role: "button",
      tabIndex: 0,
      "aria-expanded": warningIsOpen,
      onClick: onToggle,
      onKeyDown: handleActivation(onToggle),
    }
    : {};

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
          className={`${classes.WarningToggle} ${
            !warningIsCollapsible ? classes.WarningToggleStatic : ""
          }`}
          {...toggleProps}
        >
          <LoginMarkdownContent
            blocks={warning.blocks}
            classes={classes}
            paragraphClassName={warningTextClassName}
            linkIcon={externalLinkIcon}
          />
          {warningIsCollapsible && (
            <ToggleArrow
              isOpen={warningIsOpen}
              openIcon={arrowOpenIcon}
              closedIcon={arrowClosedIcon}
            />
          )}
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
    // Help subareas intentionally follow YAML key order so editors can move
    // generic blocks above or below tutorial/contact without new components.
    {
      type: "blocks",
      enabled: hasBlocks(help),
      keys: ["blocks"],
    },
    {
      type: "tutorial",
      enabled: Boolean(
        tutorial.title || hasBlocks(tutorial) || tutorial.videoUrl,
      ),
      keys: ["tutorial"],
    },
    {
      type: "contact",
      enabled: Boolean(
        contact.title || hasBlocks(contact) || contact.buttonText,
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
          if (component.type === "blocks") {
            return (
              <Box key="blocks" className={classes.HelpContentSection}>
                <LoginMarkdownContent
                  blocks={help.blocks}
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
                  blocks={tutorial.blocks}
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
                blocks={contact.blocks}
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
