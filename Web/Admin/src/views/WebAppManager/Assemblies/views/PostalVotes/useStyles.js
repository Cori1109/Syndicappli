import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({

  title:{
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
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
}));
export const AddPostalVoteStyles = makeStyles(theme => ({
  paper: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: 5,
      padding: theme.spacing(2, 4, 3),
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
      '& .MuiOutlinedInput-multiline':{
        padding: 0,
        lineHeight: 'normal'
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
export const EditPostalVoteStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('xl')]: {
      marginTop: 64,
      marginBottom: 64,
      paddingTop: 58,
      paddingBottom: 58,
      borderRadius: 30,
    },
    [theme.breakpoints.down('lg')]: {
      marginTop: 45,
      marginBottom: 45,
      paddingTop: 41,
      paddingBottom: 41,
      borderRadius: 21,
    },
    [theme.breakpoints.down('md')]: {
      marginTop: 32,
      marginBottom: 32,
      paddingTop: 29,
      paddingBottom: 29,
      borderRadius: 15,
    },
    boxShadow: '0 3px 5px 2px rgba(128, 128, 128, .3)',
  },
  editHeader: {
    [theme.breakpoints.up('xl')]: {
      paddingLeft: 58,
      paddingRight: 58,
      marginBottom: 64,
    },
    [theme.breakpoints.down('lg')]: {
      paddingLeft: 41,
      paddingRight: 41,
      marginBottom: 45,
    },
    [theme.breakpoints.down('md')]: {
      paddingLeft: 29,
      paddingRight: 29,
      marginBottom: 32,
    },
  },
  title:{
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  headerTitle:{
    [theme.breakpoints.up('xl')]: {
      fontSize :32
    },
    [theme.breakpoints.down('lg')]: {
      fontSize :22
    },
    [theme.breakpoints.down('md')]: {
      fontSize :15
    },
  },
  subTitle:{
    [theme.breakpoints.up('xl')]: {
      fontSize :16
    },
    [theme.breakpoints.down('lg')]: {
      fontSize :11
    },
    [theme.breakpoints.down('md')]: {
      fontSize :8
    },
  },
  close: {
    cursor: 'pointer',
    [theme.breakpoints.up('xl')]: {
      width: 35,
      height: 35,
      marginRight: -28
    },
    [theme.breakpoints.down('lg')]: {
      width: 25,
      height: 25,
      marginRight: -20
    },
    [theme.breakpoints.down('md')]: {
      width: 18,
      height: 18,
      marginRight: -14
    },
    backgroundColor: '#eeeeee',
    borderRadius: '50%',
    color: '#212121',
    padding: 3
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
  
  line: {
    backgroundColor: '#E8E8E8',
    height: 1
}
}));
  export default useStyles;