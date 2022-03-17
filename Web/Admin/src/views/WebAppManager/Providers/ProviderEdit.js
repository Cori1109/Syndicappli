import React, { useState,useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import { Avatar } from '@material-ui/core';
import MySelect from 'components/MySelect';
import MyButton from 'components/MyButton';
import Badge from '@material-ui/core/Badge';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import authService from 'services/authService.js';
import Multiselect from 'components/Multiselect.js';
import { EditProviderStyles as useStyles } from './useStyles';
import {ManagerService as Service} from 'services/api.js';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiPhoneNumber from 'material-ui-phone-number';
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
const ManagerService = new Service();
const ProviderEdit = (props) => {
  const { history } = props;

  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const accessProviders = authService.getAccess('role_providers');
  const [visibleIndicator, setVisibleIndicator] = useState(false);
  const classes = useStyles();
  const [avatarurl, setAvatarUrl] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [lastname, setLastName] = useState('');
  const [firstname, setFirstName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhoneNumber] = useState('');

  const [errorsCategorie, setErrorsCategorie] = useState('');
  const [errorsBuildings, setErrorsBuildings] = useState('');
  const [errorsLastname, setErrorsLastname] = useState('');
  const [errorsFirstname, setErrorsFirstname] = useState('');
  const [errorsCompanyName, setErrorsCompanyName] = useState('');
  const [errorsEmail, setErrorsEmail] = useState('');
  const [errorsPhonenumber, setErrorsPhonenumber] = useState('');
  let company = [''];
  const [companies, setCompanies] = useState(0);
  const [companyList, setCompanyList] = useState([]);
  const [companyID, setCompanyID] = useState(-1);
  const [categorie, setCategorie] = useState(0);
  const categories = [''];
  const [buildingList, setBuildingList] = useState([]);
  let buildingID = [];
  const [buildings, setBuildings] = useState([]);
  const [mulitID, setMultiID] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  useEffect(() => {
    getProvider();
    getCompanies();
  }, [accessProviders]);
  const getCompanies = () => {
    setVisibleIndicator(true);
    ManagerService.getCompanyListByUser()
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
              setCompanyList([ ...data.companylist]);
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
    ManagerService.getBuildingListByCompany(requestData)
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
  const getProvider = () => {
    setVisibleIndicator(true);

    ManagerService.getProvider(props.match.params.id)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              const profile = data.provider;
              setLastName(profile.lastname);
              setFirstName(profile.firstname);
              setEmail(profile.email);
              setPhoneNumber(profile.phone);
              setAvatarUrl(profile.photo_url);
              buildingID.splice(0,buildingID.length)
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
    ManagerService.getProvider(props.match.params.id)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              const profile = data.provider;
              setLastName(profile.lastname);
              setFirstName(profile.firstname);
              setEmail(profile.email);
              setPhoneNumber(profile.phone);
              setAvatarUrl(profile.photo_url);
              buildingID.splice(0,buildingID.length)
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
  useEffect(()=>{
    let buildings = [];
    for (let i = 0; i < mulitID.length; i++)
      for (let j = 0; j < buildingList.length; j++)
        if (mulitID[i] === buildingList[j].buildingID) {
          buildings[i] = { label: buildingList[j].name, value: buildingList[j].buildingID };
          break;
        }
    setBuildings(buildings);
  },[mulitID])
  const handleClick = () => {
    history.goBack();
  };
  const onClickSave = () => {
    let cnt = 0;
    if (lastname.length === 0) { setErrorsLastname('please enter provider last name'); cnt++; }
    else setErrorsLastname('');
    if (firstname.length === 0) { setErrorsFirstname('please enter provider first name'); cnt++; }
    else setErrorsFirstname('');
    if (companyName.length === 0) { setErrorsCompanyName('please enter provider company name'); cnt++; }
    else setErrorsCompanyName('');
    if (buildings.length === 0) { setErrorsBuildings('please select buildings'); cnt++; }
    else setErrorsBuildings('');
    if (email.length === 0) { setErrorsEmail('please enter provider email'); cnt++; }
    else setErrorsEmail('');
    if (phonenumber.length === 0) { setErrorsPhonenumber('please enter provider phone number'); cnt++; }
    else setErrorsPhonenumber('');
    if (cnt === 0) {
      updateProvider();
    }
  }
  const handleChangeLastName = (event) => {
    setLastName(event.target.value);
  }
  const handleChangeFirstName = (event) => {
    setFirstName(event.target.value);
  }
  const handleChangeCompanyName = (event) => {
    setCompanyName(event.target.value);
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
  const handleChangeCategorie = (val)=>{
    setCategorie(val);
  }
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

  const updateProvider = () => {
    let formdata = new FormData();
    formdata.set('companyID', companyID);
    formdata.set('buildingID', JSON.stringify(mulitID));
    formdata.set('firstname', firstname);
    formdata.set('lastname', lastname);
    formdata.set('email', email);
    formdata.set('phone', phonenumber);
    formdata.set('logo', avatar === null ? '' : avatar);
    setVisibleIndicator(true);
    ManagerService.updateProvider(props.match.params.id, formdata)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              ToastsStore.success('Updated provider successfully!');
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
        <p onClick={handleClick} className={classes.backTitle}>&lt; Retour à la liste des Prestataires</p>
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
                      <input className={classes.input} accept="image/*" type="file" id="img_front" onChange={accessProviders === 'see' ? null : handleLoadFront} />
                      <label htmlFor="img_front">
                        <EditOutlinedIcon className={classes.editAvatar} />
                      </label>
                    </div>
                  }
                >
                  <Avatar className={classes.size} alt={firstname + ' ' + lastname} src={avatarurl} />
                </Badge>
              </Grid>
            </Grid>
            <Grid xs item container direction="column" spacing={5}>
              <Grid item></Grid>
              <Grid item container alignItems="center" spacing={2}>
                <Grid item><p className={classes.itemTitle}>Immeubles</p></Grid>
                <Grid xs item container alignItems="stretch">
                  <Multiselect
                    selected={buildings}
                    no={'No buildings found'}
                    all={suggestions}
                    onSelected={handleChangeBuildings}
                    disabled={(accessProviders === 'see' ? true : false)}
                    width="100%"
                  />
                  {errorsBuildings.length > 0 &&
                    <span className={classes.error}>{errorsBuildings}</span>}
                </Grid>
              </Grid>
              <Grid item container alignItems="center" spacing={1}>
                <Grid item><p className={classes.itemTitle}>Nom</p></Grid>
                <Grid xs item container alignItems="stretch" direction="column">
                  <Grid item>
                    <TextField
                      variant="outlined"
                      value={lastname}
                      onChange={handleChangeLastName}
                      disabled={(accessProviders === 'see' ? true : false)}
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
                      disabled={(accessProviders === 'see' ? true : false)}
                      fullWidth
                    />
                  </Grid>
                  {errorsFirstname.length > 0 &&
                    <span className={classes.error}>{errorsFirstname}</span>}
                </Grid>
              </Grid>
              <Grid item container alignItems="center" spacing={1}>
                <Grid item><p className={classes.itemTitle}>Société</p></Grid>
                <Grid xs item container alignItems="stretch" direction="column">
                  <Grid item>
                    <TextField
                      className={classes.text}
                      variant="outlined"
                      value={companyName}
                      onChange={handleChangeCompanyName}
                      disabled={(accessProviders === 'see' ? true : false)}
                      fullWidth
                    />
                  </Grid>
                  {errorsCompanyName.length > 0 &&
                    <span className={classes.error}>{errorsCompanyName}</span>}
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
                      disabled={(accessProviders === 'see' ? true : false)}
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
                      disabled={(accessProviders === 'see' ? true : false)}
                      fullWidth
                    />
                  </Grid>
                  {errorsPhonenumber.length > 0 &&
                    <span className={classes.error}>{errorsPhonenumber}</span>}
                </Grid>
              </Grid>
              <Grid item container alignItems="center" spacing={2}>
                <Grid item><p className={classes.itemTitle}>Catégories</p></Grid>
                <Grid xs item container alignItems="stretch">
                  <MySelect
                    color="gray"
                    data={categories}
                    onChangeSelect={handleChangeCategorie}
                    value={categorie}
                    width="100%"
                    disabled={(accessProviders === 'see' ? true : false)}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          
          <Grid item container style={{ paddingTop: '50px', paddingBottom: '50px' }}>
            <MyButton name={"Sauvegarder"} color={"1"} onClick={onClickSave} disabled={(accessProviders === 'see' ? true : false)} />
          </Grid>
        </div>
      </Grid>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(ProviderEdit);
