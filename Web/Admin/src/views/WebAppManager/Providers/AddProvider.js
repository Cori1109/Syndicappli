import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import MyButton from 'components/MyButton';
import Multiselect from 'components/Multiselect.js';
import TextField from '@material-ui/core/TextField';
import MySelect from 'components/MySelect';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { AddProviderStyles as useStyles } from './useStyles';
import AdminService from 'services/api.js';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import CircularProgress from '@material-ui/core/CircularProgress';
import authService from 'services/authService';
import { withRouter } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
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
const AddProvider = (props) => {
    const { history } = props;
    const classes = useStyles();
    const [visibleIndicator, setVisibleIndicator] = useState(false);
    const [avatarurl, setAvatarUrl] = useState("");
    const [avatar, setAvatar] = useState(null);
    const [lastname, setLastName] = useState('');
    const [firstname, setFirstName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [email, setEmail] = useState('');
    const [phonenumber, setPhoneNumber] = useState('');
    const [categorie, setCategorie] = useState(0);
    const categories = [''];
    let company = [''];
    const [companies, setCompanies] = useState(0);
    const [companyList, setCompanyList] = useState([]);
    const [companyID, setCompanyID] = useState(-1);
    const [buildingList, setBuildingList] = useState([]);
    let buildingID1 = [];
    const [buildings1, setBuildings1] = useState([]);
    const [multiID, setMultiID] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const [errorsCompanies, setErrorsCompanies] = useState('');
    const [errorsCompanyName, setErrorsCompanyName] = useState('');
    const [errorsBuildings, setErrorsBuildings] = useState('');
    const [errorsLastname, setErrorsLastname] = useState('');
    const [errorsFirstname, setErrorsFirstname] = useState('');
    const [errorsEmail, setErrorsEmail] = useState('');
    const [errorsPhonenumber, setErrorsPhonenumber] = useState('');
    const handleClose = () => {
        props.onCancel();
    };
    const handleCreate = () => {
        let cnt = 0;
        if (lastname.length === 0) { setErrorsLastname('please enter provider last name'); cnt++; }
        else setErrorsLastname('');
        if (firstname.length === 0) { setErrorsFirstname('please enter provider first name'); cnt++; }
        else setErrorsFirstname('');
        if (companyName.length === 0) { setErrorsCompanyName('please enter provider company name'); cnt++; }
        else setErrorsCompanyName('');
        if (companyID === -1) { setErrorsCompanies('please select companies'); cnt++; }
        else setErrorsCompanies('');
        if (multiID.length === 0) { setErrorsBuildings('please select buildings'); cnt++; }
        else setErrorsBuildings('');
        if (email.length === 0) { setErrorsEmail('please enter provider email'); cnt++; }
        else setErrorsEmail('');
        if (phonenumber.length === 0) { setErrorsPhonenumber('please enter provider phone number'); cnt++; }
        else setErrorsPhonenumber('');
        if (cnt === 0) {
            createProvider();
        }
    }
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
    const handleChangeCategories = (val) => {
        setCategorie(val);
    };
    const handleChangeBuildings = async (val) => {
        if (val !== null) {
            setBuildings1(val)
            buildingID1.splice(0, buildingID1.length)
            for (let i = 0; i < val.length; i++)
                for (let j = 0; j < buildingList.length; j++)
                    if (val[i].label == buildingList[j].name) {
                        buildingID1.push(buildingList[j].buildingID);
                    }
            setMultiID(buildingID1);
        }
        else {
            await setBuildings1([]);
            setMultiID([]);
        }
    };
    useEffect(() => {
        getCompanies();
    }, [companies]);
    useEffect(() => {
        getBuildings();
    }, [companyID])
    const getCompanies = () => {
        AdminService.getCompanyListByUser()
            .then(
                response => {
                    setVisibleIndicator(false);
                    switch (response.data.code) {
                        case 200:
                            const data = response.data.data;
                            localStorage.setItem("token", JSON.stringify(data.token));
                            company.splice(0, company.length)
                            company.push('');
                            data.companylist.map((item) => (
                                company.push(item.name)
                            )
                            );
                            setCompanyList([{ 'companyID': -1 }, ...data.companylist]);
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
    const createProvider = () => {

        let formdata = new FormData();
        formdata.set('companyID', companyID);
        formdata.set('buildingID', JSON.stringify(multiID));
        formdata.set('firstname', firstname);
        formdata.set('lastname', lastname);
        formdata.set('email', email);
        formdata.set('phone', phonenumber);
        formdata.set('logo', avatar === null ? '' : avatar);


        setVisibleIndicator(true);
        AdminService.createProvider(formdata)
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
    return (
        <Scrollbars style={{ height: '100vh' }}>
            <div className={classes.root}>
                {
                    visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
                }
                <div className={classes.paper} sm={12}>
                    <Grid container spacing={2} >
                        <Grid item container alignItems="center">
                            <Grid item xs={3}><p className={classes.title}>Immeubles</p></Grid>
                            <Grid xs={9} item container alignItems="stretch">
                                <Multiselect
                                    selected={buildings1}
                                    no={'No buildings found'}
                                    all={suggestions}
                                    onSelected={handleChangeBuildings}
                                    width="100%"
                                />
                                {errorsBuildings.length > 0 &&
                                    <span className={classes.error}>{errorsBuildings}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container justify="space-between" alignItems="center">
                            <Grid xs={3} item container><p className={classes.title}>Nom</p></Grid>
                            <Grid xs={9} item container>
                                <TextField
                                    className={classes.text}
                                    variant="outlined"
                                    value={lastname}
                                    onChange={handleChangeLastName}
                                    fullWidth
                                />
                                {errorsLastname.length > 0 &&
                                    <span className={classes.error}>{errorsLastname}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container justify="space-between" alignItems="center">
                            <Grid xs={3} item container><p className={classes.title}>Prénom</p></Grid>
                            <Grid xs={9} item container>
                                <TextField
                                    className={classes.text}
                                    variant="outlined"
                                    value={firstname}
                                    onChange={handleChangeFirstName}
                                    fullWidth
                                />
                                {errorsFirstname.length > 0 &&
                                    <span className={classes.error}>{errorsFirstname}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container justify="space-between" alignItems="center">
                            <Grid xs={3} item container><p className={classes.title}>Société</p></Grid>
                            <Grid xs={9} item container>
                                <TextField
                                    className={classes.text}
                                    variant="outlined"
                                    value={companyName}
                                    onChange={handleChangeCompanyName}
                                    fullWidth
                                />
                                {errorsCompanyName.length > 0 &&
                                    <span className={classes.error}>{errorsCompanyName}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container justify="space-between" alignItems="center">
                            <Grid xs={3} item container><p className={classes.title}>Email</p></Grid>
                            <Grid xs={9} item container>
                                <TextField
                                    className={classes.text}
                                    variant="outlined"
                                    value={email}
                                    onChange={handleChangeEmail}
                                    fullWidth
                                />
                                {errorsEmail.length > 0 &&
                                    <span className={classes.error}>{errorsEmail}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container justify="space-between" alignItems="center">
                            <Grid xs={3} item container><p className={classes.title}>Téléphone</p></Grid>
                            <Grid xs={9} item container>
                                <MuiPhoneNumber 
                                    defaultCountry='fr'
                                    className={classes.text}
                                    variant="outlined"
                                    value={phonenumber}
                                    onChange={handleChangePhoneNumber}
                                    fullWidth
                                />
                                {errorsPhonenumber.length > 0 &&
                                    <span className={classes.error}>{errorsPhonenumber}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container justify="center" alignItems="center">
                            <Grid xs={3} item container><p className={classes.title}>Catégories</p></Grid>
                            <Grid xs={9} item container>
                                <MySelect
                                    color="gray"
                                    data={categories}
                                    onChangeSelect={handleChangeCategories}
                                    value={categorie}
                                    width="100%"
                                />
                            </Grid>
                        </Grid>
                        <Grid xs={12} item container direction="column" >
                            <p className={classes.title}>Photo</p>
                            <Grid item container justify="flex-start">
                                <input className={classes.input} accept="image/*" type="file" id="img_front" onChange={handleLoadFront} />
                                <label htmlFor="img_front">
                                    {
                                        avatarurl === '' ?
                                            <div className={classes.img}>
                                                <AddCircleOutlineIcon className={classes.plus} />
                                            </div> :
                                            <img className={classes.img} src={avatarurl} alt="" />
                                    }
                                </label>
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

export default withRouter(AddProvider);
