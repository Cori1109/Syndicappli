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
import { EditOrderStyles as useStyles } from './useStyles';
import AdminService from 'services/api.js';
import { isGetAccessorDeclaration } from 'typescript';
import { AddBuildingStyles } from '../Buildings/useStyles';

const OrderEdit = (props) => {
  const classes = useStyles();
  const { history } = props;

  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const accessOrders = authService.getAccess('role_orders');
  const categorieList = ['Gestionnaires', 'Copropriétaires', 'Immeubles'];
  const en_categorieList = ['managers', 'owners', 'buildings'];
  const [categorie, setCategorie] = React.useState(0);
  const discountTypeList = ['fixe', 'pourcentage'];
  const [billingCycle, setBillingCycle] = React.useState(0);
  const billingCycleList = ['une fois', 'annuellement', 'trimestrielle', 'mensuelle'];
  const en_billingCycleList = ['one_time', 'annually', '3_monthly', 'monthly'];
  const orderStatusList = ['Terminé', 'Actif', 'En attente', 'Annulée'];
  const en_orderstatusList = ['terminated', 'active', 'on_hold', 'cancelled'];
  const [orderStatus, setOrderStatus] = React.useState(0);
  const paymentList = ['carte bancaire', 'SEPA'];
  const en_paymentList = ['credit_card', 'SEPA'];
  const [payment, setPayment] = React.useState(0);
  const [codeName, setCodeName] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [renewal, setRenewal] = React.useState(false);
  const [vat_state, setVatState] = React.useState(false);
  const [vat_fee, setVatFee] = React.useState('');
  const [priceType, setPriceType] = React.useState(0);
  const [price, setPrice] = React.useState('');
  const priceTypeList = ['Par lot', 'Par unité'];
  const en_priceTypeList = ['per_apartment', 'per_unit'];
  const [clients, setClients] = useState(['']);
  const [client, setClient] = useState(0);
  const [clientID, setClientID] = useState(-1);
  const [companyID, setCompanyID] = useState(-1);
  const [buildingID, setBuildingID] = useState(-1);
  const [products, setProducts] = useState(['']);
  const [product, setProduct] = useState(0);
  const [productID, setProductID] = useState(-1);
  const [codes, setCodes] = useState(['']);
  const [code, setCode] = useState(0);
  const [codeID, setCodeID] = useState(-1);
  const [apartNumber, setApartNumber] = useState('');
  const [productList, setProductList] = useState(['']);
  const [clientList, setClientList] = useState(['']);
  const [codeList, setCodeList] = useState(['']);
  const [clientName, setClientName] = useState('');
  const [errorsCode, setErrorsCode] = React.useState('');
  const [errorsStartDate, setErrorsStartDate] = React.useState('');
  const [errorsVatFee, setErrorsVatFee] = React.useState('');
  const [errorsPrice, setErrorsPrice] = React.useState('');
  const [errorsApartNumber, setErrorsApartNumber] = useState('');
  const [errorsProduct, setErrorsProduct] = useState('');
  const [errorsClient, setErrorsClient] = useState('');
  const [stateLot, setStateLot] = useState(true);
  const handleClickSave = () => {
    let cnt = 0;
    if (productID === -1) { setErrorsProduct('please select product'); cnt++; }
    else setErrorsProduct('');
    if (clientID === -1) { setErrorsClient('please select client'); cnt++; }
    else setErrorsClient('');
    if (startDate.length === 0) { setErrorsStartDate('please select start date'); cnt++; }
    else setErrorsStartDate('');
    if (priceType === 0) {
      if (apartNumber.length === 0 || apartNumber === '0') { setErrorsApartNumber('please enter amount of apartment number'); cnt++; }
      else setErrorsApartNumber('');
    }
    else setErrorsApartNumber('');
    if (price.length === 0 || price === '0') { setErrorsPrice('please enter price'); cnt++; }
    else setErrorsPrice('');
    if (vat_state === true) {
      if (vat_fee.length === 0 || vat_fee === '0') { setErrorsVatFee('please enter VAT fee'); cnt++; }
      else setErrorsVatFee('');
    }
    if (cnt === 0) {
      updateOrder();
    }
  }
  const updateOrder = () => {
    const requestData = {
      'buyer_type': en_categorieList[categorie],
      'productID': productID,
      'buyerID': clientID,
      'companyID': companyID,
      'buildingID': buildingID,
      'buyer_name': clientName,
      'billing_cycle': en_billingCycleList[billingCycle],
      'renewal': renewal ? 'true' : 'false',
      'price_type': en_priceTypeList[priceType],
      'price': price,
      'vat_option': vat_state ? 'true' : 'false',
      'vat_fee': vat_state ? vat_fee : '0',
      'apartment_amount': apartNumber,
      'start_date': startDate,
      'end_date': endDate,
      'payment_method': en_paymentList[payment],
      'discount_codeID': codeID,
      'status': en_orderstatusList[orderStatus]
    }
    setVisibleIndicator(true);
    AdminService.updateOrder(props.match.params.id, requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              ToastsStore.success("Updated successfully!");
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
  const getOrder = async () => {
    setVisibleIndicator(true);
    await AdminService.getOrder(props.match.params.id)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data.order;
              localStorage.setItem("token", JSON.stringify(response.data.data.token));
              setBillingCycle(en_billingCycleList.indexOf(data.billing_cycle));
              setCategorie(en_categorieList.indexOf(data.buyer_type));
              setStartDate(data.start_date);
              setEndDate(data.end_date);
              setPrice(data.price);
              setRenewal(data.renewal === 'true' ? true : false);
              setPriceType(en_priceTypeList.indexOf(data.price_type));
              if (en_priceTypeList.indexOf(data.price_type) === 0)
                setStateLot(true);
              else
                setStateLot(false);
              if (data.price_type === 'per_apartment') {
                setApartNumber(data.apartment_amount);
              }
              if (data.vat_option === 'true') {
                setVatState(true);
                setVatFee(data.vat_fee);
              }
              setClientID(data.buyerID);
              setProductID(data.productID);
              setCodeID(data.discount_codeID);
              setPayment(en_paymentList.indexOf(data.payment_method));
              setOrderStatus(en_orderstatusList.indexOf(data.status));
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
  const handleChangeCategorie = (val) => {
    setCategorie(val);
    setDefault();
  }
  const handleChangeStartDate = (event) => {
    setStartDate(event.target.value);
  }
  const handleChangeEndDate = (event) => {
    setEndDate(event.target.value);
  }
  const handleChangeBillingCycle = (val) => {
    setBillingCycle(val);
  }
  const handleChangeClient = (val) => {
    setClient(val);
    setClientID(clientList[val].buyerID);
    if (clientList[val].companyID)
      setCompanyID(clientList[val].companyID);
    if (clientList[val].buildingID)
      setBuildingID(clientList[val].buildingID);
    setClientName(clientList[val].name)
    setDefault();
  }
  const handleChangeCode = (val) => {
    setCode(val);
    setCodeID(codeList[val].discount_codeID);
  }
  const handleChangeProduct = (val) => {
    setProduct(val);
    setProductID(productList[val].productID);
    setDefault();
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
  const handleChangePriceType = (val) => {
    setPriceType(val);
    setStateLot(!stateLot);
  }

  const handleChangePayment = (val) => {
    setPayment(val);
  }
  const handleChangeOrderStatus = (val) => {
    setOrderStatus(val);
  }
  const handleChangePrice = (event) => {
    setPrice(event.target.value);
  }
  const handleChangeApartNumber = (event) => {
    setApartNumber(+event.target.value);
  }
  useEffect(() => {
    getOrder();
  }, []);
  useEffect(async () => {
    await getBuyerList(categorie);
    // await getOrder();
    await getProductList(categorie);
    // await getOrder();
    await getCodeList(categorie);
    await getOrder();
  }, [categorie]);
  // useEffect(async ()=>{

  // },[categorie])
  // useEffect(async ()=>{

  // },[categorie])
  const getProductList = async (id) => {
    const requestData = {
      'search_key': '',
      'page_num': 0,
      'row_count': -1,
      'sort_column': -1,
      'sort_method': 'asc',
      'status': 'active',
      'type': en_categorieList[id]
    }
    setVisibleIndicator(true);
    await AdminService.getProductList(requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              productList.splice(0, productList.length);
              products.splice(0, products.length)
              productList.push('')
              localStorage.setItem("token", JSON.stringify(data.token));
              data.productlist.map((item) => (
                products.push(item.name)
              )
              );
              setProductList(data.productlist);
              if (data.productlist.length !== 0) {
                setProducts(products);
                setProductID(data.productlist[0].productID);
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
          console.log('fail');
          setVisibleIndicator(false);
        }
      );
  }
  const getBuyerList = async (id) => {
    let data = {
      'buyer_type': en_categorieList[id]
    }
    setVisibleIndicator(true);
     await AdminService.getBuyerList(data)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              clientList.splice(0, clientList.length);
              clients.splice(0, clients.length);
              clientList.push('');
              localStorage.setItem("token", JSON.stringify(data.token));
              data.buyerlist.map((item) =>
                clients.push(item.name)
              )
              setClientList(data.buyerlist);
              if (data.buyerlist.length !== 0) {
                setClients(clients);
                setClientID(data.buyerlist[0].buyerID);
                setClientName(data.buyerlist[0].name);
                if (data.buyerlist[0].companyID)
                  setCompanyID(data.buyerlist[0].companyID);
                if (data.buyerlist[0].buildingID)
                  setBuildingID(data.buyerlist[0].buildingID);
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
  const getCodeList = async (id) => {
    let data = {
      'user_type': en_categorieList[id]
    }
    setVisibleIndicator(true);
    await AdminService.getCodeList(data)
      .then(
        async response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              codeList.splice(0, codeList.length);
              codes.splice(0, codes.length);
              codeList.push('');
              codes.push('');
              localStorage.setItem("token", JSON.stringify(data.token));
              data.discountcodelist.map((item) =>
                codes.push(item.name)
              )
              setCodeList([{ discount_codeID: -1 }, ...data.discountcodelist]);
              if (data.discountcodelist.length !== 0) {
                setCodes(codes);
                // if(data.discountcodelist[0].discount_codeID !== -1)
                  setCodeID(-1);
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
  const setDefault = () => {
    setBillingCycle(0);
    setStartDate('');
    setEndDate('');
    setPrice('');
    setRenewal(false);
    setPriceType(0);
    setStateLot(false);
    setApartNumber('');
    setVatState(false);
  }
  useEffect(() => {
    for (let i = 0; i < productList.length; i++)
      if (productList[i].productID === productID) {
        setProduct(i);
      }
  }, [productID]);
  useEffect(() => {
    for (let i = 0; i < clientList.length; i++)
      if (clientList[i].buyerID === clientID) {
        setClient(i);
      }
  }, [clientID]);
  useEffect(() => {
    for (let i = 0; i < codeList.length; i++)
      if (codeList[i].discount_codeID === codeID) {
        setCode(i);
      }
  }, [codeID]);
  const handleClick = () => {
    history.goBack();
  };
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
                <b>Commande #{props.match.params.id}</b>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} container justify="flex-end" >
          </Grid>
        </Grid>
      </div>
      <div className={classes.tool}>
        <p onClick={handleClick} className={classes.backTitle}>&lt; Retour à la liste des Commandes</p>
      </div>
      <Grid container direction="column" >
        <div className={classes.body}>
          <Grid item container spacing={5} xs={12} sm={10} md={8} lg={6} xl={4}>
            <Grid item container><p className={classes.headerTitle}><b>Informations</b></p></Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.title}>Catégorie</p></Grid>
              <Grid xs item container direction="column">
                <MySelect
                  color="gray"
                  data={categorieList}
                  onChangeSelect={handleChangeCategorie}
                  value={categorie}
                />
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.title}>Produit</p></Grid>
              <Grid xs item container direction="column">
                <MySelect
                  color="gray"
                  data={products}
                  onChangeSelect={handleChangeProduct}
                  value={product}
                />
                {errorsProduct.length > 0 &&
                  <span className={classes.error}>{errorsProduct}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.title}>Client</p></Grid>
              <Grid xs item container direction="column">
                <MySelect
                  color="gray"
                  data={clients}
                  onChangeSelect={handleChangeClient}
                  value={client}
                />
                {errorsClient.length > 0 &&
                  <span className={classes.error}>{errorsClient}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={2}>
              <Grid item><p className={classes.title}>Récurrence</p></Grid>
              <Grid xs item container>
                <MySelect
                  color="gray"
                  data={billingCycleList}
                  onChangeSelect={handleChangeBillingCycle}
                  value={billingCycle}
                  width="100%"
                />
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.title}>Tarification</p></Grid>
              <Grid xs item container direction="column">
                <MySelect
                  color="gray"
                  data={priceTypeList}
                  onChangeSelect={handleChangePriceType}
                  value={priceType}
                />
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.title}>Prix (€ HT {priceTypeList[priceType]})</p></Grid>
              <Grid xs item container direction="column">
                <TextField
                  className={classes.text}
                  variant="outlined"
                  value={price}
                  type="number"
                  onChange={handleChangePrice}
                />
                {errorsPrice.length > 0 &&
                  <span className={classes.error}>{errorsPrice}</span>}
              </Grid>
            </Grid>
            {
              stateLot ?
                <Grid item container alignItems="center" spacing={1}>
                  <Grid item><p className={classes.title}>Nombre de lots</p></Grid>
                  <Grid xs item container direction="column">
                    <TextField
                      className={classes.text}
                      variant="outlined"
                      value={apartNumber}
                      type="number"
                      onChange={handleChangeApartNumber}
                    />
                    {errorsApartNumber.length > 0 &&
                      <span className={classes.error}>{errorsApartNumber}</span>}
                  </Grid>
                </Grid>
                :
                null
            }
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
            <Grid xs={12} sm={6} item container direction="column" spacing={1}>
              <Grid item><p className={classes.title}>Date de début</p></Grid>
              <Grid xs item container>
                <TextField
                  className={classes.text}
                  variant="outlined"
                  value={startDate}
                  onChange={handleChangeStartDate}
                  type="date"
                  fullWidth
                />
                {errorsStartDate.length > 0 &&
                  <span className={classes.error}>{errorsStartDate}</span>}
              </Grid>
            </Grid>
            <Grid xs={12} sm={6} item container direction="column" spacing={1}>
              <Grid item ><p className={classes.title}>Date de fin</p></Grid>
              <Grid xs item container>
                <TextField
                  className={classes.text}
                  variant="outlined"
                  value={endDate}
                  onChange={handleChangeEndDate}
                  type="date"
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.title}>Paiement</p></Grid>
              <Grid xs item container direction="column">
                <MySelect
                  color="gray"
                  data={paymentList}
                  onChangeSelect={handleChangePayment}
                  value={payment}
                />
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.title}>Renouvellement automatique</p></Grid>
              <Grid xs item container>
                <Checkbox
                  checked={renewal}
                  onChange={handleChangeRenewal}
                />
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.title}>Code promo</p></Grid>
              <Grid xs item container direction="column">
                <MySelect
                  color="gray"
                  data={codes}
                  onChangeSelect={handleChangeCode}
                  value={code}
                />
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.title}>statut</p></Grid>
              <Grid xs item container direction="column">
                <MySelect
                  color="gray"
                  data={orderStatusList}
                  onChangeSelect={handleChangeOrderStatus}
                  value={orderStatus}
                />
              </Grid>
            </Grid>
            <Grid item container style={{ paddingTop: '50px', paddingBottom: '50px' }}>
              <MyButton name={"Sauvegarder"} color={"1"} onClick={handleClickSave} disabled={(accessOrders === 'see' ? true : false)} />
            </Grid>
          </Grid>
        </div>
      </Grid>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(OrderEdit);
