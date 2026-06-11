import React, { useState } from "react";
import { connect } from "react-redux";
import { Button } from "@material-ui/core";
import { SearchList, resetUploadData } from "@bento-core/local-find";
import uploadIcon from '../../../assets/dash/uploadIcon.svg';

/**
 * Custom Local Find Search View for CTDC.
 * Replaces the default SearchView from @bento-core/local-find
 * to use "Participant Set" terminology instead of "Case Set".
 */
const LocalFindSearchView = (props) => {
  const { classes, hidden, state, resetUpload, UploadModal, SearchBox } = props;

  const [showModal, setShowModal] = useState(false);
  const matchedFiles = state && state.upload ? state.upload : [];

  const eventHandler = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={classes.searchContainer}
      onFocus={eventHandler}
      onClick={eventHandler}
      hidden={hidden}
    >
      {matchedFiles.length !== 0 ? (
        <SearchList
          classes={{
            divider: classes.customDivider,
            listPadding: classes.customListPadding,
          }}
          items={["INPUT SET"]}
          id="localFindParticipantUploadSet"
          onDelete={resetUpload}
        />
      ) : null}
      <SearchBox classes={classes} />
      <Button
        variant="contained"
        disableElevation
        onClick={() => setShowModal(true)}
        className={classes.uploadButton}
        id="local_find_upload_open"
      >
        {matchedFiles.length !== 0
          ? "View Participant Set"
          : "Upload Participant Set"}
        <span className={classes.iconSpan}>
          <img
            className={classes.uploadIcon}
            src={uploadIcon} 
            alt="upload icon"
          />
        </span>
      </Button>
      <UploadModal open={showModal} onCloseModal={() => setShowModal(false)} />
    </div>
  );
};

const stateProps = (state) => ({
  state: state.localFind,
});

const dispatchProps = (dispatch) => ({
  resetUpload: () => dispatch(resetUploadData()),
});

export default connect(stateProps, dispatchProps)(LocalFindSearchView);
