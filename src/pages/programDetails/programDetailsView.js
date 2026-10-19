import React from 'react';
import { withStyles, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Stats from '../../components/Stats/AllStatsController';
import CustomBreadcrumb from '../../components/Breadcrumb/BreadcrumbView';
import { externalIcon } from '../../bento/studyDetailData';
import {
  programDetailsHeaderIcon,
  programDetailsColors,
  curatedProgramDetailContent,
  initiativesDetailContent,
  noVideosText,
  noMaterialsText,
} from '../../bento/programDetailsData';

const ProgramDetailsView = ({
  classes, isInitiatives, program, unaffiliatedStudies, notFound,
}) => {
  const label = isInitiatives ? 'Initiative' : 'Program';
  const displayShortName = isInitiatives ? initiativesDetailContent.name : program?.program_short_name;
  const displayFullName = isInitiatives ? '' : program?.program_name;
  const studies = (isInitiatives ? unaffiliatedStudies : program?.studies) || [];
  const curated = isInitiatives
    ? initiativesDetailContent
    : (curatedProgramDetailContent[program?.program_short_name] || { hostVideos: [], materials: [] });

  const breadCrumbJson = [
    { name: 'PORTFOLIO', to: '/portfolio', isALink: true },
    { name: `${label}: ${displayShortName || 'Not found'}`, isALink: false },
  ];

  return (
    <>
      <Stats />
      <div className={classes.container}>
        <div className={classes.breadCrumb}>
          <CustomBreadcrumb separator=">" data={breadCrumbJson} />
        </div>

        {!isInitiatives && notFound ? (
          <p className={classes.notFound}>
            {'No program matches this identifier. Return to the '}
            <Link to="/portfolio">Portfolio page</Link>
            {' to browse available programs and Initiatives.'}
          </p>
        ) : (
          <>
            <div className={classes.header}>
              <img
                src={programDetailsHeaderIcon.src}
                alt={programDetailsHeaderIcon.alt}
                className={classes.logo}
              />
              <div className={classes.headerTitle}>
                <div className={classes.headerMainTitle}>
                  <span className={classes.label}>{`${label}:`}</span>
                  <span>{displayShortName}</span>
                </div>
                {displayFullName && <div className={classes.subtitle}>{displayFullName}</div>}
              </div>
            </div>

            <div className={classes.body}>
              <Grid container spacing={0}>
              <Grid item xs={12} sm={12} md={6} className={classes.leftColumn}>
                <section>
                  <h2 className={classes.sectionTitle}>
                    {isInitiatives ? 'INITIATIVE DESCRIPTION' : 'PROGRAM DESCRIPTION'}
                  </h2>
                  <p className={classes.sectionText}>
                    {isInitiatives
                      ? 'Studies that are not affiliated with a defined CTDC program.'
                      : (program?.program_full_description || 'No description available.')}
                  </p>
                </section>

                {!isInitiatives && (
                  <section>
                    <h2 className={classes.sectionTitle}>PROGRAM METADATA</h2>
                    {(program?.crdc_id || program?.program_external_url) ? (
                      <dl className={classes.metadataList}>
                        {program?.crdc_id && (
                          <div className={classes.metadataRow}>
                            <dt className={classes.metadataLabel}>CRDC ID</dt>
                            <dd className={classes.metadataValue}>{program.crdc_id}</dd>
                          </div>
                        )}
                        {program?.program_external_url && (
                          <div className={classes.metadataRow}>
                            <dt className={classes.metadataLabel}>External URL</dt>
                            <dd className={classes.metadataValue}>
                              <a href={program.program_external_url} target="_blank" rel="noopener noreferrer">
                                {program.program_external_url}
                              </a>
                            </dd>
                          </div>
                        )}
                      </dl>
                    ) : (
                      <p className={classes.emptyState}>
                        No additional metadata is currently available.
                      </p>
                    )}
                  </section>
                )}

                <section>
                  <h2 className={classes.sectionTitle}>HOST VIDEOS</h2>
                  {curated.hostVideos.length === 0 ? (
                    <p className={classes.emptyState}>
                      {noVideosText(label.toLowerCase())}
                    </p>
                  ) : (
                    curated.hostVideos.map((video) => (
                      <div key={video.title} className={classes.videoItem}>
                        <a
                          href={video.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={classes.videoThumbnailButton}
                        >
                          {video.thumbnail && (
                            <img src={video.thumbnail} alt={video.title} className={classes.videoThumbnail} />
                          )}
                          <span className={classes.playButton} />
                        </a>
                        <div className={classes.videoCopy}>
                          <a
                            href={video.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={classes.videoTitle}
                          >
                            {video.title}
                          </a>
                          <span className={classes.videoDescription}>{video.description}</span>
                        </div>
                      </div>
                    ))
                  )}
                </section>
              </Grid>

              <Grid item xs={12} sm={12} md={6} className={classes.rightColumn}>
                <section>
                  <h2 className={classes.sectionTitle}>
                    {isInitiatives ? 'INITIATIVE-RELATED MATERIALS' : 'PROGRAM-RELATED MATERIALS'}
                  </h2>
                  {curated.materials.length === 0 ? (
                    <p className={classes.emptyState}>
                      {noMaterialsText(label.toLowerCase())}
                    </p>
                  ) : (
                    <ul className={classes.materialsList}>
                      {curated.materials.map((material) => (
                        <li key={material.title}>
                          <a href={material.url} target="_blank" rel="noopener noreferrer">
                            {material.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                <section>
                  <h2 className={classes.sectionTitle}>
                    {`STUDIES BELONGING TO THIS ${label.toUpperCase()}`}
                  </h2>
                  {studies.length === 0 ? (
                    <p className={classes.emptyState}>
                      {`No studies are currently linked to this ${label.toLowerCase()}.`}
                    </p>
                  ) : (
                    <ul className={classes.studiesList}>
                      {studies.map((study) => (
                        <li key={study.study_short_name}>
                          <Link to={`/study/${study.study_short_name}`} className={classes.studyLink}>
                            {study.study_name || study.study_short_name}
                            <img src={externalIcon} width={14} height={14} className={classes.studyLinkIcon} alt="" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              </Grid>
              </Grid>
            </div>
          </>
        )}
      </div>
    </>
  );
};

const styles = (theme) => ({
  container: {
    margin: 'auto',
    maxWidth: '1736px',
    paddingTop: '8px',
    paddingLeft: '36px',
    paddingRight: '36px',
    paddingBottom: '60px',
  },
  breadCrumb: {
    paddingBottom: '18px',
  },
  notFound: {
    padding: '40px 0',
  },
  header: {
    position: 'relative',
    borderBottom: '#0D6F94 12px solid',
    height: '118px',
    margin: 'auto',
  },
  logo: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    objectFit: 'contain',
    marginLeft: '-35px',
    marginTop: '-45px',
    pointerEvents: 'none',
  },
  headerTitle: {
    position: 'absolute',
    top: '50%',
    left: '146px',
    transform: 'translateY(-50%)',
  },
  headerMainTitle: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    fontFamily: 'Inter',
    fontWeight: 600,
    fontSize: '26px',
    lineHeight: '31px',
    letterSpacing: '-0.52px',
    color: '#0D6F94',
    wordBreak: 'break-word',
  },
  label: {
    fontWeight: 300,
  },
  subtitle: {
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '21.78px',
    color: '#0D6F94',
    marginTop: '10px',
  },
  body: {
    paddingTop: '40px',
    marginLeft: '60px',
    marginRight: '60px',
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    paddingRight: '63px',
    [theme.breakpoints.down('sm')]: {
      paddingRight: 0,
    },
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
    borderLeft: `1px solid ${programDetailsColors.cardBorder}`,
    paddingLeft: '30px',
    [theme.breakpoints.down('sm')]: {
      borderLeft: 'none',
      paddingLeft: 0,
      marginTop: '30px',
    },
  },
  sectionTitle: {
    margin: '0 0 8px 0',
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '21.78px',
    color: programDetailsColors.sectionTitle,
    textTransform: 'uppercase',
  },
  sectionText: {
    margin: 0,
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '24px',
    color: '#000',
  },
  emptyState: {
    margin: 0,
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '24px',
    color: '#6B7280',
  },
  metadataList: {
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  metadataRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  metadataLabel: {
    margin: 0,
    fontFamily: 'Roboto',
    fontWeight: 600,
    fontSize: '12px',
    color: '#6B7280',
  },
  metadataValue: {
    margin: 0,
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: '14px',
    color: '#111827',
  },
  videoItem: {
    display: 'flex',
    gap: '18px',
    marginBottom: '20px',
  },
  videoThumbnailButton: {
    position: 'relative',
    display: 'block',
    width: '310px',
    height: '176px',
    flexShrink: 0,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '68px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#EB3223',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '&::after': {
      content: '""',
      width: 0,
      height: 0,
      marginLeft: '4px',
      borderTop: '12px solid transparent',
      borderBottom: '12px solid transparent',
      borderLeft: '20px solid #fff',
    },
  },
  videoThumbnail: {
    width: '310px',
    height: '176px',
    objectFit: 'cover',
    flexShrink: 0,
    border: 'none',
  },
  videoCopy: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  videoTitle: {
    fontFamily: 'Roboto',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '24px',
    color: '#000',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  videoDescription: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '24px',
    color: '#000',
  },
  materialsList: {
    margin: 0,
    paddingLeft: '20px',
  },
  studiesList: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  studyLink: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#9F109F',
    fontFamily: 'Roboto',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '150%',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationSkipInk: 'none',
    textDecorationThickness: 'auto',
    textUnderlineOffset: 'auto',
    textUnderlinePosition: 'from-font',
  },
  studyLinkIcon: {
    marginLeft: '5px',
  },
});

export default withStyles(styles)(ProgramDetailsView);
