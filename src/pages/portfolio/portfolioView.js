import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';
import Stats from '../../components/Stats/AllStatsController';
import { Typography } from '../../components/Wrappers/Wrappers';
import PortfolioCard from './components/PortfolioCard';
import portfolioSearchIcon from '../../assets/portfolio/portfolio-search-icon.svg';
import {
  pageData, portfolioHeaderIcon, curatedProgramContent, initiativesCardContent, TEMP_HIDDEN_PROGRAM_SHORT_NAMES,
} from '../../bento/portfolioData';

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });

const PortfolioView = ({ classes, programs, unaffiliatedStudies }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // TEMP FIX: drop placeholder programs the backend currently returns (see TEMP_HIDDEN_PROGRAM_SHORT_NAMES).
  const visiblePrograms = (programs || []).filter(
    (program) => !TEMP_HIDDEN_PROGRAM_SHORT_NAMES.includes(program.program_short_name),
  );

  // Programs and the Initiatives card form one list, ordered alphabetically by displayed name.
  const items = visiblePrograms.map((program) => ({
    key: program.program_short_name,
    name: program.program_name || '',
    searchText: [program.program_name, program.program_short_name, program.program_short_description],
    card: (
      <PortfolioCard
        key={program.program_short_name}
        name={program.program_name}
        identifier={program.program_short_name}
        description={program.program_short_description}
        externalUrl={program.program_external_url}
        studies={program.studies || []}
        image={curatedProgramContent[program.program_short_name]?.primaryImage}
        imageAlt={
          curatedProgramContent[program.program_short_name]?.primaryImageAlt
          || `${program.program_name} program image`
        }
      />
    ),
  }));

  if ((unaffiliatedStudies || []).length > 0) {
    items.push({
      key: 'initiatives',
      name: initiativesCardContent.name,
      searchText: [initiativesCardContent.name, initiativesCardContent.description],
      card: (
        <PortfolioCard
          key="initiatives"
          isInitiatives
          name={initiativesCardContent.name}
          identifier={null}
          description={initiativesCardContent.description}
          externalUrl={initiativesCardContent.externalUrl}
          studies={unaffiliatedStudies}
          image={initiativesCardContent.primaryImage}
          imageAlt={initiativesCardContent.primaryImageAlt}
        />
      ),
    });
  }

  items.sort(byName);

  const term = searchTerm.trim().toLowerCase();
  const visibleItems = term
    ? items.filter((item) => item.searchText.some((text) => (text || '').toLowerCase().includes(term)))
    : items;

  return (
    <>
      <Stats />
      <div className={classes.container}>
        <div className={classes.header}>
          <img
            src={portfolioHeaderIcon.src}
            alt={portfolioHeaderIcon.alt}
            className={classes.logo}
          />
          <span className={classes.headerMainTitle}>{pageData.headerTitle}</span>
        </div>

        {items.length > 0 && (
          <div className={classes.searchRow}>
            <div className={classes.searchBox}>
              <input
                type="search"
                className={classes.searchInput}
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={pageData.searchPlaceholder}
                aria-label={pageData.searchPlaceholder}
              />
              <img src={portfolioSearchIcon} alt="" aria-hidden="true" className={classes.searchIcon} />
            </div>
          </div>
        )}

        <div className={classes.cardList}>
          {items.length === 0 && (
            <Typography className={classes.emptyState}>
              No programs are currently registered.
            </Typography>
          )}
          {items.length > 0 && visibleItems.length === 0 && (
            <Typography className={classes.emptyState}>
              No programs or initiatives match your search.
            </Typography>
          )}
          {visibleItems.map((item) => item.card)}
        </div>
      </div>
    </>
  );
};

const styles = (theme) => ({
  container: {
    margin: 'auto',
    maxWidth: '1736px',
    paddingTop: '21px',
    paddingLeft: '36px',
    paddingRight: '36px',
    paddingBottom: '60px',
  },
  header: {
    paddingLeft: '35px',
    paddingTop: '31px',
    borderBottom: '#0D6F94 12px solid',
    height: '83px',
    // Figma: the banner spans 96-1704 at 1800px, 28px inside the page content box on each side.
    margin: '0 28px',
    position: 'relative',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
    },
  },
  // The SVG's circle is 56.3% of the image box; at 137.4px it is the design's 77.35px circle, and the -29.9px offsets put
  // the circle's top-left corner on the banner's top-left corner.
  logo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '137.4px',
    height: '137.4px',
    objectFit: 'contain',
    marginLeft: '-29.9px',
    marginTop: '-29.9px',
    pointerEvents: 'none',
  },
  headerMainTitle: {
    position: 'absolute',
    top: '23px',
    left: '88px',
    fontFamily: 'Inter',
    fontWeight: 600,
    letterSpacing: '-0.52px',
    color: '#0D6F94',
    fontSize: '26px',
    lineHeight: '31px',
  },
  searchRow: {
    // Same box as the card list (1500px cards + 64px side margins), so the search box stays 40px inside the cards' left
    // edge.
    boxSizing: 'border-box',
    margin: '34px auto 0',
    maxWidth: '1628px',
    paddingLeft: '104px',
    paddingRight: '64px',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: '28px',
      paddingRight: '28px',
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  searchBox: {
    position: 'relative',
    width: '580px',
    maxWidth: '100%',
  },
  searchIcon: {
    position: 'absolute',
    top: '50%',
    right: '18px',
    width: '14px',
    height: '14px',
    transform: 'translateY(-50%)',
    pointerEvents: 'none',
  },
  searchInput: {
    boxSizing: 'border-box',
    width: '100%',
    height: '40px',
    padding: '0 44px 0 18px',
    border: '1px solid #1178AC',
    borderRadius: '30px',
    backgroundColor: '#FFFFFF',
    fontFamily: 'Raleway',
    fontSize: '14px',
    color: '#000',
    outline: 'none',
    '&:focus': {
      boxShadow: '0 0 0 2px rgba(17, 120, 172, 0.3)',
    },
    '&::placeholder': {
      color: '#000',
      opacity: 1,
    },
    // The native clear button would collide with the icon; typing is cleared by deleting text.
    '&::-webkit-search-cancel-button': {
      display: 'none',
    },
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '34px',
    paddingTop: '25px',
    paddingBottom: '60px', // with the container's 60px: 120px below the last card
    // 36px inside the banner, which is itself 28px inside the page content box.
    paddingLeft: '64px',
    paddingRight: '64px',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: '28px',
      paddingRight: '28px',
    },
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 0,
      paddingRight: 0,
    },
  },
  emptyState: {
    padding: '40px 0',
    textAlign: 'center',
  },
});

export default withStyles(styles, { withTheme: true })(PortfolioView);
