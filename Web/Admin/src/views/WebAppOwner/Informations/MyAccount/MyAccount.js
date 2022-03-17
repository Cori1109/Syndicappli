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
import { OwnerService as Service } from '../../../../services/api.js';
import authService from '../../../../services/authService.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import IdCard from 'components/IdCard';
import useGlobal from 'Global/global';
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
    '& .MuiTextField-root': {
      // width: '100%'
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
      width: 362,
      height: 278,
      marginTop: 30,
      marginRight: 30
    },
    [theme.breakpoints.down('lg')]: {
      width: 253,
      height: 177,
      marginTop: 21,
      marginRight: 21
    },
    [theme.breakpoints.down('md')]: {
      width: 177,
      height: 124,
      marginTop: 15,
      marginRight: 15
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
const OwnerService = new Service();
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
const MyAccount = (props) => {
  const { history } = props;

  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const classes = useStyles();
  const [globalState, globalActions] = useGlobal();
  const [lastname, setLastName] = React.useState('');
  const [firstname, setFirstName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [city, setCity] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [old_password, setOldPassword] = React.useState('');
  const [new_password, setNewPassword] = React.useState('');
  const [confirm_password, setConfirmPassword] = React.useState('');
  const [postalCode, setPostalCode] = React.useState('');

  const [errorsLastname, setErrorsLastName] = React.useState('');
  const [errorsFirstname, setErrorsFirstName] = React.useState('');
  const [errorsAddress, setErrorsAddress] = React.useState('');
  const [errorsCity, setErrorsCity] = React.useState('');
  const [errorsEmail, setErrorsEmail] = React.useState('');
  const [errorsPhone, setErrorsPhone] = React.useState('');
  const [errorsOldPassword, setErrorsOldPassword] = React.useState('');
  const [errorsNewPassword, setErrorsNewPassword] = React.useState('');
  const [errorsConfirmPassword, setErrorsConfirmPassword] = React.useState('');
  const [errorsPostalCode, setErrorsPostalCode] = React.useState('');

  const [avatarurl, setAvatarUrl] = React.useState('');
  const [avatar, setAvatar] = React.useState(null);
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const [idcardurls, setIdcardUrls] = React.useState([]);
  const [idcards, setIdcards] = React.useState([]);
  const [state, setState] = React.useState(false);
  const [stripeCustomerID, setStripeCustomerID] = React.useState('');
  const handleChangeLastName = (event) => {
    setLastName(event.target.value);
  }
  const handleChangeFirstName = (event) => {
    setFirstName(event.target.value);
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
  const handleChangePhone = (val) => {
    setPhone(val);
  }
  const handleChangeOldPassword = (event) => {
    setOldPassword(event.target.value);
  }
  const handleChangeNewPassword = (event) => {
    setNewPassword(event.target.value);
  }
  const handleChangeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
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
    OwnerService.getProfile()
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              localStorage.setItem("token", JSON.stringify(response.data.data.token));
              const profile = response.data.data.profile;
              setLastName(profile.lastname ? profile.lastname : '');
              setFirstName(profile.firstname ? profile.firstname : '');
              setEmail(profile.email ? profile.email : '');
              setPhone(profile.phone ? profile.phone : '');
              setAvatarUrl(profile.photo_url ? profile.photo_url : '');
              setAddress(profile.address ? profile.address : '');
              setCity(profile.city ? profile.city : '');
              setPostalCode(profile.code_postal ? profile.code_postal : '');
              let urls = [];
              if (!(profile.identity_card_front === null || profile.identity_card_front === '' || profile.identity_card_front === undefined))
                urls.push(profile.identity_card_front);
              if (!(profile.identity_card_back === null || profile.identity_card_back === '' || profile.identity_card_back === undefined))
                urls.push(profile.identity_card_back);
              setIdcardUrls(urls);
              setStripeCustomerID(profile.stripe_customerID ? profile.stripe_customerID : '');
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
    if (lastname.length === 0) { setErrorsLastName('please enter your last name'); cnt++; }
    else setErrorsLastName('');
    if (firstname.length === 0) { setErrorsFirstName('please enter your first name'); cnt++; }
    else setErrorsFirstName('');
    if (address.length === 0) { setErrorsAddress('please enter your address'); cnt++; }
    else setErrorsAddress('');
    if (city.length === 0) { setErrorsCity('please enter your city'); cnt++; }
    else setErrorsCity('');
    if (postalCode.length !== 5) { setErrorsPostalCode('please check postal code'); cnt++; }
    else setErrorsPostalCode('');
    if (email.length === 0) { setErrorsEmail('please enter your email'); cnt++; }
    else setErrorsEmail('');
    if (phone.length === 0) { setErrorsPhone('please enter your phone number'); cnt++; }
    else setErrorsPhone('');
    if (old_password.length !== 0) {
      if (new_password.length === 0) { setErrorsNewPassword('please enter your new password'); cnt++; }
      // else setErrorsNewPassword('');
      else if (new_password.length !== 0 && new_password.length < 4) { setErrorsNewPassword('Password must be 4 characters long!'); }
      else setErrorsNewPassword('');
    }
    else {
      if (new_password.length !== 0) { setErrorsOldPassword('please enter your current password'); cnt++; }
      else setErrorsOldPassword('');
    }
    if (new_password !== confirm_password) { setErrorsConfirmPassword('mismatch your new password'); cnt++ }
    else setErrorsConfirmPassword('');
    if (cnt === 0) setData();
  }
  const setData = () => {
    let formdata = new FormData();

    formdata.set('lastname', lastname);
    formdata.set('firstname', firstname);
    formdata.set('email', email);
    formdata.set('phone', phone);
    formdata.set('address', address);
    formdata.set('city', city);
    formdata.set('code_postal', postalCode);
    formdata.set('old_password', old_password);
    formdata.set('new_password', new_password);
    formdata.set('avatar', avatar === null ? '' : avatar);
    formdata.set('id_card_front', idcards[0] === null ? '' : idcards[0]);
    formdata.set('id_card_back', idcards[1] === null ? '' : idcards[1]);
    formdata.set('stripe_customerID', stripeCustomerID);
    setVisibleIndicator(true);
    OwnerService.updateProfile(formdata)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              ToastsStore.success("Updated successfully!");
              setErrorsOldPassword('');
              localStorage.setItem("token", JSON.stringify(response.data.data.token));
              globalActions.setFirstName(firstname);
              globalActions.setLastName(lastname);
              globalActions.setAvatarUrl(avatarurl);
              break;
            case 401:
              authService.logout();
              history.push('/login');
              window.location.reload();
              break;
            default:
              ToastsStore.error(response.data.message);
              setErrorsOldPassword('The current password is not correct');
          }
        },
        error => {
          ToastsStore.error("Can't connect to the server!");
          setVisibleIndicator(false);
        }
      );
  }
  const handleLoadIdcard = (event) => {
    if (event.target.files[0] !== undefined) {
      if (validFileType(event.target.files[0])) {
        if (event.target.files[0].size > 5 * 1048576) {
          ToastsStore.warning('Image size should be low than 5 MB.');
        } else {
          idcardurls.push(URL.createObjectURL(event.target.files[0]));
          idcards.push(event.target.files[0])
          setIdcards(idcards);
          setIdcardUrls(idcardurls);
          setState(!state);
        }
      }
      else {
        ToastsStore.warning('Image format is not correct.');
      }
    }
  }
  const handleClickCloseIdcard = (num) => {
    delete idcardurls[num];
    delete idcards[num];
    // idcardurls.splice(num, 1);
    // idcards.splice(num, 1);
    setIdcards(idcards);
    setIdcardUrls(idcardurls);
    setState(!state);
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
                  <b>Mon Compte</b>
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={6} container justify="flex-end" >
            </Grid>
          </Grid>
        </div>
        <div className={classes.body}>
          <Grid container direction="column" spacing={5}>
            <Grid item container spacing={2} direction="row" justify="space-between">
              <Grid item container direction="column" justify="space-between" xs={5}>
                <Grid item container><p className={classes.headerTitle}>{firstname} {lastname}</p></Grid>
                <Grid item container alignItems="center" spacing={2}>
                  <Grid item><p className={classes.itemTitle}>Nom</p></Grid>
                  <Grid xs item container alignItems="stretch" direction="column">
                    <Grid item>
                      <TextField
                        variant="outlined"
                        value={lastname}
                        onChange={handleChangeLastName}
                      />
                    </Grid>
                    {errorsLastname.length > 0 &&
                      <span className={classes.error}>{errorsLastname}</span>}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item container xs={5} direction="row-reverse">
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
                      <Avatar className={classes.size} alt={firstname + ' ' + lastname} src={avatarurl} />
                    </Badge>
                  }
                </label>
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.itemTitle}>Prénom</p></Grid>
              <Grid xs item container alignItems="stretch" direction="column">
                <Grid item>
                  <TextField
                    variant="outlined"
                    value={firstname}
                    onChange={handleChangeFirstName}
                  />
                </Grid>
                {errorsFirstname.length > 0 &&
                  <span className={classes.error}>{errorsFirstname}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.itemTitle}>Adresse</p></Grid>
              <Grid xs item container alignItems="stretch" direction="column">
                <Grid item>
                  <TextField
                    variant="outlined"
                    value={address}
                    onChange={handleChangeAddress}
                  />
                </Grid>
                {errorsAddress.length > 0 &&
                  <span className={classes.error}>{errorsAddress}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.itemTitle}>Code postal</p></Grid>
              <Grid xs item container alignItems="stretch" direction="column">
                <Grid item>
                  <TextField
                    variant="outlined"
                    value={postalCode}
                    onChange={handleChangePostalCode}
                  />
                </Grid>
                {errorsPostalCode.length > 0 &&
                  <span className={classes.error}>{errorsPostalCode}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.itemTitle}>Ville</p></Grid>
              <Grid xs item container alignItems="stretch" direction="column">
                <Grid item>
                  <TextField
                    variant="outlined"
                    value={city}
                    onChange={handleChangeCity}
                  />
                </Grid>
                {errorsCity.length > 0 &&
                  <span className={classes.error}>{errorsCity}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.itemTitle}>Email</p></Grid>
              <Grid xs item container alignItems="stretch" direction="column">
                <Grid item>
                  <TextField
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
                    variant="outlined"
                    value={phone}
                    onChange={handleChangePhone}
                  />
                </Grid>
                {errorsPhone.length > 0 &&
                  <span className={classes.error}>{errorsPhone}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.itemTitle}>Mot de passe actuel</p></Grid>
              <Grid xs item container alignItems="stretch" direction="column">
                <Grid item>
                  <TextField
                    variant="outlined"
                    value={old_password}
                    type="password"
                    onChange={handleChangeOldPassword}
                  />
                </Grid>
                {errorsOldPassword.length > 0 &&
                  <span className={classes.error}>{errorsOldPassword}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.itemTitle}>Nouveau mot de passe</p></Grid>
              <Grid xs item container alignItems="stretch" direction="column">
                <Grid item>
                  <TextField
                    variant="outlined"
                    value={new_password}
                    type="password"
                    onChange={handleChangeNewPassword}
                  />
                </Grid>
                {errorsNewPassword.length > 0 &&
                  <span className={classes.error}>{errorsNewPassword}</span>}
              </Grid>
            </Grid>
            <Grid item container alignItems="center" spacing={1}>
              <Grid item><p className={classes.itemTitle}>Confirmer le nouveau mot de passe</p></Grid>
              <Grid xs item container alignItems="stretch" direction="column">
                <Grid item>
                  <TextField
                    variant="outlined"
                    value={confirm_password}
                    type="password"
                    onChange={handleChangeConfirmPassword}
                  />
                </Grid>
                {errorsConfirmPassword.length > 0 &&
                  <span className={classes.error}>{errorsConfirmPassword}</span>}
              </Grid>
            </Grid>
            <Grid xs={12} item container direction="column" style={{ marginTop: 30 }}>
              <p className={classes.itemTitle}>Pièce d'identité avec face photo visible, uniquement pour authentification</p>
              <Grid item container justify="flex-start">
                <IdCard
                  onClose={handleClickCloseIdcard}
                  idcardurls={idcardurls}
                  state={state}
                  type="first"
                  badge="first"
                />

                <input className={classes.input} accept="image/*" type="file" id="img_idcard" onChange={handleLoadIdcard} />
                <label htmlFor="img_idcard">
                  {
                    <div className={classes.img}>
                      <AddCircleOutlineIcon className={classes.plus} />
                    </div>
                  }
                </label>
              </Grid>
            </Grid>
            <Grid item container style={{ paddingTop: '50px', paddingBottom: '50px' }}>
              <MyButton name={"Sauvegarder"} color={"1"} onClick={onClickSave} />
            </Grid>
          </Grid>
        </div>
      </div>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(MyAccount);
