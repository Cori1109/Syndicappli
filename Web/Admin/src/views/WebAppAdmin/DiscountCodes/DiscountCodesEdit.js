import React, {useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MySelect from '../../../components/MySelect';
import MyButton from 'components/MyButton';
import authService from '../../../services/authService.js';
import {withRouter } from 'react-router-dom';
import {EditDiscountCodeStyles as useStyles} from './useStyles';
import AdminService from '../../../services/api.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';

const DiscountCodesEdit = (props) => {
  const {history}=props;
  const token = authService.getToken();  
  if (!token) {
    window.location.replace("/login");
  }
  const accessDiscountCodes = authService.getAccess('role_discountcodes');  
  const classes = useStyles();
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const [openDialog, setOpenDialog] = React.useState(false);
  const CategorieList = ['Cabinets', 'Copropriétaires', 'Immeubles'];
  const en_categorieList = ['companies','owners','buildings'];
  const discountTypeList = [ 'fixe', 'pourcentage'];
  const en_discountTypeList = ['fixed', 'percentage'];
  const billingCyclesList = [ 'une fois', '2 mois', '3 mois', '6 mois', '1 an', 'tout le cycle'];
  const en_billingCycleList = ['once','2_months','3_months', '6_months', '1_year', 'all'];
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

  useEffect(() => {
    if(accessDiscountCodes !== 'denied'){
      getDiscountCode();
    }
  }, [accessDiscountCodes]);


  const handleClick = ()=>{
    history.goBack();
  };
  const handleClose = ()=>{
    props.onCancel();
  };
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
const handleClickSave = ()=>{
  let cnt = 0;
  if(codeName.length === 0) {setErrorsCodeName('please enter code name'); cnt++;}
  else setErrorsCodeName('');
  if(startDate.length === 0) {setErrorsStartDate('please select start date'); cnt++;}
  else setErrorsStartDate('');
  if(disocuntAmount.length === 0) {setErrorsDiscountAmount('please enter discount amount'); cnt++;}
  else setErrorsDiscountAmount('');
  
  if(cnt ===0){
    updateDiscountCode();
  }
}
const getDiscountCode = ()=>{
  setVisibleIndicator(true);
  AdminService.getDiscountCode(props.match.params.id)
    .then(
      response => {
        setVisibleIndicator(false);
        switch (response.data.code) {
          case 200:
            const data = response.data.data.discountCodes;
            localStorage.setItem("token", JSON.stringify(response.data.data.token));
            setBillingCycles(en_billingCycleList.indexOf(data.billing_cycle));
            setCategorie(en_categorieList.indexOf(data.user_type));
            setDiscountType(en_discountTypeList.indexOf(data.discount_type));
            setCodeName(data.name);
            setStartDate(data.start_date);
            setEndDate(data.end_date);
            setDiscountAmount(data.discount_amount);
            setMaxAmountOfUse(data.amount_of_use === -1 ? '' : data.amount_of_use);
            setMaxAmountOfUsePerUser(data.amount_of_use_per_user === -1 ? '' : data.amount_of_use_per_user);
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
const updateDiscountCode = () => {
  const requestData = {
      'user_type': en_categorieList[categorie],
      'name': codeName,
      'start_date' : startDate,
      'end_date' : endDate,
      'discount_type' : en_discountTypeList[discountType],
      'discount_amount' : disocuntAmount,
      'amount_of_use' : maxAmountOfUse.length === 0 ? -1 : maxAmountOfUse,
      'amount_of_use_per_user' : maxAmountOfUsePerUser.length === 0 ? -1 : maxAmountOfUsePerUser,
      'billing_cycle': en_billingCycleList[billingCycles],
  }
  setVisibleIndicator(true);
  AdminService.updateDiscountCode(props.match.params.id,requestData)
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
                <b>{codeName}</b>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} container justify="flex-end" >
          </Grid>
        </Grid>
      </div>
      <div className={classes.tool}>
          <p onClick={handleClick} className={classes.backTitle}>&lt; Retour à la liste des codes promo</p>
      </div> 
      <Grid container direction="column" >
        <div className={classes.body}>
          <Grid item container  spacing={5} xs={12} sm={10} md={8} lg={6} xl={4}>
            <Grid item container><p  className={classes.headerTitle}><b>Informations</b></p></Grid>
            <Grid item container alignItems="center" spacing={1}>
                    <Grid item><p className={classes.itemTitle}>Catégorie</p></Grid>
                    <Grid xs item container direction="column">
                        <MySelect 
                            color="gray" 
                            data={CategorieList} 
                            onChangeSelect={handleChangeCategorie}
                            value={categorie}
                            disabled={(accessDiscountCodes ==='see'? true : false)}
                        />
                    </Grid>
                </Grid>
                <Grid item container alignItems="center" spacing={1}>
                    <Grid item><p className={classes.itemTitle}>Nom</p></Grid>
                    <Grid xs item container direction="column">
                        <TextField 
                            className={classes.text} 
                            variant="outlined"
                            value={codeName}
                            onChange={handleChangeCodeName} 
                            disabled={(accessDiscountCodes ==='see'? true : false)}
                        />
                        {errorsCodeName.length > 0 && 
                        <span className={classes.error}>{errorsCodeName}</span>}
                    </Grid>
                </Grid>
                <Grid item container  alignItems="center" spacing={1}>
                    <Grid item><p className={classes.itemTitle}>Date de début</p></Grid>
                    <Grid xs item container>
                        <TextField 
                            className={classes.text} 
                            variant="outlined" 
                            value={startDate}
                            onChange={handleChangeStartDate} 
                            type="date"
                            disabled={(accessDiscountCodes ==='see'? true : false)}
                        />
                        {errorsStartDate.length > 0 && 
                        <span className={classes.error}>{errorsStartDate}</span>}
                    </Grid>
                </Grid>
                <Grid item container alignItems="center" spacing={1}>
                    <Grid item ><p className={classes.itemTitle}>Date de fin</p></Grid>
                    <Grid xs item container>
                        <TextField 
                            className={classes.text} 
                            variant="outlined"
                            value={endDate}
                            onChange={handleChangeEndDate} 
                            type="date"
                            disabled={(accessDiscountCodes ==='see'? true : false)}
                        />
                    </Grid>
                </Grid>
                <Grid item container alignItems="center" spacing={1}>
                    <Grid item><p className={classes.itemTitle}>Type de réduction</p></Grid>
                    <Grid xs item container direction="column">
                        <MySelect 
                            color="gray" 
                            data={discountTypeList} 
                            onChangeSelect={handleChangeDiscountType}
                            value={discountType}
                            disabled={(accessDiscountCodes ==='see'? true : false)}
                        />
                    </Grid>
                </Grid>
                <Grid item container alignItems="center" spacing={1}>
                    <Grid item><p className={classes.itemTitle}>Montant</p></Grid>
                    <Grid xs item container direction="column">
                        <TextField 
                            className={classes.text} 
                            variant="outlined"
                            value={disocuntAmount}
                            onChange={handleChangeDiscountAmount} 
                            disabled={(accessDiscountCodes ==='see'? true : false)}
                        />
                        {errorsDiscountAmount.length > 0 && 
                        <span className={classes.error}>{errorsDiscountAmount}</span>}
                    </Grid>
                </Grid>
                <Grid item container alignItems="center" spacing={1}>
                    <Grid item><p className={classes.itemTitle}>Appliqué sur</p></Grid>
                    <Grid xs item container direction="column">
                        <MySelect 
                            color="gray" 
                            data={billingCyclesList} 
                            onChangeSelect={handleChangeBillingCycles}
                            value={billingCycles}
                            disabled={(accessDiscountCodes ==='see'? true : false)}
                        />
                    </Grid>
                </Grid>
                <Grid item container alignItems="center" spacing={1}>
                    <Grid item><p className={classes.itemTitle}>Nombre maximal d'activations</p></Grid>
                    <Grid xs item container direction="column">
                        <TextField 
                            className={classes.text} 
                            variant="outlined"
                            value={maxAmountOfUse}
                            onChange={handleChangeMaxAmountOfUse} 
                            disabled={(accessDiscountCodes ==='see'? true : false)}
                        />
                    </Grid>
                </Grid>
                <Grid item container alignItems="center" spacing={1}>
                    <Grid item><p className={classes.itemTitle}>Nombre maximal d'activations par utilisateur</p></Grid>
                    <Grid xs item container direction="column">
                        <TextField 
                            className={classes.text} 
                            variant="outlined"
                            value={maxAmountOfUsePerUser}
                            onChange={handleChangeMaxAmountOfUsePerUser} 
                            disabled={(accessDiscountCodes ==='see'? true : false)}
                        />
                    </Grid>
                </Grid>
            <Grid item container style={{paddingTop:'50px',paddingBottom:'50px'}}>
              <MyButton name = {"Sauvegarder"} color={"1"} onClick={handleClickSave} disabled={(accessDiscountCodes ==='see'? true : false)}/>
            </Grid>
          </Grid>
        </div>
      </Grid>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(DiscountCodesEdit);
