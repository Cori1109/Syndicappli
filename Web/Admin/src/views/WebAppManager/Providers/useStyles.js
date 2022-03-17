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
  modalTitle: {
    [theme.breakpoints.up('xl')]: {
      fontSize :28
    },
    [theme.breakpoints.down('lg')]: {
      fontSize :20
    },
    [theme.breakpoints.down('md')]: {
      fontSize :14
    },
  },
  subTitle: {
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
    [theme.breakpoints.up('xl')]: {
      padding: 32
    },
    [theme.breakpoints.down('lg')]: {
      padding: 22
    },
    [theme.breakpoints.down('md')]: {
      padding: 15
    },
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
}));

export const AddProviderStyles = makeStyles(theme => ({
  paper: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: 5,
      padding: theme.spacing(2, 4, 3),
      // width: 500
  },
  footer: {
    [theme.breakpoints.up('xl')]: {
      paddingTop: 89,
    },
    [theme.breakpoints.down('lg')]: {
      paddingTop: 62,
    },
    [theme.breakpoints.down('md')]: {
      paddingTop: 43,
    },
    paddingBottom: 30
  },
  root: {
      '& .MuiOutlinedInput-input':{
        [theme.breakpoints.up('xl')]: {
          padding: '17px 25px',
          fontSize: 22,
        },
        [theme.breakpoints.down('lg')]: {
          padding: '12px 18px',
          fontSize: 15,
        },
        [theme.breakpoints.down('md')]: {
          padding: '8px 13px',
          fontSize: 11,
        },
      },
      '& p':{
          marginBottom: 0
      },
  },
  plus:{
    color: '#707070',
    [theme.breakpoints.up('xl')]: {
      width:31 , 
      height: 31,
    },
    [theme.breakpoints.down('lg')]: {
      width:22 , 
      height: 22,
    },
    [theme.breakpoints.down('md')]: {
      width:15 , 
      height: 15,
    },
  },
  input: {
      display: 'none'
  },
  img: {
    objectFit:'cover',
      cursor: 'pointer',
      alignItems: 'center',
      justifyContent: 'center',
      display: 'flex',
      border: '1px dashed rgba(112,112,112,0.43)',
      borderRadius: 8,
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
  title:{
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 13,
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 9,
    },
  },
  error:{
      color: 'red',
      [theme.breakpoints.up('xl')]: {
        fontSize: 18,
      },
      [theme.breakpoints.down('lg')]: {
        fontSize: 13,
      },
      [theme.breakpoints.down('md')]: {
        fontSize: 9,
      },
  },
  div_indicator: {
    width: '100%',
    height: '100%',
    display: 'flex',
    position: 'fixed',
    paddingLeft: '50%',
    alignItems: 'center',
    marginTop: '-60px',
    zIndex: 999,
  },
  indicator: {
    color: 'gray'
  },
}));
export const EditProviderStyles = makeStyles(theme => ({
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
    '& .MuiTextField-root': {
      // width: '100%'
  },
  '& .MuiOutlinedInput-input':{
      [theme.breakpoints.up('xl')]: {
        padding: '17px 25px',
        fontSize: 22,
      },
      [theme.breakpoints.down('lg')]: {
        padding: '12px 18px',
        fontSize: 15,
      },
      [theme.breakpoints.down('md')]: {
        padding: '8px 13px',
        fontSize: 11,
      },
    },
    '& p':{
      marginBottom: 0
    }
  },
  title:{
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  body: {
    [theme.breakpoints.up('xl')]: {
      marginTop: 64,
      marginBottom: 64,
      padding: 40,
      borderRadius: 30,
    },
    [theme.breakpoints.down('lg')]: {
      marginTop: 45,
      marginBottom: 45,
      padding: 28,
      borderRadius: 21,
    },
    [theme.breakpoints.down('md')]: {
      marginTop: 32,
      marginBottom: 32,
      padding: 20,
      borderRadius: 15,
    },
    boxShadow: '0 3px 5px 2px rgba(128, 128, 128, .3)',
  },
  item:{
    marginTop: theme.spacing(5),
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  plus:{
    color: '#707070',
    [theme.breakpoints.up('xl')]: {
      width:31 , 
      height: 31,
    },
    [theme.breakpoints.down('lg')]: {
      width:22 , 
      height: 22,
    },
    [theme.breakpoints.down('md')]: {
      width:15 , 
      height: 15,
    },
  },
  size: {
    [theme.breakpoints.up('xl')]: {
      width: 214,
      height: 214,
    },
    [theme.breakpoints.down('lg')]: {
      width: 150,
      height: 150,
    },
    [theme.breakpoints.down('md')]: {
      width: 105,
      height: 105,
    },
  },
  input: {
    display: 'none',
  }, 
  div_indicator: {
    width: '100%',
    height: '100%',
    display: 'flex',
    position: 'fixed',
    paddingLeft: '50%',
    alignItems: 'center',
    marginTop: '-60px',
    zIndex: 999,
  },
  indicator: {
    color: 'gray'
  },
  backTitle:{
    cursor: 'pointer',
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 13,
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 9,
    },
  },
  itemTitle:{
    [theme.breakpoints.up('xl')]: {
      fontSize: 25,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 18,
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 13,
    },
  },
  error:{
      color: 'red',
      [theme.breakpoints.up('xl')]: {
        fontSize: 18,
      },
      [theme.breakpoints.down('lg')]: {
        fontSize: 13,
      },
      [theme.breakpoints.down('md')]: {
        fontSize: 9,
      },
  },
  headerTitle:{
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
  sepaTitle:{
    [theme.breakpoints.up('xl')]: {
      fontSize :28
    },
    [theme.breakpoints.down('lg')]: {
      fontSize :20
    },
    [theme.breakpoints.down('md')]: {
      fontSize :14
    },
  },
  permissionItemTitle:{
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 13,
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 9,
    },
  },
  img: {
    objectFit:'cover',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    border: '1px dashed rgba(112,112,112,0.43)',
    borderRadius: 8,
    [theme.breakpoints.up('xl')]: {
      width: 362,
      height: 278,
      marginTop: 30,
      marginRight: 30
    },
    [theme.breakpoints.down('lg')]: {
      width: 253,
      height: 177,
      marginTop: 21,
      marginRight: 21
    },
    [theme.breakpoints.down('md')]: {
      width: 177,
      height: 124,
      marginTop: 15,
      marginRight: 15
    },
  },
  editAvatar:{
    cursor:'pointer',
    [theme.breakpoints.up('xl')]: {
      width: 54,
      height: 54,
    },
    [theme.breakpoints.down('lg')]: {
      width: 38,
      height: 38,
    },
    [theme.breakpoints.down('md')]: {
      width: 27,
      height: 27,
    },
      backgroundColor: 'white',
      borderRadius: '50%',
      color: 'gray'
  }
}));
  export default useStyles;