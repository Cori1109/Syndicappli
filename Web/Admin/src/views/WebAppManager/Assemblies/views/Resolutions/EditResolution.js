import React, { useState, useEffect } from 'react';
import authService from 'services/authService.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';
import { EditResolutionStyles as useStyles } from './useStyles';
import { Grid } from '@material-ui/core';
import { Checkbox } from '@material-ui/core';
import MyButton from 'components/MyButton';
import TextField from '@material-ui/core/TextField';
import MySelect from 'components/MySelect.js';
import { ManagerService as Service } from '../../../../../services/api.js';
const ManagerService = new Service();
const validEmailRegex = RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
const validateForm = (errors) => {
    let valid = true;
    Object.values(errors).forEach(
        (val) => val.length > 0 && (valid = false)
    );
    return valid;
}
const EditResolution = (props) => {
    const classes = useStyles();
    const { history } = props;
    const accessAssemblies = authService.getAccess('role_assemblies');
    const [visibleIndicator, setVisibleIndicator] = useState(false);

    const [decisionName, setDecisionName] = useState('');
    const [description, setDescription] = useState('');
    const [vote, setVote] = useState(0);
    const [votes, setVotes] = useState(['']);
    const [voteList, setVoteList] = useState([]);
    const [voteID, setVoteID] = useState(-1);
    const [calcMode, setCalcMode] = useState(0);
    const calcModeList = ['majorité simple', 'majorité double', 'majorité absolue'];
    const en_calcModeList = ['simple majority', 'double majority', 'absolute majority'];
    const [result, setResult] = useState(0);
    const resultList = ['adopté', 'rejeté', 'en attente'];
    const en_resultList = ['adopted', 'rejected', 'onhold'];
    const [externalSpeaker, setExternalSpeaker] = useState(false);
    const [externalEmail, setExternalEmail] = useState('');
    const [intervention, setIntervention] = useState(0);
    const [transfer, setTransfer] = useState(false);
    const [emailNewUnion, setEmailNewUnion] = useState('');

    const [errorsDecisionName, setErrorsDecisionName] = useState('');
    const [errorsVote, setErrorsVote] = useState('');
    const [errorsExternalEmail, setErrorsExternalEmail] = useState('');
    const [errorsEmailNewUnion, setErrorsEmailNewUnion] = useState('');
    const [currentBuildingID, setCurrentBuildingID] = useState(-1);
    const [currentAssemblyID, setCurrentAssemblyID] = useState(-1);

    const handleChangeDecisionName = (event) => {
        setDecisionName(event.target.value);
        setErrorsDecisionName('');
    }
    const handleChangeDescription = (event) => {
        setDescription(event.target.value);
    }
    const handleChangeVote = (val) => {
        setVote(val);
        setVoteID(voteList[val].voteID);
    }
    const handleChangeCalcMode = (val) => {
        setCalcMode(val);
    }
    const handleChangeResult = (val) => {
        setResult(val);
    }
    const handleChangeExternalSpeaker = (event) => {
        setExternalSpeaker(event.target.checked);
        setErrorsExternalEmail('');
        setExternalEmail('');
        setIntervention(event.target.checked);
    }
    const handleChangeExternalEmail = (event) => {
        event.preventDefault();
        let errorsMail = validEmailRegex.test(event.target.value) ? '' : 'Email is not valid!';
        setExternalEmail(event.target.value);
        setErrorsExternalEmail(errorsMail);
        setIntervention(event.target.checked);
    }
    const handleChangeTransfer = (event) => {
        setTransfer(event.target.checked);
        setErrorsEmailNewUnion('');
        setEmailNewUnion('');
    }
    const handleChangeEmailNewUnion = (event) => {
        event.preventDefault();
        let errorsMail = validEmailRegex.test(event.target.value) ? '' : 'Email is not valid!';
        setEmailNewUnion(event.target.value);
        setErrorsEmailNewUnion(errorsMail);
    }
    const handleClickSave = () => {
        let cnt = 0;
        if (decisionName.length === 0) { setErrorsDecisionName('please enter decision name'); cnt++; }
        else setErrorsDecisionName('');
        if (votes.length === 0) { setErrorsVote('please select vote branch'); cnt++; }
        else setErrorsVote('');
        if (externalSpeaker) {
            if (externalEmail.length === 0) { 
                setErrorsExternalEmail('please enter external email'); 
                cnt++; 
            } else {
                if (!validateForm(errorsExternalEmail)) {
                    setErrorsExternalEmail('Email is not valid!');
                    cnt++; 
                } else setErrorsExternalEmail('');
            }
        } else setErrorsExternalEmail('');
        if (transfer) {
            if (emailNewUnion.length === 0) {
                setErrorsEmailNewUnion('please enter email new union');
                cnt++;
            } else {
                if (!validateForm(errorsEmailNewUnion)) {
                    setErrorsEmailNewUnion('Email is not valid!');
                    cnt++;
                } else setErrorsEmailNewUnion('');
            }
        } else setErrorsEmailNewUnion('');
        if (cnt === 0) {
            updateAssemblyDecision();            
        }
    };
    useEffect(() => {
        if (accessAssemblies !== 'denied') {
            getInfos();
        }
    }, [currentBuildingID]);
    const getInfos = () => {
        let url = window.location;
        let parts = url.href.split('/');
        const decisionID = Number(parts[parts.length - 1]);
        ManagerService.getDecision(decisionID)
        .then(
            response => {
                switch (response.data.code) {
                    case 200:
                        const data = response.data.data;
                        console.log(data)
                        localStorage.setItem("token", JSON.stringify(data.token));
                        setCurrentBuildingID(data.assembly[0].buildingID)
                        setCurrentAssemblyID(data.assembly[0].assemblyID)
                        votes.splice(0, data.votelist.length);
                        data.votelist.map((item) => (
                            votes.push(item.description)
                        ));
                        setVotes(votes);
                        setVoteList(data.votelist);
                        setVoteID(data.votelist[0].voteID);
                        setVote(0);
                        setDecisionName(data.decision[0].name)
                        setDescription(data.decision[0].description)
                        if (data.decision[0].enable_external_speaker) {
                            setExternalSpeaker(true)
                            setExternalEmail(data.decision[0].enable_external_speaker)
                        }
                        if (data.decision[0].enable_company_transfer) {
                            setTransfer(true)
                            setEmailNewUnion(data.decision[0].enable_company_transfer)
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
    const updateAssemblyDecision = () => {
        let url = window.location;
        let parts = url.href.split('/');
        const decisionID = Number(parts[parts.length - 1]);
        let form = {
            'assemblyID': currentAssemblyID,
            'name' : decisionName,
            'description': description,
            'vote_branch': voteList[vote].description,
            'calc_mode': en_calcModeList[calcMode],
            'vote_result': en_resultList[result],
            'intervention': intervention,
            'enable_external_speaker': externalEmail,
            'enable_company_transfer': emailNewUnion,
        }
        ManagerService.updateDecision(decisionID, form)
        .then(
            response => {
                switch (response.data.code) {
                    case 200:
                        const data = response.data.data;
                        localStorage.setItem("token", JSON.stringify(data.token));
                        history.goBack();
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
                    <Grid item container><p className={classes.headerTitle}><b>Informations</b></p></Grid>
                    <Grid item container spacing={2}>
                        <Grid item><p className={classes.title}>Titre</p></Grid>
                        <Grid xs item container alignItems="stretch">
                            <TextField
                                variant="outlined"
                                value={decisionName}
                                fullWidth
                                onChange={handleChangeDecisionName}
                            />
                            {errorsDecisionName.length > 0 &&
                                <span className={classes.error}>{errorsDecisionName}</span>}
                        </Grid>
                    </Grid>
                    <Grid item container spacing={2} direction="column">
                        <Grid item><p className={classes.title}>Description</p></Grid>
                        <Grid item container alignItems="stretch" direction="column">
                            <TextField
                                multiline
                                variant="outlined"
                                value={description}
                                fullWidth
                                onChange={handleChangeDescription}
                            />
                        </Grid>
                    </Grid>
                    <Grid item container alignItems="center" spacing={2}>
                        <Grid item><p className={classes.title}>Clef de répartition</p></Grid>
                        <Grid xs item container alignItems="stretch" direction="column">
                            <MySelect
                                color="gray"
                                data={votes}
                                onChangeSelect={handleChangeVote}
                                value={vote}
                            />
                            {errorsVote.length > 0 &&
                                <span className={classes.error}>{errorsVote}</span>}
                        </Grid>
                    </Grid>
                    <Grid item container alignItems="center" spacing={2}>
                        <Grid item><p className={classes.title}>Type de majorité</p></Grid>
                        <Grid xs item container alignItems="stretch" direction="column">
                            <MySelect
                                color="gray"
                                data={calcModeList}
                                onChangeSelect={handleChangeCalcMode}
                                value={calcMode}
                            />
                        </Grid>
                    </Grid>
                    <Grid item container alignItems="center" spacing={2}>
                        <Grid item><p className={classes.title}>Résultat</p></Grid>
                        <Grid xs item container alignItems="stretch" direction="column">
                            <MySelect
                                color="gray"
                                data={resultList}
                                onChangeSelect={handleChangeResult}
                                value={result}
                            />
                        </Grid>
                    </Grid>
                    <Grid item container alignItems="center" spacing={2}>
                        <Grid item><p className={classes.title}>Intervenant externe</p></Grid>
                        <Grid item>
                            <Checkbox
                                checked={externalSpeaker}
                                onChange={handleChangeExternalSpeaker}
                            />
                        </Grid>
                    </Grid>
                    {
                        externalSpeaker ?
                            <Grid item container alignItems="center" spacing={2}>
                                <Grid item><p className={classes.title}>Email intervenant</p></Grid>
                                <Grid xs item container alignItems="stretch" direction="column">
                                    <TextField
                                        variant="outlined"
                                        value={externalEmail}
                                        fullWidth
                                        onChange={handleChangeExternalEmail}
                                    />
                                    {errorsExternalEmail.length > 0 &&
                                        <span className={classes.error}>{errorsExternalEmail}</span>}
                                </Grid>
                            </Grid>
                            :
                            null
                    }
                    <Grid item container alignItems="center" spacing={2}>
                        <Grid item><p className={classes.title}>Transfert de mandat</p></Grid>
                        <Grid item>
                            <Checkbox
                                checked={transfer}
                                onChange={handleChangeTransfer}
                            />
                        </Grid>
                    </Grid>
                    {
                        transfer ?
                            <Grid item container alignItems="center" spacing={2}>
                                <Grid item><p className={classes.title}>Email nouveau syndicat</p></Grid>
                                <Grid xs item container alignItems="stretch" direction="column">
                                    <TextField
                                        variant="outlined"
                                        value={emailNewUnion}
                                        fullWidth
                                        onChange={handleChangeEmailNewUnion}
                                    />
                                    {errorsEmailNewUnion.length > 0 &&
                                        <span className={classes.error}>{errorsEmailNewUnion}</span>}
                                </Grid>
                            </Grid>
                            :
                            null
                    }
                    <Grid item container style={{ paddingTop: '50px', paddingBottom: '50px' }}>
                        <MyButton name={"Sauvegarder"} color={"1"} onClick={handleClickSave} disabled={(accessAssemblies === 'see' ? false : true)} />
                    </Grid>
                </Grid>
            </div>
            <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
        </div>
    );
};

export default withRouter(EditResolution);
