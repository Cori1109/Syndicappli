import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import MyButton from '../../../components/MyButton';
import MySelect from '../../../components/MySelect';
import { withRouter } from 'react-router-dom';
import authService from '../../../services/authService.js';
import useStyles from './useStyles';
import ModuleCard from './components/ModuleCard';
import ModuleTable from './components/ModuleTable';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { ManagerService as Service } from 'services/api';
const ManagerService = new Service();
const Addons = (props) => {
  const { history } = props;
  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const accessAddons = authService.getAccess('role_addons');

  const classes = useStyles();
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const [building, setBuilding] = useState(0);
  const [buildings, setBuildings] = useState(['']);
  const [buildingList, setBuildingList] = useState(['']);
  const [buildingID, setBuildingID] = useState(-1);
  const [purchaseAddonState, setPurchaseAddonState] = useState();
  const [companyID, setCompanyID] = useState(-1);
  const [addon_price, setAddonPrice] = useState(4.90);
  const [errorsBuilding, setErrorsBuilding] = useState('');
  const [addonList, setAddonList] = useState([]);
  const [bundle_name, setBundleName] = useState('');
  const [building_name, setBuildingName] = useState('');
  const [count, setCount] = useState(0);
  const cellList = [
    { key: 'bundle_name', field: 'Produit' },
    { key: 'building_name', field: 'Immeuble' },
    { key: 'start_date', field: 'Valide du' },
    { key: 'end_date', field: "Valide jusqu'au" },
  ];
  const handleChangeBuilding = (val) => {
    setBuilding(val);
    setBuildingID(buildingList[val].buildingID);
    setBuildingName(buildingList[val].name);
  };
  const handleClickBuyPack = () => {
    if (buildingID !== -1) {
      setErrorsBuilding('');
      if(count === 0){
        ToastsStore.warning("You can't buy module. You must add at least 1 apartment in owner that is related with this building")
      }
      else{
        history.push("/manager/addons/payment?id=" + buildingID + "&count=" + count);
        window.location.reload();
      }
    } else {
      setErrorsBuilding('please select building');
    }
  };
  const handleClickBuyAgain = () => {
    setPurchaseAddonState(!purchaseAddonState);
  };
  useEffect(() => {
    if (accessAddons !== 'denied') {
      getCompanies();
    }
  }, [accessAddons]);
  useEffect(() => {
    if (companyID !== -1) {
      getAddon();
    }
  }, [companyID]);
  useEffect(() => {
    if (bundle_name !== '')
      getBuildings();
  }, [bundle_name]);
  useEffect(() => {
    if (accessAddons !== 'denied') {
      if (buildingID !== -1){
        getBuilding();
        getAddons();
      }
    }
  }, [buildingID])
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
          ToastsStore.error("Can't connect to the server!");
          setVisibleIndicator(false);
        }
      );
  }
  const getBuildings = () => {
    const requestData = {
      'search_key': '',
      'page_num': 0,
      'row_count': -1,
      'sort_column': -1,
      'sort_method': 'asc',
      'companyID': companyID,
      'status': 'active'
    }
    setVisibleIndicator(true);
    ManagerService.getBuildingList(requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              buildingList.splice(0, buildingList.length);
              buildings.splice(0, buildings.length)
              buildingList.push('')
              localStorage.setItem("token", JSON.stringify(data.token));
              data.buildinglist.map((item) => (
                buildings.push(item.name)
              )
              );
              setBuildingList(data.buildinglist);
              setBuildingName(data.buildinglist[0].name);
              if (data.buildinglist.length !== 0) {
                setBuildings(buildings);
                setBuildingID(data.buildinglist[0].buildingID);
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
          setVisibleIndicator(false);
        }
      );
  }
  const getAddon = () => {
    if (accessAddons !== 'denied') {
      setVisibleIndicator(true);
      ManagerService.getAddon()
        .then(
          response => {
            setVisibleIndicator(false);
            switch (response.data.code) {
              case 200:
                const data = response.data.data;
                localStorage.setItem("token", JSON.stringify(data.token));
                setAddonPrice(Number(data.addon[0].price).toFixed(2));
                setBundleName(data.addon[0].name);
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
  }
  const getBuilding = () => {
    setVisibleIndicator(true);
    ManagerService.getBuilding(buildingID)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              setCount(data.lots === null || data.lots === undefined ? 0 : data.lots);
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
  const getAddons = () => {
    const requestData = {
      'companyID': companyID,
      'buildingID': buildingID
    }
    setVisibleIndicator(true);
    ManagerService.getAddonsByBuildingID(requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              if (data.addonlist && data.addonlist.length !== 0) {
                setPurchaseAddonState(true);
                let list = data.addonlist;
                for (let i = 0; i < list.length; i++) {
                  console.log('bundle:', bundle_name);
                  console.log('building:', building_name);
                  list[i].bundle_name = bundle_name;
                  list[i].building_name = building_name;
                  list[i].end_date = list[i].end_date === '' ? '-' : list[i].end_date;
                }
                setAddonList(list);
              } else {
                setPurchaseAddonState(false);
                setAddonList([]);
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
          setVisibleIndicator(false);
        }
      );
  }
  if (purchaseAddonState) {
    return (
      <div className={classes.root}>
        {
          visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
        }
        <div className={classes.title}>
          <Grid item container alignItems="center">
            <Grid item xs={12} sm={6} container justify="flex-start" >
              <Grid item>
                <p className={classes.titleText}>
                  <b>Modules</b>
                </p>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <div className={classes.tool}>
          <Grid container xs={6} sm={4} item container alignItems="center" spacing={2}>
            <Grid item ><p className={classes.subTitle}>Immeuble</p></Grid>
            <Grid xs item container direction="row-reverse">
              <Grid item container direction="column" alignItems="stretch">
                <MySelect
                  color="gray"
                  data={buildings}
                  onChangeSelect={handleChangeBuilding}
                  value={building}
                  width="100%"
                />
                {errorsBuilding.length > 0 &&
                  <span className={classes.error}>{errorsBuilding}</span>}
              </Grid>
            </Grid>
          </Grid>
        </div>
        <div className={classes.body}>
          <Grid container direction="column" spacing={5}>
            <Grid item></Grid>
            <Grid item container>
              <ModuleTable
                products={addonList}
                cells={cellList}
                columns={4}
              />
            </Grid>
            <Grid item >
              <MyButton name={"Acheter à nouveau"} color={"1"} onClick={handleClickBuyAgain} />
            </Grid>
          </Grid>
        </div>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
      </div>
    );
  }
  else if(purchaseAddonState === false){
    return (
      <div className={classes.root}>
        {
          visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
        }
        <div className={classes.title}>
          <Grid item container alignItems="center">
            <Grid item xs={12} sm={6} container justify="flex-start" >
              <Grid item>
                <p className={classes.titleText}>
                  <b>Modules</b>
                </p>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <div className={classes.tool}>
          <Grid container xs={6} sm={4} item container alignItems="center" spacing={2}>
            <Grid item ><p className={classes.subTitle}>Immeuble</p></Grid>
            <Grid xs item container direction="row-reverse">
              <Grid item container direction="column" alignItems="stretch">
                <MySelect
                  color="gray"
                  data={buildings}
                  onChangeSelect={handleChangeBuilding}
                  value={building}
                  width="100%"
                />
                {errorsBuilding.length > 0 &&
                  <span className={classes.error}>{errorsBuilding}</span>}
              </Grid>
            </Grid>
          </Grid>
        </div>
        <div className={classes.body}>
          <Grid container>
            <Grid container direction="column" spacing={5}>
              <Grid item></Grid>
              <Grid item>
                <p className={classes.itemTitle}>Conformément à l’article 17-1 A de la Loi n° 65-557 du 10 juillet 1965 fixant le statut de la copropriété des immeubles
                bâtis, les copropriétaires peuvent participer à l'assemblée générale par visioconférence ou par tout autre moyen de
                    communication électronique permettant leur identification.</p>
              </Grid>
              <Grid item>
                <p className={classes.itemTitle}>Conformément à l’article 13-1 du Décret n°67-223 du 17 mars 1967 pris pour l'application de la loi n° 65-557 du 10
                juillet 1965 fixant le statut de la copropriété des immeubles bâtis, les supports doivent, au moins, transmettre leur
                voix et permettre la retransmission continue et simultanée des délibérations pour garantir la participation effective
                    des copropriétaires.</p>
              </Grid>
            </Grid>
            <Grid item container spacing={2}>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={3}>
                <ModuleCard
                  title="Voter par correspondance"
                  src="/images/advance.png"
                  details="Module vous permettant de déléguer votre droit de 
                      vote à un mandataire de votre choix, qu’il soit ou non 
                      membre du Syndicat des copropriétaires. Pour cela, 
                      vous devez acheter ce module au tarif de :"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={3}>
                <ModuleCard
                  title="Déléguer mon pouvoir"
                  src="/images/delegate.png"
                  details="Module vous permettant de voter l’ensemble des 
                      résolutions avant la tenue de l’Assemblée Générale, au 
                      moyen d’un formulaire à remplir.Pour cela, vous devez 
                      acheter ce module au tarif de :"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={3}>
                <ModuleCard
                  title="Participer à une Assemblée Générale 
                            à Distance en Audio Conférence"
                  src="/images/audio.png"
                  details="Module vous permettant de participer à l'Assemblée 
                      Générale en Audioconférence. Pour cela, vous devez 
                      acheter ce module au tarif de :"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} xl={3}>
                <ModuleCard
                  title="Participer à une Assemblée Générale à 
                            Distance en Visio Conférence à 360°"
                  src="/images/visio.png"
                  details="Module vous permettant de participer à l'Assemblée 
                      Générale en visioconférence à 360° en totale immersion. 
                      Pour cela, vous devez acheter ce module au tarif de :"
                />
              </Grid>
            </Grid>
            <Grid container direction="column" alignItems="center" spacing={3}>
              <Grid item ><p className={classes.price}><b>{addon_price}€ HT</b></p></Grid>
              <Grid item ><MyButton name={"J'achète le pack"} color={"1"} onClick={handleClickBuyPack} /></Grid>
              <Grid item></Grid>
            </Grid>
          </Grid>
        </div>
        <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
      </div>
    );
  }
  return(<></>);
};

export default withRouter(Addons);
