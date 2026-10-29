import React from "react";
import { connect } from "react-redux";
import { Button, CircularProgress, LinearProgress } from "@material-ui/core";
import DashTemplateView from "./DashTemplateView";
import useDashData from "./useDashData";

export { buildParticipantIdFilter } from "./useDashData";

const DashTemplateController = (props) => {
  const { dashData, activeFilters, loading, error, retry } = useDashData(props);
  const errorBanner = error && (
    <div role="alert">
      <p>{error}</p>
      <Button onClick={retry}>Retry</Button>
    </div>
  );
  if (!dashData) return errorBanner || <CircularProgress />;
  return (
    <>
      {errorBanner}
      {loading && !error && <LinearProgress aria-label="Updating Explore results" />}
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
