import React from 'react';
import GraphiQL from 'graphiql';
import { withStyles } from '@material-ui/core';
import fetch from 'isomorphic-fetch';
import graphGridImage from '../../assets/graphql/Graphql_Grid.png';
import env from '../../utils/env';
import Stats from '../../components/Stats/AllStatsController';

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
   <div className={classes.container}>
    <div className={classes.header}>
      <div className={classes.slope} />
      <div className={classes.slope2}><span className={classes.slope2Text}>{"GraphQL"}</span></div>
    </div>
  </div>
<div class={classes.flexContainer}>
  <div class={classes.flexItemOne}><img src={graphGridImage}></img> </div>
  <div class={classes.flexItemTwo}> CTDC provides a GraphQL interface for users to make use of CTDC information in their own systems such as Jupyter notebooks. The GraphiQL interface is provided as a convenient place for researchers to develop their GraphQL queries and view what kind of results the queries return.</div> 
</div>
<div className={classes.grapqhQlContainer}>
  <GraphiQL editorTheme="solarized light" fetcher={graphQLFetcher} 
   query={defaultQuery}/></div>
</>);
const styles = () => ({
  flexContainer: {
    display: 'flex',
    alignItems: 'stretch',
  },
  flexItemOne: {
    color: 'black',
    margin: '60px 0 60px 150px',
    textAlign: 'left',
    fontSize: '14px',
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
    height: '1200px',
    minHeight: '500px',
    maxWidth: '1800px',
    margin: 'auto',
    // padding: '10px 32px',
    // Modified the default CSS for compliance with 508 color contrast standards
    '& .cm-comment': {
      color: 'black',
    },
    '& .doc-explorer-title-bar': {
      height: '47px', // 34px
    },
    // '& .CodeMirror': {
    //   height: '600px'
    // },
    '& .CodeMirror-linenumber': {
      // height: '500px',
      color: 'black', // #999
    },
    // '& .CodeMirror-linenumber': {
    //   height: '500px',
    //   color: 'black', // #999
    // },
    '& .CodeMirror-lines': {
      height: '500px',
      color: 'black', // #999
    },
    // '& .doc-category-title': {
    //   color: 'black', // #999
    // },
    // '& .doc-category-item': {
    //   '& .type-name': {
    //     color: '#8c5d00', // ##ca9800
    //   },
    // },
    // '& .resultWrap': {
    //   '& .cm-number': {
    //     color: '#043E8B', // #97b0c0
    //   },
    //   '& .cm-string': {
    //     color: '#711948', // #D64292
    //   },
    // },
    '& .editorWrap': {
      padding: '10px 32px',
    },
  },
  docExplorerTitle:{
    padding: '0px',  
  },
  header: {
    position: 'relative',
    margin: '0px auto',
  },
  slope2Text: {
    height: '65px',
    width: '252px',
    color: '#087CA5',
    fontFamily: 'Raleway',
    fontSize: '25px',
    fontWeight: 'bold',
    letterSpacing: '0.025em',
    lineHeight: '65px',
  },
  slope: {
    background: '#087CA5',
    width: '18%',
    height: '65px',
    '&:after': {
      content: '""',
      position: 'absolute',
      left: '18%',
      borderTop: '65px solid #087CA5',
      borderRight: '65px solid transparent',
    },
  },
  slope2: {
    background: '#E5E7E8',
    width: 'calc(82% - 54px)',
    height: '65px',
    float: 'right',
    position: 'absolute',
    right: '0',
    top: '20px',
    '&:after': {
      content: '""',
      position: 'absolute',
      right: '100%',
      borderBottom: '65px solid #E5E7E8',
      borderLeft: '65px solid transparent',
    },
  },
});

export default withStyles(styles)(GraphqlView);
