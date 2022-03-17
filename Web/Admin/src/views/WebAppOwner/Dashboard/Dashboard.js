import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import MySelect from 'components/MySelect';
import {
  Budget,
  LatestSales,
} from './components';
import CurveChart from './components/CurveChart';
import authService from 'services/authService.js';
import useStyles from './useStyles';
const Dashboard = (props) => {
  const{history} = props;
  const classes = useStyles();
  const cellList = [20, 50, 100, 200];
  const incomeDirection = 2;
  const incomeColor = "#FC5555";//#2DCE9C
  const token = authService.getToken();    
  if (!token) {
    window.location.replace("/login");
  }
  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Grid item container justify="space-around">
          <Grid item xs={12} sm={6} container justify="flex-start" >
            <Grid item>
              <Typography variant="h2" className={classes.titleText}>
                <b>Accueil</b>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} container justify="flex-end" ></Grid>
        </Grid>
      </div>
      <div className={classes.tool}>
      {/* <Grid container spacing={2} direction="row-reverse" >
        <Grid item>
          <MySelect 
            color="gray" 
            width="239px" 
            data={cellList}
            />
        </Grid>
        <Grid item>
          <MySelect 
            color="gray" 
            width="239px" 
            data={cellList}
          />
        </Grid>
        <Grid item>
          <MySelect 
            color="gray" 
            width="239px" 
            data={cellList}
          />
        </Grid>
        <Grid item>
          <MySelect 
            color="gray" 
            width="239px" 
            data={cellList}
          />
        </Grid>
      </Grid> */}
      </div> 
      <div className={classes.body}>
        <Grid item container spacing={6}>
          <Grid item
            container
            direction="row"
            spacing={6}
          >
            <Grid item lg={3} container direction="column" justify="space-between">
              <Grid item>
                <Budget title="COMMANDES" body="924" pro="3.48%" tail="en 1 mois" income={2} color={"#2DCE9C"}/>
              </Grid>
              <Grid item>
              <Budget title="REVENUS" body="53 456€ HT" pro="1.17%" tail="en 1 mois" income={1} color={"#FC5555"}/>
              </Grid>
            </Grid>
            <Grid item container lg={9} direction="row" justify="space-evenly" spacing={2}>
              <Grid item lg={6} sm={6} xl={6} >
                <LatestSales />
              </Grid>
              <Grid item lg={6} sm={6} xl={6}>
                <CurveChart />
              </Grid>
            </Grid>
          </Grid>
          <Grid item container justify="space-evenly" spacing={2}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Budget title="CABINETS" body="924" pro="3.48%" tail="en 1 mois" income={2} color={"#2DCE9C"}/>
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Budget title="GESTIONNAIRES" body="924" pro="3.48%" tail="en 1 mois" income={2} color={"#2DCE9C"}/>
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Budget title="IMMEUBLES" body="924" pro="3.48%" tail="en 1 mois" income={2} color={"#2DCE9C"}/>
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
            <Budget title="Copropriétaires" body="924" pro="3.48%" tail="en 1 mois" income={2} color={"#2DCE9C"}/>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
