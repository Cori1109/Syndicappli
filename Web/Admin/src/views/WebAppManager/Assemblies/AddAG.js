import React, { useState, useEffect }  from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import Grid from '@material-ui/core/Grid';
import MyButton from '../../../components/MyButton';
import TextField from '@material-ui/core/TextField';
import MySelect from '../../../components/MySelect';
import { AddAGStyles as useStyles } from './useStyles';
import { Scrollbars } from 'react-custom-scrollbars';
import { ManagerService as Service } from '../../../services/api.js';
import authService from 'services/authService';
const ManagerService = new Service();

const AddAG = (props) => {
    const { history } = props;
    const classes = useStyles();
    const accessAssemblies = authService.getAccess('role_assemblies');
    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [location, setLocation] = React.useState('');
    const [complement, setComplement] = React.useState('');
    const [building, setBuilding] = useState(['']);
    const [buildings, setBuildings] = useState(0);
    const [buildingList, setBuildingList] = useState([]);
    const [buildingID, setBuildingID] = useState(-1);
    const [companyID, setCompanyID] = useState(-1);
    const [errorsDate, setErrorsDate] = React.useState('');
    const [errorsTime, setErrorsTime] = React.useState('');
    const [errorsTitle, setErrorsTitle] = React.useState('');
    const [errorsDescription, setErrorsDescription] = React.useState('');
    const [errorsLocation, setErrorsLocation] = React.useState('');
    const [errorsComplement, setErrorsComplement] = React.useState('');
    const [errorsBuilding, setErrorsBuilding] = React.useState('');
    const handleClose = () => {
        props.onCancel();
    };
    useEffect(() => {
        if (accessAssemblies !== 'denied') {
            getBuildings();
        }
    }, [companyID]);
    const getBuildings = () => {
        const requestData = {
        }
        ManagerService.getBuildingListByCompany(requestData)
        .then(
            response => {
                switch (response.data.code) {
                    case 200:
                        building.splice(0, building.length);
                        const data = response.data.data;
                        localStorage.setItem("token", JSON.stringify(data.token));
                        data.buildinglist.map((item) => (
                            building.push(item.name)
                        ));
                        setBuilding(building);
                        setBuildingList(data.buildinglist);
                        setBuildings(0);
                        let list = data.buildinglist;
                        setBuildingID(list[0].buildingID);
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
            }
        );
    }
    const handleCreate = () => {
        let cnt = 0;
        if (building.length === 0) { setErrorsBuilding('please select building'); cnt++; }
        else setErrorsBuilding('');
        if (date.length === 0) { setErrorsDate('please select date'); cnt++; }
        else setErrorsDate('');
        if (time.length === 0) { setErrorsTime('please select time'); cnt++; }
        else setErrorsTime('');
        if (title.length === 0) { setErrorsTitle('please enter title'); cnt++; }
        else setErrorsTitle('');
        if (description.length === 0) { setErrorsDescription('please enter description'); cnt++; }
        else setErrorsDescription('');
        if (location.length === 0) { setErrorsLocation('please enter location'); cnt++; }
        else setErrorsLocation('');
        if (complement.length === 0) { setErrorsComplement('please enter complement'); cnt++; }
        else setErrorsComplement('');

        if (cnt === 0) {
            createAssembly();
        }
    }

    const createAssembly = () => {
        let form = {
            'buildingID': buildingID,
            'title' : title,
            'description': description,
            'date': date,
            'time': time,
            'address': location,
            'additional_address': complement,
            'is_published': 1
        }
        ManagerService.createAssembly(form)
        .then(
            response => {
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
            }
        );
    }

    const handleChangeDate = (event) => {
        setDate(event.target.value);
    }
    const handleChangeTime = (event) => {
        setTime(event.target.value);
    }
    const handleChangeBuildings = (val) => {
        setBuildings(val);
        setBuildingID(buildingList[val].buildingID);
    }
    const handleChangeTitle = (event) => {
        setTitle(event.target.value);
    }
    const handleChangeDescription = (event) => {
        setDescription(event.target.value);
    }
    const handleChangeLocation = (event) => {
        setLocation(event.target.value);
    }
    const handleChangeComplement = (event) => {
        setComplement(event.target.value);
    }
    return (
        <Scrollbars style={{ height: '100vh' }}>
            <div className={classes.root}>
                <div className={classes.paper} sm={12}>
                    <Grid container spacing={3} >
                        <Grid item container alignItems="center" spacing={1}>
                            <Grid item><p className={classes.title}>Immeuble</p></Grid>
                            <Grid xs item container direction="column">
                                <MySelect 
                                    color="gray" 
                                    data={building} 
                                    onChangeSelect={handleChangeBuildings} 
                                    value={buildings} />
                                {errorsBuilding.length > 0 && <span className={classes.error}>{errorsBuilding}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container alignItems="center" spacing={1}>
                            <Grid item><p className={classes.title}>Titre</p></Grid>
                            <Grid xs item container direction="column">
                                <TextField variant="outlined" value={title} onChange={handleChangeTitle} fullWidth />
                                {errorsTitle.length > 0 && <span className={classes.error}>{errorsTitle}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container spacing={1} direction="column">
                            <Grid item><p className={classes.title}>Description</p></Grid>
                            <Grid item container direction="column">
                                <TextField multiline variant="outlined" value={description} onChange={handleChangeDescription} fullWidth />
                                {errorsDescription.length > 0 && <span className={classes.error}>{errorsDescription}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container justify="space-between">
                            <Grid xs={6} item container spacing={1} direction="column">
                                <Grid item><p className={classes.title}>Date</p></Grid>
                                <Grid item container>
                                    <TextField variant="outlined" value={date} onChange={handleChangeDate} type="date" fullWidth />
                                    {errorsDate.length > 0 && <span className={classes.error}>{errorsDate}</span>}
                                </Grid>
                            </Grid>
                            <Grid xs={6} item container spacing={1} direction="column">
                                <Grid item ><p className={classes.title}>Heure</p></Grid>
                                <Grid item container>
                                    <TextField variant="outlined" value={time} onChange={handleChangeTime} type="time" fullWidth />
                                    {errorsTime.length > 0 && <span className={classes.error}>{errorsTime}</span>}
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item container alignItems="center" spacing={1}>
                            <Grid item><p className={classes.title}>Lieu</p></Grid>
                            <Grid xs item container direction="column">
                                <TextField variant="outlined" value={location} onChange={handleChangeLocation} fullWidth />
                                {errorsLocation.length > 0 && <span className={classes.error}>{errorsLocation}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container alignItems="center" spacing={1}>
                            <Grid item><p className={classes.title}>Complément</p></Grid>
                            <Grid xs item container direction="column">
                                <TextField variant="outlined" value={complement} onChange={handleChangeComplement} fullWidth />
                                {errorsComplement.length > 0 && <span className={classes.error}>{errorsComplement}</span>}
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
            </div>
        </Scrollbars>
    );
};

export default AddAG;
