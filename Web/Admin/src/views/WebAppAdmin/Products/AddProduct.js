import React from 'react';
import Grid from '@material-ui/core/Grid';
import MyButton from '../../../components/MyButton';
import TextField from '@material-ui/core/TextField';
import MySelect from '../../../components/MySelect';
import { Checkbox } from '@material-ui/core';
import { AddProductStyles as useStyles } from './useStyles';
import { Scrollbars } from 'react-custom-scrollbars';
import AdminService from 'services/api.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';
import authService from 'services/authService.js';

const AddProducts = (props) => {
    const classes = useStyles();
    const { history } = props;
    const priceTypeList = ['Par lot', 'Par unité'];
    const en_priceTypeList = ['per_apartment', 'per_unit'];
    const [visibleIndicator, setVisibleIndicator] = React.useState(false);
    const [categorie, setCategorie] = React.useState(0);
    const [billingCycle, setBillingCycle] = React.useState(0);
    const categorieList = ['Gestionnaires', 'Copropriétaires', 'Immeubles'];
    const en_categorieList = ['managers', 'owners', 'buildings'];
    const billingCycleList = ['une fois', 'annuellement', 'trimestrielle', 'mensuelle'];
    const en_billingCycleList = ['one_time', 'annually', '3_monthly', 'monthly'];
    const [renewal, setRenewal] = React.useState(false);
    const [productName, setProductName] = React.useState('');
    const [productDescription, setProductDescription] = React.useState('');
    const [priceType, setPriceType] = React.useState(0);
    const [price, setPrice] = React.useState('');
    const [vat_state, setVatState] = React.useState(false);
    const [vat_fee, setVatFee] = React.useState('');
    const [errorsCategorie, setErrorsCategorie] = React.useState('');
    const [errorsBillingCycle, setErrorsBillingCycle] = React.useState('');
    const [errorsRenewal, setErrorsRenewal] = React.useState('');
    const [errorsProductName, setErrorsProductName] = React.useState('');
    const [errorsProductDescription, setErrorsProductDescription] = React.useState('');
    const [errorsPriceType, setErrorsPriceType] = React.useState('');
    const [errorsPrice, setErrorsPrice] = React.useState('');
    const [errorsVatFee, setErrorsVatFee] = React.useState('');

    const handleClose = () => {
        props.onCancel();
    };
    const handleCreate = () => {
        let cnt = 0;
        if (productName.length === 0) { setErrorsProductName('please enter your product name'); cnt++; }
        else setErrorsProductName('');
        if (productDescription.length === 0) { setErrorsProductDescription('please enter your product description'); cnt++; }
        else setErrorsProductDescription('');
        if (categorie.length === 0) { setErrorsCategorie('please select categorie'); cnt++; }
        else setErrorsCategorie('');
        if (billingCycle.length === 0) { setErrorsBillingCycle('please select billing cycle'); cnt++; }
        else setErrorsBillingCycle('');
        if (price.length === 0 || price === '0') { setErrorsPrice('please enter price'); cnt++; }
        else setErrorsPrice('');
        if (priceType.length === 0) { setErrorsPriceType('please enter your price type'); cnt++; }
        else setErrorsPriceType('');
        if (vat_state === true) {
            if (vat_fee.length === 0 || vat_fee === '0') { setErrorsVatFee('please enter VAT fee'); cnt++; }
            else setErrorsVatFee('');
        }
        if (cnt === 0) {
            createProduct();
        }
    }
    const createProduct = () => {
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
        AdminService.createProduct(requestData)
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
    const handleChangeProductName = (event) => {
        setProductName(event.target.value);
    }
    const handleChangeProductDescription = (event) => {
        setProductDescription(event.target.value);
    }
    const handleChangePrice = (event) => {
        setPrice(event.target.value);
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
    return (
        <Scrollbars style={{ height: '70vh' }}>
            <div className={classes.root}>
                {
                    visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
                }
                <div className={classes.paper} sm={12}>
                    <Grid container spacing={2} >
                        <Grid item container alignItems="center" spacing={2}>
                            <Grid item><p className={classes.title}>Catégorie</p></Grid>
                            <Grid xs item container>
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
                            <Grid item><p className={classes.title}>Récurrence</p></Grid>
                            <Grid xs item container>
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
                            <Grid item><p className={classes.title}>Renouvellement automatique</p></Grid>
                            <Grid xs item container>
                                <Checkbox
                                    checked={renewal}
                                    onChange={handleChangeRenewal}
                                />
                                {errorsRenewal.length > 0 &&
                                    <span className={classes.error}>{errorsRenewal}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container alignItems="center" spacing={2}>
                            <Grid item><p className={classes.title}>Nom</p></Grid>
                            <Grid xs item container>
                                <TextField
                                    className={classes.text}
                                    variant="outlined"
                                    value={productName}
                                    onChange={handleChangeProductName}
                                    fullWidth
                                />
                                {errorsProductName.length > 0 &&
                                    <span className={classes.error}>{errorsProductName}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container direction="column" spacing={2}>
                            <Grid item><p className={classes.title}>Description</p></Grid>
                            <Grid xs item container>
                                <TextField
                                    className={classes.text}
                                    variant="outlined"
                                    value={productDescription}
                                    onChange={handleChangeProductDescription}
                                    multiline
                                    fullWidth
                                />
                                {errorsProductDescription.length > 0 &&
                                    <span className={classes.error}>{errorsProductDescription}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container alignItems="center" spacing={2}>
                            <Grid item ><p className={classes.title}>Tarification</p></Grid>
                            <Grid xs item container direction="column">
                                <MySelect
                                    color="gray"
                                    data={priceTypeList}
                                    onChangeSelect={handleChangePriceType}
                                    value={priceType}
                                    width="100%"
                                />
                                {errorsPriceType.length > 0 &&
                                    <span className={classes.error}>{errorsPriceType}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container alignItems="center" spacing={2}>
                            <Grid item><p className={classes.title}>Prix (€ HT {priceTypeList[priceType]})</p></Grid>
                            <Grid xs item container>
                                <TextField
                                    className={classes.text}
                                    variant="outlined"
                                    value={price}
                                    type="number"
                                    onChange={handleChangePrice}
                                    fullWidth
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
                    </Grid>
                    <div className={classes.footer}>
                        <Grid container justify="space-between">
                            <MyButton name={"Créer"} color={"1"} onClick={handleCreate} />
                            <MyButton name={"Annuler"} bgColor="grey" onClick={handleClose} />
                        </Grid>
                    </div>
                </div>
                <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
            </div>
        </Scrollbars>
    );
};

export default withRouter(AddProducts);
