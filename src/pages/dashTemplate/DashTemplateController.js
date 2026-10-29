import React from "react";
import { connect } from "react-redux";
import { CircularProgress, LinearProgress, makeStyles } from "@material-ui/core";
import DashTemplateView from "./DashTemplateView";
import styles from "./DashTemplateStyle";
import useDashData from "./useDashData";

export { buildParticipantIdFilter } from "./useDashData";

const useStyles = makeStyles(styles);

const DashTemplateController = (props) => {
  const classes = useStyles();
  const { dashData, activeFilters, loading, error } = useDashData(props);
  if (error) {
    return (
      <div role="alert" className={classes.errorContainer}>
        <h2 className={classes.errorTitle}>
          Unable to Load Explore
        </h2>
        <p>{error}</p>
      </div>
    );
  }
  if (!dashData) return <CircularProgress />;
  return (
    <>
      {loading && <LinearProgress aria-label="Updating Explore results" />}
      <DashTemplateView {...props} dashData={dashData} activeFilters={activeFilters} />
    </>
  );
};

const mapStateToProps = (state) => ({
  filterState: state.statusReducer.filterState,
  localFindUpload: state.localFind.upload,
  localFindAutocomplete: state.localFind.autocomplete,
});

export default connect(mapStateToProps, null)(DashTemplateController);
