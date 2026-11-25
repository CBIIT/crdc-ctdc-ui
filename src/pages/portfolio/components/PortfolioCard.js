import React from 'react';
import { withStyles } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';
import { externalLinkIcon, portfolioColors } from '../../../bento/portfolioData';

// CTDC-2065 (Program Details page) is now live - program name/study count navigate there.
const PROGRAM_DETAILS_PAGE_READY = true;

const PortfolioCard = ({
  classes,
  name,
  identifier,
  description,
  externalUrl,
  studies,
  image,
  imageAlt,
  isInitiatives,
}) => {
  const history = useHistory();
  const studyCount = studies?.length || 0;
  const accentColor = portfolioColors.programAccent;

  const detailsPath = isInitiatives ? '/program-details' : `/program-details/${identifier}`;

  const studyIds = (studies || [])
    .map((study) => study.study_short_name)
    .filter(Boolean)
    .join(',');

  // No affiliated studies: the button is disabled, since an unfiltered /studies would list every study.
  const handleAssociatedStudies = () => {
    if (!studyIds) return;
    history.push(`/studies?studyIds=${encodeURIComponent(studyIds)}`);
  };

  const countContent = (
    <>
      {/* Figma: the number and the two spaces after it are bold. */}
      <span className={classes.countNumber}>{`${studyCount}\u00a0 `}</span>
      <span className={classes.countLabel}>{`Associated ${studyCount === 1 ? 'Study' : 'Studies'}`}</span>
    </>
  );

  return (
    <div className={classes.card} style={{ borderLeftColor: accentColor }}>
      <div className={classes.header} style={{ backgroundColor: accentColor }}>
        <h2 className={classes.titleGroup}>
          {PROGRAM_DETAILS_PAGE_READY ? (
            <Link to={detailsPath} className={`${classes.title} ${classes.clickable}`}>{name}</Link>
          ) : (
            <span className={classes.title}>{name}</span>
          )}
        </h2>
        {PROGRAM_DETAILS_PAGE_READY ? (
          <Link to={detailsPath} className={`${classes.studiesCount} ${classes.clickable}`}>
            {countContent}
          </Link>
        ) : (
          <span className={classes.studiesCount}>{countContent}</span>
        )}
      </div>
      <div className={classes.body}>
        <div className={classes.descriptionActions}>
          {description && <p className={classes.description}>{description}</p>}
          <div className={classes.actions}>
            <button
              type="button"
              className={classes.associatedStudiesButton}
              onClick={handleAssociatedStudies}
              disabled={!studyIds}
            >
              Associated Studies
            </button>
            {externalUrl && (
              <a
                className={classes.resourceLink}
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to site
                <img
                  src={externalLinkIcon.src}
                  alt={externalLinkIcon.alt}
                  className={classes.externalIcon}
                />
              </a>
            )}
          </div>
        </div>
        {image && (
          <div className={classes.imageFrame}>
            <img src={image} alt={imageAlt} className={classes.image} />
          </div>
        )}
      </div>
    </div>
  );
};

const styles = (theme) => ({
  card: {
    width: '100%',
    maxWidth: '1500px',
    borderLeft: '5px solid',
    display: 'flex',
    flexDirection: 'column',
    '&:hover': {
      boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 15px',
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: '60px',
    // 30px left + the card's 5px left border = text 35px from the card's outer edge (Figma's border sits inside).
    padding: '10px 35px 10px 30px',
    boxSizing: 'border-box',
    gap: '10px',
    [theme.breakpoints.down('sm')]: {
      flexWrap: 'wrap',
      padding: '12px 20px 12px 15px',
    },
  },
  // The program name is the card's heading; reset the browser's h2 margin and size (the title sets its own type).
  titleGroup: {
    margin: 0,
    fontSize: 'inherit',
    fontWeight: 'inherit',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    maxWidth: '70%',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
    },
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '20px',
    letterSpacing: 0,
    color: '#fff',
    textDecoration: 'none',
    overflowWrap: 'anywhere',
  },
  studiesCount: {
    color: '#FFF',
    fontFamily: 'Inter',
    fontSize: '20px',
    letterSpacing: '0.1px',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationSkipInk: 'none',
    textDecorationThickness: 'auto',
    textUnderlineOffset: 'auto',
    textUnderlinePosition: 'from-font',
    whiteSpace: 'nowrap',
  },
  countNumber: {
    fontWeight: 700,
    whiteSpace: 'pre',
    lineHeight: '24.2px',
    letterSpacing: '0.1px',
  },
  countLabel: {
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
    letterSpacing: '0.1px',
  },
  clickable: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
    // Visible keyboard focus on the navy header.
    '&:focus-visible': {
      outline: '2px solid #FFF',
      outlineOffset: '3px',
    },
  },
  body: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    // Figma draws the 3px right/bottom borders inside the box, so they come out of the padding: 30px left (5px card
    // border), 32px right and 37px bottom keep the content where the design has it.
    padding: '25px 32px 37px 30px',
    gap: '30px',
    borderRight: `3px solid ${portfolioColors.cardBorder}`,
    borderBottom: `3px solid ${portfolioColors.cardBorder}`,
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
      padding: '20px 17px 22px 15px',
    },
  },
  descriptionActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '45px',
    // A 340px basis (not the 785px max) so on mid-size screens the description gives up width before the image does.
    flex: '1 1 340px',
    minWidth: 0,
    maxWidth: '785px',
    [theme.breakpoints.down('sm')]: {
      gap: '25px',
      maxWidth: '100%',
    },
  },
  description: {
    margin: 0,
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '30px',
    letterSpacing: 0,
    color: '#000',
  },
  actions: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '30px',
    padding: '0 10px',
    [theme.breakpoints.down('sm')]: {
      gap: '15px',
      padding: 0,
    },
  },
  associatedStudiesButton: {
    border: 'none',
    borderRadius: '10px',
    backgroundColor: portfolioColors.buttonPrimary,
    color: '#fff',
    padding: '16px 20px',
    fontFamily: 'Roboto',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '14px',
    textTransform: 'uppercase',
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.9,
    },
    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.5,
    },
  },
  resourceLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    border: `1px solid ${portfolioColors.buttonPrimary}`,
    borderRadius: '10px',
    padding: '16px 20px',
    fontFamily: 'Roboto',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '14px',
    textTransform: 'uppercase',
    color: portfolioColors.buttonPrimary,
    textDecoration: 'none',
  },
  externalIcon: {
    width: '17px',
    height: '17px',
  },
  // Figma "Frame 703": inner shadow 0 0 40px rgba(0,0,0,0.25) over the image. An inset shadow on an <img> is hidden
  // by the image itself, so it is drawn by an overlay.
  // The image shrinks with the card (keeping its 419:249 shape) instead of forcing horizontal overflow.
  imageFrame: {
    position: 'relative',
    flex: '0 1 419px',
    minWidth: 0,
    lineHeight: 0,
    [theme.breakpoints.down('sm')]: {
      flex: 'none',
      width: '100%',
      maxWidth: '419px',
    },
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      boxShadow: 'inset 0 0 40px rgba(0, 0, 0, 0.25)',
      pointerEvents: 'none',
    },
  },
  image: {
    display: 'block',
    width: '100%',
    height: 'auto',
    aspectRatio: '419 / 249',
    objectFit: 'cover',
  },
});

export default withStyles(styles)(PortfolioCard);
