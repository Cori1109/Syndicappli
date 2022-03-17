import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('xl')]: {
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(4),
    },
    [theme.breakpoints.down('lg')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(2),
    },
    '& .MuiTab-root':{
      paddingLeft: 0,
      paddingRight: 30,
      minWidth: 0,
      fontWeight:'bold'
    },
    '& .MuiTab-wrapper':{
      flexDirection: 'row',
      justifyContent: 'flex-start',
      textTransform: 'none',
      color: '#363636',
      [theme.breakpoints.up('xl')]: {
        fontSize :20
      },
      [theme.breakpoints.down('lg')]: {
        fontSize :14
      },
      [theme.breakpoints.down('md')]: {
        fontSize :10
      },
    },
    '& .MuiTab-textColorInherit.Mui-selected':{
      textDecoration: 'underline',
      textUnderlinePosition: 'under'
    },
  },
  title:{
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  titleText: {
    [theme.breakpoints.up('xl')]: {
      fontSize :35
    },
    [theme.breakpoints.down('lg')]: {
      fontSize :25
    },
    [theme.breakpoints.down('md')]: {
      fontSize :18
    },
  },
  body:{
    paddingTop:25
  },
  assemblyName: {
    [theme.breakpoints.up('xl')]: {
      fontSize :36
    },
    [theme.breakpoints.down('lg')]: {
      fontSize :25
    },
    [theme.breakpoints.down('md')]: {
      fontSize :18
    },
  },
  assemblyDate: {
    [theme.breakpoints.up('xl')]: {
      fontSize :18
    },
    [theme.breakpoints.down('lg')]: {
      fontSize :13
    },
    [theme.breakpoints.down('md')]: {
      fontSize :9
    },
  },
  assemblyDocuments: {
    [theme.breakpoints.up('xl')]: {
      fontSize :20
    },
    [theme.breakpoints.down('lg')]: {
      fontSize :14
    },
    [theme.breakpoints.down('md')]: {
      fontSize :10
    },
  },
  doc_tip:{
    [theme.breakpoints.up('xl')]: {
      fontSize :13
    },
    [theme.breakpoints.down('lg')]: {
      fontSize :9
    },
    [theme.breakpoints.down('md')]: {
      fontSize :6
    },
    textAlign: 'center'
  },
  tool: {
    [theme.breakpoints.up('xl')]: {
      minHeight: 67
    },
    [theme.breakpoints.down('lg')]: {
      minHeight: 47
    },
    [theme.breakpoints.down('md')]: {
      minHeight: 33
    },
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: 15,
    width: 500
  },
  padding: {
    padding: theme.spacing(2, 4, 3),
  },
  close: {
    cursor: 'pointer',
    color: 'gray'
  },
  div_indicator: {
    width: '100%',
    height: '100%',
    display: 'flex',
    position: 'fixed',
    paddingLeft: '35%',
    alignItems: 'center',
    marginTop: '-60px',
    zIndex: 999,
  },
  indicator: {
    color: 'gray'
  },
  documents: {
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    border: '1px solid rgba(112,112,112,0.43)',
    borderRadius: 8,
    [theme.breakpoints.up('xl')]: {
      width: 116,
      height: 92,
      marginTop: 20,
    },
    [theme.breakpoints.down('lg')]: {
      width: 81,
      height: 64,
      marginTop: 14,
    },
    [theme.breakpoints.down('md')]: {
      width: 57,
      height: 45,
      marginTop: 10,
    },
  },
  place: {
    [theme.breakpoints.up('xl')]: {
      width: 15,
      height: 21,
    },
    [theme.breakpoints.down('lg')]: {
      width: 11,
      height: 15,
    },
    [theme.breakpoints.down('md')]: {
      width: 8,
      height: 11,
    },
    float:'left'
  },
  bodyContent: {
    [theme.breakpoints.up('xl')]: {
      paddingTop: 120
    },
    [theme.breakpoints.down('lg')]: {
      paddingTop: 84
    },
    [theme.breakpoints.down('md')]: {
      paddingTop: 60
    },
  },
  sizepng: {
    [theme.breakpoints.up('xl')]: {
      width: 116,
      height: 92,
    },
    [theme.breakpoints.down('lg')]: {
      width: 81,
      height: 64,
    },
    [theme.breakpoints.down('md')]: {
      width: 57,
      height: 45,
    },
  },
  size: {
    [theme.breakpoints.up('xl')]: {
      width: 49,
      height: 61,
    },
    [theme.breakpoints.down('lg')]: {
      width: 35,
      height: 43,
    },
    [theme.breakpoints.down('md')]: {
      width: 25,
      height: 30,
    },
  },
}));

  export default useStyles;