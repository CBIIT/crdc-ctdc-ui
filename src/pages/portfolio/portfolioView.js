import React from 'react';
import { withStyles } from '@material-ui/core';
import Stats from '../../components/Stats/AllStatsController';
import { Typography } from '../../components/Wrappers/Wrappers';
import PortfolioCard from './components/PortfolioCard';
import {
  pageData, portfolioHeaderIcon, curatedProgramContent, initiativesCardContent,
} from '../../bento/portfolioData';

const PortfolioView = ({ classes, programs, unaffiliatedStudies }) => {
  const sortedPrograms = [...(programs || [])].sort(
    (a, b) => (a.program_sort_order ?? 0) - (b.program_sort_order ?? 0),
  );
  const isEmpty = sortedPrograms.length === 0 && unaffiliatedStudies.length === 0;

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

        <div className={classes.cardList}>
          {isEmpty ? (
            <Typography className={classes.emptyState}>
              No programs are currently registered.
            </Typography>
          ) : (
            <>
              {sortedPrograms.map((program) => (
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
              ))}
              {unaffiliatedStudies.length > 0 && (
                <PortfolioCard
                  isInitiatives
                  name={initiativesCardContent.name}
                  identifier={null}
                  description={initiativesCardContent.description}
                  externalUrl={initiativesCardContent.externalUrl}
                  studies={unaffiliatedStudies}
                  image={initiativesCardContent.primaryImage}
                  imageAlt={initiativesCardContent.primaryImageAlt}
                />
              )}
            </>
          )}
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
    marginTop: '-76px',
    marginLeft: '-68px',
  },
  headerMainTitle: {
    position: 'absolute',
    top: '23px',
    left: '96px',
    fontFamily: 'Inter',
    fontWeight: 600,
    letterSpacing: '-0.52px',
    color: '#0D6F94',
    fontSize: '26px',
    lineHeight: '31px',
  },
  cardList: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '34px',
    paddingTop: '30px',
    paddingBottom: '30px',
  },
  emptyState: {
    padding: '40px 0',
    textAlign: 'center',
  },
});

export default withStyles(styles, { withTheme: true })(PortfolioView);
