import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Stats from '../../components/Stats/ScopedStatsController';
import StatsView from '../../components/Stats/StatsView';
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

  const studyShortNames = [...new Set(studies.map((study) => study?.study_short_name).filter(Boolean))];
  const studyCount = studies.length;
  const studyCountLabel = `Associated ${studyCount === 1 ? 'Study' : 'Studies'}`;
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
      {studyShortNames.length > 0 ? (
        <Stats variables={{ study_short_name: studyShortNames }} />
      ) : (
        // Empty filters return global totals, so do not query stats for an empty or unknown program.
        <StatsView data={{ numberOfPrograms: !isInitiatives && program ? 1 : 0 }} />
      )}
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
    paddingBottom: '75px',
  },
  breadCrumb: {
    paddingBottom: '18px',
  },
  notFound: {
    padding: '40px 0',
  },
  header: {
    position: 'relative',
    borderBottom: '12px solid #0F4778',
    height: '118px',
    margin: 'auto',
    paddingLeft: '10px',
    // TEMP FIX: Figma banner line spans 63-1727 at 1800px, 5px left of the page content box.
    left: '-5px',
  },
  logo: {
    position: 'absolute',
    width: '200px',
    height: '200px',
    objectFit: 'contain',
    marginLeft: '-35px',
    marginTop: '-43.5px', // TEMP FIX: Figma badge circle top is level with the banner top
    pointerEvents: 'none',
  },
  headerTitle: {
    position: 'absolute',
    // TEMP FIX: Figma title block sits 3px lower and 4px further left than centered at 150px.
    top: 'calc(50% + 3px)',
    left: '146px',
    transform: 'translateY(-50%)',
  },
  headerMainTitle: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '8px',
    color: '#0D6F94',
    fontFamily: 'Inter',
    fontSize: '26px',
    fontStyle: 'normal',
    fontWeight: 300,
    lineHeight: '31px',
    letterSpacing: '-0.52px',
    wordBreak: 'break-word',
  },
  label: {
    fontWeight: 300,
  },
  // New/Heading/H3 - short name under the title
  subtitle: {
    color: '#0D6F94',
    fontFamily: 'Inter',
    fontSize: '18px',
    fontStyle: 'normal',
    fontWeight: 500,
    lineHeight: 'normal',
    marginTop: '4px',
  },
  body: {
    paddingTop: '40px',
    marginLeft: '59px', // description and the Associated Studies title both start 127px from the viewport's left edge at 1800px
    marginRight: '30px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: '30px',
    },
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
    fontSize: '18px',
    lineHeight: '31.5px',
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
    justifyContent: 'space-between',
    gap: '40px',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  // Figma: description 965px wide, video 507px wide, free space between them (102px at 1800px).
  descriptionColumn: {
    flex: '1 1 0',
    maxWidth: '965px',
    minWidth: 0,
    [theme.breakpoints.down('sm')]: {
      flex: 'none',
      maxWidth: 'none',
    },
  },
  videosColumn: {
    flex: '0 1 507px',
    maxWidth: '35%',
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    [theme.breakpoints.down('sm')]: {
      flex: 'none',
      maxWidth: 'none',
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
    aspectRatio: '507 / 290',
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
    display: 'block',
    width: '100%',
    aspectRatio: '507 / 290',
    objectFit: 'cover',
    flexShrink: 0,
    border: 'none',
  },
  headerWrap: {
    position: 'relative',
  },
  // Figma "Frame 118": a fixed 290x47 frame (padding 12 top / 15 sides / 10 bottom) with the text centered in it, not a
  // pill that hugs its text. Plain inline text (no flex), so the space between the number and the label is a real
  // character and the underline runs through it. Its right edge lines up with the description/video row and the table's right edge, i.e.
  // 30px in from the header line.
  countPill: {
    position: 'absolute',
    top: '50%',
    right: '30px',
    transform: 'translateY(-50%)',
    boxSizing: 'border-box',
    width: '290px',
    maxWidth: '100%',
    height: '47px',
    padding: '12px 15px 10px',
    textAlign: 'center',
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
  // Same width and side padding as .container, so the table spans the header line and the section title lines up
  // with the description above it (both 30px in).
  // 36px page padding + 30px body margin (same as the description/video row), so the table's left and right edges
  // line up with the description text and the video, not with the header line.
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
    },
    // "Data Availability" label: Nunito Sans 18px/16px, regular weight, white. Set on the cell and its children, since
    // the shared theme styles the label on the group cell (Roboto 16px, weight 600).
    '&& tr.column_grouping td, && tr.column_grouping td *, && tr.column_grouping th, && tr.column_grouping th *': {
      color: '#FFF',
      fontFamily: '"Nunito Sans", sans-serif',
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '16px',
    },
    // Center the label (and its "?" tooltip) vertically in the 44px row; the 42px tooltip button otherwise stretches
    // the line box and pushes the text up.
    '&& tr.column_grouping th.data_availability > span, && tr.column_grouping td.data_availability > span': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    '&& tr.column_grouping th.data_availability > span > button, && tr.column_grouping td.data_availability > span > button': {
      paddingTop: 0,
      paddingBottom: 0,
    },
    '&& tr.column_grouping svg': {
      color: '#fff',
      fill: '#fff',
    },
    // The tooltip "?" is a black <img>; invert it to white to match the design on the navy row.
    '&& tr.column_grouping img': {
      filter: 'brightness(0) invert(1)',
    },
    // 30px side margins on the header and body rows: text starts 30px from the left edge and the last icon ends 30px
    // from the right edge. The shared theme gives the first/last data-availability columns 100px padding, so
    // override those here (scoped to this table) with five equal-width icon columns instead.
    '&& tbody td:first-child, && thead tr:not(.column_grouping) th:first-child': {
      paddingLeft: '30px',
    },
    // Horizontal space between the five text columns: 30px of padding on each side of every text column (the shared
    // theme uses 15px), so the text of two neighbouring columns is 60px apart. Change the two values together.
    '&& tbody td:nth-child(-n+5), && thead tr:not(.column_grouping) th:nth-child(-n+5)': {
      paddingLeft: '30px',
      paddingRight: '30px',
    },
    // Keep each text header (and the sort arrow next to "Study Code") on one line; Study Name absorbs the width.
    '&& thead tr:not(.column_grouping) th:nth-child(-n+5)': {
      whiteSpace: 'nowrap',
    },
    // Column header text: Nunito Sans 18px/18px, regular weight, Primary One (#0B3556). The sorted column's label is a
    // button/link element that otherwise falls back to the default text color, so target the text and its children.
    '&& thead tr:not(.column_grouping) th:not(.participant_file_count):not(.study_file_count):not(.image_collection_count):not(.numberOfPublications):not(.unique_repository), && thead tr:not(.column_grouping) th:not(.participant_file_count):not(.study_file_count):not(.image_collection_count):not(.numberOfPublications):not(.unique_repository) *': {
      color: '#0B3556',
      fontFamily: '"Nunito Sans", sans-serif',
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '18px',
    },
    // Data availability icons at the design's sizes (25/24/25/26/29px wide), 36px between neighbours, 53px tall header.
    // The cells are table cells, not a flex container, so the layout comes from cell widths: every icon gets 18px of
    // padding on each side (18 + 18 = the 36px gap). The first column adds 38.5px on its left (the design's block
    // margin, (350 - (25+24+25+26+29) - 4 * 36) / 2), and the last column leaves 38px on its right, so the rightmost
    // icon ends exactly 38px from the table's right edge.
    // Widths = icon + padding: 81.5 + 60 + 61 + 62 + 85 = 349.5 (+1px separator on the first column). Dots center under icons.
    '&& td.participant_file_count, && td.study_file_count, && td.image_collection_count, && td.numberOfPublications, && td.unique_repository, && th.participant_file_count, && th.study_file_count, && th.image_collection_count, && th.numberOfPublications, && th.unique_repository': {
      boxSizing: 'border-box',
      padding: '0 18px',
      textAlign: 'center',
    },
    '&& th.participant_file_count, && th.study_file_count, && th.image_collection_count, && th.numberOfPublications, && th.unique_repository': {
      height: '53px',
      verticalAlign: 'middle',
    },
    // Header icons at the design's sizes (height follows each SVG's own aspect ratio). The shared header scales them to
    // 35/38px and nudges the publications icon down 4px; reset both for this table.
    '&& th.participant_file_count img': { width: '25px', paddingTop: 0 },
    '&& th.study_file_count img': { width: '24px', paddingTop: 0 },
    '&& th.image_collection_count img': { width: '25px', paddingTop: 0 },
    // TEMP FIX: explicit heights from the design for the last two icons (Publications 23px, CRDC node 27px).
    '&& th.numberOfPublications img': { width: '26px', height: '23px', paddingTop: 0 },
    '&& th.unique_repository img': { width: '29px', height: '27px', paddingTop: 0 },
    // Availability dots: the design draws 8x8 dots; the shared cell renders an 18px icon whose circle is 2/3 of the box
    // (12px). A 12px icon gives the 8px circle (8 / (16/24) = 12).
    '&& td.participant_file_count svg, && td.study_file_count svg, && td.image_collection_count svg, && td.numberOfPublications svg, && td.unique_repository svg': {
      width: '12px',
      height: '12px',
      display: 'block',
      margin: '0 auto',
      color: '#00579E',
      fill: '#00579E',
    },
    // The design's dots sit 0-3px right of the icon centers; mirror those offsets per column (keep or drop with the design).
    '&& td.participant_file_count svg': { transform: 'translateX(2px)' },
    '&& td.study_file_count svg': { transform: 'translateX(2.5px)' },
    '&& td.image_collection_count svg': { transform: 'translateX(3px)' },
    '&& td.numberOfPublications svg': { transform: 'translateX(2.5px)' },
    // Vertical separator between the text columns and the data availability block: a 1px left border on the first
    // data availability column. #808080 on the body rows and the icon header row; #EDF0F1 on the blue "Data
    // Availability" row (Figma "Frame 698"/"Frame 687" vs "Frame 686"). The column is 1px wider to make room for it,
    // so the icon spacing is unchanged.
    '&& td.participant_file_count, && th.participant_file_count': {
      width: '82.5px',
      minWidth: '82.5px',
      paddingLeft: '38.5px',
      borderLeft: '1px solid #808080',
    },
    // On the blue row the separator is a 1px line inset 1px from the row's top and bottom (Figma), so it is drawn as a
    // background instead of a border.
    '&& tr.column_grouping td.data_availability, && tr.column_grouping th.data_availability': {
      borderLeft: 0,
      backgroundImage: 'linear-gradient(#EDF0F1, #EDF0F1)',
      backgroundSize: '1px calc(100% - 2px)',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'left center',
    },
    '&& td.study_file_count, && th.study_file_count': {
      width: '60px',
      minWidth: '60px',
    },
    '&& td.image_collection_count, && th.image_collection_count': {
      width: '61px',
      minWidth: '61px',
    },
    '&& td.numberOfPublications, && th.numberOfPublications': {
      width: '62px',
      minWidth: '62px',
    },
    '&& td.unique_repository, && th.unique_repository': {
      width: '85px',
      minWidth: '85px',
      paddingRight: '38px',
    },
    // Figma geometry (1800px wide): blue row 44px, icon header row 53px with a 3px #686F7F rule under it, body rows
    // 106px. The shared theme draws 3px #0E6292 borders above and below every header row; drop them here.
    '&& thead tr': {
      borderTop: 0,
      borderBottom: 0,
    },
    '&& thead tr.column_grouping': {
      height: '44px',
    },
    '&& thead tr.column_grouping th, && thead tr.column_grouping td': {
      borderBottom: 0,
      paddingTop: 0,
      paddingBottom: 0,
    },
    '&& thead tr:not(.column_grouping) th': {
      height: '53px',
      paddingTop: 0,
      paddingBottom: 0,
      borderBottom: '3px solid #686F7F',
    },
    // Rows alternate #E0EEF2 / #FFFFFF, starting with #E0EEF2 on the first row.
    '&& tbody tr': {
      height: '106px',
    },
    '&& tbody tr:nth-child(odd), && tbody tr:nth-child(odd) td': {
      backgroundColor: '#E0EEF2',
    },
    '&& tbody tr:nth-child(even), && tbody tr:nth-child(even) td': {
      backgroundColor: '#FFFFFF',
    },
    // Body text: Open Sans 16px #323232 (Accession ID in Lato); Study Code link Roboto 16px/24px #9F109F underlined.
    '&& tbody td': {
      fontFamily: '"Open Sans", sans-serif',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '18px',
      color: '#323232',
    },
    '&& tbody td:nth-child(1), && tbody td:nth-child(4)': {
      lineHeight: '16px',
    },
    '&& tbody td:nth-child(4)': {
      fontFamily: 'Lato, sans-serif',
    },
    '&& tbody td:nth-child(5) a, && tbody td:nth-child(5) a *': {
      fontFamily: 'Roboto, sans-serif',
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
      color: '#9F109F',
      textDecoration: 'underline',
    },
    // Let the toolbar and top border determine the height without an internal vertical scrollbar.
    '&& [class*="MuiTablePagination-root"]': {
      minHeight: '44px',
      boxSizing: 'border-box',
      borderTop: '3px solid #686F7F',
      borderBottom: 0,
      paddingRight: '38px',
      '&:last-child': { paddingRight: '38px' },
      '& [class*="MuiTablePagination-caption"]': {
        textTransform: 'none',
      },
      // The range label is a fixed 81px box in the design (text left aligned).
      '& [class*="MuiTablePagination-caption"]:nth-of-type(2)': {
        width: '81px',
        textAlign: 'left',
      },
      '& [class*="MuiTablePagination-input"]': {
        marginLeft: '28px',
        marginRight: '32px',
        width: '41px',
      },
      '& [class*="MuiTablePagination-select"]': {
        paddingRight: '24px',
        paddingLeft: 0,
        textOverflow: 'clip',
      },
      '& [class*="MuiTablePagination-actions"]': {
        marginLeft: '25px',
        display: 'flex',
        gap: '10px',
        '& button': {
          width: '24px',
          height: '24px',
          padding: 0,
        },
      },
    },
    '&& .downloadAndColumnView': {
      top: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      minHeight: '44px',
      height: '44px',
      maxHeight: '44px',
      padding: 0,
      paddingRight: '15px', // 48px buttons with the glyphs centered: the columns glyph ends 30px from the table edge
      '& button': {
        marginBottom: 0,
      },
      '& button.download-icon': {
        marginRight: '-8px',
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
