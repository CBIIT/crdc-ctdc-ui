import React from 'react';
import GraphiQL from 'graphiql';
import { withStyles } from '@material-ui/core';
import fetch from 'isomorphic-fetch';
import env from '../../utils/env';

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

const GraphqlView = ({ classes }) => (<div className={classes.grapqhQlContainer}><GraphiQL editorTheme="solarized light" fetcher={graphQLFetcher} 
   query={defaultQuery}/></div>);

const styles = () => ({
  grapqhQlContainer: {
    height: '600px',
    maxWidth: '1800px',
    margin: 'auto',
    padding: '10px 32px',
    // Modified the default CSS for compliance with 508 color contrast standards
    '& .cm-comment': {
      color: 'black',
    },
    '& .doc-explorer-title-bar': {
      height: '47px', // 34px
    },
    '& .CodeMirror-linenumber': {
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
});

export default withStyles(styles)(GraphqlView);
