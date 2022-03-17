import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('xl')]: {
      paddingTop: theme.spacing(12.5),
      '& .MuiOutlinedInput-input': {
        padding: '17px 25px',
        fontSize: 22,
      },
    },
    [theme.breakpoints.between('lg', 'lg')]: {
      paddingTop: theme.spacing(10.5),
      '& .MuiOutlinedInput-input': {
        padding: '11px 17px',
        fontSize: 15,
      },
    },
    [theme.breakpoints.down('md')]: {
      paddingTop: theme.spacing(9),
      '& .MuiOutlinedInput-input': {
        padding: '7px 12px',
        fontSize: 11,
      },
    },
    paddingTop: theme.spacing(15),
    justifyContent: 'center',
    '& .MuiOutlinedInput-root': {
      borderRadius: 8
    }
  },
  title: {
    [theme.breakpoints.up('xl')]: {
      width: 958,
      padding: 61,
      fontSize: 20,
      textIndent: -10,
    },
    [theme.breakpoints.down('lg')]: {
      width: 670,
      padding: 42,
      fontSize: 14,
      textIndent: -7,
    },
    [theme.breakpoints.down('md')]: {
      width: 469,
      padding: 29,
      fontSize: 10,
      textIndent: -5,
    },
    color: 'white',
    textAlign: 'center'
  },
  input: {
    [theme.breakpoints.up('xl')]: {
      padding: theme.spacing(5)
    },
    [theme.breakpoints.down('lg')]: {
      padding: theme.spacing(4)
    },
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(3)
    },
  },
  logo: {
    [theme.breakpoints.up('xl')]: {
      width: 438,
      height: 90
    },
    [theme.breakpoints.down('lg')]: {
      width: 306,
      height: 63
    },
    [theme.breakpoints.down('md')]: {
      width: 214,
      height: 44
    },
  },
  forgot: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(2),
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 12,
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(1),
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 8,
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(1),
    },
    color: 'white',
    textDecoration: 'underline',
    paddingRight: 4
  },
  boxTitle: {
    textAlign: 'center',
    [theme.breakpoints.up('xl')]: {
      fontSize: 35
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 24
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 17
    },
    padding: 0
  },
  itemTitle: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 20
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 14
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 10
    },
  },
  body: {
    [theme.breakpoints.up('xl')]: {
      paddingTop: theme.spacing(6),
      paddingBottom: theme.spacing(6)
    },
    [theme.breakpoints.down('lg')]: {
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4)
    },
    [theme.breakpoints.down('md')]: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3)
    },
    backgroundColor: 'white',
    borderRadius: 15,
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
  error: {
    color: 'red',
    [theme.breakpoints.up('xl')]: {
      fontSize: 20
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 14
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 10
    },
  },
  button1: {
    [theme.breakpoints.up('xl')]: {
      padding: '15px 30px',
      borderRadius: '52px',
      fontSize: 20
    },
    [theme.breakpoints.between('lg','lg')]: {
      padding: '10px 21px',
      borderRadius: '36px',
      fontSize: 14
    },
    [theme.breakpoints.down('md')]: {
      padding: '7px 15px',
      borderRadius: '25px',
      fontSize: 10
    },
    background: 'linear-gradient(90deg, #00C9FF 10%, #0CC77C 90%)',
    color: 'white',
    textTransform: 'none',
    border: '1px solid',
  },
}));
export default useStyles;