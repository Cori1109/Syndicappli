import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MySelect from 'components/MySelect';
import MyButton from 'components/MyButton';
import authService from 'services/authService.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';
import { Checkbox } from '@material-ui/core';
import useStyles from './useStyles';
import AdminService from 'services/api.js';
import { ManagerService as Service } from '../../../../../services/api.js';
const ManagerService = new Service();

const Informations = (props) => {
    const classes = useStyles();
    const { history } = props;
    const accessAssemblies = authService.getAccess('role_assemblies');
    const [visibleIndicator, setVisibleIndicator] = React.useState(false);
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
    const [errorsDate, setErrorsDate] = React.useState('');
    const [errorsTime, setErrorsTime] = React.useState('');
    const [errorsTitle, setErrorsTitle] = React.useState('');
    const [errorsDescription, setErrorsDescription] = React.useState('');
    const [errorsLocation, setErrorsLocation] = React.useState('');
    const [errorsComplement, setErrorsComplement] = React.useState('');
    const [errorsBuilding, setErrorsBuilding] = React.useState('');
    const [companyID, setCompanyID] = useState(-1);
    const [assemblyID, setAssemblyID] = useState(-1);
    const [currentBuildingID, setCurrentBuildingID] = useState(-1);
    const handleClose = () => {
        props.onCancel();
    };
    const handleChangeDate = (event) => {
        setDate(event.target.value);
    }
    const handleChangeTime = (event) => {
        setTime(event.target.value);
    }
    const handleChangeBuildings = (event) => {
        setCurrentBuildingID(event.target.value)
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
    const handleClickUpdate = () => {
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
            updateAssembly();
        }
    }
    useEffect(() => {
        if (accessAssemblies !== 'denied') {
            getAssembly();
        }
    }, [companyID]);
    useEffect(() => {
        if (accessAssemblies !== 'denied') {
            getBuildings();
        }
    }, [companyID]);
    const getAssembly = () => {
        let url = window.location;
        let parts = url.href.split('/');
        const assemblyID = Number(parts[parts.length - 1]);
        setAssemblyID(assemblyID);
        ManagerService.getAssembly(assemblyID)
        .then(
            response => {
                switch (response.data.code) {
                    case 200:
                        const data = response.data.data;
                        localStorage.setItem("token", JSON.stringify(data.token));
                        setTitle(data.assembly[0].title)
                        setDescription(data.assembly[0].description)
                        setDate(data.assembly[0].date)
                        setTime(data.assembly[0].time)
                        setLocation(data.assembly[0].address)
                        setComplement(data.assembly[0].additional_address)
                        setCurrentBuildingID(data.assembly[0].buildingID)
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
                        setBuildingID(currentBuildingID);
                        let list = data.buildinglist;
                        for (let i = 0; i < data.buildinglist.length; i++) {
                            if (data.buildinglist[i].buildingID == currentBuildingID) {
                                setBuildings(i);
                            }
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
            }
        );
    }

    const updateAssembly = () => {
        let formdata = {
            'buildingID': currentBuildingID,
            'title' : title,
            'description': description,
            'date': date,
            'time': time,
            'address': location,
            'additional_address': complement,
            'is_published': 1
        }
        ManagerService.updateAssembly(assemblyID, formdata)
        .then(
            response => {
                switch (response.data.code) {
                    case 200:
                        const data = response.data.data;
                        localStorage.setItem("token", JSON.stringify(data.token));
                        window.location.reload();
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

    return (
        <div className={classes.root}>
        { visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null }
        <div className={classes.title}>
        </div>
        <div className={classes.body}>
            <Grid item container spacing={5} xs={12} sm={10} md={8} lg={6} xl={4}>
                <Grid item container alignItems="center" spacing={1}>
                    <Grid item><p className={classes.title}>Immeuble</p></Grid>
                    <Grid xs item container direction="column">
                        <MySelect
                            color="gray"
                            data={building}
                            onChangeSelect={handleChangeBuildings}
                            value={buildings}
                            disabled={(accessAssemblies === 'edit' ? true : false)}
                        />
                        {errorsBuilding.length > 0 && <span className={classes.error}>{errorsBuilding}</span>}
                    </Grid>
                </Grid>
                <Grid item container alignItems="center" spacing={1}>
                    <Grid item><p className={classes.title}>Titre</p></Grid>
                    <Grid xs item container direction="column">
                        <TextField
                            variant="outlined"
                            value={title}
                            onChange={handleChangeTitle}
                            fullWidth
                            disabled={(accessAssemblies === 'edit' ? true : false)}
                        />
                        {errorsTitle.length > 0 && <span className={classes.error}>{errorsTitle}</span>}
                    </Grid>
                </Grid>
                <Grid item container spacing={1} direction="column">
                    <Grid item><p className={classes.title}>Description</p></Grid>
                    <Grid item container direction="column">
                        <TextField
                            multiline
                            variant="outlined"
                            value={description}
                            onChange={handleChangeDescription}
                            fullWidth
                            disabled={(accessAssemblies === 'edit' ? true : false)}
                        />
                        {errorsDescription.length > 0 && <span className={classes.error}>{errorsDescription}</span>}
                    </Grid>
                </Grid>
                <Grid xs={12} sm={6} item container spacing={1} direction="column">
                    <Grid item><p className={classes.title}>Date</p></Grid>
                    <Grid item container>
                        <TextField
                            variant="outlined"
                            value={date}
                            onChange={handleChangeDate}
                            type="date"
                            fullWidth
                            disabled={(accessAssemblies === 'edit' ? true : false)}
                        />
                        {errorsDate.length > 0 && <span className={classes.error}>{errorsDate}</span>}
                    </Grid>
                </Grid>
                <Grid xs={12} sm={6} item container spacing={1} direction="column">
                    <Grid item ><p className={classes.title}>Heure</p></Grid>
                    <Grid item container>
                        <TextField
                            variant="outlined"
                            value={time}
                            onChange={handleChangeTime}
                            type="time"
                            fullWidth
                            disabled={(accessAssemblies === 'edit' ? true : false)}
                        />
                        {errorsTime.length > 0 && <span className={classes.error}>{errorsTime}</span>}
                    </Grid>
                </Grid>
                <Grid item container alignItems="center" spacing={1}>
                    <Grid item><p className={classes.title}>Lieu</p></Grid>
                    <Grid xs item container direction="column">
                        <TextField
                            variant="outlined"
                            value={location}
                            onChange={handleChangeLocation}
                            fullWidth
                            disabled={(accessAssemblies === 'edit' ? true : false)}
                        />
                        {errorsLocation.length > 0 && <span className={classes.error}>{errorsLocation}</span>}
                    </Grid>
                </Grid>
                <Grid item container alignItems="center" spacing={1}>
                    <Grid item><p className={classes.title}>Complément</p></Grid>
                    <Grid xs item container direction="column">
                        <TextField
                            variant="outlined"
                            value={complement}
                            onChange={handleChangeComplement}
                            fullWidth
                            disabled={(accessAssemblies === 'edit' ? true : false)}
                        />
                        {errorsComplement.length > 0 && <span className={classes.error}>{errorsComplement}</span>}
                    </Grid>
                </Grid>
                <Grid item direction="row-reverse" container style={{ paddingTop: '50px', paddingBottom: '50px' }}>
                    <MyButton name={"Mettre à jour"} color={"1"} onClick={handleClickUpdate} disabled={(accessAssemblies === 'edit' ? true : false)} />
                </Grid>
            </Grid>
        </div>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(Informations);
