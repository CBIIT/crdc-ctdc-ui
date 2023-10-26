import React from 'react'
import { withStyles } from "@material-ui/core";
import Styles from './customToolTipContent.style';

const CustomToolTipContent = ({ classes }) => (
    <div className={classes.downloadFileManifestTooltip}>
        {/* eslint-disable-next-line max-len */}
        Click this button to download a file manifest that can be uploaded into your  
             {' '}
        <a
            style={{ color: '#blue' }}
            target="_blank"
            rel="noreferrer"
            href="https://cgc-accounts.sbgenomics.com/auth/login?next=https%3A%2F%2Fcgc-accounts.sbgenomics.com%2F"
        >
            <span style={{ textDecoration: 'underline', margin: 0, padding: 0 }}>
                Velsera Seven Bridges Cancer Genomics Cloud account
            </span>
        </a>
        {' '}
        for cloud access  
    </div>
)

export default withStyles(Styles, { withTheme: true })(CustomToolTipContent);