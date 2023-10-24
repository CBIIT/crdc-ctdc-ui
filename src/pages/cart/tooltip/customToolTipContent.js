import React from 'react'
import { withStyles } from "@material-ui/core";
import Styles from './customToolTipContent.style';

const CustomToolTipContent = ({ classes }) => (
    <div className={classes.downloadFileManifestTooltip}>
        {/* eslint-disable-next-line max-len */}
        To access and analyze files, select and remove unwanted files, click the "Download File Manifest" button, and upload the resulting manifest file to your         {' '}
        <a
            style={{ color: '#1A8CCB' }}
            target="_blank"
            rel="noreferrer"
            href="https://cgc-accounts.sbgenomics.com/auth/login?next=https%3A%2F%2Fcgc-accounts.sbgenomics.com%2F"
        >
            <span style={{ textDecoration: 'underline', margin: 0, padding: 0 }}>
                Velsera Seven Bridges Cancer Genomics Cloud account
            </span>
        </a>
        {' '}
        account.
    </div>
)

export default withStyles(Styles, { withTheme: true })(CustomToolTipContent);