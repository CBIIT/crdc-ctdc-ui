import React from 'react';
import {
  Grid,
  withStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import styles from './ParticipantCardStyle';

const ParticipantCardView = ({
  data = {},
  classes,
  index,
}) => {
  const {
    study_short_name: study = '__CMB',
    subject_id: subject = '',
    ctep_disease_term: diagnosis = '',
    age_at_enrollment: age = '',
    sex = '',
    reported_gender: gender = '',
    race = '',
    ethnicity = '',
    targeted_therapy: therapy = '',
  } = data;

  console.log("data: ", data)

  return (
    <Grid item container className={classes.card} id={`global_search_card_${index}`}>
      <Grid item xs={1} className={classes.indexContainer}>
        {index + 1 }
      </Grid>
      <Grid item xs={11} className={classes.propertyContainer}>
        <div>
          <span className={classes.detailContainerHeader}>Participant</span>
          <Link to='' className={classes.cardTitle}>
            {study + "-" + subject}
          </Link>
        </div>
        <Grid item container>
          <Grid item xs={6}>
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
                Age:
              </span>
              <span className={classes.content}>
                {age}
              </span>
            </Grid>
            <Grid item xs={12}>
              <span className={classes.title}>
                Sex:
              </span>
              <span className={classes.content}>
                {sex}
              </span>
            </Grid>
            <Grid item xs={12}>
              <span className={classes.title}>
                Gender:
              </span>
              <span className={classes.content}>
                {gender}
              </span>
            </Grid>
          </Grid>

          <Grid item xs={6}>
            <Grid item xs={12}>
              <span className={classes.title}>
                Race:
              </span>
              <span className={classes.content}>
                {race}
              </span>
            </Grid>
            <Grid item xs={12}>
              <span className={classes.title}>
                Ethnicity:
              </span>
              <span className={classes.content}>
                {ethnicity}
              </span>
            </Grid>
            <Grid item xs={12}>
              <span className={classes.title}>
                Therapy:
              </span>
              <span className={classes.content}>
                {therapy}
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
