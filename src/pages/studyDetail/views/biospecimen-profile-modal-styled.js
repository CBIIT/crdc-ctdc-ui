import styled from '@emotion/styled';
import { Box } from '@material-ui/core';
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


export const StyledDialogTitle = styled(Box)({
  '&.MuiDialogTitle-root': {
    fontFamily: 'Inter',
    color: '#0666D93',
    fontWeight: '400',
    fontSize: '18px',
    padding: '15px 0px 5px 0px',
    display: 'flex',
    alignItems: 'center',
  },
});
