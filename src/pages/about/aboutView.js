import React from 'react';
import {AboutBody } from '../../components/About';
import AboutHeader from './aboutHeader';
import { CircularProgress, withStyles } from '@material-ui/core';
import Stats from '../../components/Stats/AllStatsController';


const AboutView = ({ classes, data }) => {
  const getImage = (imgPath, alt) => <img className={classes.img} src={imgPath != null ? imgPath : ''} alt={alt} />;


  return (
    <>
      <Stats />
      <AboutHeader title={data.title} />
      <AboutBody data={{
          fontFamily: '"Roboto", "Lato Regular", "Open Sans", sans-serif',
          lineHeight: '25px',
          image: getImage(data.primaryContentImage, data.title),
          imageLocation: 'left',
          title: data.title ? data.title : '',
          content: data.content ? data.content : '',
          table: data.table ? data.table : '',
          secondaryImage: data.secondaryZoomImage ? data.secondaryZoomImage : null,
          secondaryImageData: getImage(data.secondaryZoomImage, 'secondary zoominout'),
          secondaryZoomImageTitle:
           data.secondaryZoomImageTitle ? data.secondaryZoomImageTitle : null,
        }}
        />
    </>

  );
};
const styles = () => ({
  img: {
    width: '100%',
  },
});

export default withStyles(styles)(AboutView);
