import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import authService from 'services/authService.js';
import { withRouter } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('xl')]: {
      minHeight: 209,
      padding: 16,
    },
    [theme.breakpoints.between('lg','lg')]: {
      minHeight: 146,
      padding: 11,
    },
    [theme.breakpoints.down('md')]: {
      minHeight: 102,
      padding: 8,
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatar: {
    cursor:'pointer',
    [theme.breakpoints.up('xl')]: {
      width:199,
      height: 41,
    },
    [theme.breakpoints.between('lg','lg')]: {
      width:140,
      height: 28,
    },
    [theme.breakpoints.down('md')]: {
      width:98,
      height: 20,
    },
    display: 'flex',
  },
}));

const Profile = props => {
  const { className } = props;
  const {history} = props;
  const classes = useStyles();
  const user = {
    avatar: '/images/Login.png',
  };
  const handleClickToHome = ()=>{
    localStorage.setItem("select", JSON.stringify(0));
    const usertype = authService.getAccess('usertype');  
      switch(usertype){
        case 'superadmin':
          history.push('/admin/dashboard');
          window.location.reload();
          break;
        case 'admin':
          history.push('/admin/dashboard');
          window.location.reload();
          break;
        case 'manager':
          history.push('/manager/dashboard');
          window.location.reload();
          break;
        case 'owner':
          history.push('/owner/dashboard');
          window.location.reload();
          break;
        default:
          break;
      }
  }
  return (
    <div
      className={clsx(classes.root, className)}
    >
      <img
        alt="Person"
        className={classes.avatar}
        component={RouterLink}
        src={user.avatar}
        onClick={handleClickToHome}
      />
    </div>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default withRouter(Profile);
