import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import MySelect from 'components/MySelect';
import { withRouter } from 'react-router-dom';
import authService from 'services/authService.js';
import {ManagerService as Service} from 'services/api.js';
import useStyles from './useStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import TrashTable from 'components/TrashTable';
import useGlobal from 'Global/global';
const ManagerService = new Service();
const TrashProviders = (props) => {
  const { history } = props;
  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const [globalState, globalActions] = useGlobal();
  const accessProviders = authService.getAccess('role_providers');
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const classes = useStyles();
  let company = [''];
  const [companies, setCompanies] = useState(0);
  const [companyList, setCompanyList] = useState([]);
  const [companyID, setCompanyID] = useState(-1);
  const [building, setBuilding] = useState(['']);
  const [buildings, setBuildings] = useState(0);
  const [buildingList, setBuildingList] = useState([]);
  const [buildingID, setBuildingID] = useState(-1);

  const [dataList, setDataList] = useState([]);
  const [totalpage, setTotalPage] = useState(1);
  const [row_count, setRowCount] = useState(20);
  const [page_num, setPageNum] = useState(1);
  const [sort_column, setSortColumn] = useState(-1);
  const [sort_method, setSortMethod] = useState('asc');
  const selectList = [20, 50, 100, 200, -1];

  const handleChangeCompanies = (val) => {
    setCompanies(val);
    setCompanyID(companyList[val].companyID);
  };
  const handleChangeBuildings = (val) => {
    setBuildings(val);
    setBuildingID(buildingList[val].buildingID);
  };
  const handleChangeSelect = (value) => {
    setRowCount(selectList[value]);
  }
  const handleChangePagination = (value) => {
    setPageNum(value);
  }
  const handleSort = (index, direct) => {
    setSortColumn(index);
    setSortMethod(direct);
  }
  useEffect(() => {
    getCompanies();
  }, [accessProviders]);
  useEffect(() => {
    getBuildings();
  }, [companyID]);
  useEffect(() => {
    if (accessProviders !== 'denied')
      getTrashProviders();
  }, [page_num, row_count, sort_column, sort_method, buildingID, props.refresh]);
  useEffect(() => {
    getTrashProviders();
  }, [buildingList])
  const cellList = [
    { key: 'lastname', field: 'Nom' },
    { key: 'firstname', field: 'Prénom' },
    { key: 'company_name', field: 'Société' },
    { key: 'email', field: 'Email' },
    { key: 'phone', field: 'Téléphone' },
    { key: 'categories', field: 'Catégories' },
  ];
  const columns = [];
  for (let i = 0; i < 6; i++)
    columns[i] = 'asc';
  const handleClickRestore = (id) => {
    let data = {
      'status': 'active'
    }
    ManagerService.deleteProvider(id, data)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              ToastsStore.success("Restored successfully!");
              getTrashProviders();
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
  const getTrashProviders = () => {
    const requestData = {
      'search_key': '',
      'page_num': page_num - 1,
      'row_count': row_count,
      'sort_column': sort_column,
      'sort_method': sort_method,
      'buildingID': buildingID,
      'companyID': companyID,
      'status': 'trash'
    }
    setVisibleIndicator(true);
    ManagerService.getProviderList(requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              if (data.totalpage)
                setTotalPage(data.totalpage);
              else
                setTotalPage(1);
              setDataList(data.providerlist);
              let providerID = [];
              data.providerlist.map((item, i) => (
                providerID[i] = item.ID
              )
              );
              globalActions.setTrash({type : 'provider', ID : providerID});
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
              company.splice(0, company.length)
              company.push('Tout');
              data.companylist.map((item) => (
                company.push(item.name)
              )
              );
              setCompanyList([{ 'companyID': -1 }, ...data.companylist]);
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
      'companyID': companyID
    }
    setVisibleIndicator(true);
    ManagerService.getBuildingListByCompany(requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              building.splice(0, building.length);
              buildingList.splice(0, buildingList.length)
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              building.splice(0, building.length)
              building.push('Tout');
              data.buildinglist.map((item) => (
                building.push(item.name)
              )
              );
              setBuilding(building);
              setBuildingList([{ 'buildingID': -1 }, ...data.buildinglist]);
              setBuildings(0);
              setBuildingID(-1);
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
    <>
      {
        visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
      }
      <div className={classes.title}></div>
      <div className={classes.tool}>
        <Grid container spacing={2} direction="column">
          <Grid xs={10} sm={5} md={4} lg={3} xl={2} item container alignItems="center" spacing={2}>
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
          <Grid xs={10} sm={5} md={4} lg={3} xl={2} item container alignItems="center" spacing={2}>
            <Grid item ><p className={classes.subTitle}>Cabinet</p></Grid>
            <Grid xs item container direction="row-reverse">
              <Grid item container direction="column" alignItems="stretch">
                <MySelect
                  color="gray"
                  data={company}
                  onChangeSelect={handleChangeCompanies}
                  value={companies}
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
          access={accessProviders}
        />
      </div>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </>
  );
};

export default withRouter(TrashProviders);
