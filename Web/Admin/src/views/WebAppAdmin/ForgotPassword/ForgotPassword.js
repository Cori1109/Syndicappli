import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';
import MyButton from 'components/MyButton';
import TextField from '@material-ui/core/TextField';
import useStyles from './useStyles';
import AdminService from '../../../services/api.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import Link from '@material-ui/core/Link';

const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const validateForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}
const ForgotPassword = (props) => {
  const { history } = props;
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [errorsEmail, setErrorsEmail] = useState('');
  const [bodySide, setBodySide] = useState({
    sendText: 'Envoyer',
    bodyText: 'Mot de passe oublié',
    bodyState: false
  });
  const logo = {
    url: '/images/Login.png',
  };
  const handleChangeEmail = (event) => {
    event.preventDefault();
    let errorsMail =
      validEmailRegex.test(event.target.value)
        ? ''
        : 'Email is not valid!';
    setEmail(event.target.value);
    setErrorsEmail(errorsMail);
  }
  useEffect(() => {
    let params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'success') {
      var data = {
        sendText: 'Se connecter',
        bodyText: 'Un email vient de vous être envoyé afin de réinitialiser votre mot de passe.',
        bodyState: true
      };
      setBodySide(data);
    }
  }, []);
  const handleClickSend = () => {
    if (!bodySide.bodyState) {
      let cnt = 0;
      if (email.length === 0) { setErrorsEmail('please enter your eamil'); cnt++; }
      if (cnt === 0) {
        if (validateForm(errorsEmail)) {
          var data = {};
          data['email'] = email;
          setVisibleIndicator(true);
          AdminService.forgotPassword(data)
            .then(
              response => {
                setVisibleIndicator(false);
                if (response.data.code !== 200) {
                  ToastsStore.error(response.data.message);
                } else {
                  // ToastsStore.success(response.data.message);
                  window.location.replace('/forgotpassword?success=' + 'success');
                }
              },
              error => {
                setVisibleIndicator(false);
                ToastsStore.error("Can't connect to the Server!");
              }
            );
        }
        else setErrorsEmail('Email is not valid!');
      }
    }
    else {
      history.push('/login');
      window.location.reload();
    }
  }
  return (
    <div>
      {
        visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
      }
      <Grid container direction="column" justify="flex-start" className={classes.root}>
        <Grid item container justify="center">
          <img src={logo.url} className={classes.logo} alt="" />
        </Grid>
        {
          bodySide.bodyState === false ?
            <Grid item container justify="center">
              <p className={classes.title}>Mot de passe perdu? Veuillez saisir votre adresse e-mail. Vous recevrez un lien pour créer un nouveau mot de passe par e-mail. </p>
            </Grid>
            : <Grid item container justify="center" >
              <div className={classes.title}></div>
            </Grid>
        }
        <Grid item container justify="center">
          <Grid item container xs={1} sm={2} md={4}></Grid>

          <Grid xs={10} sm={7} md={4} item container direction="column" className={classes.body}>
            <Grid item></Grid>
            {
              bodySide.bodyState === false ?
              <Grid item>
            <Grid item container justify="center">
              <p className={classes.boxTitle}><b>{bodySide.bodyText}</b></p>
            </Grid>

                <Grid item container className={classes.input}>
                  <Grid xs={1} item></Grid>
                  <Grid xs={10} item container direction="column" spacing={2}>
                    <Grid item><p className={classes.itemTitle}>Email</p></Grid>
                    <Grid item container direction='column'>
                      <TextField
                        variant="outlined"
                        fullWidth
                        value={email}
                        onChange={handleChangeEmail}
                      />
                      {errorsEmail.length > 0 &&
                        <span className={classes.error}>{errorsEmail}</span>}
                    </Grid>
                  </Grid>
                  <Grid xs={1} item></Grid>
                </Grid>
                </Grid>
                : <Grid item container justify="center" style={{padding: 30}}>
                  <Grid item/>
                <Grid item>  <p className={classes.boxTitle}>{bodySide.bodyText}</p></Grid>
                <Grid item/>
              </Grid>
            }
            <Grid item container justify="center">
              <MyButton name={bodySide.sendText} color="1" onClick={handleClickSend} />
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

export default withRouter(ForgotPassword);
