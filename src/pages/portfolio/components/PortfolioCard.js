import React from 'react';
import { withStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
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

  const handleNavigateToDetails = () => {
    if (!PROGRAM_DETAILS_PAGE_READY) return;
    history.push(isInitiatives ? '/program-details' : `/program-details/${identifier}`);
  };

  const handleAssociatedStudies = () => {
    const studyIds = (studies || [])
      .map((study) => study.study_short_name)
      .filter(Boolean)
      .join(',');
    history.push(studyIds ? `/studies?studyIds=${encodeURIComponent(studyIds)}` : '/studies');
  };

  const titleProps = PROGRAM_DETAILS_PAGE_READY
    ? { onClick: handleNavigateToDetails, className: `${classes.title} ${classes.clickable}` }
    : { className: classes.title };

  return (
    <div className={classes.card} style={{ borderLeftColor: accentColor }}>
      <div className={classes.header} style={{ backgroundColor: accentColor }}>
        <div className={classes.titleGroup}>
          <span {...titleProps}>{name}</span>
        </div>
        <span
          className={`${classes.studiesCount} ${PROGRAM_DETAILS_PAGE_READY ? classes.clickable : ''}`}
          onClick={PROGRAM_DETAILS_PAGE_READY ? handleNavigateToDetails : undefined}
        >
          <span className={classes.countNumber}>{studyCount}</span>
          {' '}
          <span className={classes.countLabel}>{`ASSOCIATED ${studyCount === 1 ? 'STUDY' : 'STUDIES'}`}</span>
        </span>
      </div>
      <div className={classes.body}>
        <div className={classes.descriptionActions}>
          <p className={classes.description}>{description || 'No description available.'}</p>
          <div className={classes.actions}>
            <button
              type="button"
              className={classes.associatedStudiesButton}
              onClick={handleAssociatedStudies}
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
                Resource Link
                <img
                  src={externalLinkIcon.src}
                  alt={externalLinkIcon.alt}
                  className={classes.externalIcon}
                />
              </a>
            )}
          </div>
        </div>
        {image && <img src={image} alt={imageAlt} className={classes.image} />}
      </div>
    </div>
  );
};

const styles = () => ({
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
    padding: '10px 35px',
    boxSizing: 'border-box',
    gap: '10px',
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    maxWidth: '70%',
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '24.2px',
    color: '#fff',
    overflowWrap: 'anywhere',
  },
  studiesCount: {
    color: '#FFF',
    fontFamily: 'Inter',
    fontSize: '20px',
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
  },
  body: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '25px 35px 40px 35px',
    gap: '30px',
    borderRight: `3px solid ${portfolioColors.cardBorder}`,
    borderBottom: `3px solid ${portfolioColors.cardBorder}`,
  },
  descriptionActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '45px',
    flex: '1 1 auto',
    maxWidth: '785px',
  },
  description: {
    margin: 0,
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '30px',
    color: '#000',
  },
  actions: {
    display: 'flex',
    gap: '30px',
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
  image: {
    width: '419px',
    height: '249px',
    flexShrink: 0,
    objectFit: 'cover',
  },
});

export default withStyles(styles)(PortfolioCard);
