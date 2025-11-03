import React from 'react';
import GraphiQL from 'graphiql';
import { withStyles } from '@material-ui/core';
import fetch from 'isomorphic-fetch';
import graphGridImage from '../../assets/graphql/Graphql_Grid.png';
import env from '../../utils/env';
import Stats from '../../components/Stats/AllStatsController';
import AboutHeader from '../../pages/about/aboutHeader';
import { Grid} from '@material-ui/core';
import externalLinkIcon from '../../components/About/assets/About-ExternalIcon.svg';
const BACKEND = env.REACT_APP_BACKEND_API;

const defaultQuery = `
# Welcome to GraphiQL
#
# GraphiQL is an in-browser tool for writing, validating, and
# testing GraphQL queries.
#
# Type queries into this side of the screen, and you will see intelligent
# typeaheads aware of the current GraphQL type schema and live syntax and
# validation errors highlighted within the text.
#
# GraphQL queries typically start with a "{" character. Lines that starts
# with a '#' are ignored.
#

# You can paste this query below and remove the # before each line by highlighting the text and pressing CTRL + ? (or command + ? on a Mac)
# And try it out 
# Keyboard shortcuts:
#
#       Run Query:  Ctrl-Enter (or press the play button above)
#
#   Auto Complete:  Ctrl-Space (or just start typing)
#
# An example GraphQL query might look like this query that we use for the global stats bar at the top of this screen:

    query search(
		# Variables defined to be searched with you can use these variables in the query Variables section to constrain results
    # to constrain results copy '"sex": ["Male"] and paste it below in the variables window
    # the results will reflect all data that is related to participants who are male
    # you can use the lists on the facets on the explore page to find variables to filter queries here
    $participant_id: [String],
    $ctep_disease_term: [String],
    $sex: [String], 
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
    searchParticipants(
      participant_id: $participant_id
      ctep_disease_term: $ctep_disease_term
      sex: $sex
      race: $race
      ethnicity: $ethnicity
      carcinogen_exposure: $carcinogen_exposure
      targeted_therapy: $targeted_therapy
      anatomical_collection_site: $anatomical_collection_site
      specimen_type: $specimen_type
      tissue_category: $tissue_category
      assessment_timepoint: $assessment_timepoint
      data_file_type: $data_file_type
      data_file_format: $data_file_format
    )  {
    # These are the return types of the query they define the results that will show up on the window to the right
      numberOfStudies
      numberOfParticipants
      numberOfDiagnoses
      numberOfTargetedTherapies
      numberOfSpecimens
      numberOfFiles
    }
}


# Below is the GraphiQL integrated development environment (IDE), from here you can query the data within the Clinical and Translational Data Commons database. 
# The default query below is the same query that is used to query data from
# the Clinical and Translational Data Commons database for the Explore page.
# query participantOverview(
#     $participant_id: [String],
#     $ctep_disease_term: [String],
#     $sex: [String],
#     $race: [String],
#     $ethnicity: [String],
#     $carcinogen_exposure: [String],
#     $targeted_therapy: [String],
#     $anatomical_collection_site: [String],
#     $specimen_type: [String],
#     $tissue_category: [String],
#     $assessment_timepoint: [String],
#     $data_file_type: [String],
#     $data_file_format: [String],
#     $first: Int,
#     $offset: Int,
#     $order_by: String,
#     $sort_direction: String
#   ){
#     participantOverview(
#       participant_id: $participant_id
#       ctep_disease_term: $ctep_disease_term
#       sex: $sex
#       reported_gender: $reported_gender
#       race: $race
#       ethnicity: $ethnicity
#       carcinogen_exposure: $carcinogen_exposure
#       targeted_therapy: $targeted_therapy
#       anatomical_collection_site: $anatomical_collection_site
#       specimen_type: $specimen_type
#       tissue_category: $tissue_category
#       assessment_timepoint: $assessment_timepoint
#       data_file_type: $data_file_type
#       data_file_format: $data_file_format
#       first: $first
#       offset: $offset
#       order_by: $order_by
#       sort_direction: $sort_direction
#     ){
#       participant_id,
#       ctep_disease_term,
#       age_at_enrollment,
#       sex,
#       race,
#       ethnicity,
#       carcinogen_exposure,
#       targeted_therapy
#       data_file_uuid
#     }
#   }


`;

function graphQLFetcher(graphQLParams) {
  
  if (!graphQLParams.variables) graphQLParams = Object.assign({}, graphQLParams, {'variables':{}});

  return fetch(BACKEND, {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(graphQLParams),
  }).then((response) => response.json());
}

const GraphqlView = ({ classes }) => (
  <main>
    <Stats />
    <AboutHeader title="GraphQL"/>
 
    <Grid className={classes.aboutSection} container direction="row" spacing={16}>
      <Grid className={classes.imageSection} item lg={3} md={3} sm={10} xs={12}>
        <img alt="GraphQl" className={classes.graphQLImg} src={graphGridImage}></img>
      </Grid>
 
      <Grid className={classes.contentSection} item lg={9} md={9} sm={12} xs={12}>
        <span className={classes.text}>  
          GraphQL is a powerful query language for APIs. It provides a more efficient, powerful, and flexible alternative to the traditional REST API. Unlike traditional REST APIs, which typically require multiple endpoints to retrieve various pieces of data, GraphQL allows clients (the systems making the queries) to fetch exactly what they need in a single request. The Clinical and Translational Data Commons (CTDC) leverages this technology by offering a GraphQL API interface, which enables users to interact with CTDC data directly from their own systems, such as through Jupyter notebooks.
        </span>
        <br />
        <br />
        <span className={classes.text}>
            To begin querying the CTDC data via GraphQL, access our API endpoint at <b>{BACKEND}</b>.
        </span>
        <br />
        <br />
        <span className={classes.text}>
          If you are new to GraphQL and want to learn more about query language, comprehensive tutorials and example queries are available at  
          <a className={classes.link} href="https://graphql.org/learn/"> graphql.org</a>
          <img
            alt="outbounnd web site icon"
            src={externalLinkIcon}
            className={classes.linkIcon}
            style= {{padding: '0 2px 2px 2px',color: '#274FA6'}}
          />. These resources provide an excellent starting point for understanding and utilizing GraphQL effectively.
        </span>
        <br />
        <br />
        <span className={classes.text}>
          Below is the GraphiQL integrated development environment (IDE), from here you can query the data within the Clinical and Translational Data Commons database. The default query below is the same query that is used to query data from the Clinical and Translational Data Commons database for the Global Stats Bar.
        </span>
      </Grid>
    </Grid>
 
    <div className={classes.grapqhQlContainer}>
      <GraphiQL
        editorTheme="solarized light"
        fetcher={graphQLFetcher}
        query={defaultQuery}
        variables='{
          "participant_id": [],
          "ctep_disease_term": [],
          "sex": [],
          "race": [],
          "ethnicity": [],
          "carcinogen_exposure": [],
          "targeted_therapy": []
        }'
      />
    </div>
  </main>
);

const styles = () => ({
  aboutSection: {
    maxWidth: "1440px",
    padding: '70px 172px',
    margin:'0px auto 0px auto',
  },
  linkIcon: {
    color: '#274FA6',
    width: '20px',
    verticalAlign: 'sub',
    margin: '0px 0px 0px 2px',
  },
  link: {
    color: '#274FA6',
    fontSize: '16px',
    fontWeight:"bold",
    textDecoration: 'none',
  },
  text: {
    color: 'black',
    fontSize: '16px',
    fontFamily: ("Lato Regular, Open Sans, sans-serif")
  },
  imageSection: {
    float: 'left',
    margin: '4px 0 0 0'
  },
  graphQLImg: {
    width: '100%',
  },
  contentSection: {
    padding: '0px 0px 8px 25px',
    float: 'left',
  },
  flexItemOne: {
    color: 'black',
    fontSize: '14px',
    width: '60px 400px 0 500px ',
    margin: '60px auto',
  },
  flexItemTwo: {
    color: 'black',
    margin: '60px 400px 0 20px ',
    textAlign: 'left',
    fontSize: '16px',
  },
  grapqhQlEditorContainer: {
    height: '1600px',
    minHeight: '1700px',
    maxWidth: '1800px',
    margin: 'auto',
  },
  grapqhQlContainer: {
    display: 'flex',
    height: '100px',
    minHeight: '800px',
    maxWidth: '1800px',
    margin: 'auto',
    // Modified the default CSS for compliance with 508 color contrast standards
    '& .cm-comment': {
      color: 'black',
    },
    '& .doc-explorer-title-bar': {
    },
    '& .CodeMirror': {

    },
    '& .CodeMirror-linenumber': {
      color: 'black', // #999
    },
    '& .variable-editor secondary-editor': {
      color: 'black', // #999
    },
    '& .CodeMirror-lines': {
      color: 'black', // #999
    },
    '& .doc-category-title': {
      color: 'black', // #999
    },
    '& .doc-category-item': {
      '& .type-name': {
        color: '#8c5d00', // ##ca9800
      },
    },
    '& .resultWrap': {
      '& .cm-number': {
        color: '#043E8B', // #97b0c0
      },
      '& .cm-string': {
        color: '#711948', // #D64292
      },
    },
  },
  docExplorerTitle:{
    padding: '0px',  
  },
  header: {
    position: 'relative',
    margin: '0px auto',
  },
});

export default withStyles(styles)(GraphqlView);
