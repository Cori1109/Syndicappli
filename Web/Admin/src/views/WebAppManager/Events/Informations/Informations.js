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
    if (complement.length === 0) { setErrorsComplement('please enter complement'); cnt++; }
    else setErrorsComplement('');

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
  const handleClickUpdate = () => {

  }
  return (
    <div className={classes.root}>
      {
        visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
      }
      <div className={classes.title}>
      </div>
      <div className={classes.body}>
        <Grid item container spacing={5} xs={12} sm={10} md={8} lg={6} xl={4}>
          <Grid item container alignItems="center" spacing={1}>
            <Grid item><p className={classes.title}>Immeuble</p></Grid>
            <Grid xs item container direction="column">
              <MySelect
                color="gray"
                data={buildings}
                onChangeSelect={handleChangeBuildings}
                value={building}
                disabled={(accessAssemblies === 'see' ? true : false)}
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
                disabled={(accessAssemblies === 'see' ? true : false)}
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
                disabled={(accessAssemblies === 'see' ? true : false)}
              />
              {errorsDescription.length > 0 &&
                <span className={classes.error}>{errorsDescription}</span>}
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
                disabled={(accessAssemblies === 'see' ? true : false)}
              />
              {errorsDate.length > 0 &&
                <span className={classes.error}>{errorsDate}</span>}
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
                disabled={(accessAssemblies === 'see' ? true : false)}
              />
              {errorsTime.length > 0 &&
                <span className={classes.error}>{errorsTime}</span>}
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
                disabled={(accessAssemblies === 'see' ? true : false)}
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
                disabled={(accessAssemblies === 'see' ? true : false)}
              />
              {errorsComplement.length > 0 &&
                <span className={classes.error}>{errorsComplement}</span>}
            </Grid>
          </Grid>
          <Grid item direction="row-reverse" container style={{ paddingTop: '50px', paddingBottom: '50px' }}>
            <MyButton name={"Mettre à jour"} color={"1"} onClick={handleClickUpdate} disabled={(accessAssemblies === 'see' ? true : false)} />
          </Grid>
        </Grid>
      </div>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(Informations);
