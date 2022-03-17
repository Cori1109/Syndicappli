import React, { useState, useEffect } from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import SelectTable from '../../../components/SelectTable';
import MyTable from '../../../components/MyTable';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router-dom';
import authService from '../../../services/authService.js';
import AdminService from '../../../services/api.js';
import MySelect from '../../../components/MySelect';
import useStyles from './useStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';

const Buildings = (props) => {
  const { history } = props;
  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const accessBuildings = authService.getAccess('role_buildings');
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const classes = useStyles();
  const [openDelete, setOpenDelete] = React.useState(false);
  const [deleteId, setDeleteId] = useState(-1);
  const [footerItems, setFooterItems] = useState([]);
  let company = [''];
  const [companies, setCompanies] = useState(0);
  const [companyList, setCompanyList] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [totalpage, setTotalPage] = useState(1);
  const [row_count, setRowCount] = useState(20);
  const [page_num, setPageNum] = useState(1);
  const [companyID, setCompanyID] = useState(-1);
  const [sort_column, setSortColumn] = useState(-1);
  const [sort_method, setSortMethod] = useState('asc');
  const selectList = [20, 50, 100, 200, -1];
  const [state, setState] = useState(false);
  const cellList = [
    { key: 'name', field: 'Nom' },
    { key: 'address', field: 'Adresse' },
    { key: 'total', field: 'CA HT' },
  ];

  const columns = [];
  for (let i = 0; i < 3; i++)
    columns[i] = 'asc';

  const handleClickEdit = (id) => {
    history.push('/admin/buildings/edit/' + id);
    window.location.reload();
  }
  const handleClickImport = (csvData) => {
      let requestData = new FormData();
      requestData.set('csv', csvData);
      requestData.set('companyID', companyID);
      setVisibleIndicator(true);
      AdminService.importBuilding(requestData)
        .then(
          response => {
            setVisibleIndicator(false);
            switch (response.data.code) {
              case 200:
                const data = response.data.data;
                localStorage.setItem("token", JSON.stringify(data.token));
                getBuildings();
                ToastsStore.success('Imported building successfully');
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

  const handleClickExport = (check) => {
    let buildingIDs = [];
    for(let i = 0 ; i < check.length ; i++){
      buildingIDs.push(dataList[check[i]].buildingID);
    }
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let date1 = new Date().getDate();
    let date = year + '_' + month + '_' + date1;
    const requestData = {
      'buildingID': JSON.stringify(buildingIDs),
    }
    setVisibleIndicator(true);
    AdminService.exportBuilding(requestData)
      .then(
        ({ data }) => {
          setVisibleIndicator(false);
          const downloadUrl = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', 'admin_building(' + date + ').csv');
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      );
  }
  const handleChangeSelect = (value) => {
    setRowCount(selectList[value]);
  }
  const handleChangeCompanies = (val) => {
    console.log('building;', val)
    setCompanies(val);
    setCompanyID(companyList[val].companyID);
  };
  const handleChangePagination = (value) => {
    setPageNum(value);
  }
  const handleSort = (index, direct) => {
    setSortColumn(index);
    setSortMethod(direct);
  }
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const getCompanies = () => {
    setVisibleIndicator(true);
    AdminService.getCompanyListByUser()
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
              console.log('companyList:', company)
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
      'page_num': page_num - 1,
      'row_count': row_count,
      'sort_column': sort_column,
      'sort_method': sort_method,
      'companyID': companyID,
      'status': 'active'
    }
    setVisibleIndicator(true);
    AdminService.getBuildingList(requestData)
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
              setDataList(data.buildinglist);
              setState(!state);
              let amount = 0;

              const items = ['', 'Total', data.totalcount, amount];
              setFooterItems(items);
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
  const handleClickDelete = (id) => {
    setOpenDelete(true);
    setDeleteId(id);
  };
  useEffect(() => {
    getCompanies();
  }, [accessBuildings]);
  useEffect(() => {
    if (accessBuildings !== 'denied')
      getBuildings();
    console.log(companyID)
  }, [page_num, row_count, sort_column, sort_method, companyID, props.refresh]);

  const handleDelete = () => {
    handleCloseDelete();
    setDeleteId(-1);
    setVisibleIndicator(true);
    let data = {
      'status': 'trash'
    }
    AdminService.deleteBuilding(deleteId, data)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              ToastsStore.success("Deleted successfully!");
              getBuildings();
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
          <Grid xs={6} sm={5} md={4} lg={3} xl={2} item container alignItems="center" spacing={2}>
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
      <div className={classes.tool}>
      </div>
      <div className={classes.body}>
        <SelectTable
          onChangeSelect={handleChangeSelect}
          onChangePage={handleChangePagination}
          onSelectSort={handleSort}
          page={page_num}
          columns={columns}
          products={dataList}
          state={state}
          totalpage={totalpage}
          cells={cellList}
          onClickEdit={handleClickEdit}
          onClickDelete={handleClickDelete}
          onImport={handleClickImport}
          onExport={handleClickExport}
          tblFooter="true"
          footerItems={footerItems}
          access={accessBuildings}
          id={companyID}
          err="You must select a company"
        />
      </div>
      <DeleteConfirmDialog
        openDelete={openDelete}
        handleCloseDelete={handleCloseDelete}
        handleDelete={handleDelete}
        account={'building'}
      />
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </>
  );
};

export default withRouter(Buildings);
