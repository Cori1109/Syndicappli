import React, { useState, useEffect } from 'react';
import OrderTable from './OrderTable';
import authService from '../../../../services/authService.js';
import AdminService from '../../../../services/api.js';
import { withRouter } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import Grid from '@material-ui/core/Grid';
import MyButton from '../../../../components/MyButton';
import MySelect from '../../../../components/MySelect';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import {
  Budget,
  LatestSales,
} from '../components';
import CurveChart from '../components/CurveChart';
import { OrdersManagerStyles as useStyles } from '../useStyles';
const OrdersOwner = (props) => {
  const { history } = props;

  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const accessOrders = authService.getAccess('role_orders');
  const [openDelete, setOpenDelete] = React.useState(false);
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const classes = useStyles();
  const [company, setCompany] = useState(0);
  const [companies, setCompanies] = useState(['Tous les Cabinet']);
  const [buildings, setBuildings] = useState(['Tous les Immeubles']);
  const [products, setProducts] = useState(['Tous les Produits']);
  const [companyID, setCompanyID] = useState(-1);
  const [buildingID, setBuildingID] = useState(-1);
  const [productID, setProductID] = useState(-1);
  const [building, setBuilding] = useState(0);
  const [product, setProduct] = useState(0);
  const [period, setPeriod] = useState(0);
  const [deleteId, setDeleteId] = useState(-1);
  const [dataList, setDataList] = useState([]);
  const [totalpage, setTotalPage] = useState(1);
  const [row_count, setRowCount] = useState(20);
  const [page_num, setPageNum] = useState(1);
  const [sort_column, setSortColumn] = useState(-1);
  const [sort_method, setSortMethod] = useState('asc');
  const selectList = [20, 50, 100, 200, -1];
  const [companyList, setCompanyList] = useState([]);
  const [buildingList, setBuildingList] = useState([]);
  const [productList, setProductList] = useState([]);
  const periodList = ['les 7 derniers jours', 'les 30 derniers jours', 'les 90 derniers jours', 'la dernière année'];
  const budgetList = ['en 7 jours', 'en 1 mois', 'en 3 mois', 'en 1 année'];
  const [budget_period, setBudgetPeriod] = useState('en 7 jours');
  const en_periodList = [7, 30, 90, 365];
  const [charts, setCharts] = useState([]);
  const [income_amount, setIncomeAmount] = useState({ count: 1, color: '#FC5555' });
  const [income_price, setIncomePrice] = useState({ price: 1, color: '#FC5555' });
  const [order_amount, setOrderAmount] = useState(0);
  const [order_price, setOrderPrice] = useState(0);
  const [pro_amount, setProAmount] = useState(0);
  const [pro_price, setProPrice] = useState(0);
  const handleClickExport = () => {
    const requestData = {
      'search_key': '',
      'page_num': page_num - 1,
      'row_count': row_count,
      'sort_column': sort_column,
      'sort_method': sort_method,
      'status': 'active',
      'type': 'owners',
      'companyID': companyID,
      'buildingID': buildingID,
      'productID': productID,
      'duration': en_periodList[period]
    }
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let date1 = new Date().getDate();
    let date = year + '_' + month + '_' + date1;
    setVisibleIndicator(true);
    AdminService.downloadZipOwner(requestData)
      .then(
        ({ data }) => {
          setVisibleIndicator(false);
          const downloadUrl = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', 'Invoice(' + date + ').zip');
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      );
  };
  const handleChangeCompany = (value) => {
    setCompany(value);
    setCompanyID(companyList[value].companyID);
    if (buildingList) {
      setBuilding(0);
      setBuildingID(-1);
    }
    if (productList) {
      setProduct(0);
      setProductID(-1);
    }
  }
  const handleChangeBuilding = (value) => {
    setBuilding(value);
    setBuildingID(buildingList[value].buildingID);
    if (productList) {
      setProduct(0);
      setProductID(-1);
    }
  }
  const handleChangeProduct = (value) => {
    setProduct(value);
    setProductID(productList[value].productID);
  }
  const handleChangePeriod = (value) => {
    setPeriod(value);
    setBudgetPeriod(budgetList[value]);
  }
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

  const cellList = [
    { key: 'ID', field: 'Commande #' },
    { key: 'buyer_name', field: 'Client' },
    { key: 'start_date', field: 'Date' },
    { key: 'price_with_vat', field: 'Total' },
    { key: 'payment_status', field: 'Paiement' },
    { key: 'end_date', field: 'Prochain paiement' },
    { key: 'status', field: 'Statut' },
  ];
  useEffect(() => {
    if (accessOrders !== 'denied')
      getOrdersOwner();
  }, [page_num, row_count, sort_column, sort_method, props.refresh, companyID, buildingID, productID, period]);

  const columns = [];
  for (let i = 0; i < 7; i++)
    columns[i] = 'asc';
  const handleClickEdit = (id) => {
    history.push('/admin/orders/edit/' + id);
    window.location.reload();
  };
  const handleClickDownload = (id) => {
    let requestDate = {
      'orderID': id,
    }
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let date1 = new Date().getDate();
    let date = year + '_' + month + '_' + date1;
    setVisibleIndicator(true);
    AdminService.downloadInvoiceOwner(requestDate)
      .then(
        ({ data }) => {
          setVisibleIndicator(false);
          const downloadUrl = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', 'Invoice' + id + '(' + date + ').pdf');
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      );
  }
  const handleClickDelete = (id) => {
    setOpenDelete(true);
    setDeleteId(id);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleDelete = () => {
    handleCloseDelete();
    setDeleteId(-1);
    setVisibleIndicator(true);
    let data = {
      'status': 'trash'
    }
    AdminService.deleteOrder(deleteId, data)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              ToastsStore.success("Deleted successfully!");
              getOrdersOwner();
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
  const getOrdersOwner = () => {
    const requestData = {
      'search_key': '',
      'page_num': page_num - 1,
      'row_count': row_count,
      'sort_column': sort_column,
      'sort_method': sort_method,
      'status': 'active',
      'type': 'owners',
      'companyID': companyID,
      'buildingID': buildingID,
      'productID': productID,
      'duration': en_periodList[period]
    }
    setVisibleIndicator(true);
    AdminService.getOrderList(requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              const filterData = data.filterlist;
              const chartData = data.chartlist;
              if (filterData) {
                if (filterData.length !== 0) {
                  if (filterData.companies) {
                    companies.splice(0, companies.length)
                    companies.push('Tous les Cabinets');
                    filterData.companies.map((item) => (
                      companies.push(item.name)
                    )
                    );
                    setCompanyList([{ 'companyID': -1 }, ...filterData.companies]);
                  }
                  if (filterData.buildings) {
                    buildings.splice(0, buildings.length)
                    buildings.push('Tous les Immeubles');
                    filterData.buildings.map((item) => (
                      buildings.push(item.name)
                    )
                    );
                    setBuildingList([{ 'buildingID': -1 }, ...filterData.buildings]);
                  }
                  if (filterData.products) {
                    products.splice(0, products.length)
                    products.push('Tous les Produits');
                    filterData.products.map((item) => (
                      products.push(item.name)
                    )
                    );
                    setProductList([{ 'productID': -1 }, ...filterData.products]);
                  }
                }
              }
              if (chartData) {
                setCharts(chartData);
                if (chartData.result_total) {
                  if (chartData.result_total.length !== 0) {
                    if (chartData.result_total[1].price > chartData.result_total[0].price)
                      setIncomePrice({ price: 2, color: '#2DCE9C' });
                    else
                      setIncomePrice({ price: 1, color: '#FC5555' });
                    if (chartData.result_total[1].count > chartData.result_total[0].count)
                      setIncomeAmount({ count: 2, color: '#2DCE9C' });
                    else
                      setIncomeAmount({ count: 1, color: '#FC5555' });
                    setOrderPrice(chartData.result_total[1].price);
                    setOrderAmount(chartData.result_total[1].count);
                    if(chartData.result_total[0].price === 0){
                      if(chartData.result_total[1].price === 0)
                        setProPrice(0);
                      else
                        setProPrice(100);
                    }
                    else{
                      if(chartData.result_total[1].price === 0)
                        setProPrice(100);
                      else
                        setProPrice(Number(chartData.result_total[1].price/chartData.result_total[0].price).toFixed(2));
                    }
                    if(chartData.result_total[0].count === 0){
                      if(chartData.result_total[1].count === 0)
                        setProAmount(0);
                      else
                        setProAmount(100);
                    }
                    else{
                      if(chartData.result_total[1].count === 0)
                        setProAmount(100);
                      else
                        setProAmount(Number(chartData.result_total[1].count/chartData.result_total[0].count).toFixed(2));
                    }
                  }
                }
              }
              localStorage.setItem("token", JSON.stringify(data.token));
              if (!data.totalpage)
                setTotalPage(1);
              else
                setTotalPage(data.totalpage);
              let list = data.orderlist;
              for (let i = 0; i < list.length; i++) {
                list[i].price_with_vat = list[i].price_with_vat + '€';
              }
              setDataList(list);
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
          console.log('fail');
          setVisibleIndicator(false);
        }
      );
  }

  return (
    <Grid item container spacing={3} direction="column">
      {
        visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
      }
      <Grid item></Grid>
      <Grid item container spacing={2} justify="flex-end" >
        <Grid item>
          <MySelect
            color="gray"
            width="239px"
            data={companies}
            value={company}
            onChangeSelect={handleChangeCompany}
          />
        </Grid>
        <Grid item>
          <MySelect
            color="gray"
            width="239px"
            data={buildings}
            value={building}
            onChangeSelect={handleChangeBuilding}
          />
        </Grid>
        <Grid item>
          <MySelect
            color="gray"
            width="239px"
            data={products}
            value={product}
            onChangeSelect={handleChangeProduct}
          />
        </Grid>
        <Grid item>
          <MySelect
            color="gray"
            width="239px"
            data={periodList}
            value={period}
            onChangeSelect={handleChangePeriod}
          />
        </Grid>
      </Grid>
      <Grid item
        container
        justify="space-between"
        spacing={1}
      >
        <Grid item sm={3} container direction="column" justify="space-between" spacing={1}>
          <Grid item>
            <Budget
              title="COMMANDES"
              body={order_amount}
              pro={pro_amount + '%'}
              tail={budget_period}
              income={income_amount.count}
              color={income_amount.color}
              avatar="/images/order_amount.png"
            />
          </Grid>
          <Grid item>
            <Budget
              title="REVENUS"
              body={order_price + "€ HT"}
              pro={pro_price + '%'}
              tail={budget_period}
              income={income_price.price}
              color={income_price.color}
              avatar="/images/order_price.png"
            />
          </Grid>
        </Grid>
        <Grid item sm={4} container alignItems="stretch" >
          <LatestSales data={charts} />
        </Grid>
        <Grid item sm={4} container alignItems="stretch">
          <CurveChart data={charts} />
        </Grid>
      </Grid>
      <Grid item style={{ marginTop: 48 }}>
        <MyButton name={"Exporter les factures"} color={"1"} onClick={handleClickExport} />
      </Grid>
      <Grid item>
        <OrderTable
          onChangeSelect={handleChangeSelect}
          onChangePage={handleChangePagination}
          onSelectSort={handleSort}
          page={page_num}
          columns={columns}
          products={dataList}
          totalpage={totalpage}
          cells={cellList}
          onClickEdit={handleClickEdit}
          onClickDelete={handleClickDelete}
          onClickDownload={handleClickDownload}
          access={accessOrders}
        />
      </Grid>
      <DeleteConfirmDialog
        openDelete={openDelete}
        handleCloseDelete={handleCloseDelete}
        handleDelete={handleDelete}
        account={'product'}
      />
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </Grid>
  );
};

export default withRouter(OrdersOwner);
