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
  itemTitle: {
    [theme.breakpoints.up('xl')]: {
      fontSize :22
    },
    [theme.breakpoints.down('lg')]: {
      fontSize :15
    },
    [theme.breakpoints.down('md')]: {
      fontSize :11
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
  price:{
    [theme.breakpoints.up('xl')]: {
      marginTop: 70,
      fontSize :40
    },
    [theme.breakpoints.down('lg')]: {
      marginTop: 50,
      fontSize :28
    },
    [theme.breakpoints.down('md')]: {
      marginTop: 35,
      fontSize :20
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
  }
}));

export const ModulePaymentStyles = makeStyles(theme => ({
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
    '& .MuiOutlinedInput-multiline':{
      padding: 0,
      lineHeight: 'normal'
    },
    '& p':{
      marginBottom: 0
    }
  },
  title:{
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  tool:{
    [theme.breakpoints.up('xl')]: {
      minHeight: 200
    },
    [theme.breakpoints.down('lg')]: {
      minHeight: 140
    },
    [theme.breakpoints.down('md')]: {
      minHeight: 100
    },
  },
  body: {
    [theme.breakpoints.up('xl')]: {
      marginTop: 64,
      marginBottom: 64,
      padding: 84,
      borderRadius: 30,
    },
    [theme.breakpoints.down('lg')]: {
      marginTop: 45,
      marginBottom: 45,
      padding: 59,
      borderRadius: 21,
    },
    [theme.breakpoints.down('md')]: {
      marginTop: 32,
      marginBottom: 32,
      padding: 42,
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
  billingAddress:{
    [theme.breakpoints.up('xl')]: {
      fontSize: 20,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 14,
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 10,
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
  price:{
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
  sepaItemTitle:{
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
  modifier:{
    [theme.breakpoints.up('xl')]: {
      fontSize: 15,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 11,
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 8,
    },
  },
  cardLeftPart:{
    [theme.breakpoints.up('xl')]: {
      width: 76,
      height: 231,
      borderTopRightRadius: 15,
      borderBottomRightRadius: 15
    },
    [theme.breakpoints.down('lg')]: {
      width: 53,
      height: 162,
      borderTopRightRadius: 11,
      borderBottomRightRadius: 11
    },
    [theme.breakpoints.down('md')]: {
      width: 37,
      height: 114,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8
    },
    boxShadow: '2px 2px 10px 5px rgba(0,0,0,0.16)',
    backgroundColor: '#72FEE6',
    opacity: 0.5
  },
  cardMainPart:{
    [theme.breakpoints.up('xl')]: {
      width: 391,
      height: 231,
      borderRadius: 15
    },
    [theme.breakpoints.down('lg')]: {
      width: 273,
      height: 162,
      borderRadius: 11
    },
    [theme.breakpoints.down('md')]: {
      width: 191,
      height: 114,
      borderRadius: 8
    },
    boxShadow: '0px 2px 8px 3px rgba(0,0,0,0.16)',
    background: 'linear-gradient(90deg, #48C9FF 10%, #72FEE6 100%)',
  },
  cardRightPart:{
    [theme.breakpoints.up('xl')]: {
      width: 76,
      height: 231,
      borderTopLeftRadius: 15,
      borderBottomLeftRadius: 15
    },
    [theme.breakpoints.down('lg')]: {
      width: 53,
      height: 162,
      borderTopLeftRadius: 11,
      borderBottomLeftRadius: 11
    },
    [theme.breakpoints.down('md')]: {
      width: 37,
      height: 114,
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8
    },
    boxShadow: '-2px 2px 10px 5px rgba(0,0,0,0.16)',
    backgroundColor: '#48C9FF',
    opacity: 0.5
  },
  cardBody: {
    [theme.breakpoints.up('xl')]: {
      padding: 20,
    },
    [theme.breakpoints.down('lg')]: {
      padding: 14,
    },
    [theme.breakpoints.down('md')]: {
      padding: 10,
    },
  },
  cardType: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 24,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 17,
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 12,
    },
    color: 'white',
    fontStyle: 'italic'
  },
  cardNumberPan: {
    [theme.breakpoints.up('xl')]: {
      marginTop: 50,
    },
    [theme.breakpoints.down('lg')]: {
      marginTop: 35,
    },
    [theme.breakpoints.down('md')]: {
      marginTop: 25,
    },
  },
  cardNumber: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 14,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 10,
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 7,
    },
    color: 'white',
  },
  cardHolderPan: {
    [theme.breakpoints.up('xl')]: {
      marginTop: 50,
    },
    [theme.breakpoints.down('lg')]: {
      marginTop: 35,
    },
    [theme.breakpoints.down('md')]: {
      marginTop: 25,
    },
  },
  cardHolder: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 12,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 8,
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 6,
    },
    color: 'white',
  }
}));
  export default useStyles;