import React from 'react';
import {
  Grid, Typography,
} from '@material-ui/core';
import { cn } from 'bento-components';
import useStyles from './style';

const BiospecimenCard = ({ data = {}, index }) => {
  const {
    specimen_id: specimenId,
    subject_id: subjectId,
    ctep_disease_term: ctepDiseaseTerm,
    specimen_type: biospecimenType,
    parent_specimen_type: parentSpecimenType,
    tissue_category: tissueCategory,
    anatomical_collection_site: anatomicalCollectionSite,
    assessment_timepoint: assessmentTimepoint,
  } = data;

  const classes = useStyles();

  const renderInfo = (label, value = '') => (
    <div className={classes.row}>
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
      <Grid item xs={1} className={classes.indexContainer}>
        {index+1}
      </Grid>

      <Grid item xs={11}>
        <div className={cn(classes.row, classes.titleRow)}>
          <span className={classes.titleKey}>BIOSPECIMEN</span>
          <Typography variant="h3" className={classes.titleValue}>
            {specimenId}
          </Typography>
        </div>
        <div className={classes.row}>
          <div className={classes.column}>
            {renderInfo('Participant:', subjectId)}
            {renderInfo('Diagnosis:', ctepDiseaseTerm)}
            {renderInfo('Biospecimen type:', biospecimenType)}
            {renderInfo('Parent biospecimen:', parentSpecimenType)}
          </div>

          <div className={classes.column}>
            {renderInfo('Tissue category:', tissueCategory)}
            {renderInfo('Anatomical collection site:', anatomicalCollectionSite)}
            {renderInfo('Collection timepoint:', assessmentTimepoint)}
          </div>
        </div>
      </Grid>
      <Grid item className={classes.hrContainer}>
        <hr className={classes.hr}/>
      </Grid>
    </Grid>
  );
};

export default BiospecimenCard;
