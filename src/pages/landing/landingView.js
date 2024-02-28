import React from 'react';
import {
  Grid,
  withStyles,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import imgStudy from '../../assets/landing/Studies-image.jpg';
import imgAccess from '../../assets/landing/RequestAccess-LP.jpg';
import icon from '../../assets/landing/LP_ReadMore.svg';
import texturebg from '../../assets/landing/BackgroundTexture-LP.jpg';
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
        <h1 className={classes.bannerTexture}>
          FUELING DISCOVERY: HARNESSING THE POWER OF DATA FROM CANCER STUDIES
        </h1>
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
                  <h2 className={classes.CTDCHeader}>
                    ABOUT THE CLINICAL AND TRANSLATIONAL DATA COMMONS&nbsp;&nbsp;(CTDC)
                  </h2>
                  <div className={classes.aboutContent}>
                  The Clinical and Translational Data Commons (CTDC) aims to accelerate scientific discovery and medical advancements through the power of clinical data. The CTDC empowers cancer researchers with comprehensive, diverse, and high-quality data collected from NCI-sponsored cancer clinical studies. The CTDC is part of NCI’s Cancer Research Data Commons (CRDC).
                  </div>
                </Link>
              </div>
            </div>
            <div className={classes.contentRightBottom}>
              <div className={classes.program}>
                <div className={classes.programImg}>
                  <img className={classes.image} src={imgStudy} alt="CTDC Studies page" />
                </div>
                <div className={classes.content}>
                  <h2 className={classes.contentHeader}>Studies</h2>
                  <p className={classes.contentContainer}>
                    View summaries of clinical studies within CTDC
                  </p>
                </div>
                <div className={classes.blueButton}>
                  <div className={classes.blueButtonLeft}>
                    <img className={classes.icon} src={icon} alt="Page Icon" />
                    {' '}
                  </div>
                  <div className={classes.blueButtonRight}>
                    <Link to="/study/NCT04314401" className={classes.blueButton}>GO TO STUDY LISTING</Link>
                  </div>
                </div>
              </div>
              <div className={classes.studies}>
                <div className={classes.programImg}>
                  <img className={classes.image} src={imgAccess} alt="CTDC Dashboard page" />
                </div>
                <div className={classes.content}>
                  <h2 className={classes.contentHeader}>EXPLORE DATA</h2>
                  <p className={classes.contentContainer}>
                    Search and explore study data
                  </p>
                </div>
                <div className={classes.blueButton}>
                  <div className={classes.blueButtonLeft}>
                    <img className={classes.icon} src={icon} alt="Page Icon" />
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
    padding: '81px 0 105px 0',
  },
  container: {
    fontFamily: 'Raleway, sans-serif',
    margin: '0 auto',
  },
  bannerTexture: {
    color: '#004D73',
    fontFamily: 'Inter',
    fontSize: '26px',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: '31px',
    textAlign: 'center',
    
    margin: '0 auto',
  },
  redButtonSection: {
    margin: 'auto auto -15px auto',
    padding: '10px 35px',
    background: '#C33B27',
    width: '130px',
    height: '34px',
    borderRadius: '10px',
    textAlign: 'center',
  },
  redButton: {
    display: 'block',
    height: '14px',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '14px',
    textAlign: 'center',
    textDecoration: 'none',
    textTransform: 'uppercase',
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
    maxWidth: '684px' // 684
  },
  aboutImage: {
    width: '300px',
    padding: '14px',
  },
  CTDCHeader: {
    margin: '0px auto',
    height: '87px',
    background: '#067CA5',
    color: '#FFFFFF',
    fontSize: '25px',
    fontWeight: 400,
    textTransform: 'uppercase',
    lineHeight: '27px',
    padding: '30px 20px',
    fontFamily: 'Oswald',
    textAlign: 'center',
    letterSpacing: '0em',
  },
  CTDCWords: {
    marginLeft: '2px',
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
    width: '337px',
    height: '251px',
  },
  aboutContent: {
    height: '132px',
    background: '#004D73',
    padding: '30px 20px',
    color: '#fff',
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '24px',
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
    margin: '0px',
    color: '#004D73',
    fontFamily: 'Oswald',
    fontSize: '26px',
    fontWeight: 400,
    lineHeight: '27px',
    padding: '10px 0',
    textTransform: 'uppercase',
  },
  contentContainer: {
    margin: '0px',
    width: '277px',
    color: '#010101',
    fontFamily: 'Nunito Sans',
    fontSize: '16px',
    lineHeight: '25px',
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
    background: '#067CA5',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
    fontSize: '14px',
    fontWeight: 500,
    lineHeight: '14px',
    paddingLeft: '8px',
    textDecoration: 'none',
  },
  blueButtonLeft: {
    float: 'left',
  },
  blueButtonRight: {
    float: 'left',
    lineHeight: '47px',
    textTransform: 'uppercase',
  },
  bannerTextureContainer: {
    paddingTop: '43px',
  },
});
export default withStyles(styles, { withTheme: true })(LandingController);
