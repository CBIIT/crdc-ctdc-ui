import React from 'react';
import {
  Grid,
  withStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import styles from './BiospecimenCardStyle';

const ParticipantCardView = ({
  data = {},
  classes,
  index,
}) => {
  const {
    specimen_id: specimenId = '',
    study_short_name: studyShortName = '',
    subject_id: subjectId = '',
    ctep_disease_term: diagnosis = '',
    specimen_type: biospecimenType = '',
    parent_specimen_type: parentSpecimenType = '',
    tissue_category: tissueCategory = '',
    anatomical_collection_site: anatomicalCollectionSite = '',
    assessment_timepoint: assessmentTimepoint = '',
  } = data;

  console.log("data: ", data)

  return (
    <Grid item container className={classes.card} id={`global_search_card_${index}`}>
      <Grid item xs={1} className={classes.indexContainer}>
        {index + 1 }
      </Grid>
      <Grid item xs={11} className={classes.propertyContainer}>
        <div>
          <span className={classes.detailContainerHeader}>Biospecimen</span>
          <Link to='' className={classes.cardTitle}>
            {specimenId}
          </Link>
        </div>
        <Grid item container>
          <Grid item xs={6}>
            <Grid item xs={12}>
              <span className={classes.title}>
                Participant:
              </span>
              <span className={classes.content}>
                {studyShortName + '-' + subjectId}
              </span>
            </Grid>
            <Grid item xs={12}>
              <span className={classes.title}>
                Diagnosis:
              </span>
              <span className={classes.content}>
                {diagnosis}
              </span>
            </Grid>
            <Grid item xs={12}>
              <span className={classes.title}>
                Biospecimen type:
              </span>
              <span className={classes.content}>
                {biospecimenType}
              </span>
            </Grid>
            <Grid item xs={12}>
              <span className={classes.title}>
                Parent biospecimen:
              </span>
              <span className={classes.content}>
                {parentSpecimenType}
              </span>
            </Grid>
          </Grid>

          <Grid item xs={6}>
            <Grid item xs={12}>
              <span className={classes.title}>
                Tissue category:
              </span>
              <span className={classes.content}>
                {tissueCategory}
              </span>
            </Grid>
            <Grid item xs={12}>
              <span className={classes.title}>
                Anatomical collection site:
              </span>
              <span className={classes.content}>
                {anatomicalCollectionSite}
              </span>
            </Grid>
            <Grid item xs={12}>
              <span className={classes.title}>
                Collection timepoint:
              </span>
              <span className={classes.content}>
                {assessmentTimepoint}
              </span>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={6}>
        {(index+1) %10 !==0 ? <hr/> : null}
      </Grid>
    </Grid>
    
  );
};

export default withStyles(styles)(ParticipantCardView);
