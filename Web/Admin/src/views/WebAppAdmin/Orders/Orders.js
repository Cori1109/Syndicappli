import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MyButton from '../../../components/MyButton';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import AddOrder from './AddOrder';
import { withRouter } from 'react-router-dom';
import authService from '../../../services/authService.js';
import useStyles from './useStyles';
import OrdersManager from './components/OrdersManager';
import OrdersOwner from './components/OrdersOwner';
import OrdersBuilding from './components/OrdersBuilding';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import AdminService from 'services/api.js';
import useGlobal from 'Global/global';
import TrashOrders from './TrashOrders';
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box >
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
const Orders = (props) => {
  const { history } = props;

  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const accessOrders = authService.getAccess('role_orders');
  const [globalState, globalActions] = useGlobal();
  const [openDelete, setOpenDelete] = React.useState(false);
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleAdd = () => {
    ToastsStore.success("Added New Order successfully!");
    setRefresh(!refresh);
  };
  const handleClickAdd = () => {
    if (accessOrders === 'edit') {
      setOpen(true);
    }
  };
  const handleClickEmptyTrashOrder = () => {
    if (globalState.trash.type === 'order' && globalState.trash.ID.length != 0)
      setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleDelete = () => {
    handleCloseDelete();
    setVisibleIndicator(true);
    let data = {
      'status': 'trash',
      'list': globalState.trash.ID
    }
    AdminService.emptyTrashOrder(data)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              ToastsStore.success("Deleted Successfully!");
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              setRefresh(!refresh);
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
      {
        visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
      }
      <div className={classes.title}>
        <Grid item container justify="space-around" alignItems="center">
          <Grid item xs={12} sm={6} container justify="flex-start" >
            <Grid item>
              <Typography variant="h2" className={classes.titleText}>
                <b>Mes Commandes</b>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} container justify="flex-end" >
            <Grid>
              <MyButton
                name={value !== 3 ? "Nouvelle Commande" : "Vider la Poubelle"}
                color={"1"}
                onClick={value !== 3 ? handleClickAdd : handleClickEmptyTrashOrder}
                style={{ visibility: accessOrders === 'edit' ? 'visible' : 'hidden' }}
              />
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                classes={{ paper: classes.paper }}
              >
                <Grid item container className={classes.padding} justify="space-between">
                  <Grid item container direction="row-reverse"><CloseIcon onClick={handleClose} className={classes.close} /></Grid>
                  <Grid><h2 id="transition-modal-title" className={classes.modalTitle}>Nouvelle Commande</h2></Grid>
                </Grid>
                <AddOrder onCancel={handleClose} onAdd={handleAdd} />
              </Dialog>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className={classes.tool}>
        <Tabs value={value} onChange={handleChange}
          TabIndicatorProps={{
            style: {
              width: 0
            }
          }}
        >
          <Tab xs={12} sm={4} label="Gestionnaires" {...a11yProps(0)} className={classes.tabTitle} disableRipple />
          <Tab xs={12} sm={4} label="Copropriétaires" {...a11yProps(1)} className={classes.tabTitle} disableRipple />
          <Tab xs={12} sm={4} label="Immeubles" {...a11yProps(2)} className={classes.tabTitle} disableRipple />
          <Tab xs={12} sm={4} label="Poubelle" {...a11yProps(3)} className={classes.tabTitle} disableRipple />
        </Tabs>
      </div>
      <div className={classes.body}>
        <TabPanel value={value} index={0}>
          <OrdersManager refresh={refresh} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <OrdersOwner refresh={refresh} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <OrdersBuilding refresh={refresh} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <TrashOrders refresh={refresh} />
        </TabPanel>
      </div>
      <DeleteConfirmDialog
        openDelete={openDelete}
        handleCloseDelete={handleCloseDelete}
        handleDelete={handleDelete}
        account={'order'}
      />
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(Orders);
