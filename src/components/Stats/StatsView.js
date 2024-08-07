import React from 'react';
import StatsBar from './StatsBarView';
import { statsStyling, globalStatsData } from '../../bento/globalStatsData';

// TODO - see if the variables `data` and `stats` can be merged to begin with
const StatsView = ({ data }) => {
  // Incorporate data into the stats array
  const stats = globalStatsData.map((e) => ({
    name: e.statTitle,
    val: data[e.statAPI],
    statIconSrc: e.statIconSrc,
    statIconAlt: e.statIconAlt,
  }));

  return (
    <StatsBar
      stats={stats}
      styles={statsStyling}
    />
  );
};

export default StatsView;
