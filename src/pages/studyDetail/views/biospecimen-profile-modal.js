import React from 'react';
import { BarChartV2 } from '../../../components/BarChartV2/index.js';
import { navigatedToDashboard } from '../../../utils/utils.js';
import { argumentConfiguration, palette, timePointArgumentConfiguration } from '../../../bento/studyDetailData.js';
import { useBiospecimenProfileModal } from './biospecimen-profile-modal-store.js';
import { Box, IconButton, Dialog, DialogContent, Tab, Tabs, Grid } from '@material-ui/core';
import { TabContext, TabPanel, } from '@material-ui/lab';
import CloseIcon from '@material-ui/icons/Close';
import {
  StyledLink,
} from './biospecimen-profile-modal-styled.js';

const tabLabels = ['Timepoint', 'Biospecimens'];

const BiospecimenProfileModal = ({ biospecimenProfile, data, studyName, studyCode }) => {

  const [{ isModalOpen, currentTab }, { setIsModalOpen, setCurrentTab }] =
    useBiospecimenProfileModal();

  const [, actions] = useBiospecimenProfileModal();
  const filterStudy = `${studyCode}`;

  const handleTabChange = async (event, newValue) => {
    await setCurrentTab(newValue);
  };

  const showModal = async () => {
    await setIsModalOpen(true);
  };

  const handleClose = async () => {
    await setIsModalOpen(false);
  };

  const linkToDashboard = async () => {
    navigatedToDashboard(filterStudy);
    await setIsModalOpen(false);
    await setCurrentTab('1');
  };

  return(
    <>
      <Box
        component={'div'}
        onClick={showModal}
        sx={{
          color: '#990099',
          textDecoration: 'underline',
          cursor: 'pointer',
          fontFamily: 'Inter',
          fontWeight: '600',
          fontSize: '16px',
          marginTop: '5px'
        }}
      >
        Open Expanded View
      </Box>
      <Dialog
        onClose={handleClose}
        open={isModalOpen}
        maxWidth= 'md'
        fullWidth={true}
      >
        <Box
          sx={{
            fontFamily: 'Inter',
            color: '#066D93',
            fontWeight: '400',
            fontSize: '18px',
            padding: '15px 0px 5px 0px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Box sx={{ marginRight: '8px' }}>
            {"Biospecimen Profile: "}
          </Box>
          <Box sx={{ fontWeight: '500' }}>
            {studyName} {studyCode}
          </Box>
        </Box>
        <Box sx= {{position: 'absolute', top: '10px', right: '12px'}}>
          <IconButton aria-label="close modal" onClick={handleClose}>
              <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent>
          <TabContext value={currentTab}>
            <Box>
              <Box
                sx={{
                  marginTop: '15px',
                  marginLeft: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingRight: '45px',
                }}
              >
                <Tabs
                  value={currentTab}
                  onChange={handleTabChange}
                  aria-label="lab API tabs example"
                  textColor='primary'
                  TabIndicatorProps={{
                    style: {
                      backgroundColor: '#0296C9',
                      height: '5px',
                      bottom: 8,
                    }
                  }}
                  sx={{
                    flexGrow: 1,
                  }}
                >
                  {tabLabels.map((tabLabel, index) => (
                    <Tab 
                      key={`tab-label-${index + 1}`} 
                      label={tabLabel} 
                      value={String(index + 1)}
                    />
                  ))}
                </Tabs>
                <Box
                  component={'span'}
                  sx={{
                    width:'218px',
                    height: '37px',
                    textAlign: 'center',
                    background: '#E7E5E5',
                    padding: '4px 5px 4px 5px',
                    position: 'relative',
                    bottom: '16px'
                  }}
                >
                  <Box
                    component={'div'}
                    sx={{
                      width: '200px',
                      fontSize: '13px',
                      display: 'inherit',
                      height: '37px',
                      marginTop: '5px',
                    }}
                  >
                    <StyledLink
                      to={() => ({
                        pathname: '/explore',
                      })}
                      onClick={() => linkToDashboard()}
                    >
                      <Box
                        component={'span'}
                        sx={{
                          fontFamily: 'Inter',
                          fontSize: '14px',
                          marginRight: '8px',
                          fontWeight: '700',
                          color: '#990099',
                          width: 'auto',
                          borderBottom: '2px solid #990099',            
                        }}
                      >
                        {data.sample_count}
                      </Box>
                      <Box
                        component={'span'}
                        sx={{
                          fontFamily: 'Inter',
                          color: '#0B3556',
                          fontSize: '12px',
                          fontStyle: 'normal',
                          fontWeight: '400',
                          lineHeight: '14px',
                          letterSpacing: '0.15px',
                        }}
                      >
                        Associated Biospecimens
                      </Box>
                    </StyledLink>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  height: '1px', 
                  backgroundColor: '#42779A', 
                  marginLeft: '10px', 
                  marginTop: '-8px',
                  marginBottom: '15px',
                }}
              />
              <Grid>
                {biospecimenProfile && biospecimenProfile.tabs && biospecimenProfile.tabs.map((item,index) => {
                  return(
                    <TabPanel 
                      value = {String(index+1)}
                      sx={{
                        padding: '0px'
                      }}
                    >
                      <BarChartV2
                        chartData={data[item.value]}
                        palette={palette}
                        xAxisLabel={item.label === 'TIMEPOINT' ? timePointArgumentConfiguration.title.text:argumentConfiguration.title.text}
                        yAxisLabel={'Biospecimen Count'}
                      />
                    </TabPanel>
                  )
                })}
              </Grid>
            </Box>
          </TabContext>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BiospecimenProfileModal;