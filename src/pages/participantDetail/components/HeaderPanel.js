import React from 'react';
import CustomBreadcrumb from '../../../components/Breadcrumb/BreadcrumbView';
import { headerIcon } from '../../../bento/participantDetailData';

const InfoRow = ({ classes, label, value }) => (
  <div className={classes.infoPanelRow}>
    <span className={classes.infoPanelLabel}>{label}:</span>
    <span className={classes.infoPanelValue}>{value != null && value !== '' ? value : 'N/A'}</span>
  </div>
);

const HeaderPanel = ({ classes, participant }) => {
  const breadCrumbJson = [
    {
      name: 'ALL STUDIES',
      to: '/studies',
      isALink: true,
    },
    {
      name: participant.study_short_name ? `${participant.study_short_name} DETAIL` : 'STUDY DETAIL',
      to: participant.study_id ? `/study/${participant.study_id}` : '',
      isALink: !!participant.study_id,
    },
    {
      name: participant.participant_id,
      to: '',
      isALink: false,
    },
  ];

  return (
    <>
      {/* ---- Breadcrumb ---- */}
      <div className={classes.breadCrumb}>
        <CustomBreadcrumb separator=">" data={breadCrumbJson} />
      </div>

      {/* ---- Page header ---- */}
      <div className={classes.header}>
        <div className={classes.logo}>
          <img src={headerIcon} alt="Participant detail header icon" />
        </div>
        <div className={classes.headerTitle}>
          <div className={classes.headerMainTitle}>
            <span>
              Participant ID&nbsp;{'>'}
              <span className={classes.headerMainSubTitle}>
                {participant.participant_id}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* ---- Info panel: Demographics | Diagnosis | Therapy ---- */}
      <div className={classes.infoPanelContainer}>
        {/* Demographics */}
        <div className={classes.infoPanelSection}>
          <div className={classes.infoPanelSectionTitle}>Demographics</div>
          <InfoRow classes={classes} label="Age at Enrollment" value={participant.age_at_enrollment} />
          <InfoRow classes={classes} label="Race" value={participant.race} />
          <InfoRow classes={classes} label="Ethnicity" value={participant.ethnicity} />
          <InfoRow classes={classes} label="Sex" value={participant.sex} />
          <InfoRow classes={classes} label="Survival Status" value={participant.survival_status} />
        </div>

        {/* Diagnosis */}
        <div className={classes.infoPanelSection}>
          <div className={classes.infoPanelSectionTitle}>Diagnosis</div>
          <InfoRow classes={classes} label="Primary Diagnosis" value={participant.primary_diagnosis_disease_group} />
          <InfoRow classes={classes} label="Primary Disease Site" value={participant.primary_disease_site} />
          <InfoRow classes={classes} label="Stage of Disease" value={participant.stage_of_disease} />
        </div>

        {/* Therapy */}
        <div className={classes.infoPanelSection}>
          <div className={classes.infoPanelSectionTitle}>THERAPY</div>
          <InfoRow classes={classes} label="Therapy Name" value={participant.therapy_name} />
          <InfoRow classes={classes} label="Therapy Type" value={participant.therapy_type} />
          <InfoRow classes={classes} label="Therapy Category" value={participant.therapy_category} />
          <InfoRow classes={classes} label="Current Response" value={participant.current_response_to_therapy} />
          <InfoRow classes={classes} label="Best Response" value={participant.best_response_to_therapy} />
        </div>
      </div>
    </>
  );
};

export default HeaderPanel;
