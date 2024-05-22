import React from 'react';
import GraphiQL from 'graphiql';
import { withStyles } from '@material-ui/core';
import fetch from 'isomorphic-fetch';
import graphGridImage from '../../assets/graphql/Graphql_Grid.png';
import env from '../../utils/env';
import Stats from '../../components/Stats/AllStatsController';
import AboutHeader from '../../pages/about/aboutHeader';
import { Grid} from '@material-ui/core';

const BACKEND = env.REACT_APP_BACKEND_API;

const defaultQuery =
`# Welcome to GraphiQL
#
# GraphiQL is an in-browser tool for writing, validating, and
# testing GraphQL queries.
#
# Type queries into this side of the screen, and you will see intelligent
# typeaheads aware of the current GraphQL type schema and live syntax and
# validation errors highlighted within the text.
#
# GraphQL queries typically start with a "{" character. Lines that starts
# with a # are ignored.
#
# An example GraphQL query might look like:
#
#     {
#       field(arg: "value") {
#         subField
#       }
#     }
#
# Keyboard shortcuts:
#
#       Run Query:  Ctrl-Enter (or press the play button above)
#
#   Auto Complete:  Ctrl-Space (or just start typing)
#
query search {
  getHomePage {
    numberOfParticipants
    numberOfDiagnoses
    numberOfTherapies
    specimenCountbyStageOfDisease {
      group
      subjects
      __typename
    }
    __typename
  }
}

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
<>
<Stats />
    <AboutHeader title="GraphQL"/>
 
    <Grid className={classes.aboutSection} container direction="row" spacing={16}>
    <Grid className={classes.imageSection} item lg={3} md={3} sm={10} xs={12}>
      <img alt="GraphQl" className={classes.graphQLImg} src={graphGridImage}></img>
      </Grid>
 
      <Grid className={classes.contentSection} item lg={9} md={9} sm={12} xs={12}>
        <span className={classes.text}>
          
          CTDC provides a GraphQL interface for users to make use of CTDC information in their own systems such as Jupyter notebooks. The GraphiQL interface is provided as a convenient place for researchers to develop their GraphQL queries and view what kind of results the queries return.
        </span>
      </Grid>
    </Grid>
 
    <div className={classes.grapqhQlContainer}>
      <GraphiQL editorTheme="solarized light" fetcher={graphQLFetcher} query={defaultQuery}/>
    </div>

</>);
const styles = () => ({
  aboutSection: {
    maxWidth: "1440px",
    padding: '60px 145px',
    marginBottom: '100px'
  },
  text: {
    color: 'black',
    fontSize: '16px',
  },
  imageSection: {
    float: 'left',
  },
  graphQLImg: {
    width: '100%',
  },
  contentSection: {
    padding: '8px 0px 8px 25px',
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
    minHeight: '500px',
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
