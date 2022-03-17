import React, { useEffect } from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Badge from '@material-ui/core/Badge';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MyButton from '../../../../components/MyButton';
import { withRouter } from 'react-router-dom';
import { ManagerService as Service } from '../../../../services/api.js';
import authService from '../../../../services/authService.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import MuiPhoneNumber from 'material-ui-phone-number';
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
      marginTop: 64,
      marginBottom: 64,
      padding: 40,
      borderRadius: 30,
    },
    [theme.breakpoints.down('lg')]: {
      marginTop: 45,
      marginBottom: 45,
      padding: 28,
      borderRadius: 21,
    },
    [theme.breakpoints.down('md')]: {
      marginTop: 32,
      marginBottom: 32,
      padding: 20,
      borderRadius: 15,
    },
    boxShadow: '0 3px 5px 2px rgba(128, 128, 128, .3)',
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
  size: {
    cursor: 'pointer',
    [theme.breakpoints.up('xl')]: {
      width: 214,
      height: 214,
    },
    [theme.breakpoints.down('lg')]: {
      width: 150,
      height: 150,
    },
    [theme.breakpoints.down('md')]: {
      width: 105,
      height: 105,
    },
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
  itemTitle: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 25,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 18,
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 13,
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
  editAvatar: {
    [theme.breakpoints.up('xl')]: {
      width: 54,
      height: 54,
    },
    [theme.breakpoints.down('lg')]: {
      width: 38,
      height: 38,
    },
    [theme.breakpoints.down('md')]: {
      width: 27,
      height: 27,
    },
    backgroundColor: 'white',
    borderRadius: '50%',
    color: 'gray'
  },
  img: {
    objectFit:'cover',
    cursor: 'pointer',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    border: '1px dashed rgba(112,112,112,0.43)',
    borderRadius: 8,
    [theme.breakpoints.up('xl')]: {
      width: 222,
      height: 176,
    },
    [theme.breakpoints.down('lg')]: {
      width: 155,
      height: 123,
    },
    [theme.breakpoints.down('md')]: {
      width: 109,
      height: 86,
    },
  },
  plus: {
    color: '#707070',
    [theme.breakpoints.up('xl')]: {
      width: 60,
      height: 60,
    },
    [theme.breakpoints.down('lg')]: {
      width: 42,
      height: 42,
    },
    [theme.breakpoints.down('md')]: {
      width: 29,
      height: 29,
    },
  },
}));
const ManagerService = new Service();
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
const MyCompany = (props) => {
  const { history } = props;

  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const classes = useStyles();
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [companyID, setCompanyID] = React.useState(-1);
  const [errorsName, setErrorsName] = React.useState('');
  const [errorsAddress, setErrorsAddress] = React.useState('');
  const [errorsEmail, setErrorsEmail] = React.useState('');
  const [errorsPhone, setErrorsPhone] = React.useState('');

  const [avatarurl, setAvatarUrl] = React.useState('');
  const [avatar, setAvatar] = React.useState(null);
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const [stripeCustomerID, setStripeCustomerID] = React.useState('');
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
  useEffect(() => {

    setVisibleIndicator(true);
    ManagerService.getMyCompany()
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              localStorage.setItem("token", JSON.stringify(response.data.data.token));
              const mycompany = response.data.data.profile;
              setName(mycompany.name);
              setAddress(mycompany.address);
              setEmail(mycompany.email);
              setPhone(mycompany.phone);
              setAvatarUrl(mycompany.logo_url);
              setCompanyID(mycompany.companyID);
              setStripeCustomerID(mycompany.stripe_customerID ? mycompany.stripe_customerID : '');
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
  }, []);

  const onClickSave = (event) => {
    let cnt = 0;
    if (name.length === 0) { setErrorsName('please enter your last name'); cnt++; }
    else setErrorsName('');
    if (address.length === 0) { setErrorsAddress('please enter your address'); cnt++; }
    else setErrorsAddress('');
    if (email.length === 0) { setErrorsEmail('please enter your email'); cnt++; }
    else setErrorsEmail('');
    if (phone.length === 0) { setErrorsPhone('please enter your phone number'); cnt++; }
    else setErrorsPhone('');
    if (cnt === 0) setData();
  }
  const setData = () => {
    let formdata = new FormData();
    formdata.set('companyID', companyID);
    formdata.set('name', name);
    formdata.set('address', address);
    formdata.set('email', email);
    formdata.set('phone', phone);
    formdata.set('logo', avatar === null ? '' : avatar);
    formdata.set('stripe_customerID', stripeCustomerID);
    setVisibleIndicator(true);
    ManagerService.updateMyCompany(formdata)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              ToastsStore.success("Updated successfully!");
              localStorage.setItem("token", JSON.stringify(response.data.data.token));
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
          ToastsStore.error(error);
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
          <Grid item container justify="space-around">
            <Grid item xs={6} container justify="flex-start" >
              <Grid item>
                <Typography variant="h2" className={classes.headerTitle}>
                  <b>Mon Cabinet</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={6} container justify="flex-end" >
            </Grid>
          </Grid>
        </div>
        <div className={classes.body}>
          <Grid container direction="row-reverse" spacing={5}>
            <Grid item container xs={12} sm={5} md={4} lg={4} xl={3} justify="flex-end">
              <input className={classes.input} accept="image/*" type="file" id="img_front" onChange={handleLoadFront} />
              <label htmlFor="img_front">
                {
                  <Badge
                    overlap="circle"
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                      right: -20,
                      top: 13,
                      border: '2px solid gray',
                      padding: '0 4px',
                    }}
                    badgeContent={
                      <EditOutlinedIcon className={classes.editAvatar} />
                    }
                  >
                    <Avatar className={classes.size} alt={name} src={avatarurl} />
                  </Badge>
                }
              </label>
            </Grid>
            <Grid item container xs={12} sm={7} md={8} lg={8} xl={9} justify="flex-start" direction="column" spacing={4}>
              <Grid item></Grid>
              <Grid item container alignItems="center" spacing={1}>
                <Grid item><p className={classes.itemTitle}>Nom</p></Grid>
                <Grid xs item container alignItems="stretch" direction="column">
                  <Grid item>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      value={name}
                      onChange={handleChangeName}
                      fullWidth
                    />
                  </Grid>
                  {errorsName.length > 0 &&
                    <span className={classes.error}>{errorsName}</span>}
                </Grid>
              </Grid>
              <Grid item container alignItems="center" spacing={1}>
                <Grid item><p className={classes.itemTitle}>Adresse</p></Grid>
                <Grid xs item container alignItems="stretch" direction="column">
                  <Grid item>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      value={address}
                      onChange={handleChangeAddress}
                      multiline
                      fullWidth
                    />
                  </Grid>
                  {errorsAddress.length > 0 &&
                    <span className={classes.error}>{errorsAddress}</span>}
                </Grid>
              </Grid>
              <Grid item container alignItems="center" spacing={1}>
                <Grid item><p className={classes.itemTitle}>Email</p></Grid>
                <Grid xs item container alignItems="stretch" direction="column">
                  <Grid item>
                    <TextField
                      id="outlined-basic"
                      variant="outlined"
                      value={email}
                      onChange={handleChangeEmail}
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
                      id="outlined-basic"
                      variant="outlined"
                      value={phone}
                      onChange={handleChangePhone}
                    />
                  </Grid>
                  {errorsPhone.length > 0 &&
                    <span className={classes.error}>{errorsPhone}</span>}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item container style={{ paddingTop: '50px', paddingBottom: '50px' }}>
            <MyButton name={"Sauvegarder"} color={"1"} onClick={onClickSave} />
          </Grid>
        </div>
      </div>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(MyCompany);
