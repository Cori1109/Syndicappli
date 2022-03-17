import React, { useEffect, useState } from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import Grid from '@material-ui/core/Grid';
import MyButton from 'components/MyButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import MySelect from 'components/MySelect.js';
import { AddPostalVoteStyles as useStyles } from './useStyles';
import { withRouter } from 'react-router-dom';
import authService from 'services/authService';
import { Scrollbars } from 'react-custom-scrollbars';
import { ManagerService as Service } from '../../../../../services/api.js';
const ManagerService = new Service();

const AddPostalVote = (props) => {
    const classes = useStyles();
    const { history } = props;
    const [visibleIndicator, setVisibleIndicator] = useState(false);
    const [owner, setOwner] = useState(0);
    const [owners, setOwners] = useState(['']);
    const [ownerID, setOwnerID] = useState(-1);
    const [ownerList, setOwnerList] = useState([]);
    const [errorsOwner, setErrorsOwner] = useState('');

    const handleChangeOwner = (val) => {
        setOwner(val);
        setOwnerID(ownerList[val].userID);
    }
    const handleClose = () => {
        props.onCancel();
    };
    const handleClickAdd = () => {
        let cnt = 0;
        if (owners.length === 0) { 
            setErrorsOwner('please select owner');
            cnt++;
        } else setErrorsOwner('');
        if (cnt === 0) {
            addPostalVote()
        }
    };
    useEffect(() => {
        getOwners();
    }, [history])
    const addPostalVote = () => {
        let url = window.location;
        let parts = url.href.split('/');
        const assemblyID = Number(parts[parts.length - 1]);
        setVisibleIndicator(true);
        ManagerService.getAssemblyFiles(assemblyID)
        let form = {
            "assemblyID" : assemblyID,
            "ownerID" : ownerID,
            "status": "active"
        }
        console.log(form)
        ManagerService.createPostalVote(form)
        .then(
            response => {
                setVisibleIndicator(false);
                switch (response.data.code) {
                    case 200:
                        const data = response.data.data;
                        localStorage.setItem("token", JSON.stringify(data.token));
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
    const getOwners = () => {
        setVisibleIndicator(true);
        ManagerService.getOwnerListForVote()
        .then(
            response => {
                setVisibleIndicator(false);
                switch (response.data.code) {
                    case 200:
                        owners.splice(0, owners.length);
                        const data = response.data.data;
                        localStorage.setItem("token", JSON.stringify(data.token));
                        let list = data.owners;
                        data.owners.map((item) => (
                            owners.push(item.firstname + ' ' + item.lastname)
                        ));
                        setOwners(owners)
                        setOwner(0);
                        setOwnerList(data.owners);
                        setOwnerID(data.owners[0].userID);
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
        <Scrollbars style={{ height: '30vh' }}>
            <div className={classes.root}>
                { visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null }
                <div className={classes.paper} >
                    <Grid container spacing={4} xs={12} item>
                        <Grid item container alignItems="center" spacing={2}>
                            <Grid item><p className={classes.title}>Copropriétaire</p></Grid>
                            <Grid xs item container alignItems="stretch" direction="column">
                                <MySelect
                                    color="gray"
                                    data={owners}
                                    onChangeSelect={handleChangeOwner}
                                    value={owner}
                                />
                                {errorsOwner.length > 0 && <span className={classes.error}>{errorsOwner}</span>}
                            </Grid>
                        </Grid>
                    </Grid>
                    <div className={classes.footer}>
                        <Grid container justify="space-between">
                            <MyButton name={"Créer"} color={"1"} onClick={handleClickAdd} />
                            <MyButton name={"Annuler"} bgColor="gray" onClick={handleClose} />
                        </Grid>
                    </div>
                </div>
                <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
            </div>
        </Scrollbars>
    );
};

export default withRouter(AddPostalVote);
