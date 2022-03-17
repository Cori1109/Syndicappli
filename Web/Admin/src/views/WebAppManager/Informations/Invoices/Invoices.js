import React, { useState} from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withRouter } from 'react-router-dom';
import authService from '../../../../services/authService.js';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import InvoiceSubscriptions from './components/InvoiceSubscriptions';
import InvoiceAddons from './components/InvoiceAddons';
import { makeStyles } from '@material-ui/styles';

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
    '& .MuiTab-root':{
      paddingLeft: 0,
      paddingRight: 30,
      minWidth: 0,
      fontWeight:'bold'
    },
    '& .MuiTab-wrapper':{
      flexDirection: 'row',
      justifyContent: 'flex-start',
      textTransform: 'none',
      color: '#363636',
      [theme.breakpoints.up('xl')]: {
        fontSize :20
      },
      [theme.breakpoints.down('lg')]: {
        fontSize :14
      },
      [theme.breakpoints.down('md')]: {
        fontSize :10
      },
    },
    '& .MuiTab-textColorInherit.Mui-selected':{
      textDecoration: 'underline',
      textUnderlinePosition: 'under'
    },
  },
  title:{
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  titleText: {
    [theme.breakpoints.up('xl')]: {
      fontSize :35
    },
    [theme.breakpoints.down('lg')]: {
      fontSize :25
    },
    [theme.breakpoints.down('md')]: {
      fontSize :18
    },
  },
  tabTitle: {
    [theme.breakpoints.up('xl')]: {
      fontSize :20
    },
    [theme.breakpoints.down('lg')]: {
      fontSize :14
    },
    [theme.breakpoints.down('md')]: {
      fontSize :10
    },
  },
  modalTitle: {
    [theme.breakpoints.up('xl')]: {
      fontSize :28
    },
    [theme.breakpoints.down('lg')]: {
      fontSize :20
    },
    [theme.breakpoints.down('md')]: {
      fontSize :14
    },
  },
  tool: {
    [theme.breakpoints.up('xl')]: {
      minHeight: 67
    },
    [theme.breakpoints.down('lg')]: {
      minHeight: 47
    },
    [theme.breakpoints.down('md')]: {
      minHeight: 33
    },
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  padding: {
    padding: theme.spacing(2, 4, 3),
  },
  close: {
    cursor: 'pointer',
    color: 'gray'
  }
}));
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
const Invoices = (props) => {
  const {history} = props;

  const token = authService.getToken();    
  if (!token) {
    window.location.replace("/login");
  }
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const accessProducts = authService.getAccess('role_products');
  const [openDialog, setOpenDialog] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const [deleteId,setDeleteId] = useState(-1);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleAdd = ()=>{

  };
  const handleClickAdd = ()=>{
    if(accessProducts === 'edit'){
      setOpen(true);
    }
    if(accessProducts === 'see'){
      setOpenDialog(true);
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Grid item xs={12} sm={6} container justify="flex-start" >
          <Grid item>
            <Typography variant="h2" className={classes.titleText}>
              <b>Mes Factures</b>
            </Typography>
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
          <Tab xs={12} sm={4} label="Mon abonnement" {...a11yProps(0)} className={classes.tabTitle} disableRipple/>
          <Tab xs={12} sm={4} label="Mes modules" {...a11yProps(1)} className={classes.tabTitle} disableRipple/>
        </Tabs>
      </div> 
      <div className={classes.body}>
        <TabPanel value={value} index={0}>
          <InvoiceSubscriptions />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <InvoiceAddons />
        </TabPanel>
      </div>
    </div>
  );
};

export default withRouter(Invoices);
