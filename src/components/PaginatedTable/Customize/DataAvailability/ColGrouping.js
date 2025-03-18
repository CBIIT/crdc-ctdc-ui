import React from 'react';
import {
  IconButton,
  Tooltip,
  withStyles,
//   withStyles,
} from '@material-ui/core';
import questionMarkIcon from '../../assets/questionMark.svg'
import booksOnAShelfIcon from '../../../../assets/study/books_on_a_shelf.svg';
import fileDrawerIcon from '../../../../assets/study/file_drawer.svg';
import photographIcon from '../../../../assets/study/photograph.svg';
import documentAndPenIcon from '../../../../assets/study/document_and_pen.svg';
import abstractGraphIcon from '../../../../assets/study/abstract_graph.svg';

const CTDC_DATA_AVAIL_ICONS = [
  {
    label: 'Participant Files',
    icon: booksOnAShelfIcon,
    iconAlt: 'Books on a shelf',
  },
  {
    label: 'Study Files',
    icon: fileDrawerIcon,
    iconAlt: 'File drawer',
  },
  {
    label: 'Image Collections',
    icon: photographIcon,
    iconAlt: 'Photograph',
  },
  {
    label: 'Publications',
    icon: documentAndPenIcon,
    iconAlt: 'Document and pen',
  },
  {
    label: 'Additional CRDC Nodes',
    icon: abstractGraphIcon,
    iconAlt: 'Abstract graph',
  },
];

export const generateDataAvailabilityTooltipText = (classes) => (
  <div className={classes.tooltipDataAvailDiv}>
    <p className={classes.tooltipText}>
      View available data counts and links to associated nodes within the CRDC community
    </p>
    <div style={{margin: '20px 0px 0px 33px' }}>
      {
        CTDC_DATA_AVAIL_ICONS.map((item, index) => (
          <div key={index} className={classes.tooltipDataAvailIcon} style={{ marginBottom: index !== CTDC_DATA_AVAIL_ICONS.length - 1 ? '16px' : '0px' }}>
            <img src={item.icon} alt={item.iconAlt} />
            {item.label}
          </div>
        ))
      }
    </div>
  </div>
);

const AvailabilityColumnGrouping = ({
  classes,
}) => (
  <span styles={classes.group}>
    Data Availability
    <Tooltip
      title={generateDataAvailabilityTooltipText(classes)}
      interactive={true}
      classes={{
        tooltip: classes.dalTooltip,
        popper: classes.dalPopper,
      }}
      placement="top"
    >
    <IconButton
      aria-label="help"
      disableRipple
      className={classes.customIconButton} 
    >
      <img
        src={questionMarkIcon}
        alt="tooltip"
      />
    </IconButton>
  
    </Tooltip>
  </span>
);

const styles = () => ({
  customIconButton: {
    '&:hover': {
      backgroundColor: 'rgba(249, 249, 249, 0.2)', // white
    },
    top: '-6.5px',
    left: '-8px'
  },
  
  group: {
    marginRight: '24em',
    fontSize: '16px',
    fontWeight: '600',
    color: '#000',
  },
  icon: {
    width: '25px',
    textAlign: 'center',
  },
  dalTooltip: {
    padding: '10px 15px 30px 15px !important',
    margin: '0px',
    maxWidth: '269px',
    border: '1px solid #CECECE',
    borderRadius: '5px',
    boxShadow: '0px 4px 10px 0px #00000059'
  },
  dalPopper: {
    margin: '0px',
    padding: '0px'
  },
  tooltipDataAvailDiv: {
    display: 'grid',
    paddingTop: '0em',

    fontFamily: 'Open Sans',
    fontWeight: 600,
    fontSize: '13px',
    lineHeight: '19px',
    letterSpacing: '0%',
  },
  tooltipText: {
    color: '#223D4C',
    margin: '0px'
  },
  tooltipDataAvailIcon: {
    display: 'flex',
    gap: '8px', 
    color: '#4B619A',
  }
  
});

export default withStyles(styles)(AvailabilityColumnGrouping);
