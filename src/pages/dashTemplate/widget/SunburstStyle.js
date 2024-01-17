import { makeStyles } from "@material-ui/core";

const sunburstStyle = makeStyles({
  label: {
    fontSize: '12px',
    textAnchor: 'middle',
    textAlign: 'center',
    fill: (props) => (props && props.textColor ? props.textColor : 'black'),
    fontFamily: (props) => (props && props.fontFamily ? props.fontFamily : 'Nunito'),
    '& text': {
      fill: (props) => (props && props.textColor ? props.textColor : 'black'),
      textAnchor: 'middle',
    },
  },
  widgetContainer: {
    margin: '18px auto 0px auto',
  },
  title: {
    color: (props) => (props && props.textColor ? props.textColor : 'black'),
    fontSize: '12px',
    fontFamily: 'Nunito',
    lineHeight: '20px',
    fontWeight: 500,
    height: '20px',
    textAlign: (props) => (props && props.titleAlignment ? props.titleAlignment : 'center'),
    width: '250px',
    margin: 'auto',
  },
});

export default sunburstStyle;