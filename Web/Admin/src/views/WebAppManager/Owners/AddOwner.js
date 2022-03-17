import React, { useEffect } from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import Grid from '@material-ui/core/Grid';
import MyButton from '../../../components/MyButton';
import TextField from '@material-ui/core/TextField';
import MySelect from '../../../components/MySelect';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Checkbox } from '@material-ui/core';
import IdCard from 'components/IdCard';
import { AddOwnerStyles as useStyles } from './useStyles';
import { ManagerService as Service } from '../../../services/api.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import authService from 'services/authService';
import { withRouter } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import MuiPhoneNumber from 'material-ui-phone-number';
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
const AddOwner = (props) => {
    const { history } = props;
    const classes = useStyles();
    const [state, setState] = React.useState(false);
    const titleList = ['', 'Mr', 'Mme', 'Mr et Mme', 'Société', 'Indivision', 'PACS'];
    const en_titleList = ['', 'Mr', 'Mrs', 'Mr & Mrs', 'Company', 'Indivision', 'PACS'];
    const [companyID, setCompanyID] = React.useState(-1);
    const [postalCode, setPostalCode] = React.useState('');
    const [building, setBuilding] = React.useState(['']);
    const [buildings, setBuildings] = React.useState(0);
    const [buildingList, setBuildingList] = React.useState([]);
    const [buildingID, setBuildingID] = React.useState(-1);

    const [visibleIndicator, setVisibleIndicator] = React.useState(false);
    const [isSubAccount, setIsSubAccount] = React.useState(false);
    const [isMemberCouncil, setIsMemberCouncil] = React.useState(false);
    const [avatarurl, setAvatarUrl] = React.useState("");
    const [avatar, setAvatar] = React.useState(null);
    const [idcardurls, setIdcardUrls] = React.useState([]);
    const [idcards, setIdcards] = React.useState([]);
    const [ownerTitle, setOwnerTitle] = React.useState(0);
    const [lastname, setLastName] = React.useState('');
    const [firstname, setFirstName] = React.useState('');
    const [lastname1, setLastName1] = React.useState('');
    const [firstname1, setFirstName1] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phonenumber, setPhoneNumber] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [city, setCity] = React.useState('');
    const [apartNumber, setApartNumber] = React.useState([]);
    const [companyName, setCompanyName] = React.useState('');

    const [errorsBuildings, setErrorsBuildings] = React.useState('');
    const [errorsOwnerTitle, setErrorsOwnerTitle] = React.useState('');
    const [errorsLastname, setErrorsLastname] = React.useState('');
    const [errorsFirstname, setErrorsFirstname] = React.useState('');
    const [errorsLastname1, setErrorsLastname1] = React.useState('');
    const [errorsFirstname1, setErrorsFirstname1] = React.useState('');
    const [errorsEmail, setErrorsEmail] = React.useState('');
    const [errorsPhonenumber, setErrorsPhonenumber] = React.useState('');
    const [errorsAddress, setErrorsAddress] = React.useState('');
    const [errorsCity, setErrorsCity] = React.useState('');
    const [errorsCompanyName, setErrorsCompanyName] = React.useState('');
    const [errorsVoteLists, setErrorsVoteLists] = React.useState('');
    const [errorsLot, setErrorsLot] = React.useState('');
    const [errorsPostalCode, setErrorsPostalCode] = React.useState('');
    const [lotsList, setLotsList] = React.useState([]);
    const [stateLots, setStateLots] = React.useState(false);
    const [buildingVote, setBuildingVote] = React.useState([]);
    const [voteAmount, setVoteAmount] = React.useState(Array.from({ length: 100 }, () => Array.from({ length: buildingVote.length }, () => null)));
    let voteLists = [];
    const [count, setCount] = React.useState(0);
    const handleClose = () => {
        props.onCancel();
    };
    useEffect(() => {
        getCompanies();
    }, []);
    useEffect(() => {
        getBuildings();
    }, [companyID]);
    const handleCreate = () => {
        let cnt = 0;
        if (ownerTitle === 4) {
            if (companyName.length === 0) { setErrorsCompanyName('please enter company name'); cnt++; }
            else setErrorsCompanyName('');
        } else if (ownerTitle === 3 || ownerTitle === 6) {
            if (lastname.length === 0) { setErrorsLastname('please enter owner last name'); cnt++; }
            else setErrorsLastname('');
            if (firstname.length === 0) { setErrorsFirstname('please enter owner first name'); cnt++; }
            else setErrorsFirstname('');
            if (lastname1.length === 0) { setErrorsLastname1('please enter owner last name'); cnt++; }
            else setErrorsLastname1('');
            if (firstname1.length === 0) { setErrorsFirstname1('please enter owner first name'); cnt++; }
            else setErrorsFirstname1('');
        }
        else {
            if (lastname.length === 0) { setErrorsLastname('please enter owner last name'); cnt++; }
            else setErrorsLastname('');
            if (firstname.length === 0) { setErrorsFirstname('please enter owner first name'); cnt++; }
            else setErrorsFirstname('');
        }
        if (building.length === 0) { setErrorsBuildings('please select buildings'); cnt++; }
        else setErrorsBuildings('');
        if (email.length === 0) { setErrorsEmail('please enter owner email'); cnt++; }
        else setErrorsEmail('');
        if (phonenumber.length === 0) { setErrorsPhonenumber('please enter owner phone number'); cnt++; }
        else setErrorsPhonenumber('');
        if (address.length === 0) { setErrorsAddress('please enter address'); cnt++; }
        else setErrorsAddress('');
        if (city.length === 0) { setErrorsCity('please enter city'); cnt++; }
        else setErrorsCity('');
        if (postalCode.length !== 5) { setErrorsPostalCode('please check postal code'); cnt++; }
        else setErrorsPostalCode('');
        if (isSubAccount === false) {
            if (count === 0) { setErrorsVoteLists('please add a lot at least'); cnt++; }
            else setErrorsVoteLists('');
            if (apartNumber.length === 0) { setErrorsLot('please input a lot'); cnt++; }
            else setErrorsLot('');
        } else {
            setErrorsVoteLists('');
            setErrorsLot('');
        }
        if (cnt === 0) {
            createOwner();
        }
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
    const handleChangeApartNumber = (event, i) => {
        let apartment = [...apartNumber];
        apartment[i] = event.target.value;
        setApartNumber(apartment);
    }
    const handleChangeVoteAmount = (event, i, j) => {
        let voteamount = [...voteAmount];
        voteamount[i][j] = +event.target.value;
        setVoteAmount(voteamount);
    }
    const handleChangeIsSubAccount = (event) => {
        setIsSubAccount(event.target.checked);
        if (event.target.checked) {
            setCount(0);
            setVoteAmount(Array.from({ length: 100 }, () => Array.from({ length: buildingVote.length }, () => null)));
            setApartNumber([]);
            setLotsList([]);
            setStateLots(!stateLots);
        }
        if (isSubAccount) {
            setIsMemberCouncil(!isSubAccount);
        }
        else
            setIsMemberCouncil(isSubAccount);
    }
    const handleChangeIsMemberCouncil = (event) => {
        setIsMemberCouncil(event.target.checked);
        if (isMemberCouncil)
            setIsSubAccount(!isMemberCouncil);
        else
            setIsSubAccount(isMemberCouncil);
    }
    const handleChangeOwnerTitle = (val) => {
        setOwnerTitle(Number(val));
    }
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
    const handleChangeBuildings = (val) => {
        setBuildings(val);
        setBuildingID(buildingList[val].buildingID);
    };
    const handleClickAddLots = (event) => {
        setCount(count + 1);
        lotsList.push(buildingVote);
        setLotsList(lotsList);
        setStateLots(!stateLots);
    }
    const handleClickRemoveLot = (num) => {
        setCount(count - 1);
        delete lotsList[num];
        lotsList.splice(num, 1);

        let voteamount = [...voteAmount];
        delete voteamount[num];
        voteamount.splice(num, 1);
        setVoteAmount(voteamount);

        let apartment = [...apartNumber];
        delete apartment[num];
        apartment.splice(num, 1);
        setApartNumber(apartment);

        setLotsList(lotsList);
        setStateLots(!stateLots);
        console.log('lotsList:', lotsList)
    }
    const getCompanies = () => {
        setVisibleIndicator(true);
        ManagerService.getCompanyListByUser()
            .then(
                response => {
                    setVisibleIndicator(false);
                    switch (response.data.code) {
                        case 200:
                            const data = response.data.data;
                            localStorage.setItem("token", JSON.stringify(data.token));
                            data.companylist.map((item) => (
                                setCompanyID(item.companyID)
                            )
                            );
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
                    ToastsStore.error('Cant connect to the server!');
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
                            buildingList.splice(0, buildingList.length);
                            building.splice(0, building.length);
                            const data = response.data.data;
                            localStorage.setItem("token", JSON.stringify(data.token));
                            data.buildinglist.map((item) => (
                                building.push(item.name)
                            )
                            );
                            setBuildingList(data.buildinglist);
                            setBuilding(building)
                            setBuildings(0);
                            if (data.buildinglist.length !== 0)
                                setBuildingID(data.buildinglist[0].buildingID);
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
        setVisibleIndicator(true);
        console.log(buildingID);
        ManagerService.getBuilding(buildingID)
            .then(
                response => {
                    setVisibleIndicator(false);
                    switch (response.data.code) {
                        case 200:
                            buildingVote.splice(0, buildingVote.length);
                            lotsList.splice(0, lotsList.length);
                            setLotsList(lotsList);
                            setStateLots(!stateLots);

                            const data = response.data.data;
                            localStorage.setItem("token", JSON.stringify(data.token));
                            const vote_list = data.vote_list;
                            vote_list.map((vote) =>
                                buildingVote.push(vote)
                            )
                            setBuildingVote(buildingVote);
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
    }, [buildingID]);
    const getVoteList = () => {
        for (let i = 0; i < apartNumber.length; i++) {
            let votes = [];
            for (let j = 0; j < voteAmount[i].length; j++) {
                const vote = {
                    'voteID': buildingVote[j].voteID,
                    'vote_amount': voteAmount[i][j]
                }
                votes.push(vote);
            }
            const voteList = {
                'apartment_number': apartNumber[i],
                'vote': votes
            }
            voteLists.push(voteList);
        }
    }
    const createOwner = () => {
        getVoteList();
        let formdata = new FormData();
        formdata.set('type', en_titleList[ownerTitle]);
        formdata.set('email', email);
        formdata.set('owner_role', isSubAccount ? 'subaccount' : isMemberCouncil ? 'member' : 'owner');
        formdata.set('buildingID', buildingID);
        formdata.set('firstname', firstname);
        formdata.set('lastname', lastname);
        formdata.set('firstname_1', firstname1);
        formdata.set('lastname_1', lastname1);
        formdata.set('owner_company_name', companyName);
        formdata.set('address', address);
        formdata.set('city', city);
        formdata.set('code_postal', postalCode);
        formdata.set('phone', phonenumber);
        formdata.set('photo_url', avatar === null ? '' : avatar)
        formdata.set('id_card_front', idcards[0] === null ? '' : idcards[0])
        formdata.set('id_card_back', idcards[1] === null ? '' : idcards[1])
        formdata.set('vote_value_list', JSON.stringify(voteLists));
        console.log(formdata)
        setVisibleIndicator(true);
        ManagerService.createOwner(formdata)
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
                        <Grid item container alignItems="center" spacing={1}>
                            <Grid item><p className={classes.title}>Immeuble</p></Grid>
                            <Grid xs item container direction="column">
                                <MySelect
                                    color="gray"
                                    data={building}
                                    onChangeSelect={handleChangeBuildings}
                                    value={buildings}
                                    width="100%"
                                />
                                {errorsBuildings.length > 0 &&
                                    <span className={classes.error}>{errorsBuildings}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container alignItems="center" spacing={1}>
                            <Grid item><p className={classes.title}>Civilité</p></Grid>
                            <Grid xs item container direction="column">
                                <MySelect
                                    color="gray"
                                    data={titleList}
                                    onChangeSelect={handleChangeOwnerTitle}
                                    value={ownerTitle}
                                    width="100%"
                                />
                                {errorsOwnerTitle.length > 0 &&
                                    <span className={classes.error}>{errorsOwnerTitle}</span>}
                            </Grid>
                        </Grid>
                        {
                            ownerTitle === 4 ?
                                <Grid xs={12} item container alignItems="center" spacing={1}>
                                    <Grid item><p className={classes.title}>Cabinet Nom</p></Grid>
                                    <Grid xs item container direction="column">
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
                                : ownerTitle === 3 || ownerTitle === 6 ?
                                    <Grid item container spacing={1}>
                                        <Grid item container alignItems="center" spacing={1}>
                                            <Grid item><p className={classes.title}>Nom</p></Grid>
                                            <Grid xs item container direction="column">
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
                                        <Grid item container alignItems="center" spacing={1}>
                                            <Grid item><p className={classes.title}>Prénom</p></Grid>
                                            <Grid xs item container direction="column">
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
                                        <Grid item container alignItems="center" spacing={1}>
                                            <Grid item><p className={classes.title}>Nom</p></Grid>
                                            <Grid xs item container direction="column">
                                                <TextField
                                                    className={classes.text}
                                                    variant="outlined"
                                                    value={lastname1}
                                                    onChange={handleChangeLastName1}
                                                    fullWidth
                                                />
                                                {errorsLastname1.length > 0 &&
                                                    <span className={classes.error}>{errorsLastname1}</span>}
                                            </Grid>
                                        </Grid>
                                        <Grid item container alignItems="center" spacing={1}>
                                            <Grid item><p className={classes.title}>Prénom</p></Grid>
                                            <Grid xs item container direction="column">
                                                <TextField
                                                    className={classes.text}
                                                    variant="outlined"
                                                    value={firstname1}
                                                    onChange={handleChangeFirstName1}
                                                    fullWidth
                                                />
                                                {errorsFirstname1.length > 0 &&
                                                    <span className={classes.error}>{errorsFirstname1}</span>}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    :
                                    <Grid item container spacing={1}>
                                        <Grid item container alignItems="center" spacing={1}>
                                            <Grid item><p className={classes.title}>Nom</p></Grid>
                                            <Grid xs item container direction="column">
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
                                        <Grid item container alignItems="center" spacing={1}>
                                            <Grid item><p className={classes.title}>Prénom</p></Grid>
                                            <Grid xs item container direction="column">
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

                                    </Grid>
                        }

                        <Grid item container spacing={1} direction="column">
                            <Grid item><p className={classes.title}>Adresse</p></Grid>
                            <Grid item container direction="column">
                                <TextField
                                    className={classes.text}
                                    variant="outlined"
                                    value={address}
                                    onChange={handleChangeAddress}
                                    multiline
                                    fullWidth
                                />
                                {errorsAddress.length > 0 &&
                                    <span className={classes.error}>{errorsAddress}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container spacing={1} alignItems="center">
                            <Grid item><p className={classes.title}>Code postal</p></Grid>
                            <Grid xs item container direction="column">
                                <TextField
                                    className={classes.text}
                                    variant="outlined"
                                    value={postalCode}
                                    onChange={handleChangePostalCode}
                                    fullWidth
                                />
                                {errorsPostalCode.length > 0 &&
                                    <span className={classes.error}>{errorsPostalCode}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container spacing={1} alignItems="center">
                            <Grid item><p className={classes.title}>Ville</p></Grid>
                            <Grid xs item container direction="column">
                                <TextField
                                    className={classes.text}
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
                            <Grid item ><p className={classes.title}>Email</p></Grid>
                            <Grid xs item container direction="column">
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
                        <Grid item container alignItems="center" spacing={1}>
                            <Grid item><p className={classes.title}>Téléphone</p></Grid>
                            <Grid xs item container direction="column">
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
                        <Grid item container justify="space-between" direction="row">
                            <Grid item>
                                <Grid container alignItems="center" spacing={1}>
                                    <Grid item ><p className={classes.title}>Sous-compte</p></Grid>
                                    <Grid xs item container>
                                        <Checkbox
                                            checked={isSubAccount}
                                            onChange={handleChangeIsSubAccount}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item>
                                <Grid container alignItems="center" spacing={1}>
                                    <Grid item><p className={classes.title}>Membre du Conseil Syndical</p></Grid>
                                    <Grid xs item container>
                                        <Checkbox
                                            checked={isMemberCouncil}
                                            onChange={handleChangeIsMemberCouncil}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid xs={12} item container direction="column" >
                            <p className={classes.title}>Photo de profil</p>
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
                        <Grid item container direction="column" spacing={2}>
                            <Grid item>
                                {
                                    stateLots !== null ?
                                        <Grid item container direction="column" spacing={5}>
                                            {
                                                lotsList.map((lot, i) => {
                                                    return (
                                                        <Grid key={i} item container alignItems="center" spacing={3}>
                                                            <Grid item>
                                                                <Grid item container direction="column" spacing={3}>
                                                                    <Grid item container alignItems="center" spacing={2}>
                                                                        <Grid item><p className={classes.title}>Lot</p></Grid>
                                                                        <Grid xs item container direction="column">
                                                                            <TextField
                                                                                className={classes.text}
                                                                                variant="outlined"
                                                                                value={apartNumber[i] || ''}
                                                                                onChange={(event) => handleChangeApartNumber(event, i)}
                                                                                style={{ width: 100 }}
                                                                            />
                                                                            {errorsLot.length > 0 &&
                                                                                <span className={classes.error}>{errorsLot}</span>}
                                                                        </Grid>
                                                                    </Grid>
                                                                    <Grid item><p className={classes.title}>Clé de répartition du lot</p></Grid>

                                                                    <Grid item container direction="column" spacing={2} >
                                                                        {
                                                                            lot.map((vote1, j) => {
                                                                                return (
                                                                                    <Grid key={j} item container alignItems="center" spacing={2}>
                                                                                        <Grid item><p className={classes.title}>{vote1.vote_branch_name} - {vote1.description}</p></Grid>
                                                                                        <Grid item >
                                                                                            <TextField
                                                                                                className={classes.text}
                                                                                                variant="outlined"
                                                                                                value={voteAmount[i][j] || ""}
                                                                                                onChange={(event) => handleChangeVoteAmount(event, i, j)}
                                                                                                style={{ width: 100 }}

                                                                                            />
                                                                                        </Grid>
                                                                                        <Grid item><p className={classes.title}>tantièmes</p></Grid>
                                                                                    </Grid>
                                                                                )
                                                                            })
                                                                        }
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                            <Grid item>
                                                                <RemoveCircleOutlineIcon
                                                                    className={classes.plus}
                                                                    onClick={() => handleClickRemoveLot(i)}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    )
                                                })
                                            }
                                        </Grid>
                                        : null
                                }
                            </Grid>
                            <Grid item style={{ marginTop: 10, marginBottom: 10 }}>
                                <Grid item container direction="column">
                                    <Grid>
                                        <MyButton
                                            name={"Ajouter un lot"}
                                            bgColor="grey"
                                            onClick={isSubAccount ? null : handleClickAddLots}
                                        />
                                    </Grid>
                                    {errorsVoteLists.length > 0 &&
                                        <span className={classes.error}>{errorsVoteLists}</span>}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid xs={12} item container direction="column" style={{ marginTop: 30 }}>
                            <p className={classes.title}>Pièce d'identité</p>
                            <Grid item container justify="flex-start">
                                <IdCard
                                    onClose={handleClickCloseIdcard}
                                    idcardurls={idcardurls}
                                    state={state}
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

export default withRouter(AddOwner);
