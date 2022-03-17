import React, { useState, useEffect } from 'react';
import useStyles from './useStyles';
import Grid from '@material-ui/core/Grid';
import MyButton from 'components/MyButton';
import TextField from '@material-ui/core/TextField';
import useGlobal from 'Global/global';
import AdminService from '../../../services/api.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';

const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}

const ResetPassword = (props) => {
  const [globalState, globalActions] = useGlobal();
  const { history } = props;
  const [visibleIndicator, setVisibleIndicator] = useState(false);
  const classes = useStyles();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorsNewPassword, setErrorsNewPassword] = useState('');
  const [errorsConfirmPassword, setErrorsConfirmPassword] = useState('');
  const logo = {
    url: '/images/Login.png',
  };
  const handleChangeNewPassword = (event) => {
    event.preventDefault();
    let errorsPass =
      event.target.value.length < 4
        ? 'Password must be 4 characters long!'
        : '';
    setNewPassword(event.target.value);
    setErrorsNewPassword(errorsPass);
  }
  const handleChangeConfirmPassword = (event) => {
    event.preventDefault();
    let errorsPass =
      event.target.value.length < 4
        ? 'Password must be 4 characters long!'
        : '';
    setConfirmPassword(event.target.value);
    setErrorsConfirmPassword(errorsPass);
  }
  const handleClickReset = () => {
    if (validateForm(errorsNewPassword) && validateForm(errorsConfirmPassword)) {
      let cnt = 0;
      if (newPassword.length === 0) { setErrorsNewPassword('please enter your new password'); cnt++; }
      if (confirmPassword.length === 0) { setErrorsConfirmPassword('please enter your confirm password'); cnt++; }
      if (newPassword !== confirmPassword) { setErrorsConfirmPassword("Doesn't match password. please enter your confirm password"); cnt++; }
      if (cnt === 0) {
        let params = new URLSearchParams(window.location.search);
        var data = {};
        data['token'] = params.get('token');
        data['password'] = newPassword;
        setVisibleIndicator(true);
        AdminService.resetPassword(data)
          .then(
            response => {
              setVisibleIndicator(false);
              if (response.data.code !== 200) {
                ToastsStore.error(response.data.message);
              } else {
                ToastsStore.success(response.data.message);
              }
            },
            error => {
              setVisibleIndicator(false);
              ToastsStore.error("Can't connect to the Server!");
            }
          );
      }
    }
  }
  useEffect(() => {
    let params = new URLSearchParams(window.location.search);
    var data = {};
    data['token'] = params.get('token');
    setVisibleIndicator(true);
    AdminService.verifyToken(data)
      .then(
        response => {
          setVisibleIndicator(false);
          if (response.data.code !== 200) {
            ToastsStore.error(response.data.message);
          } else {
            ToastsStore.success(response.data.message);
            history.push('/resetpassword?token='+response.data.data.tmpToken);
          }
        },
        error => {
          setVisibleIndicator(false);
          ToastsStore.error("Can't connect to the Server!");
        }
      );
  }, []);
  return (
    <div>
      {
        visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
      }
      <Grid container direction="column" justify="flex-start" className={classes.root}>
        <Grid item container justify="center">
          <img src={logo.url} className={classes.logo} alt="" />
        </Grid>
        <Grid item container justify="center">
          <p className={classes.title}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce accumsan mauris risus, ut
          tincidunt augue dictum eu. Donec molestie nibh purus, non sollicitudin nisl condimentum vitae.
         Suspendisse vehicula laoreet ullamcorper. </p>
        </Grid>
        <Grid item container justify="center">
          <Grid item container xs={1} sm={2} md={4}></Grid>
          <Grid xs={10} sm={7} md={4} item container direction="column" className={classes.body}>
            <Grid item></Grid>
            <Grid item container justify="center">
              <p className={classes.boxTitle}><b>Réinitialiser le mot de passe</b></p>
            </Grid>
            <Grid item container className={classes.input}>
              <Grid xs={1} item></Grid>
              <Grid xs={10} item container direction="column" spacing={2}>
                <Grid item><p className={classes.itemTitle}>Nouveau mot de passe</p></Grid>
                <Grid item container direction="column">
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={newPassword}
                    onChange={handleChangeNewPassword}
                    type="password"
                  />
                  {errorsNewPassword.length > 0 &&
                    <span className={classes.error}>{errorsNewPassword}</span>}
                </Grid>
                <Grid item><p className={classes.itemTitle}>Confirmez le mot de passe</p></Grid>
                <Grid item container direction="column">
                  <TextField
                    variant="outlined"
                    fullWidth
                    value={confirmPassword}
                    onChange={handleChangeConfirmPassword}
                    type="password"
                  />
                  {errorsConfirmPassword.length > 0 &&
                    <span className={classes.error}>{errorsConfirmPassword}</span>}
                </Grid>
              </Grid>
              <Grid xs={1} item></Grid>
            </Grid>
            <Grid item container justify="center">
              <MyButton name={"Réinitialiser"} color="1" onClick={handleClickReset} />
            </Grid>
          </Grid>
          <Grid item container xs={1} sm={2} md={4}></Grid>
        </Grid>
        <Grid item container justify="center">
          <Grid item container xs={1} sm={2} md={4}></Grid>
          <Grid item container xs={10} sm={7} md={4}>
            <Grid item container direction="row-reverse">
              <Link href="/login" variant="body2">
                <p className={classes.forgot}>Accéder à la connexion</p>
              </Link>
            </Grid>
          </Grid>
          <Grid item container xs={1} sm={2} md={4}></Grid>
        </Grid>
      </Grid>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(ResetPassword);
