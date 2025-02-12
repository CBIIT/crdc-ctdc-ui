import React from 'react';
import {
  Grid, Typography,
} from '@material-ui/core';
import { cn } from 'bento-components';
import useStyles from './style';

const BiospecimenCard = ({ data = {}, index }) => {
  const {
    parent_specimen_id: parentSpecimenId,
    participant_id: participantId,
    ctep_disease_term: ctepDiseaseTerm,
    parent_specimen_type: parentSpecimenType,
    tissue_category: tissueCategory,
    anatomical_collection_site: anatomicalCollectionSite,
    assessment_timepoint: assessmentTimepoint,
  } = data;

  const classes = useStyles();

  const renderInfo = (label, value = '') => (
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
        {index+1}
      </Grid>

      <Grid item xs={true}>
        <div className={cn(classes.keyAndValueRow, classes.titleRow)}>
          <span className={classes.titleKey}>BIOSPECIMEN</span>
          <Typography variant="h3" className={classes.titleValue}>
            {parentSpecimenId}
          </Typography>
        </div>
        <div className={classes.row}>
          <div className={classes.column}>
            {renderInfo('Participant:', participantId)}
            {renderInfo('Diagnosis:', ctepDiseaseTerm)}
            {renderInfo('Parent biospecimen:', parentSpecimenType)}
          </div>

          <div className={cn(classes.column, classes.leftColumn)}>
            {renderInfo('Tissue category:', tissueCategory)}
            {renderInfo('Anatomical collection site:', anatomicalCollectionSite)}
            {renderInfo('Collection timepoint:', assessmentTimepoint)}
          </div>
        </div>
      </Grid>
      <Grid item xs={12} className={classes.hrContainer}>
        <hr className={classes.hr}/>
      </Grid>
    </Grid>
  );
};

export default BiospecimenCard;
