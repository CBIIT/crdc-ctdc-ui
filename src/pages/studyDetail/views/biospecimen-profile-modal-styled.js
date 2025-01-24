import styled from '@emotion/styled';
import { TabPanel } from '@material-ui/lab';
import { Dialog, DialogContent, DialogTitle, Tab } from '@material-ui/core';
import { Link } from 'react-router-dom';

export const modalWidth = '1000px';

export const StyledLink = styled(Link)({
  textDecoration: 'none',
  lineHeight: '14px',
  fontWeight: 'bold',
  position: 'relative',
  color: '#dc762f',
  '&:hover': {
    textDecoration: 'none',
  },
});

export const StyledDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    height: '100%',
    width: '100%',
    overflowY: 'hidden',
  },
});

export const StyledDialogContent = styled(DialogContent)({
  '&.MuiDialogContent-root': {
    padding: '32px 16px',
    overflowY: 'hidden',
  },
});

export const StyledTab = styled(Tab)({
  '&.MuiTab-root': {
    fontFamily: 'Roboto',
    fontWeight: 500,
    fontSize: '14px',
    color: '#000',
  },
});

export const StyledDialogTitle = styled(DialogTitle)({
  '&.MuiDialogTitle-root': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export const StyledTabPanel = styled(TabPanel)({
  '&.MuiTabPanel-root': {
    '@media (max-width: 959px)': {
      height: '100%',
    },
  },
});

export const headerButtonLinkText = styled.span({
  fontFamily: 'Roboto',
  color: '#0B3556',
  fontSize: '13px',
  fontStyle: 'normal',
  fontWeight: '900',
  lineHeight: '14px',
  letterSpacing: '0.15px',
});
