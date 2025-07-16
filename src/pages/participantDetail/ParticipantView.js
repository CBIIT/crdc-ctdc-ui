import React from 'react';
import {
  CircularProgress,
  Grid,
  withStyles,
} from '@material-ui/core';
import { useQuery } from '@apollo/client';
import {
  GET_STUDY_DATA_INTEROPS_QUERY,
  pageData,
  tableLayOut,
} from '../../bento/participantDetailData';
import StatsView from '../../components/Stats/StatsView';
import ParticipantThemeProvider from './ParticipantMuiThemConfig';
import env from '../../utils/env';
import {
  TableContextProvider,
} from '../../bento-core';
import StudiesTable from '../../components/DataAvailabilityTable/StudiesTable';
import SampleTableView from './SampleView/SampleTableView';

const ParticipantView = ({ classes, data, participant_id }) => {

  const getHeaderIcon = () => (
    <img
      src={pageData.participantMainIcon.src}
      alt={pageData.participantMainIcon.alt}
    />
  );

  const stat = {
    numberOfStudies: 1,
    numberOfParticipants: 1,
    numberOfDiagnoses: data.sampleCountOfCase,
    numberOfTargetedTherapies: data.aliquotCountOfCase,
    numberOfSpecimens: data.sampleCountOfCase,
    numberOfFiles: data.studyFileCountOfCase,
  };

  const caseDetail = data.participantOverview[0];
  /*{
    "participantOverview": [
      {
        "participant_id": "MSB-00268",
        "age_at_enrollment": 56,
        "race": "Black or African American",
        "ethnicity": "Not Hispanic or Latino",
        "sex": "Female",
        "primary_diagnosis_disease_group": "Myeloma, NOS",
        "primary_disease_site": null,
        "stage_of_disease": "",
        "targeted_therapy": "[]",
        "__typename": "ParticipantOverview"
      }
    ],
    "biospecimenOverview": [
      {
        "participant_id": "MSB-00268",
        "age_at_enrollment": null,
        "sex": "Female",
        "race": "Black or African American",
        "surgical_procedure": null,
        "specimen_type": null,
        "ctep_disease_term": "Plasma Cell Myeloma",
        "stage_of_disease": "",
        "tumor_grade": "[]",
        "targeted_therapy": "[]",
        "primary_disease_site": "BLOOD",
        "specimen_id": "",
        "parent_specimen_id": "MSB-00268-02",
        "anatomical_collection_site": "Bone Marrow",
        "tissue_category": "",
        "assessment_timepoint": "Baseline (Fresh)",
        "data_file_uuid": [
          "dg.4DFC/C5C04D36-27E4-438C-B195-5A4F635C5BBF",
          "dg.4DFC/C1DFF7A7-D29D-4025-8B35-DF6F78712826"
        ],
        "__typename": "BiospecimenOverview"
      },
      {
        "participant_id": "MSB-00268",
        "age_at_enrollment": null,
        "sex": "Female",
        "race": "Black or African American",
        "surgical_procedure": null,
        "specimen_type": null,
        "ctep_disease_term": "Plasma Cell Myeloma",
        "stage_of_disease": "",
        "tumor_grade": "[]",
        "targeted_therapy": "[]",
        "primary_disease_site": "BLOOD",
        "specimen_id": "",
        "parent_specimen_id": "MSB-00268-03",
        "anatomical_collection_site": "Blood",
        "tissue_category": "",
        "assessment_timepoint": "Baseline (Fresh)",
        "data_file_uuid": [
          "dg.4DFC/C5C04D36-27E4-438C-B195-5A4F635C5BBF",
          "dg.4DFC/C1DFF7A7-D29D-4025-8B35-DF6F78712826"
        ],
        "__typename": "BiospecimenOverview"
      },
      {
        "participant_id": "MSB-00268",
        "age_at_enrollment": null,
        "sex": "Female",
        "race": "Black or African American",
        "surgical_procedure": null,
        "specimen_type": null,
        "ctep_disease_term": "Plasma Cell Myeloma",
        "stage_of_disease": "",
        "tumor_grade": "[]",
        "targeted_therapy": "[]",
        "primary_disease_site": "BLOOD",
        "specimen_id": "",
        "parent_specimen_id": "MSB-00268-04",
        "anatomical_collection_site": "Blood",
        "tissue_category": "",
        "assessment_timepoint": "Baseline (Fresh)",
        "data_file_uuid": [
          "dg.4DFC/C5C04D36-27E4-438C-B195-5A4F635C5BBF",
          "dg.4DFC/C1DFF7A7-D29D-4025-8B35-DF6F78712826"
        ],
        "__typename": "BiospecimenOverview"
      }
    ],
    "searchParticipants": {
      "numberOfStudies": 1,
      "numberOfParticipants": 1,
      "numberOfDiagnoses": 1,
      "numberOfTargetedTherapies": 0,
      "numberOfSpecimens": 3,
      "numberOfFiles": 2,
      "__typename": "SearchResult"
    },
    "fileOverview": [
      {
        "data_file_uuid": "dg.4DFC/C1DFF7A7-D29D-4025-8B35-DF6F78712826",
        "participant_id": "MSB-00268",
        "data_file_name": "MSB-00268-02-genomic-report-CTDCv1",
        "data_file_type": "Variant Report",
        "data_file_format": "pdf",
        "data_file_size": 885770,
        "data_file_description": "Validated Oncomine-derived variant analysis",
        "association": "biospecimen",
        "parent_specimen_id": "MSB-00268-02",
        "specimen_id": "",
        "ctep_disease_term": "Plasma Cell Myeloma",
        "__typename": "FileOverview"
      },
      {
        "data_file_uuid": "dg.4DFC/C5C04D36-27E4-438C-B195-5A4F635C5BBF",
        "participant_id": "MSB-00268",
        "data_file_name": "MSB-00268-02-somatic-mutations-CTDCv1",
        "data_file_type": "Variant Call File",
        "data_file_format": "vcf",
        "data_file_size": 1657273,
        "data_file_description": "Unfiltered Oncomine variant analysis",
        "association": "biospecimen",
        "parent_specimen_id": "MSB-00268-02",
        "specimen_id": "",
        "ctep_disease_term": "Plasma Cell Myeloma",
        "__typename": "FileOverview"
      }
    ]
  } */
  
  if (!caseDetail) {
    return <CircularProgress />;
  }
 /* const files = [...data.filesOfCase].map((f) => {
    const customF = { ...f };
    const parentSample = data.samplesByCaseId
      .filter((s) => s.files.map((sf) => sf.uuid).includes(f.uuid));
    if (parentSample && parentSample.length > 0) {
      customF.sample_id = parentSample[0].sample_id;
    }
    return customF;
  }); */

  const notProvided = '';

  const breadCrumbJson = [{
    name: 'ALL PROGRAMS',
    to: '/programs',
    isALink: true,
  }, {
    name: `${caseDetail?.study?.clinical_study_designation} Detail`,
    to: `/study/${caseDetail?.study?.clinical_study_designation}`,
    isALink: true,
  }, {
    name: `${caseDetail?.study?.clinical_study_designation} CASES`,
    to: '/explore',
    isALink: true,
  }, {
    name: caseDetail.case_id,
  }];

  return (
    <ParticipantThemeProvider>
      <StatsView data={stat}/>
      
      <div className={classes.tableContainer}>
        <div className={classes.container}>
          <div className={classes.header}>
            <div className={classes.logo}>
              { getHeaderIcon() }
            </div>
            <div className={classes.headerTitle}>
              <span> Participant ID {'>'} </span> <span className={classes.headerTitleId}>{participant_id}</span> 
            </div>
          </div>


          <div className={classes.detailContainer} style={{border: '1px solid green'}}>

            <Grid container>
              <Grid item className={classes.overview}>111</Grid>
              <Grid container spacing={4} className={classes.marginTopBottom3} style={{bordr: '1px solid red'}}>

                <Grid item lg={3} md={3} sm={12} xs={12} className={classes.detailContainerLeft}>
                  <Grid container spacing={32} direction="column">
                    <Grid item xs={12} pt={100}>
                      <span className={classes.detailContainerHeader}>DEMOGRAPHICS</span>
                    </Grid>

                    <Grid container className={classes.detailContainerItems}>
                      <Grid item xs={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={4}>
                            <span className={classes.title}>BREED</span>
                          </Grid>
                          <Grid item xs={8} className={classes.content}>
                            {caseDetail.demographic ? caseDetail.demographic.breed : notProvided}
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={4}>
                            <span className={classes.title}>Sex</span>
                          </Grid>
                          <Grid item xs={8} className={classes.content}>
                            {caseDetail.demographic ? caseDetail.demographic.sex : notProvided}
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={4}>
                            <span className={classes.title}>Neutered Status</span>
                          </Grid>
                          <Grid item xs={8} className={classes.content}>
                            {caseDetail.demographic
                              ? caseDetail.demographic.neutered_indicator : notProvided}
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={4}>
                            <span className={classes.title}>Weight</span>
                          </Grid>
                          <Grid item xs={8} className={classes.content}>
                            {caseDetail.demographic
                              ? caseDetail.demographic.weight : notProvided}
                          </Grid>
                        </Grid>
                      </Grid>

                      <Grid item xs={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={4}>
                            <span className={classes.title}>Age at Enrollment</span>
                          </Grid>
                          <Grid item xs={8} className={classes.content}>
                            {caseDetail.demographic
                              ? caseDetail.demographic.patient_age_at_enrollment : notProvided}
                          </Grid>
                        </Grid>
                      </Grid>

                    </Grid>
                  </Grid>
                </Grid>

                <Grid item lg={4} md={4} sm={12} xs={12} className={classes.detailContainerRight}>
                  <Grid container spacing={32} direction="column">
                    <Grid item xs={12}>
                      <span className={classes.detailContainerHeader}>DIAGNOSIS</span>
                    </Grid>

                    {caseDetail.diagnoses.map((diagnosis) => (
                      <Grid container className={classes.detailContainerItems}>
                        <Grid item xs={12}>
                          <Grid container spacing={4}>
                            <Grid item xs={6}>
                              <span className={classes.title}>Disease</span>
                            </Grid>
                            <Grid item xs={6} className={classes.content}>
                              {diagnosis.disease_term
                                ? diagnosis.disease_term : notProvided}
                              {' '}
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container spacing={4}>
                            <Grid item xs={6}>
                              <span className={classes.title}>Stage of Disease</span>
                            </Grid>
                            <Grid item xs={6} className={classes.content}>
                              {diagnosis.stage_of_disease
                                ? diagnosis.stage_of_disease : notProvided}
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container spacing={4}>
                            <Grid item xs={6}>
                              <span className={classes.title}>Date of Diagnosis</span>
                            </Grid>
                            <Grid item xs={6} className={classes.content}>
                              {diagnosis.date_of_diagnosis
                                ? diagnosis.date_of_diagnosis : notProvided}
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container spacing={4}>
                            <Grid item xs={6}>
                              <span className={classes.title}>Primary Site</span>
                            </Grid>
                            <Grid item xs={6} className={classes.content}>
                              {diagnosis.primary_disease_site
                                ? diagnosis.primary_disease_site : notProvided}
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container spacing={4}>
                            <Grid item xs={6}>
                              <span className={classes.title}>Histology/Cytology</span>
                            </Grid>
                            <Grid item xs={6} className={classes.content}>
                              {diagnosis.histology_cytopathology
                                ? diagnosis.histology_cytopathology : notProvided}
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container spacing={4}>
                            <Grid item xs={6}>
                              <span className={classes.title}>Histological Grade</span>
                            </Grid>
                            <Grid item xs={6} className={classes.content}>
                              {diagnosis.histological_grade === '' || diagnosis.histological_grade === null
                                ? '' : diagnosis.histological_grade}
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <Grid container spacing={4}>
                            <Grid item xs={6}>
                              <span className={classes.title}>RESPONSE TO TREATMENT</span>
                            </Grid>
                            <Grid item xs={6} className={classes.content}>
                              {diagnosis.best_response === '' || diagnosis.best_response === null
                                ? '' : diagnosis.best_response}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    ))}

                  </Grid>
                </Grid>

                <Grid item lg={5} md={5} sm={12} xs={12} className={classes.detailContainerRight}>
                  <Grid container spacing={32} direction="column">
                    <Grid item xs={12}>
                      <span className={classes.detailContainerHeader}>STUDY</span>
                    </Grid>

                    <Grid container className={classes.detailContainerItems}>
                      <Grid item xs={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={6}>
                            <span className={classes.title}>Assigned to Study</span>
                          </Grid>
                          <Grid item xs={6} className={classes.content}>
                            {caseDetail?.study
                              ? caseDetail?.study?.clinical_study_designation : notProvided}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={6}>
                            <span className={classes.title}>Assigned to Arm</span>
                          </Grid>
                          <Grid item xs={6} className={classes.content}>
                            {caseDetail.cohort
                              ? (caseDetail?.cohort.study_arm
                                ? caseDetail?.cohort.study_arm.arm : notProvided) : notProvided}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={6}>
                            <span className={classes.title}>Assigned to Cohort</span>
                          </Grid>
                          <Grid item xs={6} className={classes.content}>
                            {' '}
                            {caseDetail.cohort
                              ? caseDetail.cohort.cohort_description : notProvided}
                            {' '}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={6}>
                            <span className={classes.title}>Patient Subgroup</span>
                          </Grid>
                          <Grid item xs={6} className={classes.content}>
                            {caseDetail.enrollment
                              ? caseDetail.enrollment.patient_subgroup : notProvided}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={6}>
                            <span className={classes.title}>Date of Informed Consent</span>
                          </Grid>
                          <Grid item xs={6} className={classes.content}>
                            {caseDetail.enrollment
                              ? caseDetail.enrollment.date_of_informed_consent : notProvided}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={4}>
                          <Grid item xs={6}>
                            <span className={classes.title}>Date of registration</span>
                          </Grid>
                          <Grid item xs={6} className={classes.content}>
                            {caseDetail.enrollment
                              ? caseDetail.enrollment.date_of_registration : notProvided}
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <Grid container spacing={4}>

                          <Grid item xs={6}>
                            <span className={classes.title}>Study Site</span>
                          </Grid>
                          <Grid item xs={6} className={classes.content}>
                            {caseDetail.enrollment
                              && caseDetail.enrollment.site_short_name
                              && caseDetail.enrollment.site_short_name !== null
                              ? caseDetail.enrollment.site_short_name : notProvided}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>

          {/*
            <div className={classes.tableDiv}>
              <Grid container>
                <Grid item xs={12} id="table_studies">
                  
                  <TableContextProvider>
                    
                  </TableContextProvider>
                </Grid>
              </Grid>
            </div>
          */}
        </div>

        

        <div id="case_detail_table_associated_samples" className={classes.tableContainer}>
          <div className={classes.tableDiv}>
            <TableContextProvider>
              <SampleTableView data={data.samplesByCaseId} />
            </TableContextProvider>
          </div>
        </div>

      </div>
    </ParticipantThemeProvider>
  );
};

const styles = (theme) => ({
  /////////////////////////////
  overview: {
    width: '100%',
    borderBottom: '1px solid black'
  },
  detailContainer: {
    margin: 'auto',
    paddingLeft: '50px',
    paddingRight: '32px',
    fontFamily: theme.custom.fontFamilySans,
    letterSpacing: '0.014em',
    color: '#000000',
    size: '12px',
    lineHeight: '23px',
  },
  marginTopBottom3: {
    margin: '0px',
  },
  detailContainerLeft: {
    // marginTop: '-3px',
    padding: '28px 0px 0 2px !important',
    minHeight: '290px',
  },
  detailContainerRight: {
    // marginTop: '-3px',
    padding: '28px 20px 10px 20px !important',
    minHeight: '290px',
    borderLeft: '#81a6b9 1px solid',
  },
  detailContainerHeader: {
    textTransform: 'uppercase',
    fontFamily: 'Inter',
    fontWeight: 500,
    fontSize: '18px',
    lineHeight: '100%',
    letterSpacing: '0%',
    color: '#066D93',
    position: 'relative',
  },
  detailContainerItems: {
    paddingTop: '28px',
  },

  title: {
    color: '#004D73',
    fontFamily: 'Roboto',
    fontWeight: 700,
    fontSize: '16px',
    lineHeight: '105%',
    letterSpacing: '-1%',
    textTransform: 'uppercase',
  },
  content: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: '18px',
    lineHeight: '22px',
    letterSpacing: '0%',

  },


  /////////////////////////////
  tableContainer: {
    background: 'white',
    paddingBottom: '80px',
  },
  container: {
    paddingTop: '28px',
    fontFamily: 'Raleway, sans-serif',
    paddingLeft: '32px',
    paddingRight: '32px',
    maxWidth: '1800px',
    margin: "0 auto",
  },
  header: {
    height: '118px',
    paddingLeft: '35px',
    paddingTop: '31px',
    borderBottom: '#106856 12px solid',
    margin: 'auto',
    position: 'relative',
  },
  logo: {
    float: 'left',
    marginTop:'-76px',
    marginLeft: '-68px',
    position: 'absolute',

    width: '94px',
  },
  headerTitle: {
    float: 'left',
    top: '41px',
    left: '130px',
    position: 'absolute',

    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '26px',
    color: '#274FA6',
    paddingLeft: '3px',
    lineHeight: '31px',
    letterSpacing: '-2%',
  },
  headerTitleId: {
    fontWeight: 600,
  },
  tableDiv: {
    margin: 'auto',
    fontSize: '10pt',
    fontFamily: '"Open Sans", sans-serif',
    letterSpacing: '0.025em',
    textAlign: 'left',
  },
});

export default withStyles(styles, { withTheme: true })(ParticipantView);
