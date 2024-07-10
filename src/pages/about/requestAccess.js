import React from 'react';
import { Grid, Link, withStyles } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AboutHeader from './aboutHeader';
import Stats from '../../components/Stats/AllStatsController';
import followImg from './assets/design_flow.png';
import externalIconImage from './assets/externalLinkIcon.svg';
import { useGlobal } from '../../components/Global/GlobalProvider';

const RAView = ({ classes }) => {
  // Close alert once user navigate into Request Access from Explore or Studies pages
  const { Notification } = useGlobal();
  Notification.close();

  return (
    <>
      <Stats />
      <AboutHeader title={"Request Access"} />
      <div className={classes.container}>
        <Grid container spacing={16} direction="row" className={classes.aboutSection}>
              <Grid item lg={3} md={3} sm={12} xs={12} className={classes.imageSection}>
                 <img className={classes.followGraph} src={"https://raw.githubusercontent.com/CBIIT/datacommons-assets/ctdc_Assets/ctdc/images/aboutPages/About_RequestAccess.png"} alt="follow graph" />
            
              </Grid>
              <Grid item lg={9} md={9} sm={12} xs={12} className={classes.contentSection}>
                <div className={classes.header}>
                    Data within the CTDC follow a tiered-data access model as follows:
                </div>
                <div className={classes.text}>
                 <div className={classes.title}>
                    Public access data 
                </div>
                   <div className={classes.content}>
                  Public tier datasets contain de-identified aggregated data available to the public without the need for account registration or data access approval. 
                  </div>
                </div>
                <div className={classes.text}>
                 <div className={classes.title}>
                Registered access data 
                </div>
                <div className={classes.content}>
                 Registered tier datasets may contain some individual-level data or data under collaborative agreements that require users to register for access and agree to certain terms of use prior to access. Terms of use vary by study. 
                </div>
                </div>
                <div className={classes.text}>
                   <div className={classes.title}>
                      Controlled access data  
                  </div>
                  <div className={classes.content}>
                      Controlled data within the CTDC include genomic and other potentially sensitive Personal Identifiable Information (PII). To protect the privacy of individuals who have contributed data to clinical studies, researchers who want to access controlled data must register for an{' '} 
                      <Link
                              title="NIH eRA Commons"
                              target='_blank'
                              rel="noreferrer"
                              href="https://public.era.nih.gov/commonsplus/public/login.era?TARGET=https%3A%2F%2Fpublic.era.nih.gov%3A443%2Fcommons"
                              color="inherit"
                              className={classes.link}
                            >
                              NIH eRA Commons
                            </Link>
                            <img
                                  src={externalIconImage}
                                  // externalIconImage: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/common/images/logos/svgs/externalLinkIcon.svg',
                                  alt="outbounnd web site icon"
                                  className={classes.linkIcon}
                                />
                       {' '}account and apply for data access authorization through the{' '}
                           <Link
                              title=" NIH database of Genotypes and Phenotypes "
                              target='_blank'
                              rel="noreferrer"
                              href=" https://dbgap.ncbi.nlm.nih.gov/aa/wga.cgi?page=login"
                              color="inherit"
                              className={classes.link}
                            >
                               NIH database of Genotypes and Phenotypes 
                            </Link>
                            <img
                                  src={externalIconImage}
                                  // externalIconImage: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/common/images/logos/svgs/externalLinkIcon.svg',
                                  alt="outbounnd web site icon"
                                  className={classes.linkIcon}
                                />
                                
                        (dbGaP). See instructions below for how to access controlled data. 
                   </div>
                 </div>

                 <img className={classes.followGraph} src={followImg} alt="follow graph" />


                <div className={classes.text}>
                  <div className={classes.title}>
                    Accessing controlled data in the CTDC
                  </div>

                  <div className={classes.content}>
                             <div className={classes.expansionPanel}>
                <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Obtain an NIH eRA Commons account</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                   <div className={classes.panelDetails}>
                     <ul>
                        <li>
                          <Link
                              title="eRA Commons Frequently Asked Questions (FAQs)"
                              target='_blank'
                              rel="noreferrer"
                              href="https://www.era.nih.gov/faqs.htm"
                              color="inherit"
                              className={classes.link}
                            >
                              eRA Commons Frequently Asked Questions (FAQs)
                            </Link>
                            <img
                                  src={externalIconImage}
                                  // externalIconImage: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/common/images/logos/svgs/externalLinkIcon.svg',
                                  alt="outbounnd web site icon"
                                  className={classes.linkIcon}
                                />
                        </li>
                        <li>
                          <Link
                              title="eRA Help and Tutorials"
                              target='_blank'
                              rel="noreferrer"
                              href="https://www.era.nih.gov/help-tutorials"
                              color="inherit"
                              className={classes.link}
                            >
                                   eRA Help and Tutorials
                            </Link>
                            <img
                                  src={externalIconImage}
                                  // externalIconImage: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/common/images/logos/svgs/externalLinkIcon.svg',
                                  alt="outbounnd web site icon"
                                  className={classes.linkIcon}
                                />
                        </li>
                        <li>

                        <Link
                              title="Helpdesk"
                              target='_blank'
                              rel="noreferrer"
                              href="https://www.era.nih.gov/need-help"
                              color="inherit"
                              className={classes.link}
                            >
                                   NIH / eRA Helpdesk/Ticketing System 
                            </Link>
                            <img
                                  src={externalIconImage}
                                  // externalIconImage: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/common/images/logos/svgs/externalLinkIcon.svg',
                                  alt="outbounnd web site icon"
                                  className={classes.linkIcon}
                                />

                                </li>
                      </ul>
                      </div>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                 <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Obtain dbGaP access</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                   <div className={classes.panelDetails}>
                    <ul>
                       <li>
                        <Link
                              title=" VIDEO - dbGaP: Apply for Controlled Access Data"
                              target='_blank'
                              rel="noreferrer"
                              href=" https://www.youtube.com/watch?v=m0xp_cCO7kA"
                              color="inherit"
                              className={classes.link}
                            >
                                    VIDEO - dbGaP: Apply for Controlled Access Data
                            </Link>
                            <img
                                  src={externalIconImage}
                                  // externalIconImage: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/common/images/logos/svgs/externalLinkIcon.svg',
                                  alt="outbounnd web site icon"
                                  className={classes.linkIcon}
                                />

                       </li>
                       <li>
                       <Link
                              title="  dbGaP Frequently Asked Questions (FAQs)"
                              target='_blank'
                              rel="noreferrer"
                              href=" https://www.ncbi.nlm.nih.gov/books/NBK5295/"
                              color="inherit"
                              className={classes.link}
                            >
                                     dbGaP Frequently Asked Questions (FAQs)
                            </Link>
                            <img
                                  src={externalIconImage}
                                  // externalIconImage: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/common/images/logos/svgs/externalLinkIcon.svg',
                                  alt="outbounnd web site icon"
                                  className={classes.linkIcon}
                                />
                       </li>
                       <li>

                       <Link
                              title=" dbGaP Helpdesk "
                              target='_blank'
                              rel="noreferrer"
                              href="  https://dbgap.ncbi.nlm.nih.gov/aa/wga.cgi?page=email&filter=from&from=login"
                              color="inherit"
                              className={classes.link}
                            >
                                 dbGaP Helpdesk 
                            </Link>
                            <img
                                  src={externalIconImage}
                                  // externalIconImage: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/common/images/logos/svgs/externalLinkIcon.svg',
                                  alt="outbounnd web site icon"
                                  className={classes.linkIcon}
                                />




                       </li>
                      </ul>
                      </div>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                 <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Request access to controlled data of choice through dbGaP</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                  <div className={classes.panelDetails}>
                    <ul>
                        <li>Log in to your dbGaP account using your eRA Commons username and password.</li>
                        <li>Navigate to the “My Projects” page.</li>
                        <li>Create a new research project or revise project to request access to new data.</li>
                        <li>Enter the appropriate ID for your project of interest.</li><ul>
                        <li>E.g. “phs002192” for Cancer Moonshot Biobank dataset.</li></ul>
                        <li>Submit request.</li>
                        <li>You will receive notification of approval via email.</li>
                    </ul>
                    </div>
                  </ExpansionPanelDetails>
                </ExpansionPanel>

                 <ExpansionPanel>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Access approved datasets within the CTDC</Typography>
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails>
                    <Typography className={classes.panelDetails}>
                      After receiving dbGaP approval for a desired dataset, you can access and download the dataset through your CTDC account or create a manifest to analyze data within the 

                                  Seven Bridges’ Cancer Genomics Cloud
                       (SB-CGC).
                    </Typography>
                  </ExpansionPanelDetails>
                </ExpansionPanel>
                </div>
                   </div>
                </div>
                  
            </Grid>
          </Grid>
      </div>
    </>

  );
};


const styles = () => ({
  container: {
    margin: '16px auto 16px auto',
    color: '#000000',
    fontFamily: '"Lato Regular", "Open Sans", sans-serif',
    fontSize: '15px',
    lineHeight: '22px',
    maxWidth: '1440px',
  },
  maxWidthContainer: {
    margin: '0px auto 0px auto',
    maxWidth: '1440px',
  },
  expansionPanel:{
    padding: '10px 0px',
  },
  heading: {
     fontFamily: 'Inter',
    fontSize: '18px',
    fontWeight: 500,
    lineHeight: '48px',
    letterSpacing: '0em',
    textAlign: 'left',
    minHeight: '48px',
  },
  panelDetails:{
    padding: '0px 35px 35px 35px',
    gap: '8px'
  },
  secondayTitle: {
    display: 'block',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: '70px',
    color: '#033D6F',
    fontSize: '28px',
    fontFamily: 'Lato',
    textTransform: 'uppercase',
  },
  text: {
    // height: '476px',
    // width: '675px',
    color: '#000000',
    fontFamily: '"Lato Regular", "Open Sans", sans-serif',
    fontSize: '16px',
    lineHeight:'30px',
    background: '#F4F4F4',
    margin: '10px',
    borderRadius: '10px',
    padding: '25px'
  },
  header: {
    fontFamily: 'Inter',
    fontSize: '20px',
    fontWeight: 500,
    lineHeight: '24px',
    letterSpacing: '0em',
    textAlign: 'left',
    color: '#000',
    padding: '10px 11px'
  },

  followGraph: {
    padding: '0px 10px',
    width: '100%',
    marginBottom: '-5px'
  },
  title: (props) => ({
    color: props.titleColor,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    padding: '10px auto'
  }),
  email: (props) => ({
    color: props.linkColor,
    fontWeight: 'bold',
  }),
  contentSection: {
    padding: '8px 0px 8px 25px !important',
    float: 'left',
  },
  imageSection: {
    float: 'left',
  },
  aboutSection: {
    padding: '60px 45px',
  },
  img: {
    width: '100%',
  },
  linkIcon: {
    width: '20px',
    verticalAlign: 'sub',
    margin: '0px 0px 0px 2px',
  },
  link: (props) => ({
    color: props.linkColor,
    fontWeight:'600',
    fontSize:'16px',
    '&:hover': {
      color: props.linkColor,
    },
  }),
  tableDiv: {
    marginTop: '0px',
  },
  tablelinkIcon: {
    width: '15px',
    verticalAlign: 'sub',
    margin: '0px 0px 0px 2px',
  },
  tableLink: {
    fontWeight: 'bolder',
    textDecoration: 'underline',
  },
  table: {
    borderSpacing: '0',
    borderCollapse: 'collapse',
    fontSize: '12px',
    fontWeight: 'bold',
    letterSpacing: '0.025em',
    lineHeight: '30px',
    textAlign: 'left',
    width: '100%',
  },
  tableHeader: {
    fontFamily:'"Lato Regular", "Open Sans", sans-serif',
    color: '#194563',
    textTransform: 'uppercase',

  },
  tableBodyRow: {
    borderSpacing: '0',
    borderCollapse: 'collapse',
    color: '#3E7AAA',
  },
  tableCell: {
    fontFamily: '"Lato Regular", "Open Sans", sans-serif',
    fontSize: '14px',
    padding: '8px 15px 8px 0px',
    borderBottom: '0.66px solid #087CA5',
  },
  headerCell: {
    borderBottom: '4px solid #087CA5',
    borderSpacing: '0',
    borderCollapse: 'collapse',
    fontWeight: 'bolder',
  },
  MyCasesWizardStep4: {
    width: '600px',
  },
});

RAView.defaultProps = {
  classes: {},
  data: {
    content: [],
    fontFamily: 'Nunito',
    lineHeight: '30px',
  },
  linkColor: '#274FA6',
  titleColor: '#000',
  externalIconImage: 'https://raw.githubusercontent.com/CBIIT/datacommons-assets/main/common/images/logos/svgs/externalLinkIcon.svg',
};

export default withStyles(styles)(RAView);