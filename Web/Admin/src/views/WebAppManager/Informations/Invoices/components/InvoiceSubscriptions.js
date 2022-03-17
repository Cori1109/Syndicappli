import React, { useState, useEffect } from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import InvoiceTable from '../../../../../components/InvoiceTable';
import { withRouter } from 'react-router-dom';
import authService from '../../../../../services/authService.js';
import { makeStyles } from '@material-ui/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ManagerService as Service } from 'services/api';

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
  tool: {
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
const InvoiceSubscriptions = (props) => {
  const { history } = props;
  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }

  const classes = useStyles();
  const accessInvoices = authService.getAccess('role_invoices');
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const [dataList, setDataList] = useState([]);
  const [companyID, setCompanyID] = useState(-1);
  const cellList = [
    { key: 'product_name', field: 'Produit' },
    { key: 'apartment_amount', field: 'Nombre de lots' },
    { key: 'price', field: 'Prix par lot' },
    { key: 'start_date', field: 'Date' },
    { key: 'total_amount', field: 'Montant' },
  ];
  const handleClickDownload = (id) => {
    let requestDate = {
      'orderID': id
    }
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let date1 = new Date().getDate();
    let date = year + '_' + month + '_' + date1;
    setVisibleIndicator(true);
    ManagerService.downloadInvoiceSubscription(requestDate)
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
  useEffect(() => {
    if (accessInvoices !== 'denied') {
      getCompanies();
    }
  }, [accessInvoices]);
  useEffect(() => {
    if (companyID !== -1)
      getInvoices();
  }, [companyID]);
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
  const getInvoices = () => {
    let requestDate = {
      'companyID': companyID
    }
    setVisibleIndicator(true);
    ManagerService.getInvoiceSubscription(requestDate)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              let list = data.invoicelist;
              for (let i = 0; i < list.length; i++) {
                list[i].price = list[i].price + '€ HT';
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
  return (
    <div>
      {
        visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
      }
      <div className={classes.tool}>
      </div>
      <InvoiceTable
        products={dataList}
        cells={cellList}
        onClickDownload={handleClickDownload}
        columns={5}
      />
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(InvoiceSubscriptions);
