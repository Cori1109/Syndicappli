import React, { useState, useEffect } from 'react';
import authService from 'services/authService.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';
import { EditPostalVoteStyles as useStyles } from './useStyles';
import { Grid } from '@material-ui/core';
import DecisionCard from './compoment/DecisionCard';
import useGlobal from 'Global/global';
import { ManagerService as Service } from 'services/api.js';
const ManagerService = new Service();
const EditPostalVote = (props) => {
    const classes = useStyles();
    const { history } = props;
    const [initialState] = useGlobal();
    const accessAssemblies = authService.getAccess('role_assemblies');
    const [visibleIndicator, setVisibleIndicator] = useState(false);
    const [userData, setUserData] = useState([]);
    const [voteData, setVoteData] = useState([]);
    const [decisionsData, setDecisionsData] = useState([]);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [apartments, setApartments] = useState('');
    useEffect(() => {
        if (accessAssemblies !== 'denied') {
            getVoteDetail();
        }
    }, [history])
    const getVoteDetail = () => {
        let url = window.location;
        let parts = url.href.split('/');
        const assemblyID = Number(parts[parts.length - 1]);
        let data = {
            'assemblyID': assemblyID,
        }
        const id = initialState.postalID;
        ManagerService.getPostalVoteDetail(id, data)
        .then(
            response => {
                setVisibleIndicator(false);
                switch (response.data.code) {
                    case 200:
                        const data = response.data.data;
                        localStorage.setItem("token", JSON.stringify(data.token));
                        console.log(data)
                        setUserData(data.users)
                        setDecisionsData(data.decisions)
                        setVoteData(data.votes)
                        setName(data.votes[0].fullname)
                        setAddress(data.users[0].address)
                        setApartments(data.votes[0].apartments)
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
        <div className={classes.root}>
            { visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null }
            <div className={classes.title}>
            </div>
            <div className={classes.body}>
                <Grid item container direction="column" spacing={1} className={classes.editHeader}>
                    <Grid item>
                        <p className={classes.headerTitle}><b>{name}</b></p>
                    </Grid>
                    <Grid item>
                        <p className={classes.subTitle}>{address}</p>
                    </Grid>
                    <Grid item>
                        <p className={classes.subTitle}><b>Lots {apartments}</b></p>
                    </Grid>
                </Grid>

                {decisionsData.map((item, i) => (
                    <DecisionCard
                        decision_number={i}
                        decision_name={item.name}
                        description={item.description}
                        calc_mode={item.calc_mode}
                        vote_branch={item.vote_branch}
                        apartment_amount={'300/1500'}
                        vote_result={'Pour'}
                    />
                ))}
            </div>
            <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
        </div>
    );
};

export default withRouter(EditPostalVote);
