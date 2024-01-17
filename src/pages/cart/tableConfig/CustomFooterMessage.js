import React from 'react'
const linkImg = require("../../../assets/icons/External_Link.Data_Availability 1.svg");

const CustomFooterMessage = () => (
    <div style={{
        fontFamily: 'Nunito Sans',
        backgroundColor: 'white',
        fontStyle: 'normal',
        fontWeight: 400,
        fontSize: '14px',
        color: 'rgba(0, 0, 0, 0.65)',
        lineHeight: '19px',
    }}>
        {/* eslint-disable-next-line max-len */}
        <p>
            To access and analyze files, select and remove unwanted files, click the "Download File Manifest" button, and upload the resulting manifest file to your 
            {' '}
            <a
                style={{ color: '#990099' }}
                target="_blank"
                rel="noreferrer"
                href="https://cgc-accounts.sbgenomics.com/auth/login?next=https%3A%2F%2Fcgc-accounts.sbgenomics.com%2F"
            >
                <span style={{ textDecoration: 'underline', margin: 0, padding: 0 }}>
                    Velsera Seven Bridges Cancer Genomics Cloud account.
                    <img src={linkImg} style={{ margin: '5px', marginBottom: '-4px' }} />
                </span>
            </a>

        </p>


    </div>
)

export default CustomFooterMessage;