import React, { useEffect } from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';
import useStyles from './useStyles';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import AdminService from '../../../services/api.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import useGlobal from 'Global/global';
import authService from 'services/authService.js';

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}
const Login = (props) => {
  const classes = useStyles();
  if (!authService.getFirstLoginState()) {
    localStorage.setItem("firstlogin", JSON.stringify("true"));
  }

  const [globalState, globalActions] = useGlobal();
  const { history } = props;
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorsEmail, setErrorsEmail] = React.useState('');
  const [errorsPassword, setErrorsPassword] = React.useState('');
  document.onkeydown = function (e) {
    if (e.keyCode === 13) {
      if (document.getElementById('login')) {
        handleClickButton();
      }
    }
  }
  const handleChangeEmail = (event) => {
    event.preventDefault();
    let errorsMail =
      validEmailRegex.test(event.target.value)
        ? ''
        : 'Email is not valid!';
    setEmail(event.target.value);
    setErrorsEmail(errorsMail);
  }
  const handleChangePassword = (event) => {
    event.preventDefault();
    let errorsPass =
      event.target.value.length === 0
        ? ''
        : '';
    setPassword(event.target.value);
    setErrorsPassword(errorsPass);
  }
  useEffect(() => {
    if (authService.getFirstLoginState() === "false") {

      const usertype = authService.getAccess('usertype');
      const token = authService.getToken();
      if (token) {
        localStorage.setItem("select", JSON.stringify(0));
        switch (usertype) {
          case 'superadmin':
            history.push('/admin/dashboard');
            break;
          case 'admin':
            history.push('/admin/dashboard');
            break;
          case 'manager':
            history.push('/manager/dashboard');
            break;
          case 'owner':
            history.push('/owner/dashboard');
            break;
          default:
            break;
        }
      }
    }
  });
  const handleClickButton = () => {
    let cnt = 0;
    if (email.length === 0) { setErrorsEmail('please enter your eamil'); cnt++; }
    if (password.length === 0) { setErrorsPassword('please enter your password'); cnt++; }
    if (cnt === 0) {
      if (validateForm(errorsEmail)) {
        if (authService.getFirstLoginState() === "true") {
          firstLogin();
        }
        else {
          login();
        }
      }
      else setErrorsEmail('Email is not valid!');
    }
  }
  const login = () => {
    var data = {};
    data['email'] = email;
    data['password'] = password;
    setVisibleIndicator(true);
    AdminService.login(data)
      .then(
        response => {
          setVisibleIndicator(false);
          if (response.data.code !== 200) {
            ToastsStore.error(response.data.message);
          } else {
            ToastsStore.success(response.data.message);
            let profile = response.data.data.profile;
            globalActions.setFirstName(profile.firstname);
            globalActions.setLastName(profile.lastname);
            globalActions.setAvatarUrl(profile.photo_url);
            if (authService.getFirstLoginState() === "true") {
              history.push('/smsauth/' + email);
            }
            else {
              if (profile.usertype === 'superadmin' || profile.usertype === 'admin') {
                localStorage.clear();
                localStorage.setItem("token", JSON.stringify(response.data.data.token));
                localStorage.setItem("firstlogin", JSON.stringify("false"));
                localStorage.setItem("usertype", JSON.stringify(profile.usertype));
                localStorage.setItem("role_companies", profile.role_companies === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_companies));
                localStorage.setItem("role_managers", profile.role_managers === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_managers));
                localStorage.setItem("role_buildings", profile.role_buildings === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_buildings));
                localStorage.setItem("role_owners", profile.role_owners === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_owners));
                localStorage.setItem("role_orders", profile.role_orders === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_orders));
                localStorage.setItem("role_products", profile.role_products === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_products));
                localStorage.setItem("role_discountcodes", profile.role_discountcodes === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_discountcodes));
                localStorage.setItem("role_users", profile.role_users === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_users));
                localStorage.setItem("select", JSON.stringify(0));
                history.push('/admin/dashboard');
              }
              else if (profile.usertype === 'manager') {
                localStorage.clear();
                localStorage.setItem("token", JSON.stringify(response.data.data.token));
                localStorage.setItem("firstlogin", JSON.stringify("false"));
                localStorage.setItem("usertype", JSON.stringify(profile.usertype));
                localStorage.setItem("role_addons", profile.role_addons === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_addons));
                localStorage.setItem("role_advertisement", profile.role_advertisement === undefined ? JSON.stringify('denied') : JSON.stringify('denied'));
                localStorage.setItem("role_assemblies", profile.role_assemblies === undefined ? JSON.stringify('denied') : JSON.stringify('see'));
                localStorage.setItem("role_buildings", profile.role_buildings === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_buildings));
                localStorage.setItem("role_chat", profile.role_chat === undefined ? JSON.stringify('denied') : JSON.stringify('denied'));
                localStorage.setItem("role_company", profile.role_company === undefined ? JSON.stringify('denied') : JSON.stringify('denied'));
                localStorage.setItem("role_events", profile.role_events === undefined ? JSON.stringify('denied') : JSON.stringify('denied'));
                localStorage.setItem("role_incidents", profile.role_incidents === undefined ? JSON.stringify('denied') : JSON.stringify('denied'));
                localStorage.setItem("role_invoices", profile.role_invoices === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_invoices));
                localStorage.setItem("role_owners", profile.role_owners === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_owners));
                localStorage.setItem("role_payments", profile.role_payments === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_payments));
                localStorage.setItem("role_providers", profile.role_providers === undefined ? JSON.stringify('denied') : JSON.stringify('denied'));
                localStorage.setItem("role_team", profile.role_team === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_team));
                localStorage.setItem("select", JSON.stringify(0));
                history.push("/manager/dashboard");
              }
              else if (profile.usertype === 'owner') {
                localStorage.clear();
                localStorage.setItem("token", JSON.stringify(response.data.data.token));
                localStorage.setItem("firstlogin", JSON.stringify("false"));
                localStorage.setItem("usertype", JSON.stringify(profile.usertype));
                localStorage.setItem("select", JSON.stringify(0));
                if (!(profile.identity_card_front === null || profile.identity_card_front === "" || profile.identity_card_front === undefined)) {
                  if (profile.owner_role === 'subaccount') {
                    localStorage.setItem("role_addons", JSON.stringify('edit'));
                    localStorage.setItem("role_assemblies", JSON.stringify('denied'));
                    localStorage.setItem("role_chat", JSON.stringify('edit'));
                    localStorage.setItem("role_events", JSON.stringify('edit'));
                    localStorage.setItem("role_incidents", JSON.stringify('edit'));
                    localStorage.setItem("role_payments", JSON.stringify('edit'));
                    localStorage.setItem("role_invoices", JSON.stringify('edit'));
                    localStorage.setItem("idcard_state", JSON.stringify('true'));
                  } else {
                    localStorage.setItem("role_addons", JSON.stringify('edit'));
                    localStorage.setItem("role_assemblies", JSON.stringify('edit'));
                    localStorage.setItem("role_chat", JSON.stringify('edit'));
                    localStorage.setItem("role_events", JSON.stringify('edit'));
                    localStorage.setItem("role_incidents", JSON.stringify('edit'));
                    localStorage.setItem("role_payments", JSON.stringify('edit'));
                    localStorage.setItem("role_invoices", JSON.stringify('edit'));
                    localStorage.setItem("idcard_state", JSON.stringify('true'));
                  }
                } else {
                  localStorage.setItem("role_addons", JSON.stringify('denied'));
                  localStorage.setItem("role_assemblies", JSON.stringify('denied'));
                  localStorage.setItem("role_chat", JSON.stringify('denied'));
                  localStorage.setItem("role_events", JSON.stringify('denied'));
                  localStorage.setItem("role_incidents", JSON.stringify('denied'));
                  localStorage.setItem("role_payments", JSON.stringify('denied'));
                  localStorage.setItem("role_invoices", JSON.stringify('denied'));
                  localStorage.setItem("idcard_state", JSON.stringify('false'));
                }
                history.push("/owner/dashboard");
              }
              else
                history.push("/not-found");
            }
          }
        },
        error => {
          setVisibleIndicator(false);
          ToastsStore.error("Can't connect to the Server!");
        }
      );
  }
  const firstLogin = () => {
    var data = {};
    data['email'] = email;
    data['password'] = password;
    setVisibleIndicator(true);
    AdminService.firstLogin(data)
      .then(
        response => {
          setVisibleIndicator(false);
          if (response.data.code !== 200) {
            ToastsStore.error(response.data.message);
          } else {
            ToastsStore.success(response.data.message);
            globalActions.setSmsAuth(response.data.message);
            history.push('/smsauth?email=' + email);
          }
        },
        error => {
          setVisibleIndicator(false);
          ToastsStore.error("Can't connect to the Server!");
        }
      );
  }
  const logo = {
    url: '/images/Login.png',
  };
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
          <p className={classes.title}>Bienvenue sur votre espace personnel de connexion.<br/> Veuillez entrer votre identifiant Email et votre mot de passe personnel pour vous connecter.</p>
        </Grid>
        <Grid item container justify="center">
          <Grid item container xs={1} sm={2} md={4}></Grid>
          <Grid xs={10} sm={7} md={4} item container direction="column" className={classes.body}>
            <Grid item></Grid>
            <Grid item container justify="center">
              <p className={classes.boxTitle}><b>Connexion</b></p>
            </Grid>
            <Grid item container className={classes.input}>
              <Grid xs={1} item></Grid>
              <Grid xs={10} item container direction="column" spacing={2}>
                <Grid item><p className={classes.itemTitle}>Email</p></Grid>
                <Grid item container direction="column">
                  <TextField
                    name="email"
                    type="email"
                    value={email}
                    fullWidth
                    onChange={handleChangeEmail}
                    noValidate
                    variant="outlined"
                  />
                  {errorsEmail.length > 0 &&
                    <span className={classes.error}>{errorsEmail}</span>}
                </Grid>
                <Grid item><p className={classes.itemTitle}>Mot de passe</p></Grid>
                <Grid item container direction="column">
                  <TextField
                    name="password"
                    variant="outlined"
                    fullWidth
                    value={password}
                    onChange={handleChangePassword}
                    type="password"
                    noValidate
                  />
                  {errorsPassword.length > 0 &&
                    <span className={classes.error}>{errorsPassword}</span>}
                </Grid>
              </Grid>
              <Grid xs={1} item></Grid>
            </Grid>
            <Grid item container justify="center">
              <Button className={classes.button1} onClick={handleClickButton} id="login">
                Se Connecter
              </Button>
            </Grid>
          </Grid>
          <Grid item container xs={1} sm={2} md={4}></Grid>
        </Grid>
        <Grid item container justify="center">
          <Grid item container xs={1} sm={2} md={4}></Grid>
          <Grid item container xs={10} sm={7} md={4}>
            <Grid item container direction="row-reverse">
              <Link href="/forgotpassword" variant="body2">
                <p className={classes.forgot}>J'ai oublié mon mot de passe</p>
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
export default withRouter(Login);
