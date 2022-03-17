import React from 'react';
import Grid from '@material-ui/core/Grid';
import MyButton from '../../../components/MyButton';
import TextField from '@material-ui/core/TextField';
import MySelect from '../../../components/MySelect';
import { AddEventStyles as useStyles } from './useStyles';
import { Scrollbars } from 'react-custom-scrollbars';

const AddEvent = (props) => {
    const classes = useStyles();

    const [date, setDate] = React.useState('');
    const [time, setTime] = React.useState('');
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [location, setLocation] = React.useState('');
    const [complement, setComplement] = React.useState('');
    const [building, setBuilding] = React.useState('');
    const [buildings, setBuildings] = React.useState([]);

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

        if (cnt === 0) {

            handleClose();
        }
    }

    const handleChangeDate = (event) => {
        setDate(event.target.value);
    }
    const handleChangeTime = (event) => {
        setTime(event.target.value);
    }
    const handleChangeBuildings = (event) => {
        // setBuildings(event.target.value);
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
                                    data={buildings}
                                    onChangeSelect={handleChangeBuildings}
                                    value={building}
                                />
                                {errorsBuilding.length > 0 &&
                                    <span className={classes.error}>{errorsBuilding}</span>}
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
                                />
                                {errorsTitle.length > 0 &&
                                    <span className={classes.error}>{errorsTitle}</span>}
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
                                />
                                {errorsDescription.length > 0 &&
                                    <span className={classes.error}>{errorsDescription}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container justify="space-between">
                            <Grid xs={6} item container spacing={1} direction="column">
                                <Grid item><p className={classes.title}>Date</p></Grid>
                                <Grid item container>
                                    <TextField
                                        variant="outlined"
                                        value={date}
                                        onChange={handleChangeDate}
                                        type="date"
                                        fullWidth
                                    />
                                    {errorsDate.length > 0 &&
                                        <span className={classes.error}>{errorsDate}</span>}
                                </Grid>
                            </Grid>
                            <Grid xs={6} item container spacing={1} direction="column">
                                <Grid item ><p className={classes.title}>Heure</p></Grid>
                                <Grid item container>
                                    <TextField
                                        variant="outlined"
                                        value={time}
                                        onChange={handleChangeTime}
                                        type="time"
                                        fullWidth
                                    />
                                    {errorsTime.length > 0 &&
                                        <span className={classes.error}>{errorsTime}</span>}
                                </Grid>
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
                                />
                                {errorsLocation.length > 0 &&
                                    <span className={classes.error}>{errorsLocation}</span>}
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
                                />
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

export default AddEvent;
