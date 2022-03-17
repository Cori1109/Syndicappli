import React, { useState, useEffect } from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router-dom';
import authService from '../../../services/authService.js';
import {ManagerService as Service} from '../../../services/api.js';
import MySelect from '../../../components/MySelect';
import useStyles from './useStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import TrashTable from 'components/TrashTable';
import useGlobal from 'Global/global';
const ManagerService = new Service();
const TrashEvents = (props) => {
  const { history } = props;
  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const accessEvents = authService.getAccess('role_events');
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const [globalState, globalActions] = useGlobal();
  const classes = useStyles();
  let building = [''];
  const [buildings, setBuildings] = useState(0);
  const [buildingList, setBuildingList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [totalpage, setTotalPage] = useState(1);
  const [row_count, setRowCount] = useState(20);
  const [page_num, setPageNum] = useState(1);
  const [companyID, setCompanyID] = useState(-1);
  const [BuildingID, setBuildingID] = useState(-1);
  const [sort_column, setSortColumn] = useState(-1);
  const [sort_method, setSortMethod] = useState('asc');
  const selectList = [20, 50, 100, 200, -1];
  const cellList = [
    { key: 'name', field: 'Titre' },
    { key: 'date', field: 'Date' },
    { key: 'address', field: 'Adresse' },
  ];

  const columns = [];
  for (let i = 0; i < 3; i++)
    columns[i] = 'asc';

  const handleClickRestore = (id) => {
    let data = {
      'status': 'active'
    }
    ManagerService.deleteEvent(id, data)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              ToastsStore.success("Restored successfully!");
              getTrashEvents();
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
  const handleChangeSelect = (value) => {
    setRowCount(selectList[value]);
  }
  const handleChangeBuildings = (val) => {
    setBuildings(val);
    setBuildingID(buildingList[val].buildingID);
  };
  const handleChangePagination = (value) => {
    setPageNum(value);
  }
  const handleSort = (index, direct) => {
    setSortColumn(index);
    setSortMethod(direct);
  }
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
    setVisibleIndicator(true);
    let data={
      'companyID' : companyID
    }
    ManagerService.getBuildingListByCompany(data)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              building.splice(0, building.length)
              building.push('Tout');
              data.buildinglist.map((item) => (
                building.push(item.name)
              )
              );
              setBuildingList([{ 'buildingID': -1 }, ...data.buildinglist]);
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
  const getTrashEvents = () => {
    const requestData = {
      'search_key': '',
      'page_num': page_num - 1,
      'row_count': row_count,
      'sort_column': sort_column,
      'sort_method': sort_method,
      'BuildingID': BuildingID,
      'status': 'trash'
    }
    setVisibleIndicator(true);
    ManagerService.getEventList(requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              if (!data.totalpage)
                setTotalPage(1);
              else
                setTotalPage(data.totalpage);
              setDataList(data.eventlist);
              let eventID = [];
              data.eventlist.map((item, i) => (
                eventID[i] = item.eventID
              )
              );
              globalActions.setTrash({type : 'event', ID : eventID});
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

  useEffect(() => {
    getCompanies();
  }, [accessEvents]);
  useEffect(()=>{
    getBuildings();
  },[companyID])
  useEffect(() => {
    getTrashEvents();
  }, [page_num, row_count, sort_column, sort_method, BuildingID, props.refresh]);

  return (
    <>
      {
        visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
      }
      <div className={classes.title}></div>
      <div className={classes.tool}>
        <Grid container spacing={2} direction="column">
          <Grid xs={6} sm={5} md={4} lg={3} xl={2} item container alignItems="center" spacing={2}>
            <Grid item ><p className={classes.subTitle}>Immeuble</p></Grid>
            <Grid xs item container direction="row-reverse">
              <Grid item container direction="column" alignItems="stretch">
                <MySelect
                  color="gray"
                  data={building}
                  onChangeSelect={handleChangeBuildings}
                  value={buildings}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className={classes.body}>
        <TrashTable
          onChangeSelect={handleChangeSelect}
          onChangePage={handleChangePagination}
          onSelectSort={handleSort}
          page={page_num}
          columns={columns}
          products={dataList}
          totalpage={totalpage}
          cells={cellList}
          onClickRestore={handleClickRestore}
          access={accessEvents}
        />
      </div>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </>
  );
};

export default withRouter(TrashEvents);
