import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import MyButton from 'components/MyButton';
import TextField from '@material-ui/core/TextField';
import useStyles from './useStyles';
import AdminService from '../../../services/api.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import useGlobal from 'Global/global';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';

const SMSAuth = (props) => {
  const classes = useStyles();
  const logo = {
    url: '/images/Login.png',
  };
  const [globalState, globalActions] = useGlobal();
  const { history } = props;
  const [smsCode, setSmsCode] = useState('');
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  useEffect(() => {
    if (globalState.smsAuth.length !== 0) {
      ToastsStore.success(globalState.smsAuth);
    }
  }, []);
  const handleChangeSmsCode = (event) => {
    setSmsCode(event.target.value);
  }
  const handleClickSendSmsCode = () => {
    let params = new URLSearchParams(window.location.search);
    var data = {};
    data['email'] = params.get('email');
    data['code'] = smsCode;
    setVisibleIndicator(true);
    AdminService.verifySMS(data)
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
            if (profile.usertype === 'superadmin' || profile.usertype === 'admin') {
              localStorage.clear();
              localStorage.setItem("token", JSON.stringify(response.data.data.token));
              localStorage.setItem("firstlogin", JSON.stringify("false"));
              localStorage.setItem("usertype", JSON.stringify(profile.usertype));
              localStorage.setItem("role_companies", JSON.stringify(profile.role_companies));
              localStorage.setItem("role_managers", JSON.stringify(profile.role_managers));
              localStorage.setItem("role_buildings", JSON.stringify(profile.role_buildings));
              localStorage.setItem("role_owners", JSON.stringify(profile.role_owners));
              localStorage.setItem("role_orders", JSON.stringify(profile.role_orders));
              localStorage.setItem("role_products", JSON.stringify(profile.role_products));
              localStorage.setItem("role_discountcodes", JSON.stringify(profile.role_discountcodes));
              localStorage.setItem("role_users", JSON.stringify(profile.role_users));
              localStorage.setItem("select", JSON.stringify(0));
              history.push('/admin/dashboard');
            }
            else if (profile.usertype === 'manager') {
              localStorage.clear();
              localStorage.setItem("token", JSON.stringify(response.data.data.token));
              localStorage.setItem("firstlogin", JSON.stringify("false"));
              localStorage.setItem("usertype", JSON.stringify(profile.usertype));
              localStorage.setItem("role_addons", JSON.stringify(profile.role_addons));
              localStorage.setItem("role_advertisement", JSON.stringify('denied'));
              localStorage.setItem("role_assemblies", JSON.stringify('denied'));
              localStorage.setItem("role_buildings", JSON.stringify(profile.role_buildings));
              localStorage.setItem("role_chat", JSON.stringify('denied'));
              localStorage.setItem("role_company", JSON.stringify('denied'));
              localStorage.setItem("role_events", JSON.stringify('denied'));
              localStorage.setItem("role_incidents", JSON.stringify('denied'));
              localStorage.setItem("role_invoices", JSON.stringify(profile.role_invoices));
              localStorage.setItem("role_owners", JSON.stringify(profile.role_owners));
              localStorage.setItem("role_payments", JSON.stringify(profile.role_payments));
              localStorage.setItem("role_providers", JSON.stringify('denied'));
              localStorage.setItem("role_team", JSON.stringify(profile.role_team));
              localStorage.setItem("select", JSON.stringify(0));
              history.push("/manager/dashboard");
            }
            else if (profile.usertype === 'owner') {
              localStorage.clear();
              localStorage.setItem("token", JSON.stringify(response.data.data.token));
              localStorage.setItem("firstlogin", JSON.stringify("false"));
              localStorage.setItem("usertype", JSON.stringify(profile.usertype));
              localStorage.setItem("role_addons", JSON.stringify(profile.role_addons));
              localStorage.setItem("role_assemblies", JSON.stringify('denied'));
              localStorage.setItem("role_chat", JSON.stringify('denied'));
              localStorage.setItem("role_events", JSON.stringify('denied'));
              localStorage.setItem("role_incidents", JSON.stringify('denied'));
              localStorage.setItem("select", JSON.stringify(0));
              history.push("/owner/dashboard");
            }
            else
              history.push("/not-found");
          }
        },
        error => {
          setVisibleIndicator(false);
          ToastsStore.error("Can't connect to the Server!");
        }
      );
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
        <Grid item container justify="center">
          <p className={classes.title}>Veuillez entrer votre code de vérification pour vous connecter. Vous recevrez un code de vérification par votre téléphone.</p>
        </Grid>
        <Grid item container justify="center">
          <Grid item container xs={1} sm={2} md={4}></Grid>
          <Grid xs={10} sm={7} md={4} item container direction="column" className={classes.body}>
            <Grid item></Grid>
            <Grid item container justify="center" className={classes.input}>
              <p className={classes.boxTitle}><b>Nous avons envoyé un code de vérification de connexion</b></p>
            </Grid>
            <Grid item container className={classes.input}>
              <Grid xs={1} item></Grid>
              <Grid xs={10} item container direction="column" spacing={2}>
                <Grid item><p className={classes.itemTitle}>Entrez votre code de vérification</p></Grid>
                <Grid item>
                  <TextField
                    variant="outlined"
                    value={smsCode}
                    onChange={handleChangeSmsCode}
                    placeholder="6 Chiffres"
                    fullWidth
                  />
                </Grid>
              </Grid>
              <Grid xs={1} item></Grid>
            </Grid>
            <Grid item container justify="center">
              <MyButton name={"Envoyer"} color="1" onClick={handleClickSendSmsCode} />
            </Grid>
          </Grid>
          <Grid item container xs={1} sm={2} md={4}></Grid>
        </Grid>
      </Grid>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>

  );
};

export default withRouter(SMSAuth);
