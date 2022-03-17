import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import MyButton from 'components/MyButton';
import MySelect from 'components/MySelect';
import { OwnerService as Service } from 'services/api.js';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import CircularProgress from '@material-ui/core/CircularProgress';
import authService from 'services/authService';
import { withRouter } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { makeStyles } from '@material-ui/styles';
import TextField from '@material-ui/core/TextField';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export const useStyles = makeStyles(theme => ({
    paper: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: 5,
        padding: theme.spacing(2, 4, 3),
    },
    footer: {
        [theme.breakpoints.up('xl')]: {
            paddingTop: 89,
        },
        [theme.breakpoints.down('lg')]: {
            paddingTop: 62,
        },
        [theme.breakpoints.down('md')]: {
            paddingTop: 43,
        },
        paddingBottom: 30
    },
    root: {
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
    plus: {
        color: '#707070',
        [theme.breakpoints.up('xl')]: {
            width: 31,
            height: 31,
        },
        [theme.breakpoints.down('lg')]: {
            width: 22,
            height: 22,
        },
        [theme.breakpoints.down('md')]: {
            width: 15,
            height: 15,
        },
    },
    input: {
        display: 'none'
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
            width: 116,
            height: 92,
            marginTop: 20,
            marginRight: 20
        },
        [theme.breakpoints.down('lg')]: {
            width: 81,
            height: 64,
            marginTop: 14,
            marginRight: 14
        },
        [theme.breakpoints.down('md')]: {
            width: 57,
            height: 45,
            marginTop: 10,
            marginRight: 10
        },
    },
    title: {
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
}));
const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);

const OwnerService = new Service();

const Delegate = (props) => {
    const { history } = props;
    const classes = useStyles();
    const [visibleIndicator, setVisibleIndicator] = React.useState(false);
    const [buildings, setBuildings] = useState([]);
    const [building, setBuilding] = useState('');
    const [assemblies, setAssemblies] = useState([]);
    const [assembly, setAssembly] = useState('');
    const [valueSetMandatair, setValueSetMandatair] = React.useState('physiquement');
    const [valueMandatair, setValueMandatair] = React.useState('another_owner');
    const [lastname, setLastName] = React.useState('');
    const [firstname, setFirstName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [mobile, setMobile] = React.useState('');

    const [errorsBuildings, setErrorsBuildings] = useState('');
    const [errorsAssemblies, setErrorsAssemblies] = useState('');
    const [errorsLastName, setErrorsLastName] = useState('');
    const [errorsFirstName, setErrorsFirstName] = useState('');
    const [errorsEmail, setErrorsEmail] = useState('');
    const [errorsMobile, setErrorsMobile] = useState('');

    const handleClickBuy = () => {
        let cnt = 0;
        if (building.length === 0) { setErrorsBuildings('please select building'); cnt++; }
        else setErrorsBuildings('');
        if (assembly.length === 0) { setErrorsAssemblies('please select assembly'); cnt++; }
        else setErrorsAssemblies('');
        if (lastname.length === 0) { setErrorsLastName('please enter last name of representative'); cnt++; }
        else setErrorsLastName('');
        if (firstname.length === 0) { setErrorsFirstName('please enter first name of representative'); cnt++; }
        else setErrorsFirstName('');
        if (email.length === 0) { setErrorsEmail('please enter email of representative'); cnt++; }
        else setErrorsEmail('');
        if (mobile.length === 0) { setErrorsMobile('please enter a mobile of representative'); cnt++; }
        else setErrorsMobile('');
        if (cnt === 0)
            props.onBuy();
    }
    const handleChangeBuildings = (event) => {

    }
    const handleChangeAssemblies = (event) => {

    }
    const handleChangeSetMandatair = (event) => {
        setValueSetMandatair(event.target.value);
    };
    const handleChangeMandatair = (event) => {
        setValueMandatair(event.target.value);
    };
    const handleChangeLastName = (event) => {
        setLastName(event.target.value);
    };
    const handleChangeFirstName = (event) => {
        setFirstName(event.target.value);
    };
    const handleChangeEmail = (event) => {
        event.preventDefault();
        let errorsMail =
            validEmailRegex.test(event.target.value)
                ? ''
                : 'Email is not valid!';
        setEmail(event.target.value);
        setErrorsEmail(errorsMail);
    };
    const handleChangeMobile = (event) => {
        setMobile(event.target.value);
    };
    return (
        <Scrollbars style={{ height: '100vh' }}>
            <div className={classes.root}>
                {
                    visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
                }
                <div className={classes.paper} sm={12}>
                    <Grid container spacing={3} direction="column">
                        <Grid item container alignItems="center" spacing={2}>
                            <Grid item><p className={classes.title}>Immeuble</p></Grid>
                            <Grid xs item container direction="column">
                                <MySelect
                                    color="gray"
                                    data={building}
                                    onChangeSelect={handleChangeBuildings}
                                    value={buildings}
                                    width="50%"
                                />
                                {errorsBuildings.length > 0 &&
                                    <span className={classes.error}>{errorsBuildings}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container alignItems="center" spacing={1}>
                            <Grid item><p className={classes.title}>Assemblée Générale</p></Grid>
                            <Grid xs item container direction="column">
                                <MySelect
                                    color="gray"
                                    data={assembly}
                                    onChangeSelect={handleChangeAssemblies}
                                    value={assemblies}
                                    width="50%"
                                />
                                {errorsAssemblies.length > 0 &&
                                    <span className={classes.error}>{errorsAssemblies}</span>}
                            </Grid>
                        </Grid>
                        <Grid item>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Mon mandataire participera à l'Assemblée Générale :</FormLabel>
                                <RadioGroup aria-label="set_mandatair" name="set_mandatair1" value={valueSetMandatair} onChange={handleChangeSetMandatair}>
                                    <FormControlLabel value="physiquement" control={<Radio />} label="Physiquement" />
                                    <FormControlLabel value="distance" control={<Radio />} label="A distance" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <FormControl component="fieldset">
                                <FormLabel component="legend">Mon mandataire est :</FormLabel>
                                <RadioGroup aria-label="mandatair" name="mandatair1" value={valueMandatair} onChange={handleChangeMandatair}>
                                    <FormControlLabel value="another_owner" control={<Radio />} label="Un autre copropriétaire de l'immeuble" />
                                    <FormControlLabel value="external_person" control={<Radio />} label="Une personne externe" />
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <Grid item container alignItems="center" spacing={2}>
                                <Grid item><p className={classes.title}>Nom du mandataire</p></Grid>
                                <Grid xs item container alignItems="stretch">
                                    <TextField
                                        variant="outlined"
                                        value={lastname}
                                        fullWidth
                                        onChange={handleChangeLastName}
                                    />
                                    {errorsLastName.length > 0 &&
                                        <span className={classes.error}>{errorsLastName}</span>}
                                </Grid>
                            </Grid>
                            <Grid item container alignItems="center" spacing={2}>
                                <Grid item><p className={classes.title}>Prénom du mandataire</p></Grid>
                                <Grid xs item container alignItems="stretch">
                                    <TextField
                                        variant="outlined"
                                        value={firstname}
                                        fullWidth
                                        onChange={handleChangeFirstName}
                                    />
                                    {errorsFirstName.length > 0 &&
                                        <span className={classes.error}>{errorsFirstName}</span>}
                                </Grid>
                            </Grid>
                            <Grid item container alignItems="center" spacing={2}>
                                <Grid item><p className={classes.title}>Email du mandataire</p></Grid>
                                <Grid xs item container alignItems="stretch">
                                    <TextField
                                        variant="outlined"
                                        value={email}
                                        fullWidth
                                        onChange={handleChangeEmail}
                                    />
                                    {errorsEmail.length > 0 &&
                                        <span className={classes.error}>{errorsEmail}</span>}
                                </Grid>
                            </Grid>
                            <Grid item container alignItems="center" spacing={2}>
                                <Grid item><p className={classes.title}>Mobile du mandataire</p></Grid>
                                <Grid xs item container alignItems="stretch">
                                    <TextField
                                        variant="outlined"
                                        value={mobile}
                                        fullWidth
                                        onChange={handleChangeMobile}
                                    />
                                    {errorsMobile.length > 0 &&
                                        <span className={classes.error}>{errorsMobile}</span>}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <div className={classes.footer}>
                        <Grid container>
                            <MyButton name={"J'achète le module"} color={"1"} onClick={handleClickBuy} />
                        </Grid>
                    </div>
                </div>
                <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
            </div>
        </Scrollbars>
    );
};

export default withRouter(Delegate);
