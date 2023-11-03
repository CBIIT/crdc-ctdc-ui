import React from 'react';
import {AboutBody } from '@bento-core/about';
import AboutHeader from './aboutHeader';
import { CircularProgress, withStyles } from '@material-ui/core';
import StatsView from '../../components/Stats/StatsView';

const AboutView = ({ classes, data,statData }) => {
  const getImage = (imgPath, alt) => <img className={classes.img} src={imgPath != null ? imgPath : ''} alt={alt} />;


  return (
    <>
    {statData.data? <StatsView data={statData.data.searchParticipants} /> : 
    <CircularProgress />}
      <AboutHeader title={data.title} />
      <AboutBody data={{
          fontFamily: '"Lato Regular", "Open Sans", sans-serif',
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
