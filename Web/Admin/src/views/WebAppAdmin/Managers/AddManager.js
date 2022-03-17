import React, { useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import MyButton from '../../../components/MyButton';
import Multiselect from '../../../components/Multiselect.js';
import TextField from '@material-ui/core/TextField';
import MySelect from '../../../components/MySelect';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { AddManagerStyles as useStyles } from './useStyles';
import AdminService from '../../../services/api.js';
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
const AddManager = (props) => {
    const { history } = props;
    const classes = useStyles();
    const permissionList = ['Voir', 'Editer', 'Refusé'];
    const role_permission = ['see', 'edit', 'denied'];
    const [visibleIndicator, setVisibleIndicator] = React.useState(false);
    const [avatarurl, setAvatarUrl] = React.useState("");
    const [avatar, setAvatar] = React.useState(null);
    const [lastname, setLastName] = React.useState('');
    const [firstname, setFirstName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phonenumber, setPhoneNumber] = React.useState('');

    let company = [''];
    const [companies, setCompanies] = React.useState(0);
    const [companyList, setCompanyList] = React.useState([]);
    const [companyID, setCompanyID] = React.useState(-1);
    const [buildingList, setBuildingList] = React.useState([]);
    let buildingID1 = [];
    const [buildings1, setBuildings1] = React.useState([]);
    const [multiID, setMultiID] = React.useState([]);
    const [suggestions, setSuggestions] = React.useState([]);
    const [buildingsPermission, setBuildingsPermission] = React.useState(0);
    const [chatPermission, setChatPermission] = React.useState(0);
    const [ownersPermission, setOwnersPermission] = React.useState(0);
    const [incidentsPermission, setIncidentsPermission] = React.useState(0);
    const [assembliesPermission, setAssembliesPermission] = React.useState(0);
    const [eventsPermission, setEventsPermission] = React.useState(0);
    const [teamPermission, setTeamPermission] = React.useState(0);
    const [providersPermission, setProvidersPermission] = React.useState(0);
    const [announcementsPermission, setAnnouncementsPermission] = React.useState(0);
    const [companyPermission, setCompanyPermission] = React.useState(0);
    const [addonsPermission, setAddonsPermission] = React.useState(0);
    const [invoicesPermission, setInvoicesPermission] = React.useState(0);
    const [paymentMethodsPermission, setPaymentMethodsPermission] = React.useState(0);

    const [errorsCompanies, setErrorsCompanies] = React.useState('');
    const [errorsBuildings, setErrorsBuildings] = React.useState('');
    const [errorsLastname, setErrorsLastname] = React.useState('');
    const [errorsFirstname, setErrorsFirstname] = React.useState('');
    const [errorsEmail, setErrorsEmail] = React.useState('');
    const [errorsPhonenumber, setErrorsPhonenumber] = React.useState('');
    const handleClose = () => {
        props.onCancel();
    };
    const handleCreate = () => {
        let cnt = 0;
        if (lastname.length === 0) { setErrorsLastname('please enter your last name'); cnt++; }
        else setErrorsLastname('');
        if (firstname.length === 0) { setErrorsFirstname('please enter your first name'); cnt++; }
        else setErrorsFirstname('');
        if (companyID === -1) { setErrorsCompanies('please select companies'); cnt++; }
        else setErrorsCompanies('');
        if (multiID.length === 0) { setErrorsBuildings('please select buildings'); cnt++; }
        else setErrorsBuildings('');
        if (email.length === 0) { setErrorsEmail('please enter your email'); cnt++; }
        else setErrorsEmail('');
        if (phonenumber.length === 0) { setErrorsPhonenumber('please enter your phone number'); cnt++; }
        else setErrorsPhonenumber('');
        if (cnt === 0) {
            createManager();
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
    const createManager = () => {
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
        formdata.set('buildingID', JSON.stringify(multiID));
        formdata.set('firstname', firstname);
        formdata.set('lastname', lastname);
        formdata.set('email', email);
        formdata.set('phone', phonenumber);
        formdata.set('logo', avatar === null ? '' : avatar);
        formdata.set('permission_info', JSON.stringify(permissionInfos));


        setVisibleIndicator(true);
        AdminService.createManager(formdata)
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
                        <Grid item container justify="center" alignItems="center">
                            <Grid xs={3} item container><p className={classes.title}>Cabinet</p></Grid>
                            <Grid xs={9} item container>
                                <MySelect
                                    color="gray"
                                    data={company}
                                    onChangeSelect={handleChangeCompanies}
                                    value={companies}
                                    width="100%"
                                />
                                {errorsCompanies.length > 0 &&
                                    <span className={classes.error}>{errorsCompanies}</span>}
                            </Grid>
                        </Grid>
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
                    <br />
                    <p className={classes.title}><b>Permissions</b></p>
                    <br />
                    <Grid container spacing={2}>
                        <Grid xs={6} item container direction="column">
                            <p className={classes.title}>Immeubles</p>
                            <MySelect
                                color="gray"
                                data={permissionList}
                                onChangeSelect={handleChangeBuildingsPermission}
                                value={buildingsPermission}
                            />
                        </Grid>
                        <Grid xs={6} item container direction="column">
                            <p className={classes.title}>Copropriétaires</p>
                            <MySelect
                                color="gray"
                                data={permissionList}
                                onChangeSelect={handleChangeOwnersPermission}
                                value={ownersPermission}
                            />
                        </Grid>
                        <Grid xs={6} item container direction="column">
                            <p className={classes.title}>Messagerie</p>
                            <MySelect
                                color="gray"
                                data={permissionList}
                                onChangeSelect={handleChangeChatPermission}
                                value={chatPermission}
                            />
                        </Grid>
                        <Grid xs={6} item container direction="column">
                            <p className={classes.title}>Incidents</p>
                            <MySelect
                                color="gray"
                                data={permissionList}
                                onChangeSelect={handleChangeIncidentsPermission}
                                value={incidentsPermission}
                            />
                        </Grid>
                        <Grid xs={6} item container direction="column">
                            <p className={classes.title}>Assemblées</p>
                            <MySelect
                                color="gray"
                                data={permissionList}
                                onChangeSelect={handleChangeAssembliesPermission}
                                value={assembliesPermission}
                            />
                        </Grid>
                        <Grid xs={6} item container direction="column">
                            <p className={classes.title}>Événements</p>
                            <MySelect
                                color="gray"
                                data={permissionList}
                                onChangeSelect={handleChangeEventsPermission}
                                value={eventsPermission}
                            />
                        </Grid>
                        <Grid xs={6} item container direction="column">
                            <p className={classes.title}>Équipe</p>
                            <MySelect
                                color="gray"
                                data={permissionList}
                                onChangeSelect={handleChangeTeamPermission}
                                value={teamPermission}
                            />
                        </Grid>
                        <Grid xs={6} item container direction="column">
                            <p className={classes.title}>Prestataires</p>
                            <MySelect
                                color="gray"
                                data={permissionList}
                                onChangeSelect={handleChangeProvidersPermission}
                                value={providersPermission}
                            />
                        </Grid>
                        <Grid xs={6} item container direction="column">
                            <p className={classes.title}>Annonces</p>
                            <MySelect
                                color="gray"
                                data={permissionList}
                                onChangeSelect={handleChangeAnnouncementsPermission}
                                value={announcementsPermission}
                            />
                        </Grid>
                        <Grid xs={6} item container direction="column">
                            <p className={classes.title}>Cabinet</p>
                            <MySelect
                                color="gray"
                                data={permissionList}
                                onChangeSelect={handleChangeCompanyPermission}
                                value={companyPermission}
                            />
                        </Grid>
                        <Grid xs={6} item container direction="column">
                            <p className={classes.title}>Modules</p>
                            <MySelect
                                color="gray"
                                data={permissionList}
                                onChangeSelect={handleChangeAddonsPermission}
                                value={addonsPermission}
                            />
                        </Grid>
                        <Grid xs={6} item container direction="column">
                            <p className={classes.title}>Factures</p>
                            <MySelect
                                color="gray"
                                data={permissionList}
                                onChangeSelect={handleChangeInvoicesPermission}
                                value={invoicesPermission}
                            />
                        </Grid>
                        <Grid xs={6} item container direction="column">
                            <p className={classes.title}>Moyens de paiement</p>
                            <MySelect
                                color="gray"
                                data={permissionList}
                                onChangeSelect={handleChangePaymentMethodsPermission}
                                value={paymentMethodsPermission}
                            />
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

export default withRouter(AddManager);
