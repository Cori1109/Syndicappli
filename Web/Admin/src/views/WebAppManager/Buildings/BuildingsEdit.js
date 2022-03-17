import React, { useEffect, useState } from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MyButton from 'components/MyButton';
import authService from '../../../services/authService.js';
import MySelect from '../../../components/MySelect.js';
import { withRouter } from 'react-router-dom';
import { EditBuildingStyles as useStyles } from './useStyles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { ManagerService as Service } from '../../../services/api.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
const ManagerService = new Service();
const BuildingsEdit = (props) => {
  const { history } = props;
  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const accessBuildings = authService.getAccess('role_buildings');
  const [visibleIndicator, setVisibleIndicator] = useState(false);
  const classes = useStyles();
  const [state, setState] = useState(false);

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [accountname, setAccountName] = useState('');
  const [accountaddress, setAccountAddress] = useState('');
  const [IBAN, setIBAN] = useState('');
  const [addClefs, setAddClefs] = useState('');
  const [clefList, setClefList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [companyID, setCompanyID] = useState(-1);
  const [openSEPADelete, setOpenSEPADelete] = useState(false);

  const [errorsName, setErrorsName] = useState('');
  const [errorsAddress, setErrorsAddress] = useState('');
  const [errorsCompanies, setErrorsCompanies] = useState('');
  const [errorsVote, setErrorsVote] = useState('');
  const [errorsBank, setErrorsBank] = useState('');
  const [count, setCount] = useState(0);
  const [companies, setCompanies] = useState(0);
  const [company, setCompany] = useState(['']);
  const [stripeCustomerID, setStripeCustomerID] = useState('');
  const handleClick = () => {
    history.goBack();
  };

  const handleChangeCompanies = (val) => {
    setCompanies(val);
    if (val < companyList.length)
      setCompanyID(companyList[val].companyID);
    else
      setCompanyID(-1);
  };
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleChangeAddress = (event) => {
    setAddress(event.target.value);
  };
  const handleChangeAddClefs = (event) => {
    setAddClefs(event.target.value);
  };
  const handleClickAddClef = (event) => {
    if (addClefs !== '') {
      setCount(count + 1);
      clefList.push({ "vote_branch_name": addClefs, "description": '' });
      setAddClefs('');
      setClefList(clefList);
    }
  };
  const handleChangeAddDescription = (event, id) => {
    let list = [...clefList];
    list[id].description = event.target.value;
    setClefList(list);
  };
  const handleClickRemoveClef = (num) => {
    setCount(count - 1);
    delete clefList[num];
    clefList.splice(num, 1);
    setClefList(clefList);
    setState(!state);
  };
  const handleClickAdd = () => {
    let cnt = 0;
    if (name.length === 0) { setErrorsName('please enter your name'); cnt++; }
    else setErrorsName('');
    if (address.length === 0) { setErrorsAddress('please enter your first name'); cnt++; }
    else setErrorsAddress('');
    if (companyID === -1) { setErrorsCompanies('please select companies'); cnt++; }
    else setErrorsCompanies('');
    if (count === 0) { setErrorsVote('please add a vote branch'); cnt++; }
    else setErrorsVote('');
    if (cnt === 0) {
      updateBuilding();
    }
  };
  const handleCloseSEPADelete = () => {
    setOpenSEPADelete(false);
  };
  const handleSEPADelete = () => {
    handleCloseSEPADelete();
    let requestData = {
      'account_holdername': '',
      'account_address': '',
      'account_IBAN': ''
    }
    setVisibleIndicator(true);
    ManagerService.updateBankInfo(props.match.params.id, requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              ToastsStore.success('Deleted Successfully');
              setAccountAddress('');
              setAccountName('');
              setIBAN('');
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
  const handleClickDeleteBankInfo = () => {
    if (IBAN.length !== 0) {
      setOpenSEPADelete(true);
    }
  }
  const handleChangeAccountName = (event) => {
    setAccountName(event.target.value);
  }

  const handleChangeAccountAddress = (event) => {
    setAccountAddress(event.target.value);
  }

  const handleChangeIBAN = (event) => {
    setIBAN(event.target.value);
  }
  const setOutcome = (result) => {
    if (result.source) {
      setErrorsBank('');
      updateBuildingBankInfo(result.source.id);
  } else if (result.error) {
      setErrorsBank("Please check your bank information. It's not correct.");
    }
  }
  const updateBuildingBankInfo = (id) => {
      let requestData = {
        'account_holdername': accountname,
        'account_address': accountaddress,
        'account_IBAN': IBAN,
        'id' : id
      }
      setVisibleIndicator(true);
      ManagerService.updateBankInfo(props.match.params.id, requestData)
        .then(
          response => {
            setVisibleIndicator(false);
            switch (response.data.code) {
              case 200:
                const data = response.data.data;
                localStorage.setItem("token", JSON.stringify(data.token));
                ToastsStore.success('Updated Successfully');
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
  const handleClickUpdateBankInfo = () => {
    var stripe = window.Stripe(process.env.REACT_APP_STRIPE_KEY);
    var sourceData = {
      type: 'sepa_debit',
      sepa_debit: {
        iban: IBAN,
      },
      currency: 'eur',
      owner: {
        name: accountname,
      },
    };
    stripe.createSource(sourceData).then(setOutcome);
  }
  const updateBuilding = () => {
    const requestData = {
      'companyID': companyID,
      'name': name,
      'address': address,
      'vote_branches': clefList,
      'stripe_customerID': stripeCustomerID
    }
    setVisibleIndicator(true);
    ManagerService.updateBuilding(props.match.params.id, requestData)
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
  };
  const getCompanyList = (id) => {
    setVisibleIndicator(true);
    ManagerService.getCompanyListByUser()
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              company.splice(0, company.length)
              data.companylist.map((item) => (
                company.push(item.name)
              )
              );
              setCompanyList(data.companylist);
              setCompany(company);
              for (let i = 0; i < data.companylist.length; i++)
                if (data.companylist[i].companyID === id)
                  setCompanies(i);
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
          ToastsStore.error("Can't connect")
          setVisibleIndicator(false);
        }
      );
  }

  useEffect(() => {
    if (accessBuildings !== 'denied') {
      setVisibleIndicator(true);
      ManagerService.getBuilding(props.match.params.id)
        .then(
          response => {
            setVisibleIndicator(false);
            switch (response.data.code) {
              case 200:
                const data = response.data.data;
                localStorage.setItem("token", JSON.stringify(data.token));
                const building = data.building[0];
                const vote_list = data.vote_list;
                vote_list.map((vote) =>
                  clefList.push(vote)
                )
                getCompanyList(building.companyID);
                setName(building.name);
                setAddress(building.address);
                setAccountName(building.account_holdername ? building.account_holdername : '');
                setAccountAddress(building.account_address ? building.account_address : '');
                setIBAN(building.account_IBAN ? building.account_IBAN : '');
                setCompanyID(building.companyID);
                setClefList(clefList);
                setCount(vote_list.length);
                setStripeCustomerID(building.stripe_customerID ? building.stripe_customerID : '');
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
  }, [accessBuildings]);

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
                <b>{name}</b>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} container justify="flex-end" >
          </Grid>
        </Grid>
      </div>
      <div className={classes.tool}>
        <p onClick={handleClick} className={classes.backTitle}>&lt; Retour à la liste des Immeubles</p>
      </div>
      <Grid container direction="column" >
        <div className={classes.body}>
          <Grid item container spacing={5} xs={12} sm={8} md={6}>
            <Grid item container><p className={classes.headerTitle}><b>Informations</b></p></Grid>
            <Grid item container alignItems="center" spacing={2}>
              <Grid item><p className={classes.itemTitle}>Nom</p></Grid>
              <Grid xs item container alignItems="stretch">
                <TextField
                  variant="outlined"
                  value={name}
                  fullWidth
                  onChange={handleChangeName}
                  disabled={(accessBuildings === 'see' ? true : false)}
                />
                {errorsName.length > 0 &&
                  <span className={classes.error}>{errorsName}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={2}>
              <Grid item><p className={classes.itemTitle}>Cabinets</p></Grid>
              <Grid xs item container alignItems="stretch" direction="column">
                <MySelect
                  color="gray"
                  data={company}
                  onChangeSelect={handleChangeCompanies}
                  value={companies}
                  width="100%"
                  disabled={(accessBuildings === 'see' ? true : false)}
                />
                {errorsCompanies.length > 0 &&
                  <span className={classes.error}>{errorsCompanies}</span>}
              </Grid>
            </Grid>
            <Grid item container direction="column" spacing={2}>
              <Grid item><p className={classes.itemTitle}>Adresse</p></Grid>
              <Grid item container alignItems="stretch" direction="column">
                <TextField
                  multiline
                  variant="outlined"
                  value={address}
                  onChange={handleChangeAddress}
                  disabled={(accessBuildings === 'see' ? true : false)}
                />
                {errorsAddress.length > 0 &&
                  <span className={classes.error}>{errorsAddress}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={2}>
              <Grid item><p className={classes.itemTitle}>Clé de répartition</p></Grid>
            </Grid>
            {
              state !== null ?
                <Grid item container direction="column" spacing={4}>
                  {
                    clefList.map((clef, i) => (
                      <Grid key={i} item container spacing={1} direction="column">
                        <Grid item>
                          <Grid item  xs={6} container justify="space-between" alignItems="center">
                            <Grid item xs={6}>
                              <p className={classes.itemTitle} style={{ display: 'flex' }}>{clef.vote_branch_name}</p>
                            </Grid>
                            <Grid item xs={6}>
                              <RemoveCircleOutlineIcon
                                className={classes.plus}
                                onClick={accessBuildings === 'see' ? null : () => handleClickRemoveClef(i)}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Grid item xs={12} container justify="space-between" alignItems="center" spacing={1}>
                            <Grid item >
                              <p className={classes.itemTitle}>Libellé</p>
                            </Grid>
                            <Grid xs item >
                              <TextField
                                variant="outlined"
                                value={clef.description}
                                onChange={(event) => handleChangeAddDescription(event, i)}
                                disabled={accessBuildings === 'see' ? true : false}
                                fullWidth
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <p className={classes.itemTitle}>{clef.total ? clef.total : 0} tantièmes</p>
                        </Grid>
                      </Grid>
                    ))
                  }
                </Grid>
                : null
            }
            <Grid item container spacing={4}>
              <Grid item container direction="column" spacing={1}>
                <Grid xs={6} item container direction="column" >
                  <Grid item container direction="row-reverse" justify="space-between" alignItems="center" spacing={1}>
                    <Grid item>
                      <AddCircleOutlineIcon
                        className={classes.plus}
                        onClick={accessBuildings === 'see' ? null : handleClickAddClef}
                      />
                    </Grid>
                    <Grid xs item >
                      <TextField
                        variant="outlined"
                        value={addClefs}
                        onChange={handleChangeAddClefs}
                        disabled={accessBuildings === 'see' ? true : false}
                      />
                    </Grid>
                  </Grid>
                  {errorsVote.length > 0 &&
                    <span className={classes.error}>{errorsVote}</span>}
                </Grid>
              </Grid>
            </Grid>
            <Grid item container style={{ paddingTop: '50px', paddingBottom: '50px' }}>
              <MyButton name={"Sauvegarder"} color={"1"} onClick={handleClickAdd} disabled={(accessBuildings === 'see' ? true : false)} />
            </Grid>
          </Grid>
        </div>
        <div>
          <Grid xs={12} sm={6} item container justify="flex-start" direction="column" spacing={5} className={classes.item}>
            <Grid item>
              <p className={classes.sepaTitle}><b>Compte bancaire - Prelevement SEPA</b></p>
            </Grid>
            <Grid item container direction="column" spacing={2} >
              <Grid item container alignItems="center" spacing={2}>
                <Grid item><p className={classes.sepaItemTitle}>Nom du titulaire du compte</p></Grid>
                <Grid xs item container direction="row-reverse">
                  <Grid item container alignItems="stretch" direction="column">
                    <TextField
                      variant="outlined"
                      value={accountname}
                      onChange={handleChangeAccountName}
                      disabled={(accessBuildings === 'see' ? true : false)}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item container alignItems="flex-start" spacing={2}>
                <Grid item><p className={classes.sepaItemTitle}>Adresse</p></Grid>
                <Grid xs item container direction="row-reverse">
                  <Grid item container alignItems="stretch" direction="column">
                    <TextField
                      multiline
                      variant="outlined"
                      value={accountaddress}
                      onChange={handleChangeAccountAddress}
                      disabled={(accessBuildings === 'see' ? true : false)}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item container alignItems="center" spacing={2}>
                <Grid item><p className={classes.sepaItemTitle}>IBAN</p></Grid>
                <Grid xs item container direction="row-reverse">
                  <Grid item container alignItems="stretch" direction="column">
                    <TextField
                      variant="outlined"
                      value={IBAN}
                      onChange={handleChangeIBAN}
                      disabled={(accessBuildings === 'see' ? true : false)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item container justify="space-between" spacing={1}>
              <Grid item>
                <MyButton
                  name={"Editer le mandat"}
                  color={"1"}
                  disabled={(accessBuildings === 'see' ? true : false)}
                  onClick={accessBuildings === 'see' ? null : handleClickUpdateBankInfo}
                />
              </Grid>
              <Grid item>
                <MyButton
                  name={"Supprimer"}
                  bgColor="grey"
                  disabled={(accessBuildings === 'see' ? true : false)}
                  onClick={accessBuildings === 'see' ? null : handleClickDeleteBankInfo}
                />
              </Grid>
            </Grid>
            {errorsBank.length > 0 &&
                      <span className={classes.error}>{errorsBank}</span>}
          </Grid>
        </div>
      </Grid>
      <DeleteConfirmDialog
        openDelete={openSEPADelete}
        handleCloseDelete={handleCloseSEPADelete}
        handleDelete={handleSEPADelete}
        account={'bank information'}
      />
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(BuildingsEdit);
