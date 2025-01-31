import React from 'react';
import { withStyles } from '@material-ui/core';
import HorseShoe from './HorseShoe';
import ActiveParticpants from '../../assets/landing/animation/PARTICIPANTS_Active.png';
import InActiveParticpants from '../../assets/landing/animation/PARTICIPANTS_InActive.png';
import ActiveDiagnoses from '../../assets/landing/animation/Diagnoses_Active.png';
import InActiveDiagnoses from '../../assets/landing/animation/Diagnoses_InActive.png';
import ActiveTHERAPIES from '../../assets/landing/animation/THERAPIES_Active.png';
import InActiveTHERAPIES from '../../assets/landing/animation/THERAPIES_InActive.png';
import ActiveReports from '../../assets/landing/animation/Reports_Active.png';
import InActiveReports from '../../assets/landing/animation/Reports_InActive.png';

import WhispInActive from '../../assets/landing/animation/Whisp-All_Active.png';
import CircularIcon from './CircularIcon';
import Circle1 from '../../assets/landing/animation/circle1.png';
import Circle2 from '../../assets/landing/animation/circle2.png';
import Circle3 from '../../assets/landing/animation/circle3.png';
import Circle4 from '../../assets/landing/animation/circle4.png';


const ParticipantsInActiveText = ({ classes, heroData }) => (
  <div className={classes.inActiveTextBG}>
    <div className={classes.whiteTextInactive}>
      {' '}
      {/* {heroData ? heroData.numberOfParticipants : 'NA'} */}
      {/* code to Add count to the inactive view  */}
      {' '}

      PARTICIPANTS
    </div>
  </div>
);

const ParticipantsActiveText = ({ classes, heroData }) => (
  <div className={classes.activeTextBG}>
    <div>
      {heroData ? heroData.numberOfParticipants : 'NA'}
      {' '}
      PARTICIPANTS
    </div>
    {/* <div className={classes.blueText}>
      {' '}
      {heroData ? heroData.numberOfParticipants : 'NA'}
      {' '}
      PARTICIPANTS
    </div> */}
  </div>
);

const DiagnosesInActiveText = ({ classes, heroData }) => (
  <div className={classes.inActiveTextBG}>
    <div className={classes.whiteTextInactive}>
      
      {/* code to Add count to the inactive view  */}
      DIAGNOSES
    </div>
  </div>
);

const DiagnosesActiveText = ({ classes, heroData }) => {
  const diagnosisData = heroData.specimenCountbyStageOfDisease;

  return (
    <div className={classes.inActiveTextBG}>
      <div className={classes.whiteText}>
      {heroData ? heroData.numberOfDiagnoses : 'NA'}
      {' '}
        DIAGNOSES
      </div>
      {diagnosisData[5] ? (
      <div className={classes.blueText}>
        {diagnosisData[5].subjects}
        {' '}
        {diagnosisData[5].group}
      </div>):""
      }
      
       {diagnosisData[1] ? (
      <div className={classes.blueText}>
        {diagnosisData[1].subjects}
        {' '}
        {diagnosisData[1].group}
      </div>):""
      }
       {diagnosisData[2] ? (
      <div className={classes.blueText}>
        {diagnosisData[2].subjects}
        {' '}
        {diagnosisData[2].group}
      </div>):""
      }

      
    </div>
  );
};

const TherapiesInActiveText = ({ classes, heroData }) => (
  <div className={classes.inActiveTextBG}>
    <div className={classes.whiteTextInactive}>
      TARGETED THERAPIES
    </div>
  </div>
);

const TherapiesActiveText = ({ classes, heroData }) => (
  <div className={classes.activeTextBG}>
    <div>
    {heroData ? heroData.numberOfTargeted : 'NA'}
    {' '}
    TARGETED THERAPIES
    </div>
    <div className={classes.blueText}>
    </div>
  </div>
);


const FilesInActiveText = ({ classes, heroData }) => (
  <div className={classes.inActiveTextBG}>
    <div className={classes.whiteTextInactive}>
      {/* {heroData ? heroData.dataFileCount : 'NA'} */}
      {/* code to Add count to the inactive view  */}
      {' '}
      FILES
    </div>
  </div>
);
const FilesActiveText = ({ classes, heroData }) => {
  const FileData = heroData.dataFileByType;

  return (
    <div className={classes.inActiveTextBG}>
      <div className={classes.whiteText}>
        {heroData ? heroData.dataFileCount : 'NA'}
        {' '}
        FILES
      </div>
      {FileData[0] ? (
      <div className={classes.blueText}>
        {FileData[0].subjects}
        {' '}
        {FileData[0].group}
      </div>):""
      }
      
       {FileData[1] ? (
      <div className={classes.blueText}>
        {FileData[1].subjects}
        {' '}
        {FileData[1].group}
      </div>):""
      }
       {FileData[2] ? (
      <div className={classes.blueText}>
        {FileData[2].subjects}
        {' '}
        {FileData[2].group}
      </div>):""
      }
    </div>
  );
};


const InteractiveHero = ({ classes, heroData }) => {
  const [activeState, setActiveState] = React.useState({
    isActive: '',
    transformedHorseShoe: Circle1,
  });
  return (
    <div className={classes.animationWrapper}>
      <div className={classes.participantsIcon} onMouseEnter={() => { setActiveState({ isActive: 'Participants', transformedHorseShoe: Circle1 }); }} onMouseLeave={() => { setActiveState({ isActive: '', transformedHorseShoe: Circle1 }); }}>
        <CircularIcon isActive={activeState.isActive === 'Participants'} InactiveImage={InActiveParticpants} activeImage={ActiveParticpants} />
      </div>
     
        {activeState.isActive === 'Participants' ? 
        ( <div className={classes.participantsActiveText}>
            <ParticipantsActiveText heroData={heroData} classes={classes} /> 
             </div>)
        : (<div className={classes.participantsText}>
            <ParticipantsInActiveText heroData={heroData} classes={classes} />
           </div>)}
     
      <HorseShoe transformedHorseShoe={activeState.transformedHorseShoe} />
      <div className={classes.diagnosesIcon} onMouseEnter={() => { setActiveState({ isActive: 'Diagnoses', transformedHorseShoe: Circle2 }); }} onMouseLeave={() => { setActiveState({ isActive: '', transformedHorseShoe: Circle2 }); }}>
        <CircularIcon isActive={activeState.isActive === 'Diagnoses'} InactiveImage={InActiveDiagnoses} activeImage={ActiveDiagnoses} />
      </div>
      
        {activeState.isActive === 'Diagnoses' ? (
          <div className={classes.diagnosesActiveText}>
            <DiagnosesActiveText heroData={heroData} classes={classes} />
          </div>)  : (
           <div className={classes.diagnosesText}>
            <DiagnosesInActiveText heroData={heroData} classes={classes} />
            </div>)
        }
      <div className={classes.therapiesIcon} onMouseEnter={() => { setActiveState({ isActive: 'Therapies', transformedHorseShoe: Circle3 }); }} onMouseLeave={() => { setActiveState({ isActive: '', transformedHorseShoe: Circle3 }); }}>
        <CircularIcon isActive={activeState.isActive === 'Therapies'} InactiveImage={InActiveTHERAPIES} activeImage={ActiveTHERAPIES} />
      </div>
     
        {activeState.isActive === 'Therapies' ?(
           <div className={classes.therapiesActiveText}>
              <TherapiesActiveText heroData={heroData} classes={classes} />
              </div>)
               : (
                 <div className={classes.therapiesText}>
                  <TherapiesInActiveText heroData={heroData} classes={classes} />
                  </div>)
             }
       <div className={classes.reportsIcon} onMouseEnter={() => { setActiveState({ isActive: 'Reports', transformedHorseShoe: Circle4 }); }} onMouseLeave={() => { setActiveState({ isActive: '', transformedHorseShoe: Circle4 }); }}>
        <CircularIcon isActive={activeState.isActive === 'Reports'} InactiveImage={InActiveReports} activeImage={ActiveReports} />
      </div>
      
        {activeState.isActive === 'Reports' ? (
          <div className={classes.FilesActiveText}>
            <FilesActiveText heroData={heroData} classes={classes} /> 
            </div>): (
            <div className={classes.reportsText}>
              <FilesInActiveText heroData={heroData} classes={classes} />
              </div>)}
    </div>
  );
};

const styles = () => ({
  animationWrapper: {
    left: '0px',
    position: 'absolute',
    '@media (min-width: 800px)': {
      left: 'calc(50%)',
    },
    '@media (min-width: 1200px)': {
      left: 'calc(60%)',
    },
    '@media (min-width: 1600px)': {
      left: 'calc(70%)',
    },
  },
  participantsIcon: {
    left: '76px',
    float: 'left',
    width: 86,
    position: 'absolute',
    marginTop: 50,
  },
  participantsText: {
    position: 'absolute',
    float: 'left',
    marginTop: '80px',
    left: '170px',
    width: '150px',
    color: '#FEFFFF',
    fontFamily: 'Oswald',
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: 0,
    textAlign: 'center',
  },
  participantsActiveText: {
    position: 'absolute',
    float: 'left',
    marginTop: '80px',
    left: '180px',
    width: '150px',
    color: '#FEFFFF',
    fontFamily: 'Oswald',
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: 0,
    textAlign: 'center',
  },
  diagnosesIcon: {
    left: '255px',
    position: 'absolute',
    float: 'left',
    marginTop: '180px',
  },
  diagnosesText: {
    position: 'absolute',
    float: 'left',
    marginTop: '215px',
    left: '340px',
    width: '150px',
    color: '#FFFFFF',
    fontFamily: 'Oswald',
    fontSize: 16,
    fontWeight: 500,
  },
  diagnosesActiveText: {
    position: 'absolute',
    float: 'left',
    marginTop: '185px',
    left: '340px',
    width: '150px',
    color: '#FFFFFF',
    fontFamily: 'Oswald',
    fontSize: 16,
    fontWeight: 500,
  },
  therapiesIcon :{
    left: '252px',
    position: 'absolute',
    float: 'left',
    marginTop: '335px',
  },
  therapiesText :{
    position: 'absolute',
    float: 'left',
    marginTop: '373px',
    left: '345px',
    width: '150px',
    color: '#FFFFFF',
    fontFamily: 'Oswald',
    fontSize: 16,
    fontWeight: 500,
  },
  therapiesActiveText :{
    position: 'absolute',
    float: 'left',
    marginTop: '373px',
    left: '385px',
    width: '150px',
    color: '#FFFFFF',
    fontFamily: 'Oswald',
    fontSize: 18,
    fontWeight: 500,
  },
  reportsIcon: {
    marginTop: '435px',
    position: 'absolute',
    float: 'left',
    left: '75px',
  },
  reportsText: {
    position: 'absolute',
    float: 'left',
    marginTop: '470px',
    left: '142px',
    width: '200px',
    color: '#FFFFFF',
    fontFamily: 'Oswald',
    fontSize: 16,
    fontWeight: 500,
  },
  FilesActiveText: {
    position: 'absolute',
    float: 'left',
    marginTop: '447px',
    left: '162px',
    width: '250px',
    color: '#FFFFFF',
    fontFamily: 'Oswald',
    fontSize: 16,
    fontWeight: 500,
  },
  hide: {
    display: 'none',
  },
  whiteText: {
    color: '#FEFFFF',
    fontFamily: 'Oswald',
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 0,
    textAlign: 'left',
    marginLeft: '29px',
  },
  whiteSmallText: {
    color: '#FEFFFF',
    fontFamily: 'Oswald',
    fontSize: 12,
    fontWeight: 500,
    letterSpacing: 0,
    textAlign: 'center',
  },
  whiteTextInactive: {
    color: '#FEFFFF',
    fontFamily: 'Oswald',
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: 0,
    textAlign: 'center',
  },
  blueText: {
    color: '#A8DAF1',
    fontFamily: 'Oswald',
    fontSize: 14,
    fontWeight: 500,
    letterSpacing: 0,
    textAlign: 'left',
    marginLeft: '28px',
  },
  inActiveTextBG: {
    background: `url(${WhispInActive})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
  activeTextBG: {
    background: `url(${WhispInActive})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    paddingTop: '10px',
    paddingBottom: '10px',
  },
});

export default withStyles(styles)(InteractiveHero);
