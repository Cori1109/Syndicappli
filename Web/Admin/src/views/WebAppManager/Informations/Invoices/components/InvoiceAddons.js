import React, { useState, useEffect } from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import InvoiceTable from '../../../../../components/InvoiceTable';
import MySelect from '../../../../../components/MySelect';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router-dom';
import authService from '../../../../../services/authService.js';
import { makeStyles } from '@material-ui/styles';
import { ManagerService as Service } from 'services/api';
import CircularProgress from '@material-ui/core/CircularProgress';
const ManagerService = new Service();
const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('xl')]: {
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(4),
    },
    [theme.breakpoints.down('lg')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(2),
    },
  },
  title: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  titleText: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 35
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 25
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 18
    },
  },
  tool: {
    paddingTop: 30,
    paddingBottom: 65,
    [theme.breakpoints.up('xl')]: {
      minHeight: 60
    },
    [theme.breakpoints.down('lg')]: {
      minHeight: 42
    },
    [theme.breakpoints.down('md')]: {
      minHeight: 29
    },
  },
  div_indicator: {
    width: '100%',
    height: '100%',
    display: 'flex',
    position: 'fixed',
    paddingLeft: '50%',
    alignItems: 'center',
    marginTop: '-60px',
    zIndex: 999,
  },
  indicator: {
    color: 'gray'
  },
  close: {
    cursor: 'pointer',
    color: 'gray'
  }
}));
const InvoiceAddons = (props) => {
  const { history } = props;
  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }

  const classes = useStyles();
  const accessInvoices = authService.getAccess('role_invoices');
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const [dataList, setDataList] = useState([]);
  const [building, setBuilding] = useState(0);
  const [buildings, setBuildings] = useState(['']);
  const [buildingID, setBuildingID] = useState(-2);
  const [companyID, setCompanyID] = useState(-1);
  const [buildingList, setBuildingList] = useState(['']);
  const cellList = [
    { key: 'product_name', field: 'Produit' },
    { key: 'building_name', field: 'Immeuble' },
    { key: 'start_date', field: 'Date' },
    { key: 'total_amount', field: 'Montant' },
  ];
  const handleClickDownload = (id) => {
    let requestDate = {
      'orderID': id,
    }
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let date1 = new Date().getDate();
    let date = year + '_' + month + '_' + date1;
    setVisibleIndicator(true);
    ManagerService.downloadInvoiceAddon(requestDate)
      .then(
        ({ data }) => {
          setVisibleIndicator(false);
          const downloadUrl = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', 'Invoice'+ id +'(' + date + ').pdf');
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
      );
  }
  useEffect(() => {
    if (accessInvoices !== 'denied') {
      getCompanies();
    }
  }, [accessInvoices]);
  useEffect(() => {
    if (companyID !== -1)
      getBuildings();
  }, [companyID]);
  useEffect(() => {
    if (accessInvoices !== 'denied') {
      if (companyID !== -1)
        getInvoices();
    }
  }, [buildingID]);
  const getInvoices = () => {
    let requestDate = {
      'companyID': companyID,
      'buildingID': buildingID
    }
    setVisibleIndicator(true);
    ManagerService.getInvoiceAddon(requestDate)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              let list = data.invoice;
              for (let i = 0; i < list.length; i++) {
                list[i].total_amount = list[i].total_amount + '€ HT';
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
              buildings.push('Tout');
              localStorage.setItem("token", JSON.stringify(data.token));
              data.buildinglist.map((item) => (
                buildings.push(item.name)
              )
              );
              setBuildingList([{ 'buildingID': -1 }, ...data.buildinglist]);
              if (data.buildinglist.length !== 0) {
                setBuildings(buildings);
                setBuildingID(-1);
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
  const handleChangeBuilding = (val) => {
    setBuilding(val);
    setBuildingID(buildingList[val].buildingID);
  }
  return (
    <div>
      {
        visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
      }
      <div className={classes.tool}>
        <Grid xs={6} sm={5} md={4} lg={3} xl={2} item container alignItems="center" spacing={2}>
          <Grid item ><p className={classes.subTitle}>Immeuble</p></Grid>
          <Grid xs item container direction="row-reverse">
            <Grid item container direction="column" alignItems="stretch">
              <MySelect
                color="gray"
                data={buildings}
                onChangeSelect={handleChangeBuilding}
                value={building}
              />
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className={classes.body}>
        <InvoiceTable
          products={dataList}
          cells={cellList}
          onClickDownload={handleClickDownload}
          columns={4}
        />
      </div>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(InvoiceAddons);
