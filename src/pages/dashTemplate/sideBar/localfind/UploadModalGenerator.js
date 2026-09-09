import React, { useState } from 'react';
import { connect } from 'react-redux';
import clsx from 'clsx';
import {
  Modal, Button, Typography,
  TextareaAutosize, IconButton, withStyles,
} from '@material-ui/core';
import HelpIcon from '@material-ui/icons/Help';
import CloseIcon from '@material-ui/icons/Close';
import ToolTip from '@bento-core/tool-tip';
import { updateUploadData, updateUploadMetadata } from '@bento-core/local-find/dist/store/actions/Actions';
import FileUploader from '@bento-core/local-find/dist/UploadModal/components/FileUploader';
import DEFAULT_STYLES from '@bento-core/local-find/dist/UploadModal/styles';
import DEFAULT_CONFIG from '@bento-core/local-find/dist/UploadModal/config';
import SummaryTable from './SummaryTable';
import localFindReopenIcon from '../../../../assets/dash/localFindReopenIcon.svg';

// Adds a fileUploaderRefresh rule on top of the bento-core UploadModal stylesheet
// so the FileUploader's refresh icon can be swapped for the CTDC arrow asset.
const MODAL_STYLES = (theme) => ({
  ...DEFAULT_STYLES(theme),
  fileUploaderRefresh: {
    color: 'transparent !important',
    backgroundImage: `url(${localFindReopenIcon})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    width: '12px !important',
    height: '12px !important',
    marginLeft: '8px !important',
    cursor: 'pointer',
  },
  modalCloseIcon: {
    height: '20px !important',
    width: '20px !important',
  },
  helpIconButton: {
    padding: '4px !important',
    marginLeft: '2px !important',
    transform: 'translateY(-6px)',
  },
  helpIcon: {
    color: '#1F344F !important',
    fontSize: '18px !important',
  },
});

// Forked from @bento-core/local-find UploadModalGenerator
// to use CTDC-specific SummaryTable and "Participant IDs" terminology.
const UploadModalGenerator = (uiConfig = DEFAULT_CONFIG) => {
  const { config, functions } = uiConfig;

  const modalClosed = functions && typeof functions.modalClosed === 'function'
    ? functions.modalClosed : DEFAULT_CONFIG.functions.modalClosed;
  const searchMatches = functions && typeof functions.searchMatches === 'function'
    ? functions.searchMatches : DEFAULT_CONFIG.functions.searchMatches;
  const modalTitle = config && config.title && typeof config.title === 'string'
    ? config.title : DEFAULT_CONFIG.config.title;
  const inputPlaceholder = config && config.inputPlaceholder && typeof config.inputPlaceholder === 'string'
    ? config.inputPlaceholder : DEFAULT_CONFIG.config.inputPlaceholder;
  const inputTooltip = config && typeof config.inputTooltip === 'string'
    ? config.inputTooltip : DEFAULT_CONFIG.config.inputTooltip;
  const uploadTooltip = config && typeof config.uploadTooltip === 'string'
    ? config.uploadTooltip : DEFAULT_CONFIG.config.uploadTooltip;
  const fileAccept = config && typeof config.accept === 'string'
    ? config.accept : DEFAULT_CONFIG.config.accept;
  const maxTerms = config && typeof config.maxSearchTerms === 'number'
    ? config.maxSearchTerms : DEFAULT_CONFIG.config.maxSearchTerms;

  const stateProps = (state) => ({ metadata: state.localFind.uploadMetadata });
  const dispatchProps = (dispatch) => ({
    onApplySearch: (data) => dispatch(updateUploadData(data)),
    updateMetadata: (data) => dispatch(updateUploadMetadata(data)),
  });

  return {
    UploadModal: withStyles(MODAL_STYLES, { withTheme: true })(connect(stateProps, dispatchProps)((props) => {
      const {
        classes, open, metadata = {},
        onApplySearch, updateMetadata,
      } = props;

      const {
        SummaryTable: summaryClasses,
      } = classes;
      const uploaderClasses = { refresh: classes.fileUploaderRefresh };

      const [filename, setUploadedFileName] = useState(metadata.filename || '');
      const [fileContent, setFileContent] = useState(metadata.fileContent || '');
      const [matchIds, setMatchIds] = useState(metadata.matched || []);
      const [unmatchedIds, setUnmatchedIds] = useState(metadata.unmatched || []);

      const overMaxTerms = matchIds.length > maxTerms;
      const errorText = `Total number of participants exceeds the maximum of ${maxTerms}.`;

      const clearData = () => {
        setFileContent('');
        setMatchIds([]);
        setUnmatchedIds([]);
        setUploadedFileName('');
        updateMetadata({});
      };

      const closeModalWrapper = () => {
        modalClosed();
        if (props.onCloseModal) props.onCloseModal();
      };

      const applySearchWrapper = () => {
        onApplySearch(matchIds);
        updateMetadata({ filename, fileContent, matched: matchIds, unmatched: unmatchedIds });
        closeModalWrapper();
      };

      const generateToolTip = (message) => (
        <ToolTip className={classes.customTooltip} classes={{ arrow: classes.customArrow }} title={message} arrow placement="bottom">
          <IconButton aria-label="help" className={classes.helpIconButton}>
            <HelpIcon className={classes.helpIcon} fontSize="small" />
          </IconButton>
        </ToolTip>
      );

      const handleContent = async (content) => {
        if (!content || typeof content !== 'string' || !content.trim()) {
          setMatchIds([]);
          setUnmatchedIds([]);
          return;
        }
        const searchTokens = content
          .split(/[,\n]/g)
          .map((e) => e.trim().replace('\r', '').toUpperCase())
          .filter((e) => e && e.length > 1);
        const { matched, unmatched } = await searchMatches(searchTokens);
        setMatchIds(matched);
        setUnmatchedIds(unmatched);
      };

      const handleChange = ({ target: { value } }) => {
        setFileContent(value);
        handleContent(value);
      };

      const handleFileUpload = (fileName, content) => {
        setFileContent(content);
        setUploadedFileName(fileName);
        handleContent(content);
      };

      return (
        <Modal {...props} open={open} className={classes.modal} onClose={closeModalWrapper}>
          <div className={classes.paper}>
            <h1 className={classes.modalTitle}>
              <span>{modalTitle}</span>
              <IconButton
                className={classes.closeIcon}
                onClick={closeModalWrapper}
                aria-label="close"
              >
                <CloseIcon
                  className={clsx(classes.closeRoot, classes.modalCloseIcon)}
                />
              </IconButton>
            </h1>
            <div className={classes.modalContainer}>
              <div className={classes.textSection}>
                <div className={classes.inputLabel}>
                  <Typography>
                    <p className={classes.listTitle}>Add a list of Participant IDs:</p>
                  </Typography>
                  {inputTooltip ? generateToolTip(inputTooltip) : null}
                </div>
                <TextareaAutosize
                  value={fileContent}
                  name="caseDescription"
                  onChange={handleChange}
                  placeholder={inputPlaceholder}
                  className={classes.textArea}
                  id="local_find_upload_textarea"
                />
              </div>
              <div className={classes.uploadFile}>
                <div className={classes.orTitle}>or</div>
                <div className={classes.inputLabel}>
                  <Typography>
                    <p className={classes.listTitle}>Choose a file to upload:</p>
                  </Typography>
                  {uploadTooltip ? generateToolTip(uploadTooltip) : null}
                </div>
                <FileUploader
                  classes={uploaderClasses}
                  filename={filename}
                  onClear={clearData}
                  onUploadRead={handleFileUpload}
                  accept={fileAccept}
                />
              </div>
            </div>
            {fileContent && (
              <SummaryTable
                classes={summaryClasses}
                matched={matchIds}
                unmatched={unmatchedIds}
                error={overMaxTerms ? errorText : null}
              />
            )}
            <div className={classes.modalFooter}>
              <Button
                variant="contained"
                onClick={closeModalWrapper}
                style={{ backgroundColor: '#566672' }}
                className={classes.button}
                id="local_find_upload_cancel"
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={clearData}
                style={{ backgroundColor: '#437BBE' }}
                className={classes.button}
                id="local_find_upload_clear"
              >
                Clear
              </Button>
              <Button
                variant="contained"
                onClick={applySearchWrapper}
                style={overMaxTerms ? undefined : { backgroundColor: '#03A383' }}
                className={classes.button}
                disabled={overMaxTerms}
                id="local_find_upload_submit"
              >
                Submit
              </Button>
            </div>
          </div>
        </Modal>
      );
    })),
  };
};

export default UploadModalGenerator;
