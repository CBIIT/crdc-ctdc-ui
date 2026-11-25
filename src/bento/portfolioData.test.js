import {
  pageData,
  portfolioHeaderIcon,
  externalLinkIcon,
  curatedProgramContent,
  initiativesCardContent,
  GET_PORTFOLIO_PROGRAMS_QUERY,
  GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY,
  flattenProgramStudies,
} from './portfolioData';

describe('portfolioData configuration', () => {
  it('should define the Portfolio page heading', () => {
    expect(pageData.headerTitle).toBe('Programs and Initiatives');
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

  // Component tests mock useQuery, so they cannot notice a stale argument. The backend renamed the program filter
  // from study_has_program ("has program") to is_program ("is program") in crdc-ctdc-backend PR #212; a stale
  // argument makes the whole Portfolio page fail validation, so pin the contract here.
  describe('backend program filter contract (crdc-ctdc-backend PR #212)', () => {
    const body = (doc) => doc.loc.source.body;

    it('requests only real programs with is_program: ["is program"]', () => {
      expect(body(GET_PORTFOLIO_PROGRAMS_QUERY)).toContain('getAllPrograms(is_program: ["is program"])');
    });

    it('requests the unaffiliated (Initiatives) studies with is_program: ["is not program"]', () => {
      expect(body(GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY)).toContain('getAllPrograms(is_program: ["is not program"])');
    });

    it('does not use the removed study_has_program argument or the old "has program" values', () => {
      [GET_PORTFOLIO_PROGRAMS_QUERY, GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY].forEach((doc) => {
        expect(body(doc)).not.toMatch(/study_has_program|has program|has no program/);
      });
    });

    it('requests study_id on program studies so table rows can link to Study Details', () => {
      expect(body(GET_PORTFOLIO_PROGRAMS_QUERY)).toContain('study_id');
      expect(body(GET_PORTFOLIO_UNAFFILIATED_STUDIES_QUERY)).toContain('study_id');
    });
  });
});

describe('flattenProgramStudies', () => {
  it('combines the studies of every returned grouping, not just the first', () => {
    const groups = [
      { studies: [{ study_id: 'NCT1', study_short_name: 'A' }] },
      { program_short_name: 'NA', studies: [{ study_id: 'NCT2', study_short_name: 'B' }] },
    ];
    expect(flattenProgramStudies(groups).map((study) => study.study_id)).toEqual(['NCT1', 'NCT2']);
  });

  it('drops duplicate studies that appear in more than one grouping', () => {
    const groups = [
      { studies: [{ study_id: 'NCT1' }, { study_id: 'NCT2' }] },
      { studies: [{ study_id: 'NCT2' }] },
    ];
    expect(flattenProgramStudies(groups)).toHaveLength(2);
  });

  it('handles missing data and groupings without studies', () => {
    expect(flattenProgramStudies(undefined)).toEqual([]);
    expect(flattenProgramStudies([{ studies: null }, {}])).toEqual([]);
  });
});
