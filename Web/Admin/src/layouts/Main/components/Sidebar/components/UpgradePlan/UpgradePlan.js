import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import authService from '../../../../../../services/authService';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    minHeight: 'fit-content',
    align: 'center',
    bottom: 0,

    [theme.breakpoints.up('xl')]: {
      marginBottom: 29,
      marginLeft: 46,
    },
    [theme.breakpoints.between('lg','lg')]: {
      marginBottom: 20,
      marginLeft: 32,
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: 14,
      marginLeft: 22,
    },
    '& MuiSvgIcon-root' : {
      [theme.breakpoints.up('xl')]: {
        height: 30,
        width: 30
      },
      [theme.breakpoints.between('lg','lg')]: {
        height: 21,
        width: 21,
      },
      [theme.breakpoints.down('md')]: {
        height: 15,
        width: 15,
      },
    }
  },
  medias:{
    display: 'flex',
    alignItems: 'center'
  },
  media: {
    color: 'white',
    [theme.breakpoints.up('xl')]: {
      height: 23,
      width: 23
    },
    [theme.breakpoints.down('lg')]: {
      height: 16,
      width: 16,
    },
    [theme.breakpoints.down('md')]: {
      height: 11,
      width: 11,
    },
    textAlign: 'flex-start',
    '& > img': {
      height: '100%',
      width: 'auto'
    }
  },
  actions: {
    display: 'flex',
    color: 'white',
    alignItems: 'center'

  },
  fontsize: {
    cursor: 'pointer',
    [theme.breakpoints.up('xl')]: {
      fontSize:20, 
      paddingLeft:15,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize:14, 
      paddingLeft:10,
    },
    [theme.breakpoints.down('md')]: {
      fontSize:13, 
      paddingLeft:7,
    },
    textDecoration:'underline',
    textUnderlinePosition: 'under',
    color:'white',
  }
}));

const UpgradePlan = props => {
  const { className } = props;
  const {history} = props;
  const classes = useStyles();
  const webApp = authService.getAccess('usertype'); 
  const handleClickHelp = ()=>{
    localStorage.setItem("select", JSON.stringify(-1));
    history.push(webApp === 'manager' ? "/manager/help" : webApp === 'owner' ? "/owner/help" : "/admin/help");
    window.location.reload();
  } 
  return (
    <div
      className={clsx(classes.root, className)}
    >
      <div className={classes.medias}>
        <img className={classes.media} src='/images/smile.png'/>
      </div>
      <div className={classes.content}>

      </div>
      <div className={classes.actions}>
        <div
          align="center"
          className={classes.fontsize}
          onClick={handleClickHelp}
        >
          J'ai besoin d'aide
        </div>
      </div>
    </div>
  );
};

UpgradePlan.propTypes = {
  className: PropTypes.string
};

export default withRouter(UpgradePlan);
