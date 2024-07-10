import React, { useCallback } from 'react';
import {
  Button,
  Collapse,
  FormControlLabel,
  Grid,
  withStyles,
} from '@material-ui/core';
import { WidgetGenerator } from '@bento-core/widgets';
// import { useTheme } from '../../../components/ThemeContext';
import styles from './WidgetStyle';
import { widgetConfig } from '../../../bento/dashTemplate';
import colors from '../../../utils/colors';
import { Typography } from '../../../components/Wrappers/Wrappers';
import { formatWidgetData } from './WidgetUtils';
import sunburstStyle from './SunburstStyle'
import { DEFAULT_VALUE } from '../../../bento/siteWideConfig';

const WidgetView = ({
  classes,
  data,
  theme,
}) => {
  const displayWidgets = formatWidgetData(data, widgetConfig);
  const [collapse, setCollapse] = React.useState(true);
  // const themeChanger = useTheme(); Hidding Dark Mode
  const handleChange = () => setCollapse((prev) => !prev);

  const widgetGeneratorConfig = {
    theme,
    DonutConfig: {
      colors,
      styles: {
        cellPadding: 2,
        textOverflowLength: 20,
        textColor: theme.palette.widgetBackground.contrastText,
      },
    },
    SunburstConfig: {
      classes: sunburstStyle(),
      styles: {
        textColor: theme.palette.widgetBackground.contrastText,
        sunburst: {
          stroke: '#ddd',
          strokeOpacity: 0.3,
          strokeWidth: '0.5',
        },
      },
    }
  };
  const { Widget } = useCallback(WidgetGenerator(widgetGeneratorConfig), []);

  const titleTransformer = (sunburstTitle) => {
    if (sunburstTitle.includes(':')) {
      // Extract the title parts
      const [firstString, secondString] = sunburstTitle.split(' : ');
      // Replace empty strings with the value of DEFAULT_VALUE("No value") from /bento/siteWideConfig
      return `${firstString || DEFAULT_VALUE } : ${secondString || DEFAULT_VALUE}`;
    }
    return sunburstTitle;
  };
  
  return (
    <>
      <div className={classes.widgetsCollapse}>
        <div className={classes.floatLeft} />
        <div className={classes.floatRight}>
          <FormControlLabel
            control={(
              <Button className={classes.customButton} onClick={handleChange}>
                {collapse ? 'COLLAPSE VIEW' : 'OPEN VIEW'}
              </Button>
            )}
          />
          {/*
          Hidding Dark Mode
          <Switch
            classes={{
              root: classes.switchRoot,
              switchBase: classes.switchBase,
              thumb: classes.thumb,
              track: classes.track,
              checked: classes.checked,
            }}
            className={classes.customSwitch}
            disableRipple
            checked={themeChanger.dark}
            onChange={themeChanger.toggleTheme}
            inputProps={{ 'aria-label': 'Switch between dark and light themes' }}
          /> */}
        </div>
      </div>
      <Collapse in={collapse} className={classes.backgroundWidgets}>
        <Grid container>
          {widgetConfig.slice(0, 6).map((widget, index) => {
            const dataset = displayWidgets[widget.dataName];
            if (!dataset || dataset.length === 0) {
              return <></>;
            }
            if (widget.type === 'sunburst' && (!dataset.children || !dataset.children.length)) {
              return <></>;
            }
            return (
              <Grid key={index} item lg={4} md={6} sm={12} xs={12}>
                <Widget
                  header={(
                    <Typography size="md" weight="normal" family="Nunito" color="lochmara">
                      {widget.title}
                    </Typography>
                  )}
                  bodyClass={classes.fullHeightBody}
                  className={classes.card}
                  bottomDivider
                  customBackGround
                  data={dataset}
                  chartType={widget.type}
                  sliceTitle={widget.sliceTitle}
                  chartTitleLocation="bottom"
                  chartTitleAlignment="center"
                  resetSunburstOnMouseOut={widget.resetSunburstOnMouseOut}
                  titleTransformer={titleTransformer}
                />
              </Grid>
            );
          })}
        </Grid>
      </Collapse>
      {collapse && <div className={classes.dashboardDividerTop} />}
      {collapse && <div className={classes.dashboardDivider} />}
    </>
  );
};

export default withStyles(styles, { withTheme: true })(WidgetView);
