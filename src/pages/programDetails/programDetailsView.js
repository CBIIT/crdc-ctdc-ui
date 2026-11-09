import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Stats from '../../components/Stats/AllStatsController';
import CustomBreadcrumb from '../../components/Breadcrumb/BreadcrumbView';
import StudiesThemeProvider from '../studies/studiesMuiThemConfig';
import { TableContextProvider } from '../../bento-core';
import StudiesTable from '../../components/DataAvailabilityTable/StudiesTable';
import { tableLayOut } from '../../bento/studiesData';
import {
  programDetailsHeaderIcon,
  programDetailsColors,
  curatedProgramDetailContent,
  initiativesDetailContent,
  programStudiesTable,
} from '../../bento/programDetailsData';

// Extracts a YouTube video ID from a standard watch URL so it can be embedded inline via an iframe. CTDC
// doesn't host the video file itself here - YouTube still serves it, this just displays their player inline
// instead of linking out (per AC8/9 + Manual QA #2 "embedded or linked-out" - both are in scope).
const getYouTubeEmbedUrl = (url) => {
  try {
    const videoId = new URL(url).searchParams.get('v');
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  } catch {
    return null;
  }
};

const ProgramDetailsView = ({
  classes, isInitiatives, program, unaffiliatedStudies, notFound, studyRows,
}) => {
  const [playingVideoTitle, setPlayingVideoTitle] = useState(null);
  const label = isInitiatives ? 'Initiative' : 'Program';
  const displayShortName = isInitiatives ? initiativesDetailContent.name : program?.program_short_name;
  const displayFullName = isInitiatives ? '' : program?.program_name;
  const studies = (isInitiatives ? unaffiliatedStudies : program?.studies) || [];
  const curated = isInitiatives
    ? initiativesDetailContent
    : (curatedProgramDetailContent[program?.program_short_name] || { hostVideos: [] });

  const studyCount = studies.length;
  const studyCountLabel = `ASSOCIATED ${studyCount === 1 ? 'STUDY' : 'STUDIES'}`;
  const tableRows = studyRows && studyRows.length > 0
    ? studyRows
    : studies.map((study) => ({ ...study, program_short_name: displayShortName }));
  const scrollToStudies = () => {
    const target = document.getElementById('associated-studies');
    if (target && target.scrollIntoView) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const breadCrumbJson = [
    { name: 'Programs & Initiatives', to: '/portfolio', isALink: true },
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
            <div className={classes.headerWrap}>
            <div className={classes.header}>
              <img
                src={programDetailsHeaderIcon.src}
                alt={programDetailsHeaderIcon.alt}
                className={classes.logo}
              />
              <div className={classes.headerTitle}>
                <div className={classes.headerMainTitle}>
                  <span className={classes.label}>{displayFullName || displayShortName}</span>
                </div>
                {displayFullName && <div className={classes.subtitle}>{displayShortName}</div>}
              </div>
            </div>
            <button type="button" className={classes.countPill} onClick={scrollToStudies}>
              <span className={classes.countNumber}>{studyCount}</span>
              {' '}
              <span className={classes.countLabel}>{studyCountLabel}</span>
            </button>
            </div>

            <div className={classes.body}>
              <div className={classes.content}>
                <div className={classes.descriptionRow}>
                  <div className={classes.descriptionColumn}>
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
                  </div>
                  {curated.hostVideos.length > 0 && (
                    <div className={classes.videosColumn}>
                      {curated.hostVideos.map((video) => {
                        const embedUrl = getYouTubeEmbedUrl(video.videoUrl);
                        const isPlaying = playingVideoTitle === video.title && embedUrl;

                        return (
                          <div key={video.title} className={classes.videoItem}>
                            {isPlaying ? (
                              <iframe
                                className={classes.videoThumbnail}
                                src={embedUrl}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            ) : (
                              <button
                                type="button"
                                className={classes.videoThumbnailButton}
                                onClick={() => setPlayingVideoTitle(video.title)}
                                disabled={!embedUrl}
                              >
                                {video.thumbnail && (
                                  <img src={video.thumbnail} alt={video.title} className={classes.videoThumbnail} />
                                )}
                                {embedUrl && <span className={classes.playButton} />}
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {!(!isInitiatives && notFound) && (
        <div className={classes.studiesBand} id="associated-studies">
          <div className={classes.studiesBandInner}>
            <div className={tableRows.length === 0 ? classes.tableAreaEmpty : classes.tableArea}>
              <h2 className={classes.bandTitle}>ASSOCIATED STUDIES</h2>
              {tableRows.length === 0 ? (
                <p className={classes.emptyState}>
                  {`No studies are currently linked to this ${label.toLowerCase()}.`}
                </p>
              ) : (
                <StudiesThemeProvider>
                  <TableContextProvider>
                    <StudiesTable
                      data={tableRows}
                      interOpData={tableRows}
                      table={programStudiesTable}
                      tableLayOut={tableLayOut}
                      rowsPerPage={programStudiesTable.numbOfRowPerPage || 10}
                    />
                  </TableContextProvider>
                </StudiesThemeProvider>
              )}
            </div>
          </div>
        </div>
      )}
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
    paddingLeft: '10px',
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
    left: '150px',
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
    marginLeft: '30px',
    marginRight: '30px',
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px',
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
  descriptionRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '40px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  descriptionColumn: {
    flex: '7 1 0',
    minWidth: 0,
  },
  videosColumn: {
    flex: '3 1 0',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  videoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  videoThumbnailButton: {
    position: 'relative',
    width: '100%',
    aspectRatio: '16 / 9',
    flexShrink: 0,
    padding: 0,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    '&:disabled': {
      cursor: 'default',
    },
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
    width: '100%',
    aspectRatio: '16 / 9',
    objectFit: 'cover',
    flexShrink: 0,
    border: 'none',
  },
  headerWrap: {
    position: 'relative',
  },
  countPill: {
    position: 'absolute',
    top: '50%',
    right: '18px',
    transform: 'translateY(-50%)',
    padding: '11px 20px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#E6F5FB',
    color: programDetailsColors.programAccent,
    fontFamily: 'Inter',
    fontSize: '20px',
    textDecorationLine: 'underline',
    textDecorationStyle: 'solid',
    textDecorationSkipInk: 'none',
    textDecorationThickness: 'auto',
    textUnderlineOffset: 'auto',
    textUnderlinePosition: 'from-font',
    [theme.breakpoints.down('sm')]: {
      position: 'static',
      transform: 'none',
      marginTop: '16px',
    },
  },
  countNumber: {
    fontWeight: 700,
    lineHeight: '24.2px',
    letterSpacing: '0.1px',
  },
  countLabel: {
    color: programDetailsColors.programAccent,
    fontFamily: 'Inter',
    fontSize: '20px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: 'normal',
    letterSpacing: '0.1px',
  },
  studiesBand: {
    backgroundColor: '#E8F4F8',
    paddingTop: '59px',
    paddingBottom: '133px',
  },
  studiesBandInner: {
    margin: 'auto',
    maxWidth: '1736px',
    paddingLeft: '66px',
    paddingRight: '66px',
  },
  // Title and the table's download/view-columns toolbar share one row (same pattern as the Participant Detail
  // tables): the toolbar stays in the flow and defines the row height, the title is absolutely placed at the left.
  tableArea: {
    position: 'relative',
    // Data Availability grouping row: navy band with white label, per the approved design.
    '&& tr.column_grouping, && tr.column_grouping th, && tr.column_grouping td': {
      backgroundColor: programDetailsColors.programAccent,
      color: '#fff',
    },
    '&& tr.column_grouping svg': {
      color: '#fff',
      fill: '#fff',
    },
    // The tooltip "?" is a black <img>; invert it to white to match the design on the navy row.
    '&& tr.column_grouping img': {
      filter: 'brightness(0) invert(1)',
    },
    '&& .downloadAndColumnView': {
      top: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      minHeight: '44px',
      height: '44px',
      maxHeight: '44px',
      padding: '0 29px 0 0',
      '& button': {
        marginBottom: 0,
      },
    },
  },
  tableAreaEmpty: {
    position: 'relative',
    paddingTop: '44px',
  },
  bandTitle: {
    position: 'absolute',
    top: '11px',
    left: '29px',
    zIndex: 1,
    margin: 0,
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '21.8px',
    color: programDetailsColors.sectionTitle,
    textTransform: 'uppercase',
  },
});

export default withStyles(styles)(ProgramDetailsView);
