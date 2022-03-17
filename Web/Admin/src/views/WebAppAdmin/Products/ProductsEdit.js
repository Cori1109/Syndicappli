import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MySelect from '../../../components/MySelect';
import MyButton from 'components/MyButton';
import authService from '../../../services/authService.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';
import { Checkbox } from '@material-ui/core';
import { EditProductStyles as useStyles } from './useStyles';
import AdminService from 'services/api.js';

const ProductsEdit = (props) => {
  const { history } = props;
  const priceTypeList = ['Par lot', 'Par unité'];
  const en_priceTypeList = ['per_apartment','per_unit'];
  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const accessProducts = authService.getAccess('role_products');
  const classes = useStyles();
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const [renewal, setRenewal] = useState(false);
  const [productName, setProductName] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [priceType, setPriceType] = useState(0);
  const [price, setPrice] = useState('');
  const [vat_state, setVatState] = React.useState(false);
  const [vat_fee, setVatFee] = React.useState('');
  const [categorie, setCategorie] = React.useState(0);
  const [billingCycle, setBillingCycle] = React.useState(0);

  const [errorsCategorie, setErrorsCategorie] = useState('');
  const [errorsBillingCycle, setErrorsBillingCycle] = useState('');
  const [errorsRenewal, setErrorsRenewal] = useState('');
  const [errorsProductName, setErrorsProductName] = useState('');
  const [errorsProductDescription, setErrorsProductDescription] = useState('');
  const [errorsPriceType, setErrorsPriceType] = useState('');
  const [errorsPrice, setErrorsPrice] = useState('');
  const [errorsVatFee, setErrorsVatFee] = React.useState('');

  const categorieList = ['Gestionnaires', 'Copropriétaires', 'Immeubles'];
  const en_categorieList = ['managers','owners','buildings'];
  const billingCycleList = ['une fois', 'annuellement', 'trimestrielle', 'mensuelle'];
  const en_billingCycleList = ['one_time','annually', '3_monthly', 'monthly'];
  useEffect(() => {
    getProduct();
  }, [accessProducts]);


  const handleClick = () => {
    history.goBack();
  };

  const handleChangeProductName = (event) => {
    setProductName(event.target.value);
  }
  const handleChangeProductDescription = (event) => {
    setProductDescription(event.target.value);
  }
  const handleChangePrice = (event) => {
    setPrice(event.target.value);
    console.log(price)
  }
  const handleChangePriceType = (val) => {
    setPriceType(val);
  }
  const handleChangeCategorie = (val) => {
    setCategorie(val);
  }
  const handleChangeBillingCycle = (val) => {
    setBillingCycle(val);
  }
  const handleChangeRenewal = (event) => {
    setRenewal(event.target.checked);
  }
  const handleChangeVatState = (event) => {
    setVatState(event.target.checked);
}
const handleChangeVatFee = (event) => {
    setVatFee(event.target.value);
}
  const handleClickSave = () => {
    let cnt = 0;
    if (productName.length === 0) { setErrorsProductName('please enter your product name'); cnt++; }
    else setErrorsProductName('');
    if (productDescription.length === 0) { setErrorsProductDescription('please enter your product description'); cnt++; }
    else setErrorsProductDescription('');
    if (categorie.length === 0) { setErrorsCategorie('please select categorie'); cnt++; }
    else setErrorsCategorie('');
    if (billingCycle.length === 0) { setErrorsBillingCycle('please select billing cycle'); cnt++; }
    else setErrorsBillingCycle('');
    if (price.length === 0 || price === '0' ) { setErrorsPrice('please enter price'); cnt++; }
    else setErrorsPrice('');
    if (priceType.length === 0) { setErrorsPriceType('please enter your price type'); cnt++; }
    else setErrorsPriceType('');
    if (vat_state === true) {
      if (vat_fee.length === 0 || vat_fee === '0') { setErrorsVatFee('please enter VAT fee'); cnt++; }
      else setErrorsVatFee('');
    }
    if (cnt === 0) {
      updateProduct();
    }
  };
  const getProduct = ()=>{
    setVisibleIndicator(true);
    AdminService.getProduct(props.match.params.id)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data.product;
              localStorage.setItem("token", JSON.stringify(response.data.data.token));
              setBillingCycle(en_billingCycleList.indexOf(data.billing_cycle));
              setCategorie(en_categorieList.indexOf(data.buyer_type));
              setProductDescription(data.description);
              setProductName(data.name);
              setPrice(data.price);
              setRenewal(data.renewal === 'true' ? true : false);
              setPriceType(en_priceTypeList.indexOf(data.price_type));
              if(data.vat_option === 'true'){
                setVatState(true);
                setVatFee(data.vat_fee);
              }
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
  const updateProduct = () => {
    const requestData = {
        'buyer_type': en_categorieList[categorie],
        'billing_cycle': en_billingCycleList[billingCycle],
        'renewal': renewal ? 'true' : 'false',
        'name': productName,
        'description': productDescription,
        'price_type': en_priceTypeList[priceType],
        'price': price,
        'vat_option': vat_state ? 'true' : 'false',
        'vat_fee': vat_state ? vat_fee : '0',
    }
    setVisibleIndicator(true);
    AdminService.updateProduct(props.match.params.id,requestData)
        .then(
            response => {
                setVisibleIndicator(false);
                switch (response.data.code) {
                    case 200:
                        const data = response.data.data;
                        localStorage.setItem("token", JSON.stringify(data.token));
                        ToastsStore.success('Updated successfully!');
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
  return (
    <div className={classes.root}>
                      {
                    visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
                }
      <div className={classes.title}>
        <Grid item container justify="space-around" alignItems="center">
          <Grid item xs={12} sm={6} container justify="flex-start" >
            <Grid item>
              <Typography variant="h2" className={classes.headerTitle}>
                <b>{productName}</b>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} container justify="flex-end" >
          </Grid>
        </Grid>
      </div>
      <div className={classes.tool}>
        <p onClick={handleClick} className={classes.backTitle}>&lt; Retour à la liste des produits</p>
      </div>
      <Grid container direction="column" >
        <div className={classes.body}>
          <Grid item container spacing={5} xs={12} sm={10} md={8} lg={6} xl={4}>
            <Grid item container><p className={classes.headerTitle}><b>Informations</b></p></Grid>
            <Grid item container alignItems="center" spacing={2}>
              <Grid item><p className={classes.itemTitle}>Catégorie</p></Grid>
              <Grid xs item container direction="column">
                <MySelect
                  color="gray"
                  data={categorieList}
                  onChangeSelect={handleChangeCategorie}
                  value={categorie}
                  width="100%"
                />
                {errorsCategorie.length > 0 &&
                  <span className={classes.error}>{errorsCategorie}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={2}>
              <Grid item><p className={classes.itemTitle}>Récurrence</p></Grid>
              <Grid xs item container direction="column">
                <MySelect
                  color="gray"
                  data={billingCycleList}
                  onChangeSelect={handleChangeBillingCycle}
                  value={billingCycle}
                  width="100%"
                />
                {errorsBillingCycle.length > 0 &&
                  <span className={classes.error}>{errorsBillingCycle}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={2}>
              <Grid item><p className={classes.itemTitle}>Renouvellement automatique</p></Grid>
              <Grid xs item container direction="column">
                <Checkbox
                  checked={renewal}
                  onChange={handleChangeRenewal}
                  disabled={(accessProducts === 'see' ? true : false)}
                />
                {errorsRenewal.length > 0 &&
                  <span className={classes.error}>{errorsRenewal}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={2}>
              <Grid item><p className={classes.itemTitle}>Nom</p></Grid>
              <Grid xs item container direction="column">
                <TextField
                  id="outlined-basic"
                  className={classes.text}
                  variant="outlined"
                  value={productName}
                  onChange={handleChangeProductName}
                  disabled={(accessProducts === 'see' ? true : false)}
                />
                {errorsProductName.length > 0 &&
                  <span className={classes.error}>{errorsProductName}</span>}
              </Grid>
            </Grid>
            <Grid item container direction="column" spacing={2}>
              <Grid item><p className={classes.itemTitle}>Description</p></Grid>
              <Grid xs item container direction="column">
                <TextField
                  id="outlined-basic"
                  className={classes.text}
                  variant="outlined"
                  value={productDescription}
                  onChange={handleChangeProductDescription}
                  multiline
                  disabled={(accessProducts === 'see' ? true : false)}
                />
                {errorsProductDescription.length > 0 &&
                  <span className={classes.error}>{errorsProductDescription}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={2}>
              <Grid item ><p className={classes.itemTitle}>Tarification</p></Grid>
              <Grid xs item container direction="column">
                <MySelect
                  color="gray"
                  data={priceTypeList}
                  onChangeSelect={handleChangePriceType}
                  value={priceType}
                  width="80%"
                  disabled={(accessProducts === 'see' ? true : false)}
                />
                {errorsPriceType.length > 0 &&
                  <span className={classes.error}>{errorsPriceType}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={2}>
              <Grid item><p className={classes.itemTitle}>Prix (€ HT {priceTypeList[priceType]})</p></Grid>
              <Grid xs item container direction="column">
                <TextField
                  id="outlined-basic"
                  className={classes.text}
                  variant="outlined"
                  value={price}
                  type="number"
                  onChange={handleChangePrice}
                  disabled={(accessProducts === 'see' ? true : false)}
                />
                {errorsPrice.length > 0 &&
                  <span className={classes.error}>{errorsPrice}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={2}>
              <Grid item><p className={classes.title}>TVA applicable</p></Grid>
              <Grid xs item container>
                <Checkbox
                  checked={vat_state}
                  onChange={handleChangeVatState}
                />
              </Grid>
            </Grid>
            {
              vat_state === true ?
                <Grid item container alignItems="center" spacing={2}>
                  <Grid item><p className={classes.title}>TVA en %</p></Grid>
                  <Grid xs item container>
                    <TextField
                      className={classes.text}
                      variant="outlined"
                      value={vat_fee}
                      type="number"
                      onChange={handleChangeVatFee}
                      fullWidth
                    />
                    {errorsVatFee.length > 0 &&
                      <span className={classes.error}>{errorsVatFee}</span>}
                  </Grid>
                </Grid>
                :
                null
            }
            <Grid item container style={{ paddingTop: '50px', paddingBottom: '50px' }}>
              <MyButton name={"Sauvegarder"} color={"1"} onClick={handleClickSave} disabled={(accessProducts === 'see' ? true : false)} />
            </Grid>
          </Grid>
        </div>
      </Grid>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(ProductsEdit);
