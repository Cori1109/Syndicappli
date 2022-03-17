import React, { useState, useEffect } from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';
import authService from '../../../services/authService.js';
import useStyles from './useStyles';
import AdminService from '../../../services/api.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import TrashTable from 'components/TrashTable';
import Grid from '@material-ui/core/Grid';
import MySelect from '../../../components/MySelect';
import useGlobal from 'Global/global.js';
const TrashOrders = (props) => {
  const { history } = props;
  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const [globalState, globalActions] = useGlobal();
  const accessOrders = authService.getAccess('role_orders');
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const classes = useStyles();
  const categorieList = ['Gestionnaires', 'Copropriétaires', 'Immeubles'];
  const en_categorieList = ['managers', 'owners', 'buildings'];
  const [categorie, setCategorie] = React.useState(0);
  const [companyID, setCompanyID] = useState(-1);
  const [buildingID, setBuildingID] = useState(-1);
  const [dataList, setDataList] = useState([]);
  const [totalpage, setTotalPage] = useState(1);
  const [row_count, setRowCount] = useState(20);
  const [page_num, setPageNum] = useState(1);
  const [sort_column, setSortColumn] = useState(-1);
  const [sort_method, setSortMethod] = useState('asc');
  const selectList = [20, 50, 100, 200, -1];
  const cellList = [
    { key: 'ID', field: 'Commande #' },
    { key: 'buyer_name', field: 'Client' },
    { key: 'start_date', field: 'Date' },
    { key: 'price_with_vat', field: 'Total' },
    { key: 'payment_status', field: 'Paiement' },
    { key: 'end_date', field: 'Prochain paiement' },
    { key: 'status', field: 'Statut' },
  ];
  const columns = [];
  for (let i = 0; i < 7; i++)
    columns[i] = 'asc';

  const handleClickRestore = (id) => {
    let data = {
      'status': 'active'
    }
    AdminService.deleteOrder(id, data)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              ToastsStore.success("Restored successfully!");
              getTrashOrders();
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
    getBuyerList();
  }, [categorie]);
  useEffect(() => {
    if (accessOrders !== 'denied')
      getTrashOrders();
  }, [page_num, row_count, sort_column, sort_method, props.refresh, companyID, buildingID]);

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
  const handleChangeCategorie = (val) => {
    setCategorie(val);
  }
  const getTrashOrders = () => {
    const requestData = {
      'search_key': '',
      'page_num': page_num - 1,
      'row_count': row_count,
      'sort_column': sort_column,
      'sort_method': sort_method,
      'status': 'trash',
      'type': en_categorieList[categorie],
      'companyID' : companyID,
      'buildingID' : buildingID
    }
    setVisibleIndicator(true);
    AdminService.getOrderList(requestData)
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
                let list = data.orderlist;
                for(let i = 0 ; i < list.length ; i++){
                  list[i].price_with_vat = list[i].price_with_vat + '€';
                }
                setDataList(list);
              let orderID = [];
              data.orderlist.map((item, i) => (
                orderID[i] = item.ID
              )
              );
              globalActions.setTrash({type : 'order', ID : orderID});
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
          ToastsStore.error("Can't connect to the server");
          setVisibleIndicator(false);
        }
      );
  }
  const getBuyerList = () => {
    let data = {
      'buyer_type': en_categorieList[categorie]
    }
    setVisibleIndicator(true);
    AdminService.getBuyerList(data)
      .then(
        async response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              if (data.buyerlist.length !== 0) {
                if (data.buyerlist[0].companyID)
                  setCompanyID(data.buyerlist[0].companyID);
                if (data.buyerlist[0].buildingID)
                  setBuildingID(data.buyerlist[0].buildingID);
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
  return (
    <div>
      {
        visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
      }
      <div className={classes.title}>
      </div>
      <div className={classes.tool}>
        <Grid xs={6} sm={5} md={4} lg={3} xl={2} item container alignItems="center" spacing={2}>
          <Grid item ><p className={classes.subTitle}>Catégorie</p></Grid>
          <Grid xs item container direction="row-reverse">
            <Grid item container direction="column" alignItems="stretch">
              <MySelect
                color="gray"
                data={categorieList}
                onChangeSelect={handleChangeCategorie}
                value={categorie}
              />
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
          access={accessOrders}
        />
      </div>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(TrashOrders);
