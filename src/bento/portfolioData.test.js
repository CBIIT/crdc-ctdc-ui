import {
  pageData,
  portfolioHeaderIcon,
  externalLinkIcon,
  curatedProgramContent,
  initiativesCardContent,
  GET_PORTFOLIO_PROGRAMS_QUERY,
  GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY,
} from './portfolioData';

describe('portfolioData configuration', () => {
  it('should define the Portfolio page heading', () => {
    expect(pageData.headerTitle).toBe('Portfolio of CTDC Programs and Initiatives');
  });

  it('should define a header icon with src and alt', () => {
    expect(portfolioHeaderIcon.src).toBeTruthy();
    expect(portfolioHeaderIcon.alt).toBeTruthy();
  });

  it('should define an external link icon with src and alt', () => {
    expect(externalLinkIcon.src).toBeTruthy();
    expect(externalLinkIcon.alt).toBeTruthy();
  });

  it('should define curated content container for programs', () => {
    expect(typeof curatedProgramContent).toBe('object');
  });

  it('should define the Initiatives card name', () => {
    expect(initiativesCardContent.name).toBeTruthy();
  });

  it('should export a GraphQL document for the program list query', () => {
    expect(GET_PORTFOLIO_PROGRAMS_QUERY.kind).toBe('Document');
  });

  it('should export a GraphQL document for the unaffiliated studies query', () => {
    expect(GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY.kind).toBe('Document');
  });
});
