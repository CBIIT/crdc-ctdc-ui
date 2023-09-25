/* eslint-disable */
import gql from 'graphql-tag';
import { cellTypes } from '@bento-core/table';
import { customCasesTabDownloadCSV, customFilesTabDownloadCSV, customSamplesTabDownloadCSV } from './tableDownloadCSV';
import { dataFormatTypes } from '@bento-core/table';

// --------------- Tooltip configuration --------------
export const tooltipContent = {
  icon: 'https://raw.githubusercontent.com/google/material-design-icons/master/src/action/help/materialicons/24px.svg',
  alt: 'tooltipIcon',
  0: 'Click button to Add Associated Files associated with the selected Participant(s).',
  1: 'Click button to Add Associated Files associated with the selected Biospecimen(s).',
  2: 'Click button to Add Associated Files.',
  Participants: 'Click button to Add Associated Files associated with the selected Participant(s).',
  Samples: 'Click button to Add Associated Files associated with the selected Biospecimen(s).',
  Files: 'Click button to Add Associated Files.',
  arrow: true,
  styles: {
    border: '#03A383 1px solid',
  }
};

// --------------- Dahboard Table external link configuration --------------
// Ideal size for externalLinkIcon is 16x16 px
export const externalLinkIcon = {
  src: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/bento/images/icons/svgs/externalLinkIcon.svg',
  alt: 'External link icon',
};


// --------------- Tabs Header Data configuration --------------
export const tabs = [
  {
    id: 'participants_tab',
    title: 'Participants',
    dataField: 'dataCase',
    count: 'numberOfParticipants',
  },
  {
    id: 'biospecimens_tab',
    title: 'Biospecimens',
    dataField: 'dataSample',
    count: 'numberOfSamples',
  },
  {
    id: 'file_tab',
    title: 'Files',
    dataField: 'dataFile',
    count: 'numberOfFiles',
  },
];

// --------------- Tabs Header Style configuration --------------
export const tabIndex = [
  {
    title: 'Cases',
    primaryColor: '#D6F2EA',
    secondaryColor: '#FFDFB8',
    selectedColor: '#10A075',
  },
  {
    title: 'Samples',
    primaryColor: '#CFEDF9',
    secondaryColor: '#C9F1F1',
    selectedColor: '#0DAFEC',
  },
  {
    title: 'Files',
    primaryColor: '#F7D7F7',
    secondaryColor: '#86D6F0',
    selectedColor: '#C92EC7',
  },
];

/*
    $subject_ids: [String],
    $ctep_disease_code: [String], // Diagnosis
    $snomed_disease_code: [String], // Stage of Disease
    $tumor_grade: [String], // Tumor Grade
    $sex: [String], // Sex
    $reported_gender: [String], // Gender
    $race: [String], // Race
    $ethnicity: [String], // Ethnicity
    $carcinogen_exposure: [String], // Exposures
    $targeted_therapy: [String], // Targeted Therapy
    $anatomical_collection_site: [String], // Anatomical Collection Site
    $specimen_type: [String], // Biospecimen Type
    $tissue_category: [String], // Tissue Category
    $assessment_timepoint: [String], // Collection Timepoint
    $data_file_type: [String], // File Type
    $data_file_format: [String] // File Format
*/
// Main Query used to populate Facet, Widget components
export const DASHBOARD_QUERY_NEW = gql`
  query search (          
    $subject_ids: [String],
    $ctep_disease_code: [String],
    $snomed_disease_code: [String],
    $tumor_grade: [String],
    $sex: [String],
    $reported_gender: [String],
    $race: [String],
    $ethnicity: [String],
    $carcinogen_exposure: [String],
    $targeted_therapy: [String],
    $anatomical_collection_site: [String],
    $specimen_type: [String],
    $tissue_category: [String],
    $assessment_timepoint: [String],
    $data_file_type: [String],
    $data_file_format: [String]
  ){
      searchSubjects (          
        subject_ids: $subject_ids,
        ctep_disease_code: $ctep_disease_code,
        snomed_disease_code: $snomed_disease_code,
        tumor_grade: $tumor_grade,
        sex: $sex,
        reported_gender: $reported_gender,
        race: $race,
        ethnicity: $ethnicity,
        carcinogen_exposure: $carcinogen_exposure,
        targeted_therapy: $targeted_therapy,
        anatomical_collection_site: $anatomical_collection_site,
        specimen_type: $specimen_type,
        tissue_category: $tissue_category,
        assessment_timepoint: $assessment_timepoint,
        data_file_type: $data_file_type,
        data_file_format: $data_file_format
      ) {
        numberOfTrials
        numberOfParticipants
        numberOfDiagnoses
        numberOfTargetedTherapies
        numberOfBiospecimens
        numberOfFiles
        armsByPrograms {
          program
          caseSize
          children {
            arm
            caseSize
            size
          }
        }
        diagnosesAndStageOfDiseases {
          ctepDiseaseCode
          caseSize
          children {
            snomedDiseaseCode
            caseSize
            size
          }
        }
        sexesAndGenders {
          sex
          caseSize 
          children {
            reportedGender
            caseSize
            size
          }
        }
        racesAndEthnicities {
          race 
          caseSize
          children {
            ethnicity 
            caseSize
            size
          }
        }
        timepointsAndBiospecimensTypes {
          assessmentTimepoint
          caseSize
          children {
            biospecimensType
            caseSize
            size
          }
        }
        participantCountByDiagnosis {
          group
          subjects
        }
        filterParticipantCountByDiagnosis {
          group
          subjects
        }

        participantCountByStageOfDisease {
          group
          subjects
        }
        filterParticipantCountByStageOfDisease {
          group
          subjects
        }

        participantCountByTumorGrade {
          group
          subjects
        }
        filterParticipantCountByTumorGrade {
          group
          subjects
        }

        participantCountBySex {
          group
          subjects
        }
        filterParticipantCountBySex {
          group
          subjects
        }

        participantCountByGender {
          group
          subjects
        }
        filterParticipantCountByGender {
          group
          subjects
        }

        participantCountByRace {
          group
          subjects
        }
        filterParticipantCountByRace {
          group
          subjects
        }

        participantCountByEthnicity {
          group
          subjects
        }
        filterParticipantCountByEthnicity {
          group
          subjects
        }

        participantCountByExposures {
          group
          subjects
        }
        filterParticipantCountByExposures {
          group
          subjects
        }

        participantCountByTargetedTherapy {
          group
          subjects
        }
        filterParticipantCountByTargetedTherapy {
          group
          subjects
        }

        participantCountByAnatomicalCollectionSite {
          group
          subjects
        }
        filterParticipantCountByAnatomicalCollectionSite {
          group
          subjects
        }

        participantCountByBiospecimenType {
          group
          subjects
        }
        filterParticipantCountByBiospecimenType {
          group
          subjects
        }

        participantCountByTissueCategory {
          group
          subjects
        }
        filterParticipantCountByTissueCategory {
          group
          subjects
        }

        participantCountByCollectionTimepoint {
          group
          subjects
        }
        filterParticipantCountByCollectionTimepoint {
          group
          subjects
        }

        participantCountByDataFileType {
          group
          subjects
        }
        filterParticipantCountByDataFileType {
          group
          subjects
        }

        participantCountByFileFormat {
          group
          subjects
        }
        filterParticipantCountByFileFormat {
          group
          subjects
        }
      }
  }
`;

export const GET_PARTICIPANTS_OVERVIEW_QUERY = gql`
  query participantOverview(
    $subject_ids: [String],
    $ctep_disease_code: [String],
    $snomed_disease_code: [String],
    $tumor_grade: [String],
    $age_at_diagnosis: [String],
    $sex: [String],
    $reported_gender: [String] ,
    $race: [String],
    $ethnicity: [String],
    $carcinogen_exposure: [String],
    $targeted_therapy: [String],
    $first: Int, 
    $offset: Int, 
    $order_by: String,
    $sort_direction: String
  ){
    participantOverview(
      subject_ids: $subject_ids,
      ctep_disease_code: $ctep_disease_code,
      snomed_disease_code: $snomed_disease_code,
      tumor_grade: $tumor_grade,
      age_at_diagnosis: $age_at_diagnosis,
      sex: $sex,
      reported_gender: $reported_gender,
      race: $race,
      ethnicity: $ethnicity,
      carcinogen_exposure: $carcinogen_exposure,
      targeted_therapy: $targeted_therapy,
      first: $first, 
      offset: $offset, 
      order_by: $order_by,
      sort_direction: $sort_direction
    ) {
      subject_id,
      ctep_disease_code,
      snomed_disease_code,
      tumor_grade,
      age_at_diagnosis,
      sex,
      reported_gender,
      race,
      ethnicity,
      carcinogen_exposure,
      targeted_therapy
    }
  }
`;

export const GET_BIOSPECIMENS_OVERVIEW_QUERY = gql`
  query biospecimenOverview(
    $subject_ids: [String],
    $ctep_disease_code: [String],
    $snomed_disease_code: [String],
    $primary_disease_site: [String],
    $specimen_id: [String],
    $parent_specimen_id: [String],
    $anatomical_collection_site: [String], 
    $specimen_type: [String],
    $tissue_category: [String],
    $assessment_timepoint: [String],
    $first: Int, 
    $offset: Int, 
    $order_by: String,
    $sort_direction: String
  ){
    biospecimenOverview(
      subject_ids: $subject_ids,
      ctep_disease_code: $ctep_disease_code,
      snomed_disease_code: $snomed_disease_code,
      primary_disease_site: $primary_disease_site,
      specimen_id: $specimen_id,
      parent_specimen_id: $parent_specimen_id,
      anatomical_collection_site: $anatomical_collection_site,
      specimen_type: $specimen_type,
      tissue_category: $tissue_category,
      assessment_timepoint: $assessment_timepoint,
      first: $first, 
      offset: $offset, 
      order_by: $order_by,
      sort_direction: $sort_direction
    ) {
      subject_id,
      ctep_disease_code,
      snomed_disease_code,
      primary_disease_site,
      specimen_id,
      parent_specimen_id,
      anatomical_collection_site,
      specimen_type,
      tissue_category,
      assessment_timepoint
    }
  }
`;
export const GET_FILES_OVERVIEW_QUERY = gql`
  query fileOverview(
    $subject_ids: [String],
    $data_file_names: [String],
    $data_file_formats: [String],
    $data_file_types: [String],
    $data_file_sizes: [String],
    $associations: [String],
    $data_file_descriptions: [String],
    $specimen_ids: [String],
    $ctep_disease_codes: [String],
    $first: Int, 
    $offset: Int, 
    $order_by: String,
    $sort_direction: String
    ){
      fileOverview(
        subject_ids: $subject_ids,
        data_file_names: $data_file_names,
        data_file_formats: $data_file_formats,
        data_file_types: $data_file_types,
        data_file_sizes: $data_file_sizes,
        associations: $associations,
        data_file_descriptions: $data_file_descriptions,
        specimen_ids: $specimen_ids,
        ctep_disease_codes: $ctep_disease_codes,
        first: $first, 
        offset: $offset, 
        order_by: $order_by,
        sort_direction: $sort_direction
    ) {
        subject_id,
        data_file_name,
        data_file_format,
        data_file_type,
        data_file_size,
        association,
        data_file_description,
        specimen_id,
        ctep_disease_code
    }
}
`;

// Original DASHBOARD_QUERY_NEW for reference
export const ORIGINAL_DASHBOARD_QUERY_NEW = gql`
query search (          
    $subject_ids: [String],
    $programs: [String] ,
    $studies: [String] ,
    $diagnoses: [String] ,
    $rc_scores: [String] ,
    $tumor_sizes: [String] ,
    $chemo_regimen: [String] ,
    $tumor_grades: [String] ,
    $er_status: [String] ,
    $pr_status: [String] ,
    $endo_therapies: [String] ,
    $meno_status: [String] ,
    $tissue_type: [String],
    $composition: [String],
    $association: [String],
    $file_type: [String],
    $age_at_index: [Float]
){
    searchSubjects (          
        subject_ids: $subject_ids,
        programs: $programs,
        studies: $studies,
        diagnoses: $diagnoses,
        rc_scores: $rc_scores,
        tumor_sizes: $tumor_sizes,
        chemo_regimen: $chemo_regimen,
        tumor_grades: $tumor_grades,
        er_status: $er_status,
        pr_status: $pr_status,
        endo_therapies: $endo_therapies,
        meno_status: $meno_status,
        tissue_type: $tissue_type,
        composition: $composition,
        association: $association,       
        file_type: $file_type,
        age_at_index: $age_at_index
    ) {
        numberOfPrograms
        numberOfStudies
        numberOfSubjects
        numberOfSamples
        numberOfLabProcedures
        numberOfFiles
        armsByPrograms {
            program
            caseSize
            children {
                arm
                caseSize
                size
            }
        }
        subjectCountByProgram {
            group
            subjects
        }
        subjectCountByStudy {
            group
            subjects
        }
        subjectCountByDiagnoses {
            group
            subjects
        }
        subjectCountByRecurrenceScore {
            group
            subjects
        }
        subjectCountByTumorSize {
            group
            subjects
        }
        subjectCountByChemotherapyRegimen {
            group
            subjects
        }
        subjectCountByEndocrineTherapy {
            group
            subjects
        }
        subjectCountByTumorGrade{
            group
            subjects
        }
        subjectCountByErStatus{
            group
            subjects
        }
        subjectCountByPrStatus{
            group
            subjects
        }
        subjectCountByMenopauseStatus{
            group
            subjects
        }
        subjectCountByFileType {
            group
            subjects
        }
        subjectCountByFileAssociation {
            group
            subjects
        }
        subjectCountByTissueComposition {
            group
            subjects
        }
        subjectCountByTissueType {
            group
            subjects
        }
        filterSubjectCountByProgram {
            group
            subjects
        }
        filterSubjectCountByStudy{
            group
            subjects
        }
        filterSubjectCountByDiagnoses{
            group
            subjects
        }
        filterSubjectCountByRecurrenceScore{
            group
            subjects
        }
        filterSubjectCountByTumorSize{
            group
            subjects
        }
        filterSubjectCountByTumorGrade{
            group
            subjects
        }
        filterSubjectCountByErStatus{
            group
            subjects
        }
        filterSubjectCountByPrStatus{
            group
            subjects
        }
        filterSubjectCountByChemotherapyRegimen{
            group
            subjects
        }
        filterSubjectCountByEndocrineTherapy{
            group
            subjects
        }
        filterSubjectCountByMenopauseStatus{
            group
            subjects
        }
        filterSubjectCountByTissueType{
            group
            subjects
        }
        filterSubjectCountByTissueComposition{
            group
            subjects
        }
        filterSubjectCountByFileAssociation{
            group
            subjects
        }
        filterSubjectCountByFileType{
            group
            subjects
        }
        filterSubjectCountByAge{
            lowerBound
            upperBound
            subjects
        }
    }
}
`;

// Unused Query
export const DASHBOARD_QUERY = gql`
    query search (          
      $programs: [String] ,
      $studies: [String] ,
      $diagnoses: [String] ,
      $rc_scores: [String] ,
      $tumor_sizes: [String] ,
      $chemo_regimen: [String] ,
      $tumor_grades: [String] ,
      $er_status: [String] ,
      $pr_status: [String] ,
      $endo_therapies: [String] ,
      $meno_status: [String] ,
      $tissue_type: [String],
      $composition: [String],
      $association: [String],
      $file_type: [String],
      $age_at_index: [Float]
  ){
      searchSubjects (          
          programs: $programs,
          studies: $studies,
          diagnoses: $diagnoses,
          rc_scores: $rc_scores,
          tumor_sizes: $tumor_sizes,
          chemo_regimen: $chemo_regimen,
          tumor_grades: $tumor_grades,
          er_status: $er_status,
          pr_status: $pr_status,
          endo_therapies: $endo_therapies,
          meno_status: $meno_status,
          tissue_type: $tissue_type,
          composition: $composition,
          association: $association,       
          file_type: $file_type,
          age_at_index: $age_at_index
      ) {
          numberOfPrograms
          numberOfStudies
          numberOfSubjects
          numberOfSamples
          numberOfLabProcedures
          numberOfFiles
          armsByPrograms {
              program
              caseSize
              children {
                  arm
                  caseSize
                  size
              }
  
          }
  
      subjectCountByProgram {
              group
              subjects
          }
          subjectCountByStudy {
              group
              subjects
          }
          subjectCountByDiagnoses {
              group
              subjects
          }
          subjectCountByRecurrenceScore {
              group
              subjects
          }
          subjectCountByTumorSize {
              group
              subjects
          }
          subjectCountByChemotherapyRegimen {
              group
              subjects
          }
          subjectCountByEndocrineTherapy {
              group
              subjects
          }
          subjectCountByTumorGrade{
              group
              subjects
          }
          subjectCountByErStatus{
              group
              subjects
          }
          subjectCountByPrStatus{
              group
              subjects
          }
          subjectCountByMenopauseStatus{
              group
              subjects
          }
          subjectCountByFileType {
              group
              subjects
          }
          subjectCountByFileAssociation {
              group
              subjects
          }
          subjectCountByTissueComposition {
              group
              subjects
          }
          subjectCountByTissueType {
              group
              subjects
          }
  
          filterSubjectCountByProgram {
              group
              subjects
          }
          filterSubjectCountByStudy{
              group
              subjects
          }
          filterSubjectCountByDiagnoses{
              group
              subjects
          }
          filterSubjectCountByRecurrenceScore{
              group
              subjects
          }
          filterSubjectCountByTumorSize{
              group
              subjects
          }
          filterSubjectCountByTumorGrade{
              group
              subjects
          }
          filterSubjectCountByErStatus{
              group
              subjects
          }
          filterSubjectCountByPrStatus{
              group
              subjects
          }
          filterSubjectCountByChemotherapyRegimen{
              group
              subjects
          }
          filterSubjectCountByEndocrineTherapy{
              group
              subjects
          }
          filterSubjectCountByMenopauseStatus{
              group
              subjects
          }
          filterSubjectCountByTissueType{
              group
              subjects
          }
          filterSubjectCountByTissueComposition{
              group
              subjects
          }
          filterSubjectCountByFileAssociation{
              group
              subjects
          }
          filterSubjectCountByFileType{
              group
              subjects
          }
          filterSubjectCountByAge{
            lowerBound
            upperBound
            subjects
        }
  
      }
  }
  
   `;

// Unused Query
export const FILTER_GROUP_QUERY = gql`
  query groupCounts($subject_ids: [String]){
   armsByPrograms(subject_ids: $subject_ids) {
     program
     caseSize
     children {
         arm
         caseSize
         size
     }
 }
 subjectCountByDiagnoses (subject_ids: $subject_ids){
  group
  subjects
}
subjectCountByRecurrenceScore (subject_ids: $subject_ids){
  group
  subjects
}
subjectCountByTumorSize(subject_ids: $subject_ids) {
  group
  subjects
}
subjectCountByChemotherapyRegimen(subject_ids: $subject_ids) {
  group
  subjects
}
subjectCountByEndocrineTherapy (subject_ids: $subject_ids){
  group
  subjects
}
   
}
 `;

// Unused Query
export const FILTER_QUERY = gql`
query search (          
  $programs: [String] ,
  $studies: [String] ,
  $diagnoses: [String] ,
  $rc_scores: [String] ,
  $tumor_sizes: [String] ,
  $chemo_regimen: [String] ,
  $tumor_grades: [String] ,
  $er_status: [String] ,
  $pr_status: [String] ,
  $endo_therapies: [String] ,
  $meno_status: [String] ,
  $tissue_type: [String],
  $composition: [String],
  $association: [String],
  $file_type: [String],
  $age_at_index: [Float]
){
  searchSubjects (          
      programs: $programs,
      studies: $studies,
      diagnoses: $diagnoses,
      rc_scores: $rc_scores,
      tumor_sizes: $tumor_sizes,
      chemo_regimen: $chemo_regimen,
      tumor_grades: $tumor_grades,
      er_status: $er_status,
      pr_status: $pr_status,
      endo_therapies: $endo_therapies,
      meno_status: $meno_status,
      tissue_type: $tissue_type,
      composition: $composition,
      association: $association,       
      file_type: $file_type,
      age_at_index: $age_at_index
  ) {
      numberOfPrograms
      numberOfStudies
      numberOfSubjects
      numberOfSamples
      numberOfLabProcedures
      numberOfFiles
      armsByPrograms {
          program
          caseSize
          children {
              arm
              caseSize
              size
          }

      }

  subjectCountByProgram {
          group
          subjects
      }
      subjectCountByStudy {
          group
          subjects
      }
      subjectCountByDiagnoses {
          group
          subjects
      }
      subjectCountByRecurrenceScore {
          group
          subjects
      }
      subjectCountByTumorSize {
          group
          subjects
      }
      subjectCountByChemotherapyRegimen {
          group
          subjects
      }
      subjectCountByEndocrineTherapy {
          group
          subjects
      }
      subjectCountByTumorGrade{
          group
          subjects
      }
      subjectCountByErStatus{
          group
          subjects
      }
      subjectCountByPrStatus{
          group
          subjects
      }
      subjectCountByMenopauseStatus{
          group
          subjects
      }
      subjectCountByFileType {
          group
          subjects
      }
      subjectCountByFileAssociation {
          group
          subjects
      }
      subjectCountByTissueComposition {
          group
          subjects
      }
      subjectCountByTissueType {
          group
          subjects
      }

      filterSubjectCountByProgram {
          group
          subjects
      }
      filterSubjectCountByStudy{
          group
          subjects
      }
      filterSubjectCountByDiagnoses{
          group
          subjects
      }
      filterSubjectCountByRecurrenceScore{
          group
          subjects
      }
      filterSubjectCountByTumorSize{
          group
          subjects
      }
      filterSubjectCountByTumorGrade{
          group
          subjects
      }
      filterSubjectCountByErStatus{
          group
          subjects
      }
      filterSubjectCountByPrStatus{
          group
          subjects
      }
      filterSubjectCountByChemotherapyRegimen{
          group
          subjects
      }
      filterSubjectCountByEndocrineTherapy{
          group
          subjects
      }
      filterSubjectCountByMenopauseStatus{
          group
          subjects
      }
      filterSubjectCountByTissueType{
          group
          subjects
      }
      filterSubjectCountByTissueComposition{
          group
          subjects
      }
      filterSubjectCountByFileAssociation{
          group
          subjects
      }
      filterSubjectCountByFileType{
          group
          subjects
      }
      filterSubjectCountByAge{
        lowerBound
        upperBound
        subjects
      }

  }
}
`;

// Query for Tab - Files Table
export const GET_FILES_OVERVIEW_QUERY_ORIGINAL = gql`
query fileOverview(
    $subject_ids: [String],
    $file_ids: [String],
    $programs: [String] ,
    $studies: [String] ,
    $diagnoses: [String] ,
    $rc_scores: [String] ,
    $tumor_sizes: [String] ,
    $chemo_regimen: [String] ,
    $tumor_grades: [String] ,
    $er_status: [String] ,
    $pr_status: [String] ,
    $endo_therapies: [String] ,
    $meno_status: [String] ,
    $tissue_type: [String],
    $composition: [String],
    $association: [String],
    $file_type: [String],
    $age_at_index: [Float],
    $first: Int, 
    $offset: Int, 
    $order_by:  String
    $sort_direction: String ){
    fileOverview(
        subject_ids: $subject_ids,
        file_ids: $file_ids,
        programs: $programs,
        studies: $studies,
        diagnoses: $diagnoses,
        rc_scores: $rc_scores,
        tumor_sizes: $tumor_sizes,
        chemo_regimen: $chemo_regimen,
        tumor_grades: $tumor_grades,
        er_status: $er_status,
        pr_status: $pr_status,
        endo_therapies: $endo_therapies,
        meno_status: $meno_status,
        tissue_type: $tissue_type,
        composition: $composition,
        association: $association,       
        file_type: $file_type,
        age_at_index: $age_at_index,
        first: $first, 
        offset: $offset, 
        order_by: $order_by,
        sort_direction: $sort_direction
    ){
        file_id,
        program_id,
        file_name,
        association,
        file_description,
        file_format,
        file_size,
        program,
        arm,
        acl,
        subject_id,
        sample_id,
        diagnosis,
    }
}
`;

// Query for Tab - Samples Table
export const GET_SAMPLES_OVERVIEW_QUERY = gql`
query sampleOverview(
    $subject_ids: [String],
    $sample_ids: [String],
    $programs: [String] ,
    $studies: [String] ,
    $diagnoses: [String] ,
    $rc_scores: [String] ,
    $tumor_sizes: [String] ,
    $chemo_regimen: [String] ,
    $tumor_grades: [String] ,
    $er_status: [String] ,
    $pr_status: [String] ,
    $endo_therapies: [String] ,
    $meno_status: [String] ,
    $tissue_type: [String],
    $composition: [String],
    $association: [String],
    $file_type: [String],
    $age_at_index: [Float],
    $first: Int, 
    $offset: Int, 
    $order_by:  String
    $sort_direction: String ){
    sampleOverview(
        subject_ids: $subject_ids,
        sample_ids: $sample_ids,
        programs: $programs,
        studies: $studies,
        diagnoses: $diagnoses,
        rc_scores: $rc_scores,
        tumor_sizes: $tumor_sizes,
        chemo_regimen: $chemo_regimen,
        tumor_grades: $tumor_grades,
        er_status: $er_status,
        pr_status: $pr_status,
        endo_therapies: $endo_therapies,
        meno_status: $meno_status,
        tissue_type: $tissue_type,
        composition: $composition,
        association: $association,       
        file_type: $file_type,
        age_at_index: $age_at_index,
        first: $first, 
        offset: $offset, 
        order_by: $order_by,
        sort_direction: $sort_direction
    ){
        sample_id,
        subject_id,
        program,
        program_id,
        arm,
        diagnosis,
        tissue_type,
        tissue_composition,
        sample_anatomic_site,
        sample_procurement_method,
        platform,
        files 
    }
}
`;

// Query for Tab - Cases Table
export const GET_CASES_OVERVIEW_QUERY = gql`
query subjectOverview(
    $subject_ids: [String],
    $programs: [String] ,
    $studies: [String] ,
    $diagnoses: [String] ,
    $rc_scores: [String] ,
    $tumor_sizes: [String] ,
    $chemo_regimen: [String] ,
    $tumor_grades: [String] ,
    $er_status: [String] ,
    $pr_status: [String] ,
    $endo_therapies: [String] ,
    $meno_status: [String] ,
    $tissue_type: [String],
    $composition: [String],
    $association: [String],
    $file_type: [String],
    $age_at_index: [Float],
    $first: Int, 
    $offset: Int, 
    $order_by:  String
    $sort_direction: String ){
    subjectOverview(
        subject_ids: $subject_ids,
        programs: $programs,
        studies: $studies,
        diagnoses: $diagnoses,
        rc_scores: $rc_scores,
        tumor_sizes: $tumor_sizes,
        chemo_regimen: $chemo_regimen,
        tumor_grades: $tumor_grades,
        er_status: $er_status,
        pr_status: $pr_status,
        endo_therapies: $endo_therapies,
        meno_status: $meno_status,
        tissue_type: $tissue_type,
        composition: $composition,
        association: $association,       
        file_type: $file_type,
        age_at_index: $age_at_index,
        first: $first, 
        offset: $offset, 
        order_by: $order_by,
        sort_direction: $sort_direction
        
        ) {
        subject_id
        program
        program_id
        study_acronym
        study_short_description
        study_info
        diagnosis
        recurrence_score
        tumor_size
        tumor_grade
        er_status
        pr_status
        chemotherapy
        endocrine_therapy
        menopause_status
        age_at_index
        survival_time
        survival_time_unit
        files
        lab_procedures
        samples
    }
}
`;

// --------------- GraphQL Query - Add Associated Files under Cases table to Cart ---------------
export const GET_ALL_FILEIDS_CASESTAB_FOR_SELECT_ALL = gql`
query search (          
  $subject_ids: [String],
){
  fileIDsFromList (          
      subject_ids: $subject_ids,
  ) 
}
  `;

// --------------- GraphQL Query - Add Associated Files under Samples table to Cart ---------------
export const GET_ALL_FILEIDS_SAMPLESTAB_FOR_SELECT_ALL = gql`
query search (          
  $sample_ids: [String],
){
  fileIDsFromList (          
    sample_ids: $sample_ids,
  ) 
}
  `;

// --------------- GraphQL Query - Add Associated Files under Files table to Cart ---------------
export const GET_ALL_FILEIDS_FILESTAB_FOR_SELECT_ALL = gql`
query search (          
  $file_names: [String] 
){
  fileIDsFromList (          
      file_names: $file_names
  ) 
}
  `;

// --------------- GraphQL Query - Add all files under Cases table to Cart ---------------
export const GET_ALL_FILEIDS_FROM_CASESTAB_FOR_ADD_ALL_CART = gql`
query subjectsAddAllToCart(
  $subject_ids: [String],
  $programs: [String] ,
  $studies: [String] ,
  $diagnoses: [String] ,
  $rc_scores: [String] ,
  $tumor_sizes: [String] ,
  $chemo_regimen: [String] ,
  $tumor_grades: [String] ,
  $er_status: [String] ,
  $pr_status: [String] ,
  $endo_therapies: [String] ,
  $meno_status: [String] ,
  $tissue_type: [String],
  $composition: [String],
  $association: [String],
  $file_type: [String],
  $age_at_index: [Float],
  $first: Int,
  $offset: Int= 0, 
  $order_by: String = "file_id",
  $sort_direction: String = "asc" 
  ){
  subjectOverview(
      subject_ids: $subject_ids,
      programs: $programs,
      studies: $studies,
      diagnoses: $diagnoses,
      rc_scores: $rc_scores,
      tumor_sizes: $tumor_sizes,
      chemo_regimen: $chemo_regimen,
      tumor_grades: $tumor_grades,
      er_status: $er_status,
      pr_status: $pr_status,
      endo_therapies: $endo_therapies,
      meno_status: $meno_status,
      tissue_type: $tissue_type,
      composition: $composition,
      association: $association,
      file_type: $file_type,
      age_at_index: $age_at_index,
      first: $first,
      offset: $offset,
      order_by: $order_by,
      sort_direction: $sort_direction
      ) {
      files
  }
}
    `;

// --------------- GraphQL Query - Add all files under Samples table to Cart ---------------
export const GET_ALL_FILEIDS_FROM_SAMPLETAB_FOR_ADD_ALL_CART = gql`
    query samplesAddAllToCart(
      $subject_ids: [String],
      $sample_ids: [String],
      $programs: [String] ,
      $studies: [String] ,
      $diagnoses: [String] ,
      $rc_scores: [String] ,
      $tumor_sizes: [String] ,
      $chemo_regimen: [String] ,
      $tumor_grades: [String] ,
      $er_status: [String] ,
      $pr_status: [String] ,
      $endo_therapies: [String] ,
      $meno_status: [String] ,
      $tissue_type: [String],
      $composition: [String],
      $association: [String],
      $file_type: [String],
      $age_at_index: [Float],
      $first: Int,
      $offset: Int= 0, 
      $order_by: String = "file_id",
      $sort_direction: String = "asc" ){
      sampleOverview(
          subject_ids: $subject_ids,
          sample_ids: $sample_ids,
          programs: $programs,
          studies: $studies,
          diagnoses: $diagnoses,
          rc_scores: $rc_scores,
          tumor_sizes: $tumor_sizes,
          chemo_regimen: $chemo_regimen,
          tumor_grades: $tumor_grades,
          er_status: $er_status,
          pr_status: $pr_status,
          endo_therapies: $endo_therapies,
          meno_status: $meno_status,
          tissue_type: $tissue_type,
          composition: $composition,
          association: $association,
          file_type: $file_type,
          age_at_index: $age_at_index,
          first: $first,
          offset: $offset,
          order_by: $order_by,
          sort_direction: $sort_direction
          ) {
          files
      }
    }
        `;

// --------------- GraphQL Query - Add all files under Files table to Cart ---------------
export const GET_ALL_FILEIDS_FROM_FILESTAB_FOR_ADD_ALL_CART = gql`
query fileAddAllToCart(
  $subject_ids: [String],
  $programs: [String] ,
  $studies: [String] ,
  $diagnoses: [String] ,
  $rc_scores: [String] ,
  $tumor_sizes: [String] ,
  $chemo_regimen: [String] ,
  $tumor_grades: [String] ,
  $er_status: [String] ,
  $pr_status: [String] ,
  $endo_therapies: [String] ,
  $meno_status: [String] ,
  $tissue_type: [String],
  $composition: [String],
  $association: [String],
  $file_type: [String],
  $age_at_index: [Float],
  $first: Int,
  $offset: Int= 0, 
  $order_by: String = "file_id",
  $sort_direction: String = "asc"
 ){
  fileOverview(
      subject_ids:$subject_ids,
      programs: $programs,
      studies: $studies,
      diagnoses: $diagnoses,
      rc_scores: $rc_scores,
      tumor_sizes: $tumor_sizes,
      chemo_regimen: $chemo_regimen,
      tumor_grades: $tumor_grades,
      er_status: $er_status,
      pr_status: $pr_status,
      endo_therapies: $endo_therapies,
      meno_status: $meno_status,
      tissue_type: $tissue_type,
      composition: $composition,
      association: $association,       
      file_type: $file_type,
      age_at_index: $age_at_index,
      first: $first, 
      offset: $offset, 
      order_by: $order_by,
      sort_direction: $sort_direction
  ){
      file_id,
  }
}
            `;

// --------------- GraphQL query - Retrieve files tab details --------------
export const GET_FILES_NAME_QUERY = gql`
query fileOverview($file_ids: [String], $offset: Int = 0, $first: Int = 100000, $order_by:String ="file_name"){
  fileOverview(file_ids: $file_ids, offset: $offset,first: $first, order_by: $order_by) {
    file_name
  }
}
  `;

export const GET_FILE_IDS_FROM_FILE_NAME = gql`
  query (
      $file_name: [String],
      $offset: Int,
      $first: Int,
      $order_by: String
  )
  {
      fileIdsFromFileNameDesc(
          file_name:$file_name, 
          offset:$offset,
          first:$first,
          order_by:$order_by
      )
      {
          file_id
      }
  }`;

// --------------- Tabs Table configuration --------------
export const tabContainers = [
  {
    name: 'Participants',
    dataField: 'dataCase',
    api: GET_PARTICIPANTS_OVERVIEW_QUERY,
    paginationAPIField: 'participantOverview',
    count: 'numberOfParticipants',
    dataKey: 'subject_id',
    defaultSortField: 'subject_id',
    defaultSortDirection: 'asc',
    buttonText: 'Add Associated Files',
    tableID: 'participants_tab_table',
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: "View Columns"
      },
      download: {
        downloadCsv: "Download Table Contents As CSV"
      },
    },
    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'subject_id',
        header: 'Participant ID',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'ctep_disease_code',
        header: 'Diagnosis',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'snomed_disease_code',
        header: 'Stage of Disease',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'tumor_grade',
        header: 'Tumor Grade',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'age_at_diagnosis',
        header: 'Age',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'sex',
        header: 'Sex',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'reported_gender',
        header: 'Gender',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'race',
        header: 'Race',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'ethnicity',
        header: 'Ethnicity',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'carcinogen_exposure',
        header: 'Carcinogen Exposure',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'targeted_therapy',
        header: 'Targeted Therapy',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
    ],
    id: 'participants_tab',
    tableID: 'participants_tab_table',
    tableDownloadCSV: customCasesTabDownloadCSV,
    tabIndex: '0',
    downloadFileName: 'Bento_Dashboard_cases_download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
    addFilesRequestVariableKey: 'subject_ids',
    addFilesResponseKeys: ['fileIDsFromList'],
    addAllFilesResponseKeys: ['subjectOverview', 'files'],
    addAllFileQuery: GET_ALL_FILEIDS_FROM_CASESTAB_FOR_ADD_ALL_CART,
    addSelectedFilesQuery: GET_ALL_FILEIDS_CASESTAB_FOR_SELECT_ALL,
  },
  {
    name: 'Biospecimens',
    dataField: 'dataSample',
    api: GET_BIOSPECIMENS_OVERVIEW_QUERY,
    count: 'numberOfBiospecimens',
    paginationAPIField: 'biospecimenOverview',
    dataKey: 'specimen_id',
    defaultSortField: 'specimen_id',
    defaultSortDirection: 'asc',
    tableID: 'biospecimens_tab_table',
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: "View Columns"
      },
      download: {
        downloadCsv: "Download Table Contents As CSV"
      },
    },
    saveButtonDefaultStyle: {
      color: '#fff',
      backgroundColor: '#00AEEF',
      opacity: '1',
      border: '0px',
      cursor: 'pointer',
    },
    DeactiveSaveButtonDefaultStyle: {
      opacity: '0.3',
      cursor: 'auto',
    },
    ActiveSaveButtonDefaultStyle: {
      cursor: 'pointer',
      opacity: 'unset',
      border: 'unset',
    },

    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'subject_id',
        header: 'Participant ID',
        cellType: cellTypes.LINK,
        linkAttr : {
          rootPath: '/participant',
          pathParams: ['subject_id'],
        },
        display: true,
        tooltipText: 'sort',
      },
      {
        dataField: 'ctep_disease_code',
        header: 'Diagnosis',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'snomed_disease_code',
        header: 'Stage of Disease',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'primary_disease_site',
        header: 'Primary Site',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'specimen_id',
        header: 'Biospecimen ID',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'parent_specimen_id',
        header: 'Parent Biospecimen ID',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'anatomical_collection_site',
        header: 'Anatomical Collection Site',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'specimen_type',
        header: 'Biospecimen Type',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'tissue_category',
        header: 'Tissue Category',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'assessment_timepoint',
        header: 'Collection Timepoint',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
    ],
    id: 'biospecimens_tab',
    tableID: 'biospecimens_tab_table',
    tabIndex: '1',
    tableDownloadCSV: customSamplesTabDownloadCSV,
    downloadFileName: 'Bento_Dashboard_cases_download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
    addFilesRequestVariableKey: 'specimen_ids',
    addFilesResponseKeys: ['fileIDsFromList'],
    addAllFilesResponseKeys: ['sampleOverview', 'files'],
    addAllFileQuery: GET_ALL_FILEIDS_FROM_SAMPLETAB_FOR_ADD_ALL_CART,
    addSelectedFilesQuery: GET_ALL_FILEIDS_SAMPLESTAB_FOR_SELECT_ALL,
  },
  {
    name: 'Files',
    dataField: 'dataFile',
    api: GET_FILES_OVERVIEW_QUERY,
    paginationAPIField: 'fileOverview',
    defaultSortField: 'data_file_name',
    defaultSortDirection: 'asc',
    count: 'numberOfFiles',
    dataKey: 'data_file_name',
    tableID: 'file_tab_table',
    extendedViewConfig: {
      pagination: true,
      manageViewColumns: {
        title: "View Columns"
      },
      download: {
        downloadCsv: "Download Table Contents As CSV"
      },
    },
    columns: [
      {
        cellType: cellTypes.CHECKBOX,
        display: true,
        role: cellTypes.CHECKBOX,
      },
      {
        dataField: 'data_file_name',
        header: 'File Name',
        display: true,
        tooltipText: 'sort',
      },
      {
        dataField: 'data_file_format',
        header: 'Format',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'data_file_type',
        header: 'File Type',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'data_file_size',
        header: 'Size',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'association',
        header: 'Association',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'data_file_description',
        header: 'Description',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'specimen_id',
        header: 'Biospecimen ID',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'subject_id',
        header: 'Participant ID',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
      {
        dataField: 'ctep_disease_code',
        header: 'Diagnosis',
        display: true,
        tooltipText: 'sort',
        role: cellTypes.DISPLAY,
      },
    ],
    id: 'file_tab',
    tableID: 'file_tab_table',
    selectableRows: true,
    tableDownloadCSV: customFilesTabDownloadCSV,
    downloadFileName: 'Bento_Dashboard_cases_download',
    tableMsg: {
      noMatch: 'No Matching Records Found',
    },
    addFilesRequestVariableKey: 'data_file_name',
    addFilesResponseKeys: ['fileIDsFromList'],
    addAllFilesResponseKeys: ['fileOverview', 'file_id'],
    addAllFileQuery: GET_ALL_FILEIDS_FROM_FILESTAB_FOR_ADD_ALL_CART,
    addSelectedFilesQuery: GET_ALL_FILEIDS_FILESTAB_FOR_SELECT_ALL,
  },
];

  