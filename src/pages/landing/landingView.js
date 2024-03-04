import React from 'react';
import {
  Grid,
  withStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import imgAbout from '../../assets/landing/About-image.jpg';
import imgStudy from '../../assets/landing/Studies-image.jpg';
import imgAccess from '../../assets/landing/RequestAccess-LP.jpg';
import icon from '../../assets/landing/LP_ReadMore.svg';
import iconAbout from '../../assets/landing/LP_About_Fullarticle.Arrow.svg';
import texturebg from '../../assets/landing/BackgroundTexture-LP.jpg';
import l9dg from '../../assets/landing/Cases-LP.jpg';
import herobg800 from '../../assets/landing/heroGraphic/heroGraphic800.png';
import herobg1000 from '../../assets/landing/heroGraphic/heroGraphic1000.png';
import herobg1200 from '../../assets/landing/heroGraphic/heroGraphic1200.png';
import herobg1400 from '../../assets/landing/heroGraphic/heroGraphic1400.png';
import herobg1600 from '../../assets/landing/heroGraphic/heroGraphic1600.png';
import herobg1800 from '../../assets/landing/heroGraphic/heroGraphic1800.png';
import herobg2000 from '../../assets/landing/heroGraphic/heroGraphic2000.png';
import InteractiveHero from '../../components/InteractiveHero/InteractiveHero';

const LandingController = ({ classes, heroData }) => (
  <div className={classes.page}>
    <div className={classes.container}>
      <div className={classes.hero}>
        <Grid container spacing={16} direction="row">
          <div className={classes.heroImage} />
          <InteractiveHero heroData={heroData} />
        </Grid>
      </div>
    </div>
    <div className={classes.container}>
      <Grid container spacing={16} direction="row" className={classes.bannerTextureContainer}>
        <div className={classes.bannerTexture}>
        FUELING DISCOVERY: HARNESSING THE POWER OF DATA FROM CANCER STUDIES
        </div>
      </Grid>
      <Grid container spacing={16} direction="row" className={classes.bannerTextureContainer}>
        <div className={classes.redButtonSection}>
          <Link to="/explore" className={classes.redButton}>Explore</Link>
        </div>
      </Grid>
    </div>
    <div className={classes.container}>
      <div className={classes.texture}>
        <Grid container spacing={16} direction="row" className={classes.landingContainer}>
          <div className={classes.mainLanding}>
            <div className={classes.contentRightTop}>
              <div className={classes.aboutContainer}>
                <Link to='/purpose' className={classes.link}>
                  <div className={classes.CTDCHeader}>
                  ABOUT THE CLINICAL AND TRANSLATIONAL DATA COMMONS <span className={classes.CTDCWords}>(CTDC)</span>
                  </div>
                  <div className={classes.aboutContent}>
                  The Clinical and Translational Data Commons (CTDC) aims to accelerate scientific discovery and medical advancements through the power of clinical data. The CTDC empowers cancer researchers with comprehensive, diverse, and high-quality data collected from NCI-sponsored cancer clinical studies. The CTDC is part of NCI’s Cancer Research Data Commons (CRDC).
                  </div>
                </Link>
              </div>
            </div>
            <div className={classes.contentRightBottom}>
              <div className={classes.program}>
                <div className={classes.programImg}>
                  <img className={classes.image} src={imgStudy} alt="CTDC Studies" />
                </div>
                <div className={classes.content}>
                  <div className={classes.contentHeader}> Studies</div>
                  <div className={classes.contentContainer}>
                    View summaries of clinical studies within CTDC
                  </div>

                </div>
                <div className={classes.blueButton}>
                  <div className={classes.blueButtonLeft}>
                    <img className={classes.icon} src={icon} alt="CTDC Studies" />
                    {' '}
                  </div>
                  <div className={classes.blueButtonRight}>
                    <Link to="/study/NCT04314401" className={classes.blueButton}>GO TO STUDY LISTING</Link>
                  </div>
                </div>
              </div>
              <div className={classes.studies}>
                <div className={classes.programImg}>
                  <img className={classes.image} src={imgAccess} alt="CTDC Request ACCESS " />
                </div>
                <div className={classes.content}>
                  <div className={classes.contentHeader}> EXPLORE DATA</div>
                  <div className={classes.contentContainer}>
                  Search and explore study data
                  </div>

                </div>
                <div className={classes.blueButton}>
                  <div className={classes.blueButtonLeft}>
                    <img className={classes.icon} src={icon} alt="CTDC about " />
                    {' '}
                  </div>
                  <div className={classes.blueButtonRight}>
                    <Link to="/explore" className={classes.blueButton}>START THE PROCESS</Link>
                  </div>
                </div>
              </div>

            </div>
            
          </div>
        </Grid>
      </div>

    </div>
  </div>
);
const styles = () => ({
  heroImage: {
    width: '100%',
    height: '600px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    background: `url(${herobg800})`,
    '@media (min-width: 1000px)': {
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
      background: `url(${herobg1000})`,
    },
    '@media (min-width: 1200px)': {
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
      background: `url(${herobg1200})`,
    },
    '@media (min-width: 1400px)': {
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
      background: `url(${herobg1400})`,
    },
    '@media (min-width: 1600px)': {
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
      background: `url(${herobg1600})`,
    },
    '@media (min-width: 1800px)': {
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
      background: `url(${herobg1800})`,
    },
    '@media (min-width: 2000px)': {
      backgroundRepeat: 'no-repeat',
      backgroundSize: '100% 100%',
      background: `url(${herobg2000})`,
    },
  },
  texture: {
    backgroundSize: 'cover',
    backgroundImage: `url(${texturebg})`,
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    padding: '120px 0 80px 0',
  },
  container: {
    fontFamily: 'Raleway, sans-serif',
    margin: '0 auto',
  },
  bannerTexture: {
    color: '#4898B4',
    fontFamily: 'Raleway',
    fontSize: '19px',
    fontWeight: '600',
    lineHeight: '60px',
    textAlign: 'center',
    margin: '0 auto',
    letterSpacing: '0.050pt',
    textTransform: 'uppercase',
    width: '869px',
  },
  redButtonSection: {
    margin: '0 auto -15px auto',
    background: '#C53B27',
    width: '179px',
    height: '47px',
    borderRadius: '50px',
    textAlign: 'center',
  },
  redButton: {
    height: '13px',
    color: '#FFFFFF',
    fontFamily: 'Raleway',
    fontSize: '16px',
    fontWeight: 'bold',
    lineHeight: '47px',
    textAlign: 'center',
    textDecoration: 'none',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  iconAbout: {
    height: '17px',
    width: '9px',
    marginTop: '15px',
    marginLeft: '20px',
  },
  icon: {
    width: '20px',
    marginTop: '13px',
    marginLeft: '23px',
  },
  mainLanding: {
    maxWidth: '596px'
  },
  aboutImage: {
    width: '300px',
    padding: '14px',
  },
  CTDCHeader: {
    height: '87px',
    background: '#067CA5',
    color: '#FFFFFF',
    fontSize: '26px',
    fontWeight: '400',
    textTransform: 'uppercase',
    lineHeight: '27px',
    padding: '30px 20px 30px 20px',
    fontFamily: 'Oswald',
    textAlign: 'center',
  },
  CTDCWords: {
    fontWeight: '300',
    fontSize: '24px',
  },
  landingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: '15px',
  },
  about: {
    width: '300px',
    backgroundColor: '#20506A',
  },
  image: {
    width: '293px',
    height: '251px',
  },
  aboutContent: {
    background: '#004D73',
    padding: '30px 20px 32px 20px',
    color: '#fff',
<<<<<<< Updated upstream
    fontFamily: '"Open Sans"',
    fontSize: '14px',
    lineHeight: '22px',
=======
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '24px',
>>>>>>> Stashed changes
    textAlign: 'center',
  },
  link: {
    textDecoration: 'none',
  },
  content: {
    width: '100%',
    background: '#fff',
    paddingLeft: '30px',
    minHeight: '116px',
  },
  contentHeader: {
    color: '#20506A',
    fontFamily: 'Oswald',
    fontSize: '26px',
    fontWeight: '500',
    lineHeight: '27px',
    padding: '10px 0',
    textTransform: 'uppercase',
  },
  contentContainer: {
    width: '215px',
    color: '#010101',
    fontFamily: 'Lato',
    fontSize: '15px',
    lineHeight: '22px',
    paddingLeft: '2px',
    paddingBottom: '10px',
  },

  program: {
    float: 'left',
    padding: '0 10px 8px 0px',
  },
  programImg: {
    background: '#fff',
  },
  studies: {
    float: 'left',
  },
  aboutContainer: {
    paddingBottom: '10px',
  },
  blueButton: {
    height: '45px',
    background: '#5396AA',
    color: '#FFFFFF',
    fontFamily: 'Raleway',
    fontSize: '12px',
    fontWeight: '600',
    lineHeight: '25px',
    paddingLeft: '8px',
    textDecoration: 'none',
  },
  blueButtonLeft: {
    float: 'left',
  },
  blueButtonRight: {
    float: 'left',
    lineHeight: '47px',
    color: '#fff',
    textTransform: 'uppercase',
  },
  bannerTextureContainer: {
    paddingTop: '30px',
  },
});
export default withStyles(styles, { withTheme: true })(LandingController);
