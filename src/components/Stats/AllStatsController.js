import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import StatsView from './StatsView';
import { fetchDataForStats } from './StatsState';

const Stats = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.stats.data);

  React.useEffect(() => {
    // Always refresh global stats for pages using the shared controller
    // so persisted/stale scoped values cannot leak between routes.
    dispatch(fetchDataForStats({ force: true }));
  }, [dispatch]);

  const isEmpty =
    !data ||
    (Array.isArray(data) ? data.length === 0 : Object.keys(data).length === 0);

  return isEmpty ? <CircularProgress /> : <StatsView data={data} />;
};

export default Stats;
