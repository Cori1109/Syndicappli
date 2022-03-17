import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withRouter } from 'react-router-dom';
import authService from 'services/authService';

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
    '& .MuiOutlinedInput-multiline':{
      padding: 0,
      lineHeight: 'normal'
    },
    '& .MuiOutlinedInput-input': {
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
    '& p': {
      marginBottom: 0
    }
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
  title: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  body: {
    [theme.breakpoints.up('xl')]: {
      borderRadius: 30,
    },
    [theme.breakpoints.down('lg')]: {
      borderRadius: 21,
    },
    [theme.breakpoints.down('md')]: {
      borderRadius: 15,
    },
    marginBottom: 40
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  itemTitle: {
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

}));
const Help = (props) => {
  const { history } = props;

  const token = authService.getToken();    
  if (!token) {
    window.location.replace("/login");
  }
  const classes = useStyles();

  return (

      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h2" className={classes.headerTitle}>
            <b>Contactez-nous</b>
          </Typography>
        </div>
        <div className={classes.tool}>
        </div>
        <div className={classes.body}>
          <Grid item container xs={12} sm={6} md={6} lg={5} xl={4} justify="flex-start" direction="column" spacing={4}>
            <Grid item>
              <p className={classes.headerTitle}>Email : Syndicappli@gmail.com</p>
            </Grid>
            <Grid item>
              <p className={classes.headerTitle}>Téléphone : +33180272016</p>
            </Grid>
          </Grid>
        </div>
      </div>

  );
};

export default withRouter(Help);
