import React, { useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MyButton from '../../../components/MyButton';
import { withRouter } from 'react-router-dom';
import authService from '../../../services/authService.js';
import AdminService from '../../../services/api.js';
import { ModulePaymentStyles as useStyles } from './useStyles';
import TextField from '@material-ui/core/TextField';

const ModulePayment = (props) => {
  const { history } = props;
  const token = authService.getToken();    
  if (!token) {
    window.location.replace("/login");
  }
  const accessBuildings = authService.getAccess('role_buildings');
  const classes = useStyles();
  const [expiryDate, setExpiryDate] = useState('09/20');
  const handleClickApply = () => {

  }
  const handleClickPay = () => {

  }
  const handleChangeExpiryDate = (event) => {
    setExpiryDate(event.target.value);
  }
  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Grid item xs={12} sm={6} container justify="flex-start" >
          <Grid item>
            <Typography variant="h2" className={classes.headerTitle}>
              <b>Modules - Paiement</b>
            </Typography>
          </Grid>
        </Grid>
      </div>

      <div className={classes.body}>
      <div className={classes.tool}>
      <Grid item container spacing={1}>
            <Grid item container justify="space-between">
              <Grid item>
                <p className={classes.billingAddress}><b>Module</b> : Participer à une Assemblée Générale à Distance en Visio Conférence à 360° </p>
              </Grid>
              <Grid item>
                <p className={classes.billingAddress}>x1</p>
              </Grid>
            </Grid>
            <Grid item container justify="space-between">
              <Grid item>
                <p className={classes.itemTitle}></p>
              </Grid>
              <Grid item>
                <p className={classes.price}>12,90€</p>
              </Grid>
            </Grid>
          </Grid>
      </div>
        <Grid item container direction="column" spacing={5}>
          <Grid item container spacing={1}>
            <Grid item container justify="space-between">
              <Grid item>
                <p className={classes.headerTitle}><b>TOTAL</b></p>
              </Grid>
              <Grid item>
                <p className={classes.price}><b>12,90€</b></p>
              </Grid>
            </Grid>
            <Grid item container justify="space-between">
              <Grid item>
                <p className={classes.itemTitle}>dont TVA à 20%</p>
              </Grid>
              <Grid item>
                <p className={classes.itemTitle}>2.15€</p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item container direction="column" spacing={2}>
            <Grid item>
              <p className={classes.itemTitle}><b>Adresse de Facturation</b></p>
            </Grid>
            <Grid item xs={12}>
              <p className={classes.billingAddress}>M. John Doe 3 rue des Acacias 75012 Paris</p>
            </Grid>
            <Grid item>
              <p className={classes.modifier}><u>Modifier</u></p>
            </Grid>
          </Grid>
          <Grid item container direction="column" spacing={3}>
            <Grid item container alignItems="center" spacing={2}>
              <Grid item><p className={classes.sepaItemTitle}>Code Promo</p></Grid>
              <Grid xs item container alignItems="stretch">
                <TextField
                  id="outlined-basic"
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Grid item>
              <MyButton name={"Appliquer"} color={"1"} onClick={handleClickApply} />
            </Grid>
          </Grid>
          <Grid xs={12} sm={10} md={8} lg={6} item container direction="column" spacing={3}>
            <Grid item>
              <p className={classes.itemTitle}><b>Moyen de Paiement</b></p>
            </Grid>
            <Grid item container  spacing={2}>
              <Grid item>
                <div className={classes.cardLeftPart}></div>
              </Grid>
              <Grid item>
                <div className={classes.cardMainPart}>
                  <Grid container direction="column" alignItems="stretch" justify="space-between" className={classes.cardBody}>
                    <Grid item className={classes.cardTypePan}>
                      <Grid container justify="flex-end">
                        <p className={classes.cardType}><b>VISA</b></p>
                      </Grid>
                    </Grid>
                    <Grid item className={classes.cardNumberPan}>
                      <p className={classes.cardNumber}><b>8019  5500  0000  1234</b></p>
                    </Grid>
                    <Grid item className={classes.cardHolderPan}>
                    <Grid item container justify="space-between">
                      <Grid item>
                        <p className={classes.cardHolder}>RICHARD STALLMAN</p>
                      </Grid>
                      <Grid item>
                        <p className={classes.cardHolder} onChange={handleChangeExpiryDate}>{"09/20"}</p>
                      </Grid>
                    </Grid>
                    </Grid>
                  </Grid>
                </div>
              </Grid>
              <Grid item>
                <div className={classes.cardRightPart}></div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item container justify="center" style={{ marginTop: 80 }}>
          <MyButton name={"Payer"} color={"1"} onClick={handleClickPay} />
        </Grid>
      </div>
    </div>
  );
};

export default withRouter(ModulePayment);
