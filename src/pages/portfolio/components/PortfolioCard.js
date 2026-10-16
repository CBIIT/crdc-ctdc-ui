import React from 'react';
import { withStyles } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { externalLinkIcon, portfolioColors } from '../../../bento/portfolioData';

// CTDC-2065 (Program Details page) is not yet delivered - per CTDC-2064's documented fallback, the program
// name and study count render as non-clickable text until that sibling story ships. Flip this on when ready.
const PROGRAM_DETAILS_PAGE_READY = false;

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
  const accentColor = isInitiatives ? portfolioColors.initiativeAccent : portfolioColors.programAccent;

  const handleNavigateToDetails = () => {
    if (!PROGRAM_DETAILS_PAGE_READY) return;
    history.push(isInitiatives ? '/program' : `/program/${identifier}`);
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
          <span className={classes.label}>{isInitiatives ? 'Initiative:' : 'Program:'}</span>
          <span {...titleProps}>{name}</span>
        </div>
        <span
          className={`${classes.studiesCount} ${PROGRAM_DETAILS_PAGE_READY ? classes.clickable : ''}`}
          onClick={PROGRAM_DETAILS_PAGE_READY ? handleNavigateToDetails : undefined}
        >
          {`${studyCount} STUDIES`}
        </span>
      </div>
      <div className={classes.body}>
        <div className={classes.descriptionActions}>
          <p className={classes.description}>{description || 'No description available.'}</p>
          {isInitiatives && (
            <p className={classes.description}>Program affiliation: Not Applicable (NA)</p>
          )}
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
                className={classes.goToSiteLink}
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
    height: '60px',
    padding: '0 35px',
    gap: '10px',
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  label: {
    fontFamily: 'Inter',
    fontWeight: 300,
    fontSize: '18px',
    lineHeight: '21.78px',
    color: '#fff',
  },
  title: {
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '20px',
    lineHeight: '24.2px',
    color: '#fff',
  },
  studiesCount: {
    color: '#FFF',
    fontFamily: 'Inter',
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: 700,
    lineHeight: 'normal',
    letterSpacing: '0.1px',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationSkipInk: 'none',
    textDecorationThickness: 'auto',
    textUnderlineOffset: 'auto',
    textUnderlinePosition: 'from-font',
    whiteSpace: 'nowrap',
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
  goToSiteLink: {
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
