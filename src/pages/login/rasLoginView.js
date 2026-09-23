// RAS (NIH Researcher Auth Service) login page
import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Grid, Typography, Button, Box } from "@material-ui/core";
import env from "../../utils/env";
import styles from "./rasLoginStyles";

function getAsset(assets, key) {
  const asset = assets[key];

  if (typeof asset === "string") {
    return { src: asset };
  }

  return asset || {};
}

function ContentImage({ asset, className, fallbackAlt, style }) {
  if (!asset || !asset.src) return null;

  return (
    <img
      src={asset.src}
      alt={asset.alt || fallbackAlt || ""}
      className={className}
      style={style}
    />
  );
}

function ToggleArrow({ isOpen, openIcon, closedIcon }) {
  const icon = isOpen ? openIcon : closedIcon;

  return (
    <ContentImage
      asset={icon}
      fallbackAlt={isOpen ? "Collapse" : "Expand"}
      style={{
        cursor: "pointer",
        flexShrink: 0,
      }}
    />
  );
}

function isBlankLine(line) {
  return !line || line.trim() === "";
}

function isListLine(line) {
  return /^\s*(\d+\.|-|\*)\s+/.test(line);
}

function parseMarkdownBlocks(markdown) {
  const lines = markdown.split(/\r?\n/);
  const blocks = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (isBlankLine(line)) {
      index += 1;
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];

      while (index < lines.length && /^\s*\d+\.\s+/.test(lines[index])) {
        const [, text] = lines[index].match(/^\s*\d+\.\s+(.*)$/);
        const item = { text, children: [] };
        index += 1;

        while (
          index < lines.length &&
          /^\s+[-*]\s+/.test(lines[index])
        ) {
          const [, childText] = lines[index].match(/^\s+[-*]\s+(.*)$/);
          item.children.push(childText);
          index += 1;
        }

        items.push(item);
      }

      blocks.push({ type: "ol", items });
      continue;
    }

    if (/^\s*[-*]\s+/.test(line)) {
      const items = [];

      while (index < lines.length && /^\s*[-*]\s+/.test(lines[index])) {
        const [, text] = lines[index].match(/^\s*[-*]\s+(.*)$/);
        items.push({ text, children: [] });
        index += 1;
      }

      blocks.push({ type: "ul", items });
      continue;
    }

    const paragraphLines = [];

    while (
      index < lines.length &&
      !isBlankLine(lines[index]) &&
      !isListLine(lines[index])
    ) {
      paragraphLines.push(lines[index].trim());
      index += 1;
    }

    blocks.push({
      type: "p",
      text: paragraphLines.join(" "),
    });
  }

  return blocks;
}

function renderInlineMarkdown(text, linkIcon, classes, keyPrefix) {
  const pattern = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*)/g;
  const nodes = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[2] && match[3]) {
      nodes.push(
        <React.Fragment key={`${keyPrefix}-link-${match.index}`}>
          <a href={match[3]} target="_blank" rel="noopener noreferrer">
            {match[2]}
          </a>
          <ContentImage
            asset={linkIcon}
            fallbackAlt="outbound web site icon"
            className={classes.linkIcon}
          />
        </React.Fragment>,
      );
    } else if (match[4]) {
      nodes.push(
        <strong key={`${keyPrefix}-strong-${match.index}`}>
          {match[4]}
        </strong>,
      );
    } else if (match[5]) {
      nodes.push(
        <em key={`${keyPrefix}-em-${match.index}`}>
          {match[5]}
        </em>,
      );
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderListItem({
  item,
  itemIndex,
  classes,
  unorderedListClassName,
  linkIcon,
  keyPrefix,
}) {
  return (
    <li key={`${keyPrefix}-${itemIndex}`}>
      {renderInlineMarkdown(item.text, linkIcon, classes, `${keyPrefix}-${itemIndex}`)}
      {item.children.length > 0 && (
        <ul className={unorderedListClassName}>
          {item.children.map((child, childIndex) => (
            <li key={`${keyPrefix}-${itemIndex}-${childIndex}`}>
              {renderInlineMarkdown(
                child,
                linkIcon,
                classes,
                `${keyPrefix}-${itemIndex}-${childIndex}`,
              )}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

function renderMarkdownBlock({
  block,
  blockIndex,
  classes,
  paragraphClassName,
  unorderedListClassName,
  orderedListClassName,
  linkIcon,
}) {
  if (block.type === "p") {
    return (
      <Typography key={`paragraph-${blockIndex}`} className={paragraphClassName}>
        {renderInlineMarkdown(block.text, linkIcon, classes, `paragraph-${blockIndex}`)}
      </Typography>
    );
  }

  if (block.type === "ol") {
    return (
      <ol key={`ordered-list-${blockIndex}`} className={orderedListClassName}>
        {block.items.map((item, itemIndex) =>
          renderListItem({
            item,
            itemIndex,
            classes,
            unorderedListClassName,
            linkIcon,
            keyPrefix: `ordered-list-${blockIndex}`,
          }))}
      </ol>
    );
  }

  return (
    <ul key={`unordered-list-${blockIndex}`} className={unorderedListClassName}>
      {block.items.map((item, itemIndex) =>
        renderListItem({
          item,
          itemIndex,
          classes,
          unorderedListClassName,
          linkIcon,
          keyPrefix: `unordered-list-${blockIndex}`,
        }))}
    </ul>
  );
}

function MarkdownContent({
  markdown,
  classes,
  paragraphClassName,
  unorderedListClassName,
  orderedListClassName,
  linkIcon,
}) {
  if (!markdown) return null;

  const blocks = parseMarkdownBlocks(markdown);

  return (
    <Box className={classes.MarkdownContent}>
      {blocks.map((block, blockIndex) =>
        renderMarkdownBlock({
          block,
          blockIndex,
          classes,
          paragraphClassName: paragraphClassName || classes.BodyText,
          unorderedListClassName: unorderedListClassName || classes.unorderedList,
          orderedListClassName: orderedListClassName || classes.orderedListNumeric,
          linkIcon,
        }))}
    </Box>
  );
}

function RASLoginPage(props) {
  const { classes, content = {} } = props;
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
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [requestAccessOpen, setRequestAccessOpen] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const rasAuthorizeUrl =
    typeof env.REACT_APP_RAS_AUTHORIZE_URL === "string"
      ? env.REACT_APP_RAS_AUTHORIZE_URL.trim()
      : "";

  return (
    <div className={classes.Container}>
      {/* Hero Section */}
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

      {/* Main Content - Two Column Layout */}
      <Grid container className={classes.ContentWrapper}>
        <Grid container className={classes.ColumnContainer}>
          {/* Left Column - Combined Login Box */}
          <Grid item xs={12} md className={classes.LeftColumn}>
            <Box className={classes.CombinedLoginBox}>
              {/* RAS Section */}
              <Box className={classes.RasSection}>
                <Typography
                  variant="h2"
                  component="h2"
                  className={classes.BoxTitle}
                >
                  {ras.title}
                </Typography>

                {/* Text + Button row */}
                <Box className={classes.LoginContentRow}>
                  <Box className={classes.RasTextWrapper}>
                    <MarkdownContent
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

                {/* Divider */}
                <Box className={classes.Divider} />

                {/* Collapsible CTDC Verification Process */}
                <Box className={classes.VerificationWrapper}>
                  <Box className={classes.VerificationSection}>
                    <Box
                      className={classes.VerificationHeader}
                      role="button"
                      tabIndex={0}
                      aria-expanded={verificationOpen}
                      onClick={() => setVerificationOpen((v) => !v)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setVerificationOpen((v) => !v);
                        }
                      }}
                    >
                      <Typography
                        variant="h3"
                        component="h3"
                        className={classes.VerificationTitle}
                      >
                        {verification.title}
                      </Typography>
                      <ToggleArrow
                        isOpen={verificationOpen}
                        openIcon={arrowOpenIcon}
                        closedIcon={arrowClosedIcon}
                      />
                    </Box>

                    {verificationOpen && (
                      <Box className={classes.VerificationText}>
                        <MarkdownContent
                          markdown={verification.bodyMarkdown}
                          classes={classes}
                          orderedListClassName={classes.orderedListAlpha}
                          unorderedListClassName={classes.nestedList}
                          linkIcon={externalLinkIcon}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Request Access Section */}
            <Box className={classes.RequestSection}>
              {/* Top section: Title + Access Requirements */}
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
                    <MarkdownContent
                      markdown={accessRequirements.bodyMarkdown}
                      classes={classes}
                      linkIcon={externalLinkIcon}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Divider */}
              <Box className={classes.Divider} />

              {/* Collapsible: Instructions to Request Access */}
              <Box className={classes.RequestBottomSection}>
                <Box className={classes.VerificationSection}>
                  <Box
                    className={classes.VerificationHeader}
                    role="button"
                    tabIndex={0}
                    aria-expanded={requestAccessOpen}
                    onClick={() => setRequestAccessOpen(!requestAccessOpen)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setRequestAccessOpen(!requestAccessOpen);
                      }
                    }}
                  >
                    <Typography
                      variant="h3"
                      component="h3"
                      className={classes.SubsectionTitle}
                      style={{ marginTop: 0, marginBottom: 0 }}
                    >
                      {requestInstructions.title}
                    </Typography>
                    <ToggleArrow
                      isOpen={requestAccessOpen}
                      openIcon={arrowOpenIcon}
                      closedIcon={arrowClosedIcon}
                    />
                  </Box>
                </Box>

                {requestAccessOpen && (
                  <>
                    <Box className={classes.VerificationWrapper}>
                      <Box className={classes.VerificationSection}>
                        <Typography
                          className={classes.BodyText}
                          component="div"
                        >
                          <MarkdownContent
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
                          <MarkdownContent
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

            {/* Warning Notice Section */}
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
                  onClick={() => setWarningOpen(!warningOpen)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setWarningOpen(!warningOpen);
                    }
                  }}
                >
                  <MarkdownContent
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
          </Grid>

          {/* Right Column - Help Sidebar */}
          <Grid item xs={12} md className={classes.RightColumn}>
            <Box
              component="aside"
              className={classes.HelpSidebar}
              aria-label={help.ariaLabel}
            >
              {/* Need Help Section */}
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

              {/* Tutorial Section */}
              <Box className={classes.TutorialSection}>
                <Typography
                  variant="h3"
                  component="h3"
                  className={classes.SidebarTitle}
                >
                  {tutorial.title}
                </Typography>
                <MarkdownContent
                  markdown={tutorial.bodyMarkdown}
                  classes={classes}
                  paragraphClassName={classes.SidebarText}
                  linkIcon={externalLinkIcon}
                />

                {/* Video Thumbnail */}
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
                        onClick={() => setVideoPlaying(true)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setVideoPlaying(true);
                          }
                        }}
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

              {/* Contact Section */}
              <Box className={classes.ContactSection}>
                <Typography
                  variant="h3"
                  component="h3"
                  className={classes.SidebarTitle}
                >
                  {contact.title}
                </Typography>
                <MarkdownContent
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
        </Grid>
      </Grid>
    </div>
  );
}

export default withStyles(styles)(RASLoginPage);
