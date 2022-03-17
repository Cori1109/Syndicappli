import React, { useState, useEffect } from 'react';
import MyTable from '../../../components/MyTable';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import MyTableCard from '../../../components/MyTableCard';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Avatar } from '@material-ui/core';
import MyButton from 'components/MyButton';
import { Checkbox } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import { withRouter } from 'react-router-dom';
import { EditCompanyStyles as useStyles } from './useStyles';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import AddManager from './AddManager';
import AddBuilding from './AddBuilding';
import AdminService from '../../../services/api.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import authService from '../../../services/authService.js';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import MuiPhoneNumber from 'material-ui-phone-number';
import BankCard from './BankCard';
import validator from 'card-validator';
const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const fileTypes = [
  "image/apng",
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/pjpeg",
  "image/png",
  "image/svg+xml",
  "image/tiff",
  "image/webp",
  "image/x-icon"
];

function validFileType(file) {
  return fileTypes.includes(file.type);
}
const CompaniesEdit = (props) => {
  const classes = useStyles();
  const [dataList, setDataList] = useState([]);
  const { history } = props;
  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const accessCompanies = authService.getAccess('role_companies');
  const accessManagers = authService.getAccess('role_managers');
  const accessBuildings = authService.getAccess('role_buildings');
  const [visibleIndicator, setVisibleIndicator] = useState(false);

  const [openAddManager, setOpenAddManager] = useState(false);
  const [openAddBuilding, setOpenAddBuilding] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openSEPADelete, setOpenSEPADelete] = useState(false);
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [siret, setSiret] = useState('');
  const [vat, setVat] = useState('');
  const [contact, setContact] = useState(0);
  const [accountname, setAccountName] = useState('');
  const [accountaddress, setAccountAddress] = useState('');
  const [IBAN, setIBAN] = useState('');
  const [assemblies360, setAssemblies360] = useState(false);
  const [assembliesWebcam, setAssembliesWebcam] = useState(false);
  const [assembliesAudio, setAssembliesAudio] = useState(false);
  const [statusActive, setStatusActive] = useState(false);
  const [statusInActive, setStatusInActive] = useState(false);

  const [avatarurl, setAvatarUrl] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [managerCount, setManagerCount] = useState(0);
  const [apartmentCount, setApartmentCount] = useState(0);

  const [managerDataList, setManagerDataList] = useState([]);
  const [managerTotalpage, setManagerTotalPage] = useState(1);
  const [manager_row_count, setManagerRowCount] = useState(20);
  const [manager_sort_column, setManagerSortColumn] = useState(-1);
  const [manager_sort_method, setManagerSortMethod] = useState('asc');
  const [manager_page_num, setManagerPageNum] = useState(1);
  const managerSelectList = [20, 50, 100, 200, -1];
  const [managerDeleteId, setManagerDeleteId] = useState(-1);
  const [managerOpenDelete, setManagerOpenDelete] = useState(false);
  const managerCellList = [
    { key: 'lastname', field: 'Nom' },
    { key: 'firstname', field: 'Prénom' },
    { key: 'email', field: 'Email' },
    { key: 'phone', field: 'Téléphone' },
  ];

  const managerColumns = [];
  for (let i = 0; i < 4; i++)
    managerColumns[i] = 'asc';
  const [building_refresh, setBuildingRefresh] = useState(false);
  const [manager_refresh, setManagerRefresh] = useState(false);
  const [buildingDataList, setBuildingDataList] = useState([]);
  const [buildingTotalpage, setBuildingTotalPage] = useState(1);
  const [building_row_count, setBuildingRowCount] = useState(20);
  const [building_sort_column, setBuildingSortColumn] = useState(-1);
  const [building_sort_method, setBuildingSortMethod] = useState('asc');
  const [building_page_num, setBuildingPageNum] = useState(1);
  const [buildingDeleteId, setBuildingDeleteId] = useState(-1);
  const [buildingOpenDelete, setBuildingOpenDelete] = useState(false);
  const buildingSelectList = [20, 50, 100, 200, -1];
  const [stripeCustomerID, setStripeCustomerID] = useState('');
  const [errorsName, setErrorsName] = useState('');
  const [errorsAddress, setErrorsAddress] = useState('');
  const [errorsEmail, setErrorsEmail] = useState('');
  const [errorsPhone, setErrorsPhone] = useState('');
  const [errorsSiret, setErrorsSiret] = useState('');
  const [errorsStatus, setErrorsStatus] = useState('');
  const [errorsBank, setErrorsBank] = useState('');
  const buildingCellList = [
    { key: 'name', field: 'Nom' },
    { key: 'address', field: 'Adresse' },
  ];

  const buildingColumns = [];
  for (let i = 0; i < 2; i++)
    buildingColumns[i] = 'asc';

  const [cardDataList, setCardDataList] = useState([]);
  const [deleteId, setDeleteId] = useState(-1);
  const [state, setState] = useState({ method: 'add', buttonText: 'Ajouter', pos: -1 });
  useEffect(() => {
    if (accessCompanies !== 'denied' && accessBuildings !== 'denied')
      getBuildings();
  }, [building_page_num, building_row_count, building_sort_method, building_sort_column, building_refresh]);
  useEffect(() => {
    if (accessCompanies !== 'denied' && accessManagers !== 'denied')
      getManagers();
  }, [manager_page_num, manager_row_count, manager_sort_method, manager_sort_column, manager_refresh]);
  const handleClick = () => {
    history.goBack();
  };

  const handleCloseAddManager = () => {
    setOpenAddManager(false);
  };
  const handleCloseAddBuilding = () => {
    setOpenAddBuilding(false);
  };

  const handleChangeName = (event) => {
    setName(event.target.value);
  }

  const handleChangeAddress = (event) => {
    setAddress(event.target.value);
  }

  const handleChangeEmail = (event) => {
    event.preventDefault();
    let errorsMail =
      validEmailRegex.test(event.target.value)
        ? ''
        : 'Email is not valid!';
    setEmail(event.target.value);
    setErrorsEmail(errorsMail);
  }

  const handleChangePhone = (val) => {
    setPhone(val);
  }

  const handleChangeSiret = (event) => {
    if (event.target.value[event.target.value.length - 1] === '.')
      return;
    if (Number.isInteger(Number(event.target.value))) {
      if (event.target.value.length < 15)
        setSiret(event.target.value);
    }
  }

  const handleChangeVat = (event) => {
    setVat(event.target.value);
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

  const handleLoadFront = (event) => {
    if (event.target.files[0] !== undefined) {
      if (validFileType(event.target.files[0])) {
        if (event.target.files[0].size > 5 * 1048576) {
          ToastsStore.warning('Image size should be low than 5 MB.');
        } else {
          setAvatar(event.target.files[0]);
          setAvatarUrl(URL.createObjectURL(event.target.files[0]));
        }
      }
      else {
        ToastsStore.warning('Image format is not correct.');
      }
    }
  }
  const handleClickAddManager = () => {
    setOpenAddManager(true);
  }
  const handleClickAddBuilding = () => {
    setOpenAddBuilding(true);
  }
  const handleAddManager = () => {
    ToastsStore.success("Added New Manager successfully!");
    setManagerRefresh(!manager_refresh);
  };
  const handleAddBuilding = () => {
    ToastsStore.success("Added New Building successfully!");
    setBuildingRefresh(!building_refresh);
  };
  const handleClickSave = () => {
    let cnt = 0;
    if (name.length === 0) { setErrorsName('please enter your new company name'); cnt++; }
    else setErrorsName('');
    if (address.length === 0) { setErrorsAddress('please enter your address'); cnt++; }
    else setErrorsAddress('');
    if (email.length === 0) { setErrorsEmail('please enter your email'); cnt++; }
    else setErrorsEmail('');
    if (phone.length === 0) { setErrorsPhone('please enter your phone number'); cnt++; }
    else setErrorsPhone('');
    if (siret.length !== 14) { setErrorsSiret('please check your company SIRET'); cnt++; }
    else setErrorsSiret('');
    if (statusActive === false && statusInActive === false) { setErrorsStatus('please select company status'); cnt++; }
    else setErrorsStatus('');
    if (cnt === 0) {
      updateCompany();
    }
  };
  const handleChangeAssemblies360 = (event) => {
    setAssemblies360(event.target.checked);
  }
  const handleChangeAssembliesWebcam = (event) => {
    setAssembliesWebcam(event.target.checked);
  }
  const handleChangeAssembliesAudio = (event) => {
    setAssembliesAudio(event.target.checked);
  }
  const handleChangeStatusActive = (event) => {
    setStatusActive(event.target.checked);
    if (statusActive)
      setStatusInActive(!statusActive);
    else
      setStatusInActive(statusActive);
  }
  const handleChangeStatusInActive = (event) => {
    setStatusInActive(event.target.checked);
    if (statusInActive)
      setStatusActive(!statusInActive);
    else
      setStatusActive(statusInActive);
  }
  const handleChangeManagerPagination = (value) => {
    setManagerPageNum(value);
  }
  const handleManagerSort = (index, direct) => {
    setManagerSortColumn(index);
    setManagerSortMethod(direct);
  }
  const handleClickManagerEdit = (id) => {
    console.log(id);
    history.push('/admin/managers/edit/' + id);
    window.location.reload();
  }
  const handleChangeManagerSelect = (value) => {
    setManagerRowCount(managerSelectList[value]);
  }
  const handleChangeBuildingPagination = (value) => {
    setBuildingPageNum(value);
  }
  const handleBuildingSort = (index, direct) => {
    setBuildingSortColumn(index);
    setBuildingSortMethod(direct);
  }
  const handleClickBuildingEdit = (id) => {
    console.log(id);
    history.push('/admin/buildings/edit/' + id);
    window.location.reload();
  }
  const handleChangeBuildingSelect = (value) => {
    setBuildingRowCount(buildingSelectList[value]);
  }

  useEffect(() => {
    getCards();
  }, [refresh]);
  const cardCellList = [
    { key: 'last_digits', field: '' },
    { key: 'name', field: '' },
    { key: 'expiry_date', field: '' }
  ];
  const getCards = () => {
    const requestData = {
      'companyID': props.match.params.id
    }
    setVisibleIndicator(true);
    AdminService.getCardList(requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              let list = data.cardlist;
              for (let i = 0; i < list.length; i++) {
                let numberValidation = validator.number(list[i].card_number);
                if (numberValidation.isPotentiallyValid) {
                  if (numberValidation.card) {
                    var digits = String(list[i].card_number);
                    list[i].last_digits = numberValidation.card.niceType + '-' + digits.substring(digits.length - 4);
                  } else
                  list[i].last_digits = list[i].card_number;
                } else
                list[i].last_digits = list[i].card_number;
              }
              setCardDataList(list);
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
  useEffect(() => {
    if (accessCompanies === 'denied') {
      // setOpenDialog(true);
    }
    if (accessCompanies !== 'denied') {
      setVisibleIndicator(true);
      AdminService.getCompany(props.match.params.id)
        .then(
          response => {
            setVisibleIndicator(false);
            switch (response.data.code) {
              case 200:
                const data = response.data.data.company;
                localStorage.setItem("token", JSON.stringify(response.data.data.token));
                setName(data.name);
                setAddress(data.address);
                setEmail(data.email);
                setPhone(data.phone);
                setSiret(data.SIRET);
                setVat(data.VAT);
                setAccountName(data.account_holdername);
                setAccountAddress(data.account_address);
                setIBAN(data.account_IBAN);
                setAvatarUrl(data.logo_url);
                setAssemblies360(data.access_360cam === 'true' ? true : false);
                setAssembliesWebcam(data.access_webcam === 'true' ? true : false);
                setAssembliesAudio(data.access_audio === 'true' ? true : false);
                setManagerCount(data.manager_count ? data.manager_count : 0);
                setApartmentCount(data.apartment_count ? data.apartment_count : 0);
                setStripeCustomerID(data.stripe_customerID ? data.stripe_customerID : '');
                if (data.status === 'active') {
                  setStatusActive(true);
                  setStatusInActive(false);
                }
                else if (data.status === 'inactive') {
                  setStatusActive(false);
                  setStatusInActive(true);
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
  }, [accessCompanies]);
  const updateCompany = () => {
    let formdata = new FormData();
    formdata.set('name', name);
    formdata.set('address', address);
    formdata.set('email', email);
    formdata.set('phone', phone);
    formdata.set('SIRET', siret);
    formdata.set('address', address);
    formdata.set('VAT', vat);
    formdata.set('account_holdername', accountname);
    formdata.set('account_address', accountaddress);
    formdata.set('account_IBAN', IBAN);
    formdata.set('access_360cam', assemblies360 ? 'true' : 'false');
    formdata.set('access_webcam', assembliesWebcam ? 'true' : 'false');
    formdata.set('access_audio', assembliesAudio ? 'true' : 'false');
    formdata.set('status', statusActive === true ? 'active' : 'inactive');
    formdata.set('logo', avatar === null ? '' : avatar);
    formdata.set('stripe_customerID', stripeCustomerID);
    setVisibleIndicator(true);
    AdminService.updateCompany(props.match.params.id, formdata)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              ToastsStore.success(response.data.message);
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
  const getManagers = () => {
    const requestData = {
      'search_key': '',
      'page_num': manager_page_num - 1,
      'row_count': manager_row_count,
      'sort_column': manager_sort_column,
      'sort_method': manager_sort_method,
      'buildingID': -1,
      'companyID': props.match.params.id,
      'status': 'active'
    }
    setVisibleIndicator(true);
    AdminService.getManagerList(requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              if (data.totalpage)
                setManagerTotalPage(data.totalpage);
              else
                setManagerTotalPage(1);
              setManagerDataList(data.managerlist);
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
  const getBuildings = () => {
    const requestData = {
      'search_key': '',
      'page_num': building_page_num - 1,
      'row_count': building_row_count,
      'sort_column': building_sort_column,
      'sort_method': building_sort_method,
      'companyID': props.match.params.id,
      'status': 'active'
    }
    setVisibleIndicator(true);
    AdminService.getBuildingList(requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              if (!data.totalpage)
                setBuildingTotalPage(1);
              else
                setBuildingTotalPage(data.totalpage);
              setBuildingDataList(data.buildinglist);
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
  const handleClickBuildingDelete = (id) => {
    setBuildingOpenDelete(true);
    setBuildingDeleteId(id);
  };
  const handleBuildingCloseDelete = () => {
    setBuildingOpenDelete(false);
  };
  const handleBuildingDelete = () => {
    handleBuildingCloseDelete();
    setBuildingDeleteId(-1);
    setVisibleIndicator(true);
    let data = {
      'status': 'trash'
    }
    AdminService.deleteBuilding(buildingDeleteId, data)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              ToastsStore.success("Deleted successfully!");
              getBuildings();
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
  const handleClickManagerDelete = (id) => {
    setManagerOpenDelete(true);
    setManagerDeleteId(id);
  };
  const handleManagerCloseDelete = () => {
    setManagerOpenDelete(false);
  };
  const handleManagerDelete = () => {
    handleManagerCloseDelete();
    setManagerDeleteId(-1);
    setVisibleIndicator(true);
    let data = {
      'status': 'trash'
    }
    AdminService.deleteManager(managerDeleteId, data)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              ToastsStore.success("Deleted successfully!");
              getManagers();
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
  const setOutcome = (result) => {
    if (result.source) {
      setErrorsBank('');
      updateBankInfo(result.source.id);
  } else if (result.error) {
      setErrorsBank("Please check your bank information. It's not correct.");
    }
  }
  const updateBankInfo = (id) => {
    let requestData = {
      'account_holdername': accountname,
      'account_address': accountaddress,
      'account_IBAN': IBAN,
      'id' : id
    }
    setVisibleIndicator(true);
    AdminService.updateBankInfo(props.match.params.id, requestData)
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
  const handleClickDeleteBankInfo = () => {
    if (IBAN.length !== 0) {
      setOpenSEPADelete(true);
    }
  }
  const handleClose = () => {
    setOpen(false);
  };
  const handleAdd = () => {
    ToastsStore.success("Added New Card successfully!");
    setRefresh(!refresh);
  };
  const handleUpdate = () => {
    ToastsStore.success("Updated successfully!");
    setRefresh(!refresh);
  };
  const handleClickAddCard = () => {
    let tmpState = { method: 'add', buttonText: 'Ajouter', pos: -1 };
    setState(tmpState);
    setOpen(true);
  }
  const handleClickEditCard = (id) => {
    let tmpState = { method: 'edit', buttonText: 'Mettre à jour', pos: id };
    setState(tmpState);
    setOpen(true);
  }
  const handleClickDeleteCard = (id) => {
    setOpenDelete(true);
    setDeleteId(id);
  }
  const handleCloseDelete = () => {
    setOpenDelete(false);
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
    AdminService.updateBankInfo(props.match.params.id, requestData)
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
  const handleDelete = () => {
    handleCloseDelete();
    setDeleteId(-1);
    setVisibleIndicator(true);
    AdminService.deleteCard(deleteId)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              ToastsStore.success("Deleted Successfully!");
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              setRefresh(!refresh);
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
                <b>{name}</b>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} container justify="flex-end" >
          </Grid>
        </Grid>
      </div>
      <div className={classes.tool}>
        <p onClick={handleClick} className={classes.backTitle}>&lt; Retour à la liste des Cabinets</p>
      </div>
      <Grid container direction="column" >
        <div className={classes.body}>
          <Grid container direction="column" spacing={5}>
            <Grid item container spacing={2} direction="row" justify="space-between">
              <Grid item container direction="column" justify="space-between" xs={5}>
                <Grid item container><p className={classes.headerTitle}><b>Informations</b></p></Grid>
                <Grid item container alignItems="center" spacing={2}>
                  <Grid item><p className={classes.itemTitle}>Nom</p></Grid>
                  <Grid xs item container alignItems="stretch" direction="column">
                    <TextField
                      className={classes.text}
                      variant="outlined"
                      value={name}
                      onChange={handleChangeName}
                      fullWidth
                      disabled={(accessCompanies === 'see' ? true : false)}
                    />
                    {errorsName.length > 0 &&
                      <span className={classes.error}>{errorsName}</span>}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item container xs={5} direction="row-reverse">
                <Badge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                    right: -20,
                    top: 10,
                    border: '2px solid gray',
                    padding: '1px 4px',
                  }}
                  badgeContent={
                    <div>
                      <input className={classes.input} accept="image/*" type="file" id="img_front" onChange={handleLoadFront} disabled={(accessCompanies === 'see' ? true : false)} />
                      <label htmlFor="img_front">
                        <EditOutlinedIcon className={classes.editAvatar} />
                      </label>
                    </div>
                  }
                >
                  <Avatar className={classes.size} alt="Travis Howard" src={avatarurl} />
                </Badge>
              </Grid>
            </Grid>
            <Grid item container direction="column" spacing={2} justify="space-between">
              <Grid item container direction="row" justify="space-between">
                <Grid item><p className={classes.itemTitle}>Coordonnées</p></Grid>
                <Grid item>
                  <p className={classes.itemTitle}><b>Nombre de gestionnaires : </b>{managerCount}</p>
                </Grid>
              </Grid>
              <Grid item container direction="row" justify="space-between">
                <Grid xs={5} item container alignItems="stretch" direction="column">
                  <TextField
                    className={classes.text}
                    multiline
                    variant="outlined"
                    value={address}
                    onChange={handleChangeAddress}
                    fullWidth
                    disabled={(accessCompanies === 'see' ? true : false)}
                  />
                  {errorsAddress.length > 0 &&
                    <span className={classes.error}>{errorsAddress}</span>}
                </Grid>
                <Grid xs={5} item container direction="row-reverse">
                  <p className={classes.itemTitle}><b>Nombre de lots : </b>{apartmentCount}</p>
                </Grid>
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.itemTitle}>Email</p></Grid>
              <Grid xs={5} item container direction="column">
                <TextField
                  className={classes.text}
                  variant="outlined"
                  value={email}
                  onChange={handleChangeEmail}
                  disabled={(accessCompanies === 'see' ? true : false)}
                />
                {errorsEmail.length > 0 &&
                  <span className={classes.error}>{errorsEmail}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.itemTitle}>Téléphone</p></Grid>
              <Grid xs={5} item container alignItems="stretch" direction="column">
                <MuiPhoneNumber
                  defaultCountry='fr'
                  className={classes.text}
                  variant="outlined"
                  value={phone}
                  onChange={handleChangePhone}
                  disabled={(accessCompanies === 'see' ? true : false)}
                />
                {errorsPhone.length > 0 &&
                  <span className={classes.error}>{errorsPhone}</span>}
              </Grid>
            </Grid>
            {/* <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.itemTitle}>Contact</p></Grid>
              <Grid xs item container alignItems="stretch">
                <MySelect
                  color="gray"
                  width="160px"
                  data={contactList}
                  value={contact}
                  onChangeSelect={handleChangeContact}
                />
              </Grid>
            </Grid> */}
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.itemTitle}>SIRET</p></Grid>
              <Grid xs={5} item container alignItems="stretch" direction="column">
                <TextField
                  className={classes.text}
                  variant="outlined"
                  value={siret}
                  onChange={handleChangeSiret}
                  type="tel"
                  fullWidth
                  disabled={(accessCompanies === 'see' ? true : false)}
                />
                {errorsSiret.length > 0 &&
                  <span className={classes.error}>{errorsSiret}</span>}
              </Grid>
            </Grid>
            <Grid item container direction="column" spacing={2}>
              <Grid item container><p className={classes.itemTitle}>N° TVA intracommunautaire</p></Grid>
              <Grid item xs={5} item container alignItems="stretch">
                <TextField
                  className={classes.text}
                  variant="outlined"
                  value={vat}
                  onChange={handleChangeVat}
                  fullWidth
                  disabled={(accessCompanies === 'see' ? true : false)}
                />
              </Grid>
            </Grid>
            <Grid item container direction="column">
              <Grid item>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item ><p className={classes.itemTitle}>Assemblées Générales en 360</p></Grid>
                  <Grid xs item container>
                    <Checkbox
                      checked={assemblies360}
                      onChange={handleChangeAssemblies360}
                      disabled={(accessCompanies === 'see' ? true : false)}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item><p className={classes.itemTitle}>Assemblées générales en Webcam</p></Grid>
                  <Grid xs item container>
                    <Checkbox
                      checked={assembliesWebcam}
                      onChange={handleChangeAssembliesWebcam}
                      disabled={(accessCompanies === 'see' ? true : false)}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item><p className={classes.itemTitle}>Assemblées Générales en Audio</p></Grid>
                  <Grid xs item container>
                    <Checkbox
                      checked={assembliesAudio}
                      onChange={handleChangeAssembliesAudio}
                      disabled={(accessCompanies === 'see' ? true : false)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item container direction="column">
              <Grid item><p className={classes.itemTitle}>Statut Du Cabinet</p></Grid>
              <Grid item container>
                <Grid item>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item ><p className={classes.itemTitle}>actif</p></Grid>
                    <Grid xs item container>
                      <Checkbox
                        checked={statusActive}
                        onChange={handleChangeStatusActive}
                        disabled={(accessCompanies === 'see' ? true : false)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item><p className={classes.itemTitle}>inactif</p></Grid>
                    <Grid xs item container>
                      <Checkbox
                        checked={statusInActive}
                        onChange={handleChangeStatusInActive}
                        disabled={(accessCompanies === 'see' ? true : false)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {errorsStatus.length > 0 &&
                <span className={classes.error}>{errorsStatus}</span>}
            </Grid>
            <Grid item container style={{ paddingTop: '50px', paddingBottom: '50px' }}>
              <MyButton name={"Sauvegarder"} color={"1"} onClick={handleClickSave} disabled={(accessCompanies === 'see' ? true : false)} />
            </Grid>
          </Grid>
        </div>
        <div>
          <Grid item container justify="flex-start" spacing={2} className={classes.item}>
            <Grid item>
              <p className={classes.headerTitle}><b>Gestionnaires</b></p>
            </Grid>
          </Grid>
          <MyTable
            onChangeSelect={handleChangeManagerSelect}
            onChangePage={handleChangeManagerPagination}
            onSelectSort={handleManagerSort}
            page={manager_page_num}
            columns={managerColumns}
            products={managerDataList}
            totalpage={managerTotalpage}
            cells={managerCellList}
            onClickEdit={handleClickManagerEdit}
            onClickDelete={handleClickManagerDelete}
            leftBtn="Ajouter un  gestionnaire"
            onClick={handleClickAddManager}
            access={accessManagers}
          />
        </div>
        <div>
          <Grid item container justify="flex-start" spacing={2} className={classes.item}>
            <Grid item>
              <p className={classes.headerTitle}><b>Immeubles</b></p>
            </Grid>
          </Grid>
          <MyTable
            onChangeSelect={handleChangeBuildingSelect}
            onChangePage={handleChangeBuildingPagination}
            onSelectSort={handleBuildingSort}
            page={building_page_num}
            columns={buildingColumns}
            products={buildingDataList}
            totalpage={buildingTotalpage}
            cells={buildingCellList}
            onClickEdit={handleClickBuildingEdit}
            onClickDelete={handleClickBuildingDelete}
            leftBtn="Ajouter un  immeuble"
            onClick={handleClickAddBuilding}
            access={accessBuildings}
          />
        </div>
        <Grid item container>
          <Grid item container justify="flex-start" direction="column" spacing={2} className={classes.item}>
            <Grid item>
              <p className={classes.headerTitle}><b>Moyens de paiement</b></p>
            </Grid>
            <Grid item>
              <p className={classes.sepaTitle}><b>carte bancaire</b></p>
            </Grid>
          </Grid>
          <Grid item sm={7}>
            <MyTableCard
              products={cardDataList}
              cells={cardCellList}
              leftBtn="ajouter une carte"
              onClickEdit={handleClickEditCard}
              onClickDelete={handleClickDeleteCard}
              onClickAdd={handleClickAddCard}
            />
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              classes={{ paper: classes.paper }}
            >
              <Grid item container className={classes.padding} justify="space-between">
                <Grid item container direction="row-reverse"><CloseIcon onClick={handleClose} className={classes.close} /></Grid>
                <Grid item>
                  <h2 id="transition-modal-title" className={classes.modalTitle}>
                    {state.method === 'add' ? "Ajouter Carte" : "Mettre à jour Carte"}
                  </h2>
                </Grid>
              </Grid>
              <BankCard onCancel={handleClose} onAdd={handleAdd} onUpdate={handleUpdate} state={state} />
            </Dialog>
          </Grid>
        </Grid>
        <div>
          <Grid xs={12} sm={6} item container justify="flex-start" direction="column" spacing={5} className={classes.item}>
            <Grid item>
              <p className={classes.sepaTitle}><b>Compte bancaire - Prelevement SEPA</b></p>
            </Grid>
            <Grid item container direction="column" spacing={2}>
              <Grid item container alignItems="center" spacing={2}>
                <Grid item><p className={classes.permissionItemTitle}>Nom du titulaire du compte</p></Grid>
                <Grid xs item container direction="row-reverse">
                  <Grid item container alignItems="stretch" direction="column">
                    <TextField
                      className={classes.text}
                      variant="outlined"
                      value={accountname}
                      onChange={handleChangeAccountName}
                      fullWidth
                      disabled={(accessCompanies === 'see' ? true : false)}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item container alignItems="flex-start" spacing={2}>
                <Grid item><p className={classes.permissionItemTitle}>Adresse</p></Grid>
                <Grid xs item container direction="row-reverse">
                  <Grid item container alignItems="stretch" direction="column">
                    <TextField
                      className={classes.text}
                      multiline
                      variant="outlined"
                      value={accountaddress}
                      onChange={handleChangeAccountAddress}
                      fullWidth
                      disabled={(accessCompanies === 'see' ? true : false)}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item container alignItems="center" spacing={2}>
                <Grid item><p className={classes.permissionItemTitle}>IBAN</p></Grid>
                <Grid xs item container direction="row-reverse">
                  <Grid item container alignItems="stretch" direction="column">
                    <TextField
                      className={classes.text}
                      variant="outlined"
                      value={IBAN}
                      onChange={handleChangeIBAN}
                      fullWidth
                      disabled={(accessCompanies === 'see' ? true : false)}
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
                  disabled={(accessCompanies === 'see' ? true : false)}
                  onClick={handleClickUpdateBankInfo}
                />
              </Grid>
              <Grid item>
                <MyButton
                  name={"Supprimer"}
                  bgColor="grey"
                  disabled={(accessCompanies === 'see' ? true : false)}
                  onClick={handleClickDeleteBankInfo}
                />
              </Grid>
            </Grid>
            {errorsBank.length > 0 &&
                      <span className={classes.error}>{errorsBank}</span>}
          </Grid>
        </div>
      </Grid>
      <Dialog
        open={openAddManager}
        onClose={handleCloseAddManager}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{ paper: classes.paper }}
      >
        <Grid item container className={classes.padding} justify="space-between">
          <Grid item container direction="row-reverse"><CloseIcon onClick={handleCloseAddManager} className={classes.close} /></Grid>
          <Grid item><p className={classes.sepaTitle}><b>Nouveau Gestionnaire</b></p></Grid>
        </Grid>
        <AddManager onCancel={handleCloseAddManager} onAdd={handleAddManager} companyID={props.match.params.id} />
      </Dialog>
      <Dialog
        open={openAddBuilding}
        onClose={handleCloseAddBuilding}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        classes={{ paper: classes.paper }}
      >
        <Grid item container className={classes.padding} >
          <Grid xs={12} item container direction="row-reverse"><CloseIcon onClick={handleCloseAddBuilding} className={classes.close} /></Grid>
          <Grid xs={12} item ><p className={classes.sepaTitle}><b>Nouvel immmeuble</b></p></Grid>
        </Grid>
        <AddBuilding onCancel={handleCloseAddBuilding} onAdd={handleAddBuilding} companyID={props.match.params.id} />
      </Dialog>
      <DeleteConfirmDialog
        openDelete={buildingOpenDelete}
        handleCloseDelete={handleBuildingCloseDelete}
        handleDelete={handleBuildingDelete}
        account={'building'}
      />
      <DeleteConfirmDialog
        openDelete={managerOpenDelete}
        handleCloseDelete={handleManagerCloseDelete}
        handleDelete={handleManagerDelete}
        account={'manager'}
      />
      <DeleteConfirmDialog
        openDelete={openDelete}
        handleCloseDelete={handleCloseDelete}
        handleDelete={handleDelete}
        account={'card'}
      />
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

export default withRouter(CompaniesEdit);
