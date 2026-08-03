import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import StatsView from './StatsView';
import { fetchDataForStats } from './StatsState';

const Stats = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.stats.data);
  const isLoading = useSelector((state) => state.stats.isLoading);
  const isFetched = useSelector((state) => state.stats.isFetched);
  const hasError = useSelector((state) => state.stats.hasError);
  const error = useSelector((state) => state.stats.error);

  React.useEffect(() => {
    // Always refresh global stats for pages using the shared controller
    // so persisted/stale scoped values cannot leak between routes.
    dispatch(fetchDataForStats({ force: true }));
  }, [dispatch]);

  if (isLoading || !isFetched) {
    return <CircularProgress />;
  }

  if (hasError) {
    console.error('Failed to load global stats:', error);
    // Return empty stats bar to prevent page break
    return <StatsView data={{}} />;
  }

  return <StatsView data={data} />;
};

export default Stats;
