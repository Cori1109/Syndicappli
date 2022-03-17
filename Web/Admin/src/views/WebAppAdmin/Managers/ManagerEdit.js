import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Avatar } from '@material-ui/core';
import MySelect from '../../../components/MySelect';
import MyButton from 'components/MyButton';
import Badge from '@material-ui/core/Badge';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import authService from '../../../services/authService.js';
import Multiselect from '../../../components/Multiselect.js';
import { EditManagerStyles as useStyles } from './useStyles';
import AdminService from '../../../services/api.js';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import MuiPhoneNumber from 'material-ui-phone-number';
import useGlobal from 'Global/global';
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
const ManagerEdit = (props) => {
  const { history } = props;

  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const [globalState, globalActions] = useGlobal();
  const accessManagers = authService.getAccess('role_managers');
  const [visibleIndicator, setVisibleIndicator] = useState(false);
  const classes = useStyles();
  const permissionList = ['Voir', 'Editer', 'Refusé'];
  const role_permission = ['see', 'edit', 'denied'];
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteId, setDeleteId] = useState(-1);
  const [suspendState, setSuspendState] = useState('Suspendre le compte');
  const [avatarurl, setAvatarUrl] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [lastname, setLastName] = useState('');
  const [firstname, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');
  const [buildingsPermission, setBuildingsPermission] = useState(0);
  const [chatPermission, setChatPermission] = useState(0);
  const [ownersPermission, setOwnersPermission] = useState(0);
  const [incidentsPermission, setIncidentsPermission] = useState(0);
  const [assembliesPermission, setAssembliesPermission] = useState(0);
  const [eventsPermission, setEventsPermission] = useState(0);
  const [teamPermission, setTeamPermission] = useState(0);
  const [providersPermission, setProvidersPermission] = useState(0);
  const [announcementsPermission, setAnnouncementsPermission] = useState(0);
  const [companyPermission, setCompanyPermission] = useState(0);
  const [addonsPermission, setAddonsPermission] = useState(0);
  const [invoicesPermission, setInvoicesPermission] = useState(0);
  const [paymentMethodsPermission, setPaymentMethodsPermission] = useState(0);
  const [apartNumber, setApartNumber] = useState('');

  const [errorsCompanies, setErrorsCompanies] = useState('');
  const [errorsBuildings, setErrorsBuildings] = useState('');
  const [errorsLastname, setErrorsLastname] = useState('');
  const [errorsFirstname, setErrorsFirstname] = useState('');
  const [errorsEmail, setErrorsEmail] = useState('');
  const [errorsPhonenumber, setErrorsPhonenumber] = useState('');
  let company = [''];
  const [companies, setCompanies] = useState(0);
  const [companyList, setCompanyList] = useState([]);
  const [companyID, setCompanyID] = useState(-1);

  const [buildingList, setBuildingList] = useState([]);
  let buildingID = [];
  const [buildings, setBuildings] = useState([]);
  const [mulitID, setMultiID] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [month_connection, setMonthConnection] = useState('0');
  const [daily_time, setDailyTime] = useState('0mn');
  useEffect(() => {
    getManager();
    getCompanies();
  }, [accessManagers]);
  const getCompanies = () => {
    setVisibleIndicator(true);
    AdminService.getCompanyListByUser()
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              company.splice(0, company.length)
              data.companylist.map((item) => (
                company.push(item.name)
              )
              );
              setCompanyList([...data.companylist]);
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
      'companyID': companyID
    }
    setVisibleIndicator(true);
    AdminService.getBuildingListByCompany(requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              let buildings1 = [];
              data.buildinglist.map((item, i) => (
                buildings1[i] = { label: item.name, value: item.buildingID }
              )
              );
              setBuildingList(data.buildinglist);
              setSuggestions(buildings1);
              for (let i = 0; i < companyList.length; i++)
                if (companyID === companyList[i].companyID) {
                  setCompanies(i);
                  break;
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
  const getManager = () => {
    setVisibleIndicator(true);

    AdminService.getManager(props.match.params.id)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              const profile = data.manager;
              setLastName(profile.lastname);
              setFirstName(profile.firstname);
              setEmail(profile.email);
              setPhoneNumber(profile.phone);
              setAvatarUrl(profile.photo_url);
              setAddonsPermission(role_permission.indexOf(profile.role_addons));
              setAnnouncementsPermission(role_permission.indexOf(profile.role_advertisement));
              setAssembliesPermission(role_permission.indexOf(profile.role_assemblies));
              setBuildingsPermission(role_permission.indexOf(profile.role_buildings));
              setChatPermission(role_permission.indexOf(profile.role_chat));
              setCompanyPermission(role_permission.indexOf(profile.role_company));
              setEventsPermission(role_permission.indexOf(profile.role_events));
              setIncidentsPermission(role_permission.indexOf(profile.role_incidents));
              setInvoicesPermission(role_permission.indexOf(profile.role_invoices));
              setOwnersPermission(role_permission.indexOf(profile.role_owners));
              setPaymentMethodsPermission(role_permission.indexOf(profile.role_payments));
              setProvidersPermission(role_permission.indexOf(profile.role_providers));
              setTeamPermission(role_permission.indexOf(profile.role_team));
              setCompanyID(profile.companyID);
              setApartNumber(profile.count);
              setMonthConnection(profile.month_connection);
              if (profile.daily_time > 3600)
                setDailyTime(Math.floor(profile.daily_time / 3600) + 'h' + (profile.daily_time % 3600) / 60);
              else
                setDailyTime(Math.floor(profile.daily_time / 60) + 'mn');
              if (profile.status === 'active')
                setSuspendState('Suspendre le compte');
              else if (profile.status === 'inactive')
                setSuspendState('Restaurer le compte');
              buildingID.splice(0, buildingID.length)
              data.buildinglist.map((item, i) => (
                buildingID[i] = item.relationID
              )
              );
              setMultiID(buildingID);
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
    getBuildings()
  }, [companyID]);
  useEffect(() => {
    AdminService.getManager(props.match.params.id)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              const profile = data.manager;
              setLastName(profile.lastname);
              setFirstName(profile.firstname);
              setEmail(profile.email);
              setPhoneNumber(profile.phone);
              setAvatarUrl(profile.photo_url);
              setAddonsPermission(role_permission.indexOf(profile.role_addons));
              setAnnouncementsPermission(role_permission.indexOf(profile.role_advertisement));
              setAssembliesPermission(role_permission.indexOf(profile.role_assemblies));
              setBuildingsPermission(role_permission.indexOf(profile.role_buildings));
              setChatPermission(role_permission.indexOf(profile.role_chat));
              setCompanyPermission(role_permission.indexOf(profile.role_company));
              setEventsPermission(role_permission.indexOf(profile.role_events));
              setIncidentsPermission(role_permission.indexOf(profile.role_incidents));
              setInvoicesPermission(role_permission.indexOf(profile.role_invoices));
              setOwnersPermission(role_permission.indexOf(profile.role_owners));
              setPaymentMethodsPermission(role_permission.indexOf(profile.role_payments));
              setProvidersPermission(role_permission.indexOf(profile.role_providers));
              setTeamPermission(role_permission.indexOf(profile.role_team));
              setApartNumber(profile.count);
              if (profile.status === 'active')
                setSuspendState('Suspendre le compte');
              else if (profile.status === 'inactive')
                setSuspendState('Restaurer le compte');
              buildingID.splice(0, buildingID.length)
              data.buildinglist.map((item, i) => (
                buildingID[i] = item.relationID
              )
              );
              setMultiID(buildingID);
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
  }, [buildingList]);
  useEffect(() => {
    let buildings = [];
    for (let i = 0; i < mulitID.length; i++)
      for (let j = 0; j < buildingList.length; j++)
        if (mulitID[i] === buildingList[j].buildingID) {
          buildings[i] = { label: buildingList[j].name, value: buildingList[j].buildingID };
          break;
        }
    setBuildings(buildings);
  }, [mulitID])
  const handleClick = () => {
    history.goBack();
  };
  const onClickSave = () => {
    let cnt = 0;
    if (lastname.length === 0) { setErrorsLastname('please enter your last name'); cnt++; }
    else setErrorsLastname('');
    if (firstname.length === 0) { setErrorsFirstname('please enter your first name'); cnt++; }
    else setErrorsFirstname('');
    if (companyID === -1) { setErrorsCompanies('please select companies'); cnt++; }
    else setErrorsCompanies('');
    if (buildings.length === 0) { setErrorsBuildings('please select buildings'); cnt++; }
    else setErrorsBuildings('');
    if (email.length === 0) { setErrorsEmail('please enter your email'); cnt++; }
    else setErrorsEmail('');
    if (phonenumber.length === 0) { setErrorsPhonenumber('please enter your phone number'); cnt++; }
    else setErrorsPhonenumber('');
    if (cnt === 0) {
      updateManager();
    }
  }
  const handleChangeLastName = (event) => {
    setLastName(event.target.value);
  }
  const handleChangeFirstName = (event) => {
    setFirstName(event.target.value);
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
  const handleChangePhoneNumber = (val) => {
    setPhoneNumber(val);
  }
  const handleChangeCompanies = (val) => {
    setCompanies(val);
    setCompanyID(companyList[val].companyID);
  };

  const handleChangeBuildings = async (val) => {
    if (val !== null) {
      await setBuildings(val);
      buildingID.splice(0, buildingID.length)
      for (let i = 0; i < val.length; i++)
        for (let j = 0; j < buildingList.length; j++)
          if (val[i].label == buildingList[j].name) {
            buildingID.push(buildingList[j].buildingID);
          }
      setMultiID(buildingID);
    }
    else {
      await setBuildings([]);
      setMultiID([]);
    }
  };
  const handleLoadFront = (event) => {
    if (event.target.files[0] !== undefined) {
      if (validFileType(event.target.files[0])) {
        if (event.target.files[0].size > 5 * 1048576) {
          ToastsStore.warning('Image size should be low than 5 MB.');
        }
        else {
          setAvatar(event.target.files[0]);
          setAvatarUrl(URL.createObjectURL(event.target.files[0]));
        }
      }
      else {
        ToastsStore.warning('Image format is not correct.');
      }
    }
  }
  const handleChangeBuildingsPermission = (val) => {
    setBuildingsPermission(val);
  }
  const handleChangeOwnersPermission = (val) => {
    setOwnersPermission(val);
  }
  const handleChangeChatPermission = (val) => {
    setChatPermission(val);
  }
  const handleChangeIncidentsPermission = (val) => {
    setIncidentsPermission(val);
  }
  const handleChangeAssembliesPermission = (val) => {
    setAssembliesPermission(val);
  }
  const handleChangeEventsPermission = (val) => {
    setEventsPermission(val);
  }
  const handleChangeTeamPermission = (val) => {
    setTeamPermission(val);
  }
  const handleChangeProvidersPermission = (val) => {
    setProvidersPermission(val);
  }
  const handleChangeAnnouncementsPermission = (val) => {
    setAnnouncementsPermission(val);
  }
  const handleChangeCompanyPermission = (val) => {
    setCompanyPermission(val);
  }
  const handleChangeAddonsPermission = (val) => {
    setAddonsPermission(val);
  }
  const handleChangeInvoicesPermission = (val) => {
    setInvoicesPermission(val);
  }
  const handleChangePaymentMethodsPermission = (val) => {
    setPaymentMethodsPermission(val);
  }
  const handleClickSetAsDefault = (val) => {
    setAddonsPermission(val);
    setAnnouncementsPermission(val);
    setAssembliesPermission(val);
    setBuildingsPermission(val);
    setChatPermission(val);
    setCompanyPermission(val);
    setEventsPermission(val);
    setIncidentsPermission(val);
    setInvoicesPermission(val);
    setOwnersPermission(val);
    setPaymentMethodsPermission(val);
    setProvidersPermission(val);
    setTeamPermission(val);
  }
  const handleClickSuspendRestore = () => {
    let data = {
      'status': suspendState === 'Restaurer le compte' ? 'active' : 'inactive'
    };
    setVisibleIndicator(true);
    AdminService.setSuspendManager(props.match.params.id, data)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              if (suspendState === 'Restaurer le compte')
                setSuspendState('Suspendre le compte');
              else if (suspendState === 'Suspendre le compte')
                setSuspendState('Restaurer le compte');
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
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleClickLoginAsManager = () => {
    var data = {
      'userID': props.match.params.id,
    };
    setVisibleIndicator(true);
    AdminService.loginAs(data)
      .then(
        response => {
          setVisibleIndicator(false);
          if (response.data.code !== 200) {
            ToastsStore.error(response.data.message);
          } else {
            let profile = response.data.data.profile;
            globalActions.setFirstName(profile.firstname);
            globalActions.setLastName(profile.lastname);
            globalActions.setAvatarUrl(profile.photo_url);
            localStorage.clear();
            localStorage.setItem("token", JSON.stringify(response.data.data.token));
            localStorage.setItem("firstlogin", JSON.stringify("false"));
            localStorage.setItem("usertype", JSON.stringify(profile.usertype));
            localStorage.setItem("role_addons", profile.role_addons === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_addons));
            localStorage.setItem("role_advertisement", profile.role_advertisement === undefined ? JSON.stringify('denied') : JSON.stringify('denied'));
            localStorage.setItem("role_assemblies", profile.role_assemblies === undefined ? JSON.stringify('denied') : JSON.stringify('see'));
            localStorage.setItem("role_buildings", profile.role_buildings === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_buildings));
            localStorage.setItem("role_chat", profile.role_chat === undefined ? JSON.stringify('denied') : JSON.stringify('denied'));
            localStorage.setItem("role_company", profile.role_company === undefined ? JSON.stringify('denied') : JSON.stringify('denied'));
            localStorage.setItem("role_events", profile.role_events === undefined ? JSON.stringify('denied') : JSON.stringify('denied'));
            localStorage.setItem("role_incidents", profile.role_incidents === undefined ? JSON.stringify('denied') : JSON.stringify('denied'));
            localStorage.setItem("role_invoices", profile.role_invoices === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_invoices));
            localStorage.setItem("role_owners", profile.role_owners === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_owners));
            localStorage.setItem("role_payments", profile.role_payments === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_payments));
            localStorage.setItem("role_providers", profile.role_providers === undefined ? JSON.stringify('denied') : JSON.stringify('denied'));
            localStorage.setItem("role_team", profile.role_team === undefined ? JSON.stringify('denied') : JSON.stringify(profile.role_team));
            localStorage.setItem("select", JSON.stringify(0));
            localStorage.setItem("login_as", JSON.stringify(profile.firstname + ' ' + profile.lastname));
            window.location.replace("/manager/dashboard");
          }
        },
        error => {
          setVisibleIndicator(false);
          ToastsStore.error("Can't connect to the Server!");
        }
      );
  }
  const handleClickResetPassword = () => {
    var data = {};
    data['email'] = email;
    setVisibleIndicator(true);
    AdminService.forgotPassword(data)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
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
          setVisibleIndicator(false);
          ToastsStore.error("Can't connect to the Server!");
        }
      );
  }
  const handleClickDeleteManager = () => {
    setOpenDelete(true);
    setDeleteId(props.match.params.id);
  }
  const handleDelete = () => {
    handleCloseDelete();
    setDeleteId(-1);
    setVisibleIndicator(true);
    let data = {
      'status': 'trash'
    }
    AdminService.deleteManager(deleteId, data)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              ToastsStore.success("Deleted successfully!");
              history.goBack();
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
  const updateManager = () => {
    let permissionInfos = [
      {
        'role_name': 'role_buildings',
        'permission': role_permission[buildingsPermission]
      },
      {
        'role_name': 'role_owners',
        'permission': role_permission[ownersPermission]
      },
      {
        'role_name': 'role_chat',
        'permission': role_permission[chatPermission]
      },
      {
        'role_name': 'role_incidents',
        'permission': role_permission[incidentsPermission]
      },
      {
        'role_name': 'role_assemblies',
        'permission': role_permission[assembliesPermission]
      },
      {
        'role_name': 'role_events',
        'permission': role_permission[eventsPermission]
      },
      {
        'role_name': 'role_team',
        'permission': role_permission[teamPermission]
      },
      {
        'role_name': 'role_providers',
        'permission': role_permission[providersPermission]
      },
      {
        'role_name': 'role_advertisement',
        'permission': role_permission[announcementsPermission]
      },
      {
        'role_name': 'role_company',
        'permission': role_permission[companyPermission]
      },
      {
        'role_name': 'role_addons',
        'permission': role_permission[addonsPermission]
      },
      {
        'role_name': 'role_invoices',
        'permission': role_permission[invoicesPermission]
      },
      {
        'role_name': 'role_payments',
        'permission': role_permission[paymentMethodsPermission]
      },
    ]
    let formdata = new FormData();
    formdata.set('companyID', companyID);
    formdata.set('buildingID', JSON.stringify(mulitID));
    formdata.set('firstname', firstname);
    formdata.set('lastname', lastname);
    formdata.set('email', email);
    formdata.set('phone', phonenumber);
    formdata.set('logo', avatar === null ? '' : avatar);
    formdata.set('permission_info', JSON.stringify(permissionInfos));
    setVisibleIndicator(true);
    AdminService.updateManager(props.match.params.id, formdata)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              ToastsStore.success('Updated manager successfully!');
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
                <b>{firstname + ' ' + lastname}</b>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} container justify="flex-end" >
          </Grid>
        </Grid>
      </div>
      <div className={classes.tool}>
        <p onClick={handleClick} className={classes.backTitle}>&lt; Retour à la liste des Gestionnaires</p>
      </div>
      <Grid container direction="column" >
        <div className={classes.body}>
          <Grid item container><p className={classes.headerTitle}><b>Informations</b></p></Grid>

          <Grid item container justify="space-between" direction="row-reverse" spacing={2}>

            <Grid xs item container direction="column" spacing={2}>
              <Grid item container direction="row-reverse">

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
                      <input className={classes.input} accept="image/*" type="file" id="img_front" onChange={handleLoadFront} disabled={(accessManagers === 'see' ? true : false)} />
                      <label htmlFor="img_front">
                        <EditOutlinedIcon className={classes.editAvatar} />
                      </label>
                    </div>
                  }
                >
                  <Avatar className={classes.size} alt={firstname + ' ' + lastname} src={avatarurl} />
                </Badge>
              </Grid>
              <Grid item container direction="row-reverse">
                <p className={classes.itemTitle}>Connexions/mois : {month_connection}</p>
              </Grid>
              <Grid item container direction="row-reverse">
                <p className={classes.itemTitle}>Temps connexion/jour : {daily_time}</p>
              </Grid>
              <Grid item container direction="row-reverse">
                <p className={classes.itemTitle}>Lots : {apartNumber}</p>
              </Grid>
              <Grid item container direction="row-reverse">
                <MyButton name={"Se connecter en tant que"} color={"1"} onClick={handleClickLoginAsManager} disabled={(accessManagers === 'see' ? true : false)} />
              </Grid>
              <Grid item container direction="row-reverse">
                <MyButton name={"Réinitialiser le mot de passe"} bgColor={"#00C9FF"} onClick={handleClickResetPassword} disabled={(accessManagers === 'see' ? true : false)} />
              </Grid>
              <Grid item container direction="row-reverse">
                <MyButton name={suspendState} bgColor={"#00C9FF"} onClick={handleClickSuspendRestore} disabled={(accessManagers === 'see' ? true : false)} />
              </Grid>
              <Grid item container direction="row-reverse">
                <MyButton name={"Supprimer le compte"} bgColor={"#00C9FF"} onClick={handleClickDeleteManager} disabled={(accessManagers === 'see' ? true : false)} />
              </Grid>
            </Grid>
            <Grid xs item container direction="column" spacing={5}>

              <Grid item></Grid>

              <Grid item container alignItems="center" spacing={1}>
                <Grid item><p className={classes.itemTitle}>Nom</p></Grid>
                <Grid xs item container alignItems="stretch" direction="column">
                  <Grid item>
                    <TextField
                      variant="outlined"
                      value={lastname}
                      onChange={handleChangeLastName}
                      disabled={(accessManagers === 'see' ? true : false)}
                      fullWidth
                    />
                  </Grid>
                  {errorsLastname.length > 0 &&
                    <span className={classes.error}>{errorsLastname}</span>}
                </Grid>
              </Grid>
              <Grid item container alignItems="center" spacing={1}>
                <Grid item><p className={classes.itemTitle}>Prénom</p></Grid>
                <Grid xs item container alignItems="stretch" direction="column">
                  <Grid item>
                    <TextField
                      className={classes.text}
                      variant="outlined"
                      value={firstname}
                      onChange={handleChangeFirstName}
                      disabled={(accessManagers === 'see' ? true : false)}
                      fullWidth
                    />
                  </Grid>
                  {errorsFirstname.length > 0 &&
                    <span className={classes.error}>{errorsFirstname}</span>}
                </Grid>
              </Grid>
              <Grid item container alignItems="center" spacing={1}>
                <Grid item><p className={classes.itemTitle}>Email</p></Grid>
                <Grid xs item container alignItems="stretch" direction="column">
                  <Grid item>
                    <TextField
                      className={classes.text}
                      variant="outlined"
                      value={email}
                      onChange={handleChangeEmail}
                      disabled={(accessManagers === 'see' ? true : false)}
                      fullWidth
                    />
                  </Grid>
                  {errorsEmail.length > 0 &&
                    <span className={classes.error}>{errorsEmail}</span>}
                </Grid>
              </Grid>
              <Grid item container alignItems="center" spacing={1}>
                <Grid item><p className={classes.itemTitle}>Téléphone</p></Grid>
                <Grid xs item container alignItems="stretch" direction="column">
                  <Grid item>
                    <MuiPhoneNumber
                      defaultCountry='fr'
                      className={classes.text}
                      variant="outlined"
                      value={phonenumber}
                      onChange={handleChangePhoneNumber}
                      disabled={(accessManagers === 'see' ? true : false)}
                      fullWidth
                    />
                  </Grid>
                  {errorsPhonenumber.length > 0 &&
                    <span className={classes.error}>{errorsPhonenumber}</span>}
                </Grid>
              </Grid>
              <Grid item container alignItems="center" spacing={2}>
                <Grid item><p className={classes.itemTitle}>Cabinet</p></Grid>
                <Grid xs item container alignItems="stretch">
                  <MySelect
                    color="gray"
                    data={company}
                    onChangeSelect={handleChangeCompanies}
                    value={companies}
                    width="100%"
                    disabled={(accessManagers === 'see' ? true : false)}
                  />
                  {errorsCompanies.length > 0 &&
                    <span className={classes.error}>{errorsCompanies}</span>}
                </Grid>
              </Grid>
              <Grid item container alignItems="center" spacing={2}>
                <Grid item><p className={classes.itemTitle}>Immeubles</p></Grid>
                <Grid xs item container alignItems="stretch">
                  <Multiselect
                    selected={buildings}
                    no={'No buildings found'}
                    all={suggestions}
                    onSelected={handleChangeBuildings}
                    disabled={(accessManagers === 'see' ? true : false)}
                    width="100%"
                  />
                  {errorsBuildings.length > 0 &&
                    <span className={classes.error}>{errorsBuildings}</span>}
                </Grid>
              </Grid>
              <Grid item></Grid>
            </Grid>
          </Grid>
          <Grid item ><p className={classes.itemTitle}><b>Permissions</b></p></Grid>
          <Grid item container spacing={2}>
            <Grid item container ></Grid>
            <Grid xs={9} sm={8} md={7} lg={6} xl={5} item container spacing={2}>
              <Grid xs={6} item container direction="column">
                <p className={classes.permissionItemTitle}>Immeubles</p>
                <MySelect
                  color="gray"
                  data={permissionList}
                  onChangeSelect={handleChangeBuildingsPermission}
                  value={buildingsPermission}
                  disabled={(accessManagers === 'see' ? true : false)}
                />
              </Grid>
              <Grid xs={6} item container direction="column">
                <p className={classes.permissionItemTitle}>Copropriétaires</p>
                <MySelect
                  color="gray"
                  data={permissionList}
                  onChangeSelect={handleChangeOwnersPermission}
                  value={ownersPermission}
                  disabled={(accessManagers === 'see' ? true : false)}
                />
              </Grid>
              <Grid xs={6} item container direction="column">
                <p className={classes.permissionItemTitle}>Messagerie</p>
                <MySelect
                  color="gray"
                  data={permissionList}
                  onChangeSelect={handleChangeChatPermission}
                  value={chatPermission}
                  disabled={(accessManagers === 'see' ? true : false)}
                />
              </Grid>
              <Grid xs={6} item container direction="column">
                <p className={classes.permissionItemTitle}>Incidents</p>
                <MySelect
                  color="gray"
                  data={permissionList}
                  onChangeSelect={handleChangeIncidentsPermission}
                  value={incidentsPermission}
                  disabled={(accessManagers === 'see' ? true : false)}
                />
              </Grid>
              <Grid xs={6} item container direction="column">
                <p className={classes.permissionItemTitle}>Assemblées</p>
                <MySelect
                  color="gray"
                  data={permissionList}
                  onChangeSelect={handleChangeAssembliesPermission}
                  value={assembliesPermission}
                  disabled={(accessManagers === 'see' ? true : false)}
                />
              </Grid>
              <Grid xs={6} item container direction="column">
                <p className={classes.permissionItemTitle}>Événements</p>
                <MySelect
                  color="gray"
                  data={permissionList}
                  onChangeSelect={handleChangeEventsPermission}
                  value={eventsPermission}
                  disabled={(accessManagers === 'see' ? true : false)}
                />
              </Grid>
              <Grid xs={6} item container direction="column">
                <p className={classes.permissionItemTitle}>Équipe</p>
                <MySelect
                  color="gray"
                  data={permissionList}
                  onChangeSelect={handleChangeTeamPermission}
                  value={teamPermission}
                  disabled={(accessManagers === 'see' ? true : false)}
                />
              </Grid>
              <Grid xs={6} item container direction="column">
                <p className={classes.permissionItemTitle}>Prestataires</p>
                <MySelect
                  color="gray"
                  data={permissionList}
                  onChangeSelect={handleChangeProvidersPermission}
                  value={providersPermission}
                  disabled={(accessManagers === 'see' ? true : false)}
                />
              </Grid>
              <Grid xs={6} item container direction="column">
                <p className={classes.permissionItemTitle}>Annonces</p>
                <MySelect
                  color="gray"
                  data={permissionList}
                  onChangeSelect={handleChangeAnnouncementsPermission}
                  value={announcementsPermission}
                  disabled={(accessManagers === 'see' ? true : false)}
                />
              </Grid>
              <Grid xs={6} item container direction="column">
                <p className={classes.permissionItemTitle}>Cabinet</p>
                <MySelect
                  color="gray"
                  data={permissionList}
                  onChangeSelect={handleChangeCompanyPermission}
                  value={companyPermission}
                  disabled={(accessManagers === 'see' ? true : false)}
                />
              </Grid>
              <Grid xs={6} item container direction="column">
                <p className={classes.permissionItemTitle}>Modules</p>
                <MySelect
                  color="gray"
                  data={permissionList}
                  onChangeSelect={handleChangeAddonsPermission}
                  value={addonsPermission}
                  disabled={(accessManagers === 'see' ? true : false)}
                />
              </Grid>
              <Grid xs={6} item container direction="column">
                <p className={classes.permissionItemTitle}>Factures</p>
                <MySelect
                  color="gray"
                  data={permissionList}
                  onChangeSelect={handleChangeInvoicesPermission}
                  value={invoicesPermission}
                  disabled={(accessManagers === 'see' ? true : false)}
                />
              </Grid>
              <Grid xs={6} item container direction="column">
                <p className={classes.permissionItemTitle}>Moyens de paiement</p>
                <MySelect
                  color="gray"
                  data={permissionList}
                  onChangeSelect={handleChangePaymentMethodsPermission}
                  value={paymentMethodsPermission}
                  disabled={(accessManagers === 'see' ? true : false)}
                />
              </Grid>
            </Grid>
            <Grid item container spacing={1}>
              <Grid item>
                <MyButton name={'Définir comme "Voir"'} bgColor={"#00C9FF"} onClick={() => handleClickSetAsDefault(0)} />
              </Grid>
              <Grid item>
                <MyButton name={'Définir comme "Editer"'} bgColor={"#00C9FF"} onClick={() => handleClickSetAsDefault(1)} />
              </Grid>
              <Grid item>
                <MyButton name={'Définir comme "Refusé"'} bgColor={"#00C9FF"} onClick={() => handleClickSetAsDefault(2)} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item container style={{ paddingTop: '50px', paddingBottom: '50px' }}>
            <MyButton name={"Sauvegarder"} color={"1"} onClick={onClickSave} disabled={(accessManagers === 'see' ? true : false)} />
          </Grid>
        </div>
      </Grid>
      <DeleteConfirmDialog
        openDelete={openDelete}
        handleCloseDelete={handleCloseDelete}
        handleDelete={handleDelete}
        account={'manager'}
      />
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(ManagerEdit);
