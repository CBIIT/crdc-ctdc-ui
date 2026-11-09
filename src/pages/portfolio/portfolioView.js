import React, { useState } from 'react';
import { withStyles } from '@material-ui/core';
import Stats from '../../components/Stats/AllStatsController';
import { Typography } from '../../components/Wrappers/Wrappers';
import PortfolioCard from './components/PortfolioCard';
import portfolioSearchIcon from '../../assets/portfolio/portfolio-search-icon.svg';
import {
  pageData, portfolioHeaderIcon, curatedProgramContent, initiativesCardContent,
} from '../../bento/portfolioData';

const byName = (a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });

const PortfolioView = ({ classes, programs, unaffiliatedStudies }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Programs and the Initiatives card form one list, ordered alphabetically by displayed name.
  const items = (programs || []).map((program) => ({
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
    paddingTop: '28px',
    paddingLeft: '36px',
    paddingRight: '36px',
    paddingBottom: '60px',
  },
  header: {
    paddingLeft: '35px',
    paddingTop: '31px',
    borderBottom: '#0D6F94 12px solid',
    height: '83px',
    margin: 'auto',
    position: 'relative',
  },
  logo: {
    position: 'absolute',
    width: '140px',
    height: '140px',
    objectFit: 'contain',
    marginLeft: '-65px',
    marginTop: '-65px',
    pointerEvents: 'none',
  },
  headerMainTitle: {
    position: 'absolute',
    top: '50%',
    left: '96px',
    transform: 'translateY(-50%)',
    fontFamily: 'Inter',
    fontWeight: 600,
    letterSpacing: '-0.52px',
    color: '#0D6F94',
    fontSize: '26px',
    lineHeight: '31px',
  },
  searchRow: {
    margin: '30px auto 0',
    maxWidth: '1500px',
    paddingLeft: '40px',
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
    padding: '0 44px 0 20px',
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
    paddingBottom: '30px',
    margin: 'auto',
  },
  emptyState: {
    padding: '40px 0',
    textAlign: 'center',
  },
});

export default withStyles(styles, { withTheme: true })(PortfolioView);
