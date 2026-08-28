import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { TextField } from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { updateAutocompleteData } from '@bento-core/local-find';
import { getAllIds } from './BentoFilterUtils';

const SEARCH_TYPE = 'participantIds';

/**
 * Single-select Participant ID find box.
 * Rendered standalone above the facet accordions (see BentoFacetFilter.js),
 * distinct from LocalFindSearchView's multi-select Input Set upload flow.
 */
export const ParticipantIdSearchBox = ({ classes, autocomplete, applySearch }) => {
  const selected = (autocomplete && autocomplete[0]) || null;

  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState([]);
  const dataLoaded = useRef(false);

  useEffect(() => {
    if (!open || dataLoaded.current) {
      return;
    }

    (async () => {
      const { participantIds } = await getAllIds();
      setOptions(participantIds.map((id) => ({ type: SEARCH_TYPE, title: id })));
      dataLoaded.current = true;
    })();
  }, [open]);

  return (
    <div className={classes.participantIdSearchContainer}>
      <label htmlFor="participant_id_search_input" className={classes.participantIdSearchLabel}>
        Find Participant by ID
      </label>
      <Autocomplete
        id="participant_id_search"
        className={classes.participantIdSearchInput}
        value={selected}
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        onChange={(event, newValue) => applySearch(
          newValue ? [{ type: SEARCH_TYPE, title: newValue.title }] : [],
        )}
        options={options}
        getOptionLabel={(option) => option.title}
        getOptionSelected={(option, val) => option.title === val.title}
        filterOptions={createFilterOptions({ trim: true })}
        noOptionsText="No matching Participants"
        renderInput={(params) => (
          <TextField
            {...params}
            id="participant_id_search_input"
            variant="outlined"
            size="small"
            placeholder="Find Participant by ID (e.g. MSB-01068)"
            inputProps={{
              ...params.inputProps,
              'aria-label': 'Find Participant by ID',
            }}
          />
        )}
      />
    </div>
  );
};

const stateProps = (state) => ({
  autocomplete: state.localFind.autocomplete,
});

const dispatchProps = (dispatch) => ({
  applySearch: (data) => dispatch(updateAutocompleteData(data)),
});

export default connect(stateProps, dispatchProps)(ParticipantIdSearchBox);
