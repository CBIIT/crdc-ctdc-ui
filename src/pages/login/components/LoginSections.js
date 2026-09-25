/**
 * Layout components for the YAML-driven login page.
 * Purpose: translate top-level loginView.yaml areas into page regions.
 * Assumptions: each section has one blocks list; repeated sibling content uses
 * list items, and the RAS button label uses block-level rasButtonText.
 */
import React from "react";
import { Box, Button, Grid, Typography } from "@material-ui/core";
import { RAS_LOGIN_UNAVAILABLE_MESSAGE } from "../../../bento/loginData";
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

function LoginBlocks({
  blocks,
  classes,
  externalLinkIcon,
  paragraphClassName,
  orderedListClassName,
  alphaOrderedListClassName,
  unorderedListClassName,
}) {
  return (
    <LoginMarkdownContent
      blocks={blocks}
      classes={classes}
      paragraphClassName={paragraphClassName}
      orderedListClassName={orderedListClassName || classes.orderedListNumeric}
      alphaOrderedListClassName={
        alphaOrderedListClassName || classes.orderedListAlpha
      }
      unorderedListClassName={unorderedListClassName}
      linkIcon={externalLinkIcon}
    />
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
          <LoginBlocks
            blocks={item.blocks}
            classes={classes}
            unorderedListClassName={classes.nestedList}
            externalLinkIcon={externalLinkIcon}
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
      <LoginBlocks
        blocks={item.blocks}
        classes={classes}
        externalLinkIcon={externalLinkIcon}
      />
    </Box>
  );
}

function getValidAuthorizeUrl(rasAuthorizeUrl) {
  if (typeof rasAuthorizeUrl !== "string") return "";

  const trimmedUrl = rasAuthorizeUrl.trim();

  if (!trimmedUrl || /^\$\{[^}]+\}$/.test(trimmedUrl)) {
    return "";
  }

  try {
    if (/^https?:\/\/\S+/i.test(trimmedUrl)) {
      return trimmedUrl;
    }

    const baseUrl = typeof window !== "undefined"
      ? window.location.href
      : "https://example.org";
    const parsedUrl = new URL(trimmedUrl, baseUrl);

    if (!/^https?:$/.test(parsedUrl.protocol)) {
      return "";
    }

    return trimmedUrl;
  } catch (error) {
    return "";
  }
}

function RasLoginButton({ classes, buttonText, rasAuthorizeUrl }) {
  const validAuthorizeUrl = getValidAuthorizeUrl(rasAuthorizeUrl);
  const isConfigured = Boolean(validAuthorizeUrl);

  return (
    <Box className={classes.LoginButtonContainer}>
      <Button
        variant="outlined"
        className={classes.LoginButtonRas}
        disabled={!isConfigured}
        onClick={() => {
          if (validAuthorizeUrl) {
            window.location.href = validAuthorizeUrl;
          }
        }}
      >
        {buttonText}
      </Button>
      {!isConfigured && (
        <Typography
          role="alert"
          className={classes.LoginButtonAlert}
        >
          {RAS_LOGIN_UNAVAILABLE_MESSAGE}
        </Typography>
      )}
    </Box>
  );
}

function LoginSectionContentRow({
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

function getRasButtonTextBlock(blocks = []) {
  return (Array.isArray(blocks) ? blocks : []).find((block) =>
    block &&
      Object.prototype.hasOwnProperty.call(block, "rasButtonText") &&
      typeof block.rasButtonText === "string" &&
      block.rasButtonText.trim());
}

function removeRasButtonTextBlocks(blocks = []) {
  return (Array.isArray(blocks) ? blocks : []).filter((block) =>
    !(
      block &&
      Object.prototype.hasOwnProperty.call(block, "rasButtonText")
    ));
}

function createBlocksRenderItem(blocks, extraFields = {}) {
  return {
    type: "blocks",
    item: {
      blocks,
      ...extraFields,
    },
  };
}

function createAccordionRenderItem(accordions) {
  return {
    type: "accordions",
    accordions: Array.isArray(accordions) ? accordions : [],
  };
}

function isNestedBlockGroup(item) {
  return Boolean(
    item &&
      !Array.isArray(item.accordions) &&
      Array.isArray(item.blocks),
  );
}

// Section blocks are the display sequence: plain blocks are batched together,
// nested block groups render as separate text sections, and accordion groups
// render through the shared accordion list.
function getSectionRenderItemsFromBlocks(blocks = []) {
  const renderItems = [];
  let pendingBlocks = [];

  const pushPendingBlocks = () => {
    if (pendingBlocks.length === 0) return;

    renderItems.push(createBlocksRenderItem(pendingBlocks));
    pendingBlocks = [];
  };

  blocks.forEach((item) => {
    if (item && Array.isArray(item.accordions)) {
      pushPendingBlocks();
      renderItems.push(createAccordionRenderItem(item.accordions));
      return;
    }

    if (isNestedBlockGroup(item)) {
      pushPendingBlocks();
      renderItems.push(createBlocksRenderItem(item.blocks || [], {
        title: item.title,
      }));
      return;
    }

    pendingBlocks.push(item);
  });

  pushPendingBlocks();

  return renderItems;
}

function getSectionRenderItems(section) {
  // Section.blocks is the only editable display sequence for a section.
  // Duplicate sibling blocks keys are invalid YAML and are rejected upstream.
  return getSectionRenderItemsFromBlocks(section.blocks);
}

export function getSectionAccordions(section) {
  return getSectionRenderItems(section).flatMap((item) =>
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
  const sectionItems = getSectionRenderItems(section);
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
          const rasButtonTextBlock = getRasButtonTextBlock(
            sectionItem.item.blocks,
          );
          const rasButtonText = rasButtonTextBlock
            ? rasButtonTextBlock.rasButtonText
            : "";
          const shouldRenderAction = section.type === "rasLogin" &&
            rasButtonText &&
            !actionRendered;
          const action = shouldRenderAction
            ? (
              <RasLoginButton
                classes={classes}
                buttonText={rasButtonText}
                rasAuthorizeUrl={rasAuthorizeUrl}
              />
            )
            : null;
          const contentItem = section.type === "rasLogin"
            ? {
              ...sectionItem.item,
              blocks: removeRasButtonTextBlocks(sectionItem.item.blocks),
            }
            : sectionItem.item;

          if (shouldRenderAction) {
            actionRendered = true;
          }

          return (
            <LoginSectionContentRow
              key={`blocks-${sectionItemIndex}`}
              classes={classes}
              item={contentItem}
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
          <LoginBlocks
            blocks={warning.blocks}
            classes={classes}
            paragraphClassName={warningTextClassName}
            externalLinkIcon={externalLinkIcon}
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

function SidebarTitle({ classes, title }) {
  if (!title) return null;

  return (
    <Typography
      variant="h3"
      component="h3"
      className={classes.SidebarTitle}
    >
      {title}
    </Typography>
  );
}

function HelpBlocksSection({ classes, blocks, externalLinkIcon }) {
  return (
    <LoginBlocks
      blocks={blocks}
      classes={classes}
      paragraphClassName={classes.SidebarText}
      externalLinkIcon={externalLinkIcon}
    />
  );
}

function TutorialVideo({
  classes,
  assets,
  tutorial,
  videoPlaying,
  onPlayVideo,
}) {
  if (!tutorial.videoUrl) return null;

  return (
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
  );
}

function HelpTutorialSection({
  classes,
  assets,
  tutorial,
  videoPlaying,
  onPlayVideo,
  externalLinkIcon,
}) {
  return (
    <Box className={classes.TutorialSection}>
      <SidebarTitle classes={classes} title={tutorial.title} />
      <HelpBlocksSection
        classes={classes}
        blocks={tutorial.blocks}
        externalLinkIcon={externalLinkIcon}
      />
      <TutorialVideo
        classes={classes}
        assets={assets}
        tutorial={tutorial}
        videoPlaying={videoPlaying}
        onPlayVideo={onPlayVideo}
      />
    </Box>
  );
}

function getContactButtonRel(contact, target) {
  if (contact.rel) return contact.rel;

  return target && target !== "_self" ? "noopener noreferrer" : undefined;
}

function HelpContactSection({
  classes,
  contact,
  externalLinkIcon,
}) {
  const contactButtonTarget = contact.target || undefined;
  const contactButtonRel = getContactButtonRel(contact, contactButtonTarget);

  return (
    <Box className={classes.ContactSection}>
      <SidebarTitle classes={classes} title={contact.title} />
      <HelpBlocksSection
        classes={classes}
        blocks={contact.blocks}
        externalLinkIcon={externalLinkIcon}
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
                <HelpBlocksSection
                  classes={classes}
                  blocks={help.blocks}
                  externalLinkIcon={externalLinkIcon}
                />
              </Box>
            );
          }

          if (component.type === "tutorial") {
            return (
              <HelpTutorialSection
                key="tutorial"
                classes={classes}
                assets={assets}
                tutorial={tutorial}
                videoPlaying={videoPlaying}
                onPlayVideo={onPlayVideo}
                externalLinkIcon={externalLinkIcon}
              />
            );
          }

          return (
            <HelpContactSection
              key="contact"
              classes={classes}
              contact={contact}
              externalLinkIcon={externalLinkIcon}
            />
          );
        })}
      </Box>
    </Grid>
  );
}
