import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import MyButton from 'components/MyButton';
import TextField from '@material-ui/core/TextField';
import MySelect from 'components/MySelect';
import { Scrollbars } from 'react-custom-scrollbars';
import { makeStyles } from '@material-ui/styles';
import {OwnerService as Service} from 'services/api';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';
import authService from 'services/authService';
import 'react-credit-cards/es/styles-compiled.css';
import 'react-credit-cards/lib/styles.scss';
import Cards from 'react-credit-cards';
const useStyles = makeStyles(theme => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: 5,
    padding: theme.spacing(2, 4, 3),
  },
  footer: {
    [theme.breakpoints.up('xl')]: {
      paddingTop: 89,
    },
    [theme.breakpoints.down('lg')]: {
      paddingTop: 62,
    },
    [theme.breakpoints.down('md')]: {
      paddingTop: 43,
    },
    paddingBottom: 30
  },
  root: {
    '& .MuiOutlinedInput-multiline': {
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
  plus: {
    color: '#707070',
    [theme.breakpoints.up('xl')]: {
      width: 31,
      height: 31,
    },
    [theme.breakpoints.down('lg')]: {
      width: 22,
      height: 22,
    },
    [theme.breakpoints.down('md')]: {
      width: 15,
      height: 15,
    },
  },
  input: {
    display: 'none'
  },
  img: {
    objectFit: 'cover',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    border: '1px dashed rgba(112,112,112,0.43)',
    borderRadius: 8,
    [theme.breakpoints.up('xl')]: {
      width: 116,
      height: 92,
      marginTop: 20,
      marginRight: 20
    },
    [theme.breakpoints.down('lg')]: {
      width: 81,
      height: 64,
      marginTop: 14,
      marginRight: 14
    },
    [theme.breakpoints.down('md')]: {
      width: 57,
      height: 45,
      marginTop: 10,
      marginRight: 10
    },
  },
  title: {
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
  error: {
    color: 'red',
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
}));
const OwnerService = new Service();
const BankCard = (props) => {
  const classes = useStyles();
  const { history } = props;
  const [visibleIndicator, setVisibleIndicator] = useState(false);
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardHolderName, setCardHolderName] = React.useState('');
  const [expirationDate, setExpirationDate] = React.useState('');
  const [Date, setDate] = React.useState('');
  const [cryptogram, setCryptogram] = React.useState('');
  const [focus, setFocus] = React.useState('');

  const [errorsCardNumber, setErrorsCardNumber] = React.useState('');
  const [errorsCardHolderName, setErrorsCardHolderName] = React.useState('');
  const [errorsExpirationDate, setErrorsExpirationDate] = React.useState('');
  const [errorsCryptogram, setErrorsCryptogram] = React.useState('');
  const handleClose = () => {
    props.onCancel();
  };
  useEffect(() => {
    if (props.state.method === 'edit') {
      getCard(props.state.pos);
    }
  }, [props.state]);
  const handleProcess = () => {
    let cnt = 0;
    if (cardNumber.length === 0) { setErrorsCardNumber('please enter card number'); cnt++; }
    else setErrorsCardNumber('');
    if (cardHolderName.length === 0) { setErrorsCardHolderName('please enter card holder name'); cnt++; }
    else setErrorsCardHolderName('');
    if (expirationDate.length === 0) { setErrorsExpirationDate('please select expiration date'); cnt++; }
    else setErrorsExpirationDate('');
    if (cryptogram.length === 0) { setErrorsCryptogram('please enter cryptogram'); cnt++; }
    else setErrorsCryptogram('');
    if (cnt === 0) {
      window.Stripe.setPublishableKey(process.env.REACT_APP_STRIPE_KEY);
      const exp_month = expirationDate.split('/')[0];
      const exp_year = expirationDate.split('/')[1];
      const cardInfo = {
          number: cardNumber,
          exp_month: exp_month,
          exp_year: exp_year,
          cvc: cryptogram,
      }
      var sourceData = {
        type: 'card',
      };
      window.Stripe.createToken(cardInfo,sourceData,handleResponse);
    }
  }
  const createCard = (token) => {
    const requestData = {
      'card_number': cardNumber,
      'name': cardHolderName,
      'expiry_date': Date,
      'secure_code': cryptogram,
      'ownerID' : props.state.ownerID,
      'id' : token
    }
    setVisibleIndicator(true);
    OwnerService.createCard(requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              props.onAdd();
              handleClose();
              break;
            case 401:
              authService.logout();
              history.push('/login');
              window.location.reload();
              break;
            default:
              ToastsStore.error(response.data.message);
          }
        },
        error => {
          ToastsStore.error("Can't connect to the server!");
          setVisibleIndicator(false);
        }
      );
  }
  const handleResponse = (req, res) => {
    if(res.error){
      if(res.error.code === 'invalid_number' || res.error.code === 'incorrect_number')
        setErrorsCardNumber(res.error.message);
      if(res.error.code === 'incorrect_cvc' || res.error.code === 'invalid_cvc')
        setErrorsCryptogram(res.error.message);
      if(res.error.code === 'invalid_expiry_month' || res.error.code === 'invalid_expiry_year')
        setErrorsExpirationDate(res.error.message);
    }else if(res.id){
      if (props.state.method === 'add')
        createCard(res.id);
      else if (props.state.method === 'edit')
        updateCard(res.id);
    }
  }
  const updateCard = (token) => {
    const requestData = {
      'card_number': cardNumber,
      'name': cardHolderName,
      'expiry_date': Date,
      'secure_code': cryptogram,
      'id' : token
    }
    setVisibleIndicator(true);
    OwnerService.updateCard(props.state.pos, requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              props.onUpdate();
              handleClose();
              break;
            case 401:
              authService.logout();
              history.push('/login');
              window.location.reload();
              break;
            default:
              ToastsStore.error(response.data.message);
          }
        },
        error => {
          ToastsStore.error("Can't connect to the server!");
          setVisibleIndicator(false);
        }
      );
  };
  const getCard = (id) => {
    setVisibleIndicator(true);
    OwnerService.getCard(id)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              setCardNumber(data.card.card_number);
              setCardHolderName(data.card.name);
              setDate(data.card.expiry_date);
              setCryptogram(data.card.secure_code);
              const exp_month = data.card.expiry_date.split('/')[0];
              const exp_year = data.card.expiry_date.split('/')[1];
              setExpirationDate(exp_month + '/' + exp_year%100);
              break;
            case 401:
              authService.logout();
              history.push('/login');
              window.location.reload();
              break;
            default:
              ToastsStore.error(response.data.message);
          }
        },
        error => {
          ToastsStore.error("Can't connect to the server!");
          setVisibleIndicator(false);
        }
      );
  }
  const handleChangeCardNumber = (event) => {
    if (Number.isInteger(Number(event.target.value))) {
      if (event.target.value.length <= 16){
        setCardNumber(event.target.value);
      }
    }
  }
  const handleChangeCardHolderName = (event) => {
    setCardHolderName(event.target.value);
  }
  const handleChangeExpirationDate = (event) => {
    if(event.target.value.length <8){
      if(validateDate(event.target.value)){
        const exp_month = event.target.value.split('/')[0];
        const exp_year = event.target.value.split('/')[1];
        setExpirationDate(exp_month + '/' + exp_year%100);
        setErrorsExpirationDate('');
      }
      else
        setErrorsExpirationDate('Invalid Format');
      setDate(event.target.value);
    }
  }
  const handleChangeCryptogram = (event) => {
    if (Number.isInteger(Number(event.target.value))) {
      if (event.target.value.length <= 4)
        setCryptogram(event.target.value);
    }
  }
  const handleInputFocus = (e) => {
    setFocus(e.target.name);
  }
  function validateDate(testdate) {
    var date_regex = /(0[1-9]|1[012])[/](19|20)\d\d/ ;
    return date_regex.test(testdate);
  }
  return (
    <Scrollbars style={{ height: '50vh' }}>
      <div className={classes.root}>
        {
          visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
        }
        <div className={classes.paper} sm={12}>
          <Grid container spacing={3} >
            <Grid item container alignItems="center" spacing={1}>
              <Cards
                cvc={cryptogram}
                expiry={expirationDate}
                focused={focus}
                name={cardHolderName}
                number={cardNumber}
              />
            </Grid>
            <Grid item/>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.title}>Numéro de carte</p></Grid>
              <Grid xs item container direction="column">
                <TextField
                  name="number"
                  type="tel"
                  variant="outlined"
                  value={cardNumber}
                  onChange={handleChangeCardNumber}
                  onFocus={handleInputFocus}
                  fullWidth
                />
                {errorsCardNumber.length > 0 &&
                  <span className={classes.error}>{errorsCardNumber}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item style={{ visibility: 'hidden' }}><p className={classes.title}>Numéro de carte</p></Grid>
              <Grid xs item container direction="column">
                <p className={classes.title}>E.g.: 49..., 51..., 36..., 37...</p>
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.title}>Nom du titulaire</p></Grid>
              <Grid xs item container direction="column">
                <TextField
                  name="name"
                  variant="outlined"
                  value={cardHolderName}
                  onChange={handleChangeCardHolderName}
                  onFocus={handleInputFocus}
                  fullWidth
                />
                {errorsCardHolderName.length > 0 &&
                  <span className={classes.error}>{errorsCardHolderName}</span>}
              </Grid>
            </Grid>
            <Grid xs={6} item container spacing={1} direction="column">
              <Grid item><p className={classes.title}>Date expiration</p></Grid>
              <Grid item container>
                <TextField
                  name="expiry"
                  variant="outlined"
                  value={Date}
                  onChange={handleChangeExpirationDate}
                  onFocus={handleInputFocus}
                  placeholder="MM/YYYY"
                  fullWidth
                />
                {errorsExpirationDate.length > 0 &&
                  <span className={classes.error}>{errorsExpirationDate}</span>}
              </Grid>
            </Grid>
            <Grid xs={6} item container spacing={1} direction="column">
              <Grid item ><p className={classes.title}>Cryptogramme</p></Grid>
              <Grid item container>
                <TextField
                  name="cvc"
                  variant="outlined"
                  value={cryptogram}
                  onChange={handleChangeCryptogram}
                  onFocus={handleInputFocus}
                  fullWidth
                />
                {errorsCryptogram.length > 0 &&
                  <span className={classes.error}>{errorsCryptogram}</span>}
              </Grid>
            </Grid>
          </Grid>
          <div className={classes.footer}>
            <Grid container justify="space-between">
              <MyButton name={props.state.buttonText} color={"1"} onClick={handleProcess} />
              <MyButton name={"Annuler"} bgColor="grey" onClick={handleClose} />
            </Grid>
          </div>
        </div>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
      </div>
    </Scrollbars>
  );
};

export default withRouter(BankCard);
