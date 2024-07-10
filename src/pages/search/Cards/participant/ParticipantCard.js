import React from 'react';
import {
  Grid, Typography,
} from '@material-ui/core';
import useStyles from './style';
import { cn } from 'bento-components';
import { removeSquareBracketsFromString } from '../../../../utils/utils';

const ParticipantCard = ({ data = {}, index })=> {
  const {
    subject_id: subjectId,
    ctep_disease_term: ctepDiseaseTerm,
    age_at_enrollment: age,
    sex,
    reported_gender: gender,
    race,
    ethnicity,
    targeted_therapy: therapy,
    stage_of_disease: stageOfDisease,
  } = data;
  const classes = useStyles();

  const renderInfo = (label, value='') => (
    <div className={classes.keyAndValueRow}>
      <Typography variant="h6" className={classes.key}>
        {label}
      </Typography>
      <Typography variant="body1" className={classes.value}>
        {value}
      </Typography>
    </div>
  );

  return (
    <Grid item container className={classes.card}>
      <Grid item className={classes.indexContainer}>
        {index + 1}
      </Grid>

      <Grid item xs={true}>
        <div className={cn(classes.keyAndValueRow, classes.titleRow)}>
          <span className={classes.titleKey}>PARTICIPANT</span>
          <Typography variant="h3" className={classes.titleValue}>
            {subjectId}
          </Typography>
        </div>
        <div className={classes.row}>
          <div className={classes.column}>
            {renderInfo('Diagnosis:', ctepDiseaseTerm)}
            {renderInfo('Age:', age)}
            {renderInfo('Sex:', sex)}
            {renderInfo('Gender:', gender)}
          </div>

          <div className={cn(classes.column, classes.leftColumn)}>
            {renderInfo('Race:', race)}
            {renderInfo('Ethnicity:', ethnicity)}
            {renderInfo('Therapy:', removeSquareBracketsFromString(therapy))}
            {renderInfo('Stage of Disease:', stageOfDisease)}

          </div>
        </div>
      </Grid>

      <Grid item xs={12} className={classes.hrContainer}>
        <hr className={classes.hr}/>
      </Grid>
    </Grid>
  );
};

export default ParticipantCard;