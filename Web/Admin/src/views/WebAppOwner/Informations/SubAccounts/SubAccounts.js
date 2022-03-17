import React, { useState, useEffect } from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MyButton from '../../../../components/MyButton';
import { withRouter } from 'react-router-dom';
import { OwnerService as Service } from '../../../../services/api.js';
import authService from '../../../../services/authService.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import SubAccountsTable from './components/SubAccountsTable';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import MySelect from 'components/MySelect';

const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('xl')]: {
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(4),
    },
    [theme.breakpoints.down('lg')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(2),
    },
    '& .MuiOutlinedInput-multiline':{
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
  tool: {
    [theme.breakpoints.up('xl')]: {
      minHeight: 67
    },
    [theme.breakpoints.down('lg')]: {
      minHeight: 47
    },
    [theme.breakpoints.down('md')]: {
      minHeight: 33
    },
  },
  title: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  body: {
    [theme.breakpoints.up('xl')]: {
      borderRadius: 30,
    },
    [theme.breakpoints.down('lg')]: {
      borderRadius: 21,
    },
    [theme.breakpoints.down('md')]: {
      borderRadius: 15,
    },
    marginBottom: 40
  },
  item: {
    marginTop: theme.spacing(5),
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  input: {
    display: 'none',
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
  backTitle: {
    cursor: 'pointer',
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
  headerTitle: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 35
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 25
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 18
    },
  },
}));
const OwnerService = new Service();
const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const SubAccounts = (props) => {
  const { history } = props;

  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const classes = useStyles();
  const [building, setBuilding] = useState(0);
  const [buildings, setBuildings] = useState(['']);
  const [buildingList, setBuildingList] = useState([]);
  const [buildingID, setBuildingID] = useState(-1);
  const [lastname, setLastName] = React.useState('');
  const [firstname, setFirstName] = React.useState('');
  const [lastname1, setLastName1] = React.useState('');
  const [firstname1, setFirstName1] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [mobile, setMobile] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [city, setCity] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');

  const [errorsLastName, setErrorsLastName] = React.useState('');
  const [errorsFirstName, setErrorsFirstName] = React.useState('');
  const [errorsLastName1, setErrorsLastName1] = React.useState('');
  const [errorsFirstName1, setErrorsFirstName1] = React.useState('');
  const [errorsEmail, setErrorsEmail] = React.useState('');
  const [errorsMobile, setErrorsMobile] = React.useState('');
  const [errorsAddress, setErrorsAddress] = React.useState('');
  const [errorsCity, setErrorsCity] = React.useState('');
  const [errorsPostalCode, setErrorsPostalCode] = React.useState('');
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);

  const [dataList, setDataList] = useState([]);
  const [openDelete, setOpenDelete] = React.useState(false);

  const [deleteId, setDeleteId] = useState(-1);

  useEffect(() => {
    getBuildigs();
    getOwners();
  }, [])
  const handleChangeLastName = (event) => {
    setLastName(event.target.value);
  }
  const handleChangeFirstName = (event) => {
    setFirstName(event.target.value);
  }
  const handleChangeLastName1 = (event) => {
    setLastName1(event.target.value);
  }
  const handleChangeFirstName1 = (event) => {
    setFirstName1(event.target.value);
  }
  const handleChangeAddress = (event) => {
    setAddress(event.target.value);
  }
  const handleChangeCity = (event) => {
    setCity(event.target.value);
  }
  const handleChangePostalCode = (event) => {
    if (event.target.value[event.target.value.length - 1] === '.')
        return;
    if (Number.isInteger(Number(event.target.value))) {
        if (event.target.value.length < 6)
            setPostalCode(event.target.value);
    }
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
  const handleChangeMobile = (event) => {
    setMobile(event.target.value);
  }
  const handleChangeBuilding = (val) => {
    setBuilding(val);
    setBuildingID(buildingList[val].buildingID);
  };
  const getBuildigs = () => {
    setVisibleIndicator(true);
    OwnerService.getBuildingListByOwner()
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              buildings.splice(0, buildings.length)
              data.buildinglist.map((item) => (
                buildings.push(item.name)
              )
              );
              setBuildingList(data.buildinglist);
              if (data.buildinglist.length !== 0) {
                setBuildings(buildings)
                setBuildingID(data.buildinglist[0].buildingID);
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
  useEffect(()=>{
    for (let i = 0; i < buildingList.length; i++)
    if (buildingList[i].buildingID === buildingID){
      setBuilding(i);
      console.log('client:',i);
    }
  },[buildingID]);
  const handleClickViewDetails = (id) => {
    setVisibleIndicator(true);
    OwnerService.getOwner(id, {})
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              if (data.owner.lastname)
                setLastName(data.owner.lastname);
              else
                setLastName('');
              if (data.owner.firstname)
                setFirstName(data.owner.firstname);
              else
                setFirstName('');
              if (data.owner.lastname_1)
                setLastName1(data.owner.lastname_1);
              else
                setLastName1('');
              if (data.owner.firstname_1)
                setFirstName1(data.owner.firstname_1);
              else
                setFirstName1('');
              if (data.owner.address)
                setAddress(data.owner.address);
              else
                setAddress('');
              setCity(data.owner.city ? data.owner.city : '');
              if (data.owner.code_postal)
                setPostalCode(data.owner.code_postal);
              else
                setPostalCode('');
              if (data.owner.email)
                setEmail(data.owner.email);
              else
                setEmail('');
              if (data.owner.phone)
                setMobile(data.owner.phone);
              else
                setMobile('');
              if(data.owner.buildingID)
                setBuildingID(data.owner.buildingID);
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
  const handleClickResend = (id) => {
    let requestdata = {};
    OwnerService.getOwner(id, {})
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              if (data.owner.lastname)
                requestdata['lastname'] = data.owner.lastname;
              else
                requestdata['lastname'] = '';
              if (data.owner.firstname)
                requestdata['firstname'] = data.owner.firstname;
              else
                requestdata['firstname'] = '';
              if (data.owner.lastname_1)
                requestdata['lastname_1'] = data.owner.lastname_1;
              else
                requestdata['lastname_1'] = '';
              if (data.owner.firstname_1)
                requestdata['firstname_1'] = data.owner.firstname_1;
              else
                requestdata['firstname_1'] = '';
              if (data.owner.buildingID)
                requestdata['buildingID'] = data.owner.buildingID;
              else
                requestdata['buildingID'] = -1;
              if (data.owner.address)
                requestdata['address'] = data.owner.address;
              else
                requestdata['address'] = '';
              requestdata['city'] = data.owner.city ? data.owner.city : '';
              if (data.owner.code_postal)
                requestdata['code_postal'] = data.owner.code_postal;
              else
                requestdata['code_postal'] = '';
              if (data.owner.email)
                requestdata['email'] = data.owner.email;
              else
                requestdata['email'] = '';
              if (data.owner.phone)
                requestdata['phone'] = data.owner.phone;
              else
                requestdata['phone'] = '';
              resendInvite(id, requestdata);
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
  const resendInvite = (id, requestdata) => {
    setVisibleIndicator(true);
    OwnerService.reinviteOwner(id, requestdata)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              ToastsStore.success("Invited New Owner successfully!");
              getOwners();
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
  const handleClickDelete = (id) => {
    setOpenDelete(true);
    setDeleteId(id);
  };
  const handleDelete = () => {
    handleCloseDelete();
    setDeleteId(-1);
    setVisibleIndicator(true);
    OwnerService.deleteOwner(deleteId)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              ToastsStore.success("Deleted successfully!");
              getOwners();
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
  const onClickInvite = () => {
    let cnt = 0;
    if (lastname.length === 0) { setErrorsLastName('please enter owner last name'); cnt++; }
    else setErrorsLastName('');
    if (firstname.length === 0) { setErrorsFirstName('please enter owner first name'); cnt++; }
    else setErrorsFirstName('');
    if (lastname1.length === 0) { setErrorsLastName1('please enter owner last name'); cnt++; }
    else setErrorsLastName1('');
    if (firstname1.length === 0) { setErrorsFirstName1('please enter owner first name'); cnt++; }
    else setErrorsFirstName1('');
    if (address.length === 0) { setErrorsAddress('please enter owner address'); cnt++; }
    else setErrorsAddress('');
    if (city.length === 0) { setErrorsCity('please enter owner city'); cnt++; }
    else setErrorsCity('');
    if (postalCode.length !== 5) { setErrorsPostalCode('please check postal code'); cnt++; }
    else setErrorsPostalCode('');
    if (email.length === 0) { setErrorsEmail('please enter owner email'); cnt++; }
    else setErrorsEmail('');
    if (mobile.length === 0) { setErrorsMobile('please enter owner mobile number'); cnt++; }
    else setErrorsMobile('');
    if (cnt === 0) createOwner();
  }
  const createOwner = () => {
    let data = {
      'firstname': firstname,
      'lastname': lastname,
      'firstname_1': firstname1,
      'lastname_1': lastname1,
      'address': address,
      'city': city, 
      'email': email,
      'phone': mobile,
      'buildingID': buildingID
    }
    setVisibleIndicator(true);
    OwnerService.createOwner(data)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              ToastsStore.success("Sent Invite successfully!");
              getOwners();
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
  const getOwners = () => {
    const requestData = {
      // 'search_key': '',
      // 'page_num': page_num - 1,
      // 'row_count': row_count,
      // 'sort_column': sort_column,
      // 'sort_method': sort_method,
      // 'role': owner_role[role],
      // 'buildingID': buildingID,
      // 'companyID' : companyID,
      // 'status': 'active'
    }
    setVisibleIndicator(true);
    OwnerService.getOwnerList(requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              // if (!data.totalpage)
              //   setTotalPage(1);
              // else
              //   setTotalPage(data.totalpage);
              setDataList(data.ownerlist);
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
    <div>
      {
        visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
      }
      <div className={classes.root}>
        <div className={classes.title}>
          <Typography variant="h2" className={classes.headerTitle}>
            <b>Sous comptes</b>
          </Typography>
        </div>
        <div className={classes.tool}>
          <Grid xs={12} sm={8} md={8} lg={8} xl={6} item container>
            <p className={classes.backTitle}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce accumsan mauris risus, ut
            tincidunt augue dictum eu. Donec molestie nibh purus, non sollicitudin nisl condimentum
          vitae. Suspendisse vehicula laoreet ullamcorper. </p>
          </Grid>
        </div>
        <div className={classes.body}>
          <Grid item container xs={12} sm={6} md={6} lg={5} xl={4} justify="flex-start" direction="column" spacing={4}>
            <Grid item></Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid xs={2} item ><p className={classes.backTitle}>Immeuble</p></Grid>
              <Grid xs={10} item container direction="column" alignItems="stretch">
                <MySelect
                  color="gray"
                  data={buildings}
                  onChangeSelect={handleChangeBuilding}
                  value={building}
                />
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid xs={2} item><p className={classes.backTitle}>Nom</p></Grid>
              <Grid xs={10} item container alignItems="stretch" direction="column">
                <TextField
                  variant="outlined"
                  value={lastname}
                  onChange={handleChangeLastName}
                  fullWidth
                />
                {errorsLastName.length > 0 &&
                  <span className={classes.error}>{errorsLastName}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid xs={2} item><p className={classes.backTitle}>Prénom</p></Grid>
              <Grid xs={10} item container alignItems="stretch" direction="column">
                <TextField
                  variant="outlined"
                  value={firstname}
                  onChange={handleChangeFirstName}
                  fullWidth
                />
                {errorsFirstName.length > 0 &&
                  <span className={classes.error}>{errorsFirstName}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid xs={2} item><p className={classes.backTitle}>Nom 1</p></Grid>
              <Grid xs={10} item container alignItems="stretch" direction="column">
                <TextField
                  variant="outlined"
                  value={lastname1}
                  onChange={handleChangeLastName1}
                  fullWidth
                />
                {errorsLastName1.length > 0 &&
                  <span className={classes.error}>{errorsLastName1}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid xs={2} item><p className={classes.backTitle}>Prénom 1</p></Grid>
              <Grid xs={10} item container alignItems="stretch" direction="column">
                <TextField
                  variant="outlined"
                  value={firstname1}
                  onChange={handleChangeFirstName1}
                  fullWidth
                />
                {errorsFirstName1.length > 0 &&
                  <span className={classes.error}>{errorsFirstName1}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid xs={2} item><p className={classes.backTitle}>Adresse</p></Grid>
              <Grid xs={10} item container alignItems="stretch" direction="column">
                <TextField
                  variant="outlined"
                  value={address}
                  onChange={handleChangeAddress}
                  fullWidth
                />
                {errorsAddress.length > 0 &&
                  <span className={classes.error}>{errorsAddress}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid xs={2} item><p className={classes.backTitle}>Code postal</p></Grid>
              <Grid xs={10} item container alignItems="stretch" direction="column">
                <TextField
                  variant="outlined"
                  value={postalCode}
                  onChange={handleChangePostalCode}
                  fullWidth
                />
                {errorsPostalCode.length > 0 &&
                  <span className={classes.error}>{errorsPostalCode}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid xs={2} item><p className={classes.backTitle}>Ville</p></Grid>
              <Grid xs={10} item container alignItems="stretch" direction="column">
                <TextField
                  variant="outlined"
                  value={city}
                  onChange={handleChangeCity}
                  fullWidth
                />
                {errorsCity.length > 0 &&
                  <span className={classes.error}>{errorsCity}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid xs={2} item><p className={classes.backTitle}>Email</p></Grid>
              <Grid xs={10} item container alignItems="stretch" direction="column">
                <TextField
                  variant="outlined"
                  value={email}
                  onChange={handleChangeEmail}
                />
                {errorsEmail.length > 0 &&
                  <span className={classes.error}>{errorsEmail}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid xs={2} item><p className={classes.backTitle}>Mobile</p></Grid>
              <Grid xs={10} item container alignItems="stretch" direction="column">
                <TextField
                  variant="outlined"
                  value={mobile}
                  onChange={handleChangeMobile}
                />
                {errorsMobile.length > 0 &&
                  <span className={classes.error}>{errorsMobile}</span>}
              </Grid>
            </Grid>
          </Grid>
          <Grid item container style={{ paddingTop: '50px', paddingBottom: '50px' }}>
            <MyButton name={"Inviter"} color={"1"} onClick={onClickInvite} />
          </Grid>
          <SubAccountsTable
            items={dataList}
            onClickDelete={handleClickDelete}
            onClickViewDetails={handleClickViewDetails}
            onClickResend={handleClickResend}
          />
        </div>
      </div>
      <DeleteConfirmDialog
        openDelete={openDelete}
        handleCloseDelete={handleCloseDelete}
        handleDelete={handleDelete}
        account={'owner'}
      />
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(SubAccounts);
