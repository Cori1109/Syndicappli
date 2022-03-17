import React, { useState, useEffect } from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router-dom';
import authService from '../../../services/authService.js';
import { OwnerService as Service } from '../../../services/api.js';
import MySelect from '../../../components/MySelect';
import useStyles from './useStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import AssemblyCard from './components/AssemblyCard';
import AssemblyButton from './components/AssemblyButton';

const OwnerService = new Service();
const Assemblies = (props) => {
    const { history } = props;
    const token = authService.getToken();
    if (!token) {
        window.location.replace("/login");
    }
    const classes = useStyles();
    const accessAssemblies = authService.getAccess('role_assemblies');
    const [building, setBuilding] = useState(0);
    const [buildings, setBuildings] = useState([]);
    const [buildingID, setBuildingID] = useState(-1);
    const [buildingList, setBuildingList] = useState([]);
    const [visibleIndicator, setVisibleIndicator] = React.useState(false);
    let tmpCardList = [];
    for (let i = 0; i < 2; i++)
        tmpCardList[i] = { online: false, select: false };
    tmpCardList[0] = { online: true, select: true };
    const handleChangeBuildings = (val) => {
        console.log('val;' + val)
        setBuilding(val);
        setBuildingID(buildingList[val].buildingID);
    };
    const [cardList, setCardList] = useState(tmpCardList);
    const handleClickAdd = () => {

    }
    const handleClickCard = (id, state) => {
        console.log('id:', id);
        console.log('card:', state)
        if (state[id].select === false) {
            setCardList(cardList.map(
                (cardList, index) =>
                    index === id ?
                        {
                            ...cardList,
                            select: true
                        } :
                        {
                            ...cardList,
                            select: false
                        }
            ))
        } else {
            setCardList(cardList.map(
                (cardList, index) =>
                    index === id ?
                        {
                            ...cardList,
                            select: true
                        } :
                        cardList
            ))
        }
    }
    return (
        <div className={classes.root}>
            {
                visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
            }
            <div className={classes.title}>
                <Grid item xs={12} sm={6} container justify="flex-start" >
                    <Grid item>
                        <Typography variant="h2" className={classes.titleText}>
                            <b>Assemblées Générales</b>
                        </Typography>
                    </Grid>
                </Grid>
            </div>
            <div className={classes.tool}>
                <Grid container spacing={2} direction="column">
                    <Grid xs={10} sm={5} md={4} lg={3} xl={2} item container alignItems="center" spacing={2}>
                        <Grid item ><p className={classes.subTitle}>Immeuble</p></Grid>
                        <Grid xs item container direction="row-reverse">
                            <Grid item container direction="column" alignItems="stretch">
                                <MySelect
                                    color="gray"
                                    data={buildings}
                                    onChangeSelect={handleChangeBuildings}
                                    value={building}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <div className={classes.body}>
                <Grid container spacing={3}>
                    <Grid item container xs={12} sm={6} md={5} lg={4} xl={4} justify="flex-start" direction="column" spacing={3}>
                        <Grid item>
                            <AssemblyCard
                                color={"#4F9F64"}
                                assemblyID={0}
                                onClick={handleClickCard}
                                cardlist={cardList}
                            />
                        </Grid>
                        <Grid item>
                            <AssemblyCard
                                color={"#C9C9C9"}
                                assemblyID={1}
                                onClick={handleClickCard}
                                cardlist={cardList}
                            />
                        </Grid>
                    </Grid>
                    <Grid item container xs={12} sm={6} md={7} lg={8} xl={8} direction="column" spacing={5} className={classes.bodyContent}>
                        <Grid item>
                            <Grid item container direction="column" spacing={3}>
                                <Grid item>
                                    <p className={classes.assemblyName}>
                                        <b>AG du 12/03/21</b>
                                    </p>
                                </Grid>
                                <Grid item>
                                    <Grid item container spacing={1}>
                                        <Grid item>
                                            <img src='/images/place.png' className={classes.place} />
                                        </Grid>
                                        <Grid item>
                                            <p className={classes.assemblyDate}>
                                                <b>Vendredi 12 mars 2021 - 19h00</b>
                                            </p>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <p className={classes.assemblyDate}>
                                        <u>3 rue Berlioz, 75012 Paris</u> - Salle Haussman
                                    </p>
                                </Grid>
                                <Grid item xs={10}>
                                    <p className={classes.assemblyDate}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce accumsan mauris risus, ut
                                        tincidunt augue dictum eu. Donec molestie nibh purus, non sollicitudin nisl condimentum
                                        vitae. Suspendisse vehicula laoreet ullamcorper.
                                    </p>
                                </Grid>
                                <Grid item>
                                    <Grid item container direction="column" spacing={2}>
                                        <Grid item>
                                            <p className={classes.assemblyDocuments}>
                                                <b>Documents</b>
                                            </p>
                                        </Grid>
                                        <Grid item>
                                            <Grid item container direction="row" spacing={1}>
                                                <Grid item>
                                                    <Grid item container direction="column">
                                                        <div className={classes.documents}>
                                                            <img src='/images/pdf.png' className={classes.size} />
                                                        </div>
                                                        <p className={classes.doc_tip}>doc.pdf</p>
                                                    </Grid>
                                                </Grid>
                                                <Grid item>
                                                    <Grid item container direction="column">
                                                        <div className={classes.documents}>
                                                            <img src='/images/doc.png' className={classes.size} />
                                                        </div>
                                                        <p className={classes.doc_tip}>doc.docx</p>
                                                    </Grid>
                                                </Grid>
                                                <Grid item>
                                                    <Grid item container direction="column">
                                                        <div className={classes.documents}>
                                                            <img src='/images/png.png' className={classes.sizepng} />
                                                        </div>
                                                        <p className={classes.doc_tip}>doc.png</p>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Grid item container spacing={1}>
                                <Grid item>
                                    <AssemblyButton
                                        name={"Je vote par correspondance"}
                                        bgColor="gray"
                                        onClick={handleClickAdd}
                                    />
                                </Grid>
                                <Grid item>
                                    <AssemblyButton
                                        name={"Je délègue mon pouvoir"}
                                        bgColor="gray"
                                        onClick={handleClickAdd}
                                    />
                                </Grid>
                                <Grid item>
                                    <AssemblyButton
                                        name={"Je participe en audio"}
                                        color={"1"}
                                        onClick={handleClickAdd}
                                    />
                                </Grid>
                                <Grid item>
                                    <AssemblyButton
                                        name={"Je participe en vidéo"}
                                        color={"1"}
                                        onClick={handleClickAdd}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
            <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
        </div>
    );
};

export default withRouter(Assemblies);
