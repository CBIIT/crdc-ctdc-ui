import React from "react";
import { withStyles } from "@material-ui/core";
import { useQuery } from "@apollo/client";
import {
  publicationsTableConfig,
  GET_STUDY_PUBLICATIONS_QUERY,
  externalIcon,
} from "../../../../bento/studyDetailData";
import styles from "./PublicationsStyle";

const PublicationCard = ({ publication, classes }) => {
  const {
    publication_title,
    authorship,
    year_of_publication,
    journal_citation,
    digital_object_id,
    pubmed_id,
  } = publication;

  return (
    <div className={classes.card}>
      <div className={classes.cardTitle}>{publication_title}</div>
      <div className={classes.cardRow}>
        <span className={classes.cardLabel}>AUTHORSHIP:</span>
        <span className={classes.cardValue}>{authorship}</span>
      </div>
      <div className={classes.cardRow}>
        <span className={classes.cardLabel}>YEAR OF PUBLICATION:</span>
        <span className={classes.cardValue}>{year_of_publication}</span>
      </div>
      <div className={classes.cardRow}>
        <span className={classes.cardLabel}>JOURNAL:</span>
        <span className={classes.cardValue}>{journal_citation}</span>
      </div>
      <div className={classes.cardRow}>
        <span className={classes.cardLabel}>DOI:</span>
        <span className={classes.cardValue}>
          {digital_object_id && (
            <a
              href={`https://doi.org/${digital_object_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.cardLink}
            >
              {digital_object_id}
              <img src={externalIcon} alt="external link" className={classes.externalIcon} />
            </a>
          )}
        </span>
      </div>
      <div className={classes.cardRow}>
        <span className={classes.cardLabel}>PUBMED ID:</span>
        <span className={classes.cardValue}>
          {pubmed_id && (
            <a
              href={`https://pubmed.ncbi.nlm.nih.gov/${pubmed_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.cardLink}
            >
              {pubmed_id}
              <img src={externalIcon} alt="external link" className={classes.externalIcon} />
            </a>
          )}
        </span>
      </div>
    </div>
  );
};

const PublicationsView = ({ classes, study_id }) => {
  // Fetch publications (client-side)
  const { loading, error, data } = useQuery(GET_STUDY_PUBLICATIONS_QUERY, {
    skip: !study_id,
    variables: {
      study_id: [study_id],
    },
    fetchPolicy: "cache-first",
  });

  const publications = data?.studyByStudyShortName?.[0]?.publications || [];

  // TODO: Remove mock data once backend has real publications
  const MOCK_PUBLICATIONS = [
    {
      publication_title: "Adjuvant Sirolimus Does Not Improve Outcome in Pet Dogs Receiving Standard-of-Care Therapy for Appendicular Osteosarcoma: A Prospective, Randomized Trial of 324 Dogs",
      authorship: "Amy K LeBlanc et al",
      year_of_publication: "2021",
      journal_citation: "Clinical Cancer Research 27(11):3005-3016",
      digital_object_id: "10.1158/1078-0432.CCR-21-0315",
      pubmed_id: "33753454",
    },
    {
      publication_title: "Adjuvant Sirolimus Does Not Improve Outcome in Pet Dogs Receiving Standard-of-Care Therapy for Appendicular Osteosarcoma: A Prospective, Randomized Trial of 324 Dogs",
      authorship: "Amy K LeBlanc et al",
      year_of_publication: "2021",
      journal_citation: "Clinical Cancer Research 27(11):3005-3016",
      digital_object_id: "10.1158/1078-0432.CCR-21-0315",
      pubmed_id: "33753455",
    },
    {
      publication_title: "Adjuvant Sirolimus Does Not Improve Outcome in Pet Dogs Receiving Standard-of-Care Therapy for Appendicular Osteosarcoma: A Prospective, Randomized Trial of 324 Dogs",
      authorship: "Amy K LeBlanc et al",
      year_of_publication: "2021",
      journal_citation: "Clinical Cancer Research 27(11):3005-3016",
      digital_object_id: "10.1158/1078-0432.CCR-21-0315",
      pubmed_id: "33753456",
    },
    {
      publication_title: "Adjuvant Sirolimus Does Not Improve Outcome in Pet Dogs Receiving Standard-of-Care Therapy for Appendicular Osteosarcoma: A Prospective, Randomized Trial of 324 Dogs",
      authorship: "Amy K LeBlanc et al",
      year_of_publication: "2021",
      journal_citation: "Clinical Cancer Research 27(11):3005-3016",
      digital_object_id: "10.1158/1078-0432.CCR-21-0315",
      pubmed_id: "33753457",
    },
  ];

  const displayPublications = publications.length > 0 ? publications : MOCK_PUBLICATIONS;

  if (loading) {
    return <div className={classes.container}>Loading publications...</div>;
  }

  if (error) {
    return (
      <div className={classes.container}>
        Error loading publications: {error.message}
      </div>
    );
  }

  if (displayPublications.length === 0) {
    return (
      <div className={classes.container}>
        <div className={classes.noDataMessage}>
          {publicationsTableConfig.tableMsg.noMatch}
        </div>
      </div>
    );
  }

  return (
    <div className={classes.container}>
      <div className={classes.gridContainer}>
        <div className={classes.column}>
          {displayPublications
            .filter((_, index) => index % 2 === 0)
            .map((publication, index) => (
              <PublicationCard key={index} publication={publication} classes={classes} />
            ))}
        </div>
        <div className={classes.divider} />
        <div className={classes.columnRight}>
          {displayPublications
            .filter((_, index) => index % 2 === 1)
            .map((publication, index) => (
              <PublicationCard key={index} publication={publication} classes={classes} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default withStyles(styles)(PublicationsView);
