import React from 'react';
import Grid from '@material-ui/core/Grid';
import MyButton from '../../../components/MyButton';
import TextField from '@material-ui/core/TextField';
import MySelect from '../../../components/MySelect';
import { AddDiscountCodeStyles as useStyles } from './useStyles';
import { Scrollbars } from 'react-custom-scrollbars';
import AdminService from '../../../services/api.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';
import authService from 'services/authService';
const AddDiscountCode = (props) => {
    const classes = useStyles();
    const { history } = props;

    const [visibleIndicator, setVisibleIndicator] = React.useState(false);
    const CategorieList = ['Cabinets', 'Copropriétaires', 'Immeubles'];
    const en_categorieList = ['companies', 'owners', 'buildings'];
    const discountTypeList = ['fixe', 'pourcentage'];
    const en_discountTypeList = ['fixed', 'percentage'];
    const billingCyclesList = ['une fois', '2 mois', '3 mois', '6 mois', '1 an', 'tout le cycle'];
    const en_billingCycleList = ['once', '2_months', '3_months', '6_months', '1_year', 'all'];
    const [categorie, setCategorie] = React.useState(0);
    const [codeName, setCodeName] = React.useState('');
    const [startDate, setStartDate] = React.useState('');
    const [endDate, setEndDate] = React.useState('');
    const [discountType, setDiscountType] = React.useState(0);
    const [disocuntAmount, setDiscountAmount] = React.useState('');
    const [billingCycles, setBillingCycles] = React.useState(0);
    const [maxAmountOfUse, setMaxAmountOfUse] = React.useState('');
    const [maxAmountOfUsePerUser, setMaxAmountOfUsePerUser] = React.useState('');

    const [errorsCodeName, setErrorsCodeName] = React.useState('');
    const [errorsStartDate, setErrorsStartDate] = React.useState('');
    const [errorsDiscountAmount, setErrorsDiscountAmount] = React.useState('');

    const handleClose = () => {
        props.onCancel();
    };
    const handleCreate = () => {
        let cnt = 0;
        if (codeName.length === 0) { setErrorsCodeName('please enter code name'); cnt++; }
        else setErrorsCodeName('');
        if (startDate.length === 0) { setErrorsStartDate('please select start date'); cnt++; }
        else setErrorsStartDate('');
        if (disocuntAmount.length === 0) { setErrorsDiscountAmount('please enter discount amount'); cnt++; }
        else setErrorsDiscountAmount('');

        if (cnt === 0) {
            createDiscountCode();
            handleClose();
        }
    }
    const createDiscountCode = () => {
        const requestData = {
            'user_type': en_categorieList[categorie],
            'name': codeName,
            'start_date': startDate,
            'end_date': endDate,
            'discount_type': en_discountTypeList[discountType],
            'discount_amount': disocuntAmount,
            'amount_of_use': maxAmountOfUse.length === 0 ? -1 : maxAmountOfUse,
            'amount_of_use_per_user': maxAmountOfUsePerUser.length === 0 ? -1 : maxAmountOfUsePerUser,
            'billing_cycle': en_billingCycleList[billingCycles],
        }
        setVisibleIndicator(true);
        AdminService.createDiscountCode(requestData)
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
    const handleChangeCategorie = (val) => {
        setCategorie(val);
    }
    const handleChangeCodeName = (event) => {
        setCodeName(event.target.value);
    }
    const handleChangeStartDate = (event) => {
        setStartDate(event.target.value);
    }
    const handleChangeEndDate = (event) => {
        setEndDate(event.target.value);
    }
    const handleChangeDiscountType = (val) => {
        setDiscountType(val);
    }
    const handleChangeDiscountAmount = (event) => {
        setDiscountAmount(event.target.value);
    }
    const handleChangeBillingCycles = (val) => {
        setBillingCycles(val);
    }
    const handleChangeMaxAmountOfUse = (event) => {
        setMaxAmountOfUse(event.target.value);
    }
    const handleChangeMaxAmountOfUsePerUser = (event) => {
        setMaxAmountOfUsePerUser(event.target.value);
    }

    return (
        <Scrollbars style={{ height: '70vh' }}>
            <div className={classes.root}>
                {
                    visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
                }
                <div className={classes.paper} sm={12}>
                    <Grid container spacing={2} >
                        <Grid item container alignItems="center" spacing={1}>
                            <Grid item><p className={classes.title}>Catégorie</p></Grid>
                            <Grid xs item container direction="column">
                                <MySelect
                                    color="gray"
                                    data={CategorieList}
                                    onChangeSelect={handleChangeCategorie}
                                    value={categorie}
                                />
                            </Grid>
                        </Grid>
                        <Grid item container alignItems="center" spacing={1}>
                            <Grid item><p className={classes.title}>Nom</p></Grid>
                            <Grid xs item container direction="column">
                                <TextField
                                    className={classes.text}
                                    variant="outlined"
                                    value={codeName}
                                    onChange={handleChangeCodeName}
                                />
                                {errorsCodeName.length > 0 &&
                                    <span className={classes.error}>{errorsCodeName}</span>}
                            </Grid>
                        </Grid>
                        <Grid  item container justify="space-between">
                            <Grid xs={12} sm={6} item container spacing={1} direction="column">
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
                            <Grid xs={12} sm={6} item container spacing={1} direction="column">
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
                        </Grid>
                        <Grid item container alignItems="center" spacing={1}>
                            <Grid item><p className={classes.title}>Type de réduction</p></Grid>
                            <Grid xs item container direction="column">
                                <MySelect
                                    color="gray"
                                    data={discountTypeList}
                                    onChangeSelect={handleChangeDiscountType}
                                    value={discountType}
                                />
                            </Grid>
                        </Grid>
                        <Grid item container alignItems="center" spacing={1}>
                            <Grid item><p className={classes.title}>Montant</p></Grid>
                            <Grid xs item container direction="column">
                                <TextField
                                    className={classes.text}
                                    variant="outlined"
                                    value={disocuntAmount}
                                    onChange={handleChangeDiscountAmount}
                                />
                                {errorsDiscountAmount.length > 0 &&
                                    <span className={classes.error}>{errorsDiscountAmount}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container alignItems="center" spacing={1} direction="row">
                            <Grid item><p className={classes.title}>Appliqué sur</p></Grid>
                            <Grid xs item container>
                                <Grid container direction="column">
                                    <MySelect
                                        color="gray"
                                        data={billingCyclesList}
                                        onChangeSelect={handleChangeBillingCycles}
                                        value={billingCycles}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item container alignItems="center" spacing={1}>
                            <Grid item><p className={classes.title}>Nombre maximal d'activations</p></Grid>
                            <Grid xs item container direction="column">
                                <TextField
                                    className={classes.text}
                                    variant="outlined"
                                    value={maxAmountOfUse}
                                    onChange={handleChangeMaxAmountOfUse}
                                />
                            </Grid>
                        </Grid>
                        <Grid item container alignItems="center" spacing={1}>
                            <Grid item><p className={classes.title}>Nombre maximal d'activations par utilisateur</p></Grid>
                            <Grid xs item container direction="column">
                                <TextField
                                    className={classes.text}
                                    variant="outlined"
                                    value={maxAmountOfUsePerUser}
                                    onChange={handleChangeMaxAmountOfUsePerUser}
                                />
                            </Grid>
                        </Grid>
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

export default withRouter(AddDiscountCode);
