import React from 'react';
import { withStyles } from '@material-ui/core';
import Stats from '../../components/Stats/AllStatsController';
import ParticipantThemeProvider from './participantDetailThemeConfig';
import Styles from './participantDetailStyle';
import HeaderPanel from './components/HeaderPanel';
import BiospecimensTable from './components/BiospecimensTable';
import FilesTable from './components/FilesTable';

const ParticipantDetailView = ({ classes, participant, biospecimens, files }) => (
  <ParticipantThemeProvider>
    <Stats />
    <div className={classes.container}>
      <HeaderPanel classes={classes} participant={participant} />
      <BiospecimensTable classes={classes} biospecimens={biospecimens} />
      <FilesTable classes={classes} files={files} />
    </div>
  </ParticipantThemeProvider>
);

export default withStyles(Styles, { withTheme: true })(ParticipantDetailView);

