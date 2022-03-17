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
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  padding: {
    padding: theme.spacing(2, 4, 3),
  },
  close: {
    cursor: 'pointer',
    color: 'gray'
  }
}));

export const BudgetStyles = makeStyles((theme, props)=> ({
  root: {
    height: '100%'
  },
  content: {
    alignItems: 'center',
    display: 'flex'
  },
  title: {
    [theme.breakpoints.up('xl')]: {
      fontWeight: 700
    },
    [theme.breakpoints.down('lg')]: {
      fontWeight: 490
    },
    [theme.breakpoints.down('md')]: {
      fontWeight: 343
    },
  },
  avatar: {
    backgroundColor: theme.palette.error.main,
    [theme.breakpoints.up('xl')]: {
      height: 56,
      width: 56
    },
    [theme.breakpoints.down('lg')]: {
      height: 39,
      width: 39
    },
    [theme.breakpoints.down('md')]: {
      height: 27,
      width: 27
    },
  },
  icon: {
    [theme.breakpoints.up('xl')]: {
      height: 32,
      width: 32
    },
    [theme.breakpoints.down('lg')]: {
      height: 22,
      width: 22
    },
    [theme.breakpoints.down('md')]: {
      height: 15,
      width: 15
    },
  },
  difference: {
    marginTop: theme.spacing(2),
    display: 'flex',
    alignItems: 'center'
  },
  differenceIcon: {
    color: props=>props.color
  },
  differenceValue: {
    color: props=>props.color,
    marginRight: theme.spacing(1),
    [theme.breakpoints.up('xl')]: {
      fontSize: 15
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 11
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 8
    },
  },
  tail:{
    [theme.breakpoints.up('xl')]: {
      fontSize: 15
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 11
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 8
    },
  },
  bodyTitle:{
    [theme.breakpoints.up('xl')]: {
      fontSize: 31
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 22
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 15
    },
  },
  caption:{
    [theme.breakpoints.up('xl')]: {
      fontSize: 18
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 13
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 11
    },
  },
  show: {
    visibility: 'visible',
    position: 'absolute',
    color: props=>props.color,
    zIndex: 0
  },
  hide: {
    visibility : 'hidden',
    color: props=>props.color,
    zIndex: 1
  }
}));
  export default useStyles;