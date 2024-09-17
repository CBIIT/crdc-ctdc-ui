import React, { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import axios from 'axios';
import AboutView from './aboutView';
import env from '../../utils/env';

const About = ({ match }) => {
  const [data, setData] = useState([]);

const ABOUT_CONTENT_URL = env.REACT_APP_ABOUT_CONTENT_URL;

  useEffect(() => {
    const fetchData = async () => {
      let resultData = [];
      let result = [];
      try {
        result = await axios.get(ABOUT_CONTENT_URL);
        resultData = yaml.safeLoad(result.data);
        const supportObj = resultData.find(({ page }) => page === match.path);
        setData(supportObj);
      } catch (error) {
        return setData({error})
      }
    };
    fetchData();
  }, [match.path]);

  if(data.error){
    return <div>Error in Loading aboutPagesContent.yaml.</div>
  }

  return (
    <AboutView data={data} />
  );
};
export default About;
