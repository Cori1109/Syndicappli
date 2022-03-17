import React, { useState, useEffect } from 'react';
import {ToastsContainer, ToastsContainerPosition, ToastsStore} from 'react-toasts';
import InvoiceTable from '../../../../components/InvoiceTable';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {  withRouter } from 'react-router-dom';
import authService from '../../../../services/authService.js';
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

  close: {
    cursor: 'pointer',
    color: 'gray'
  }
}));
const Invoices = (props) => {
  const {history}=props;
  const token = authService.getToken();    
  if (!token) {
    window.location.replace("/login");
  }
 
  const classes = useStyles();
  const [dataList, setDataList] = useState([]);
  const cellList = [ 
    {key : 'addon_name' , field : 'Module'}, 
    {key : 'purchase_date' , field : 'Date'},
    {key : 'addon_price' , field : 'Montant'},
  ];
  const handleClickEdit = (id) => {
    console.log(id);
    // history.push('/manager/buildings/edit/'+id);
  }

  useEffect(() => {
    getDataList();
  }, []);
  const getDataList = () => {
    setDataList([
      { ID: 1, addon_name: 'Je délègue mon pouvoir', purchase_date: '12/03/2020', addon_price: '4.90€ TTC'},
      { ID: 21, addon_name: 'Je délègue mon pouvoir', purchase_date: '12/03/2020', addon_price: '4.90€ TTC'},
      { ID: 23, addon_name: 'Participer à une Assemblée Générale à distance', purchase_date: '12/03/2020', addon_price: '4.90€ TTC'},
    ])
  }


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
      </div> 
      <div className={classes.body}>
        <Grid item container  spacing={2} xs={12} sm={8} md={8} lg={8} xl={6}>
          <InvoiceTable 
            products={dataList} 
            cells={cellList} 
            onClickEdit={handleClickEdit}
          />
        </Grid>
      </div>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT}/>
    </div>
  );
};

export default withRouter(Invoices);
