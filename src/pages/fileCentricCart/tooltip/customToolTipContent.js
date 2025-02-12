import React from 'react'
import { withStyles } from "@material-ui/core";
import Styles from './customToolTipContent.style';

const CustomToolTipContent = ({ classes }) => (
    <div className={classes.downloadFileManifestTooltip}>
        {/* eslint-disable-next-line max-len */}
        Click this button to download a file manifest that can be uploaded into your  
         Velsera Seven Bridges Cancer Genomics Cloud account for cloud access  
    </div>
)

export default withStyles(Styles, { withTheme: true })(CustomToolTipContent);