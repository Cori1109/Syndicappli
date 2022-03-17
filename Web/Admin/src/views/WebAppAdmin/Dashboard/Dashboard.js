import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import MySelect from '../../../components/MySelect';
import {
  Budget,
  LatestSales,
} from './components';
import CurveChart from './components/CurveChart';
import authService from '../../../services/authService.js';
import useStyles from './useStyles';
const Dashboard = (props) => {
  const { history } = props;
  const classes = useStyles();
  const cellList = [20, 50, 100, 200];
  const incomeDirection = 2;
  const incomeColor = "#FC5555";//#2DCE9C
  // const token = authService.getToken();
  // if (!token) {
  //   history.push("/login");
  //   window.location.reload();
  // }
  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Grid item xs={12} sm={6} container>
          <Grid item>
            <Typography variant="h2" className={classes.titleText}>
              <b>Accueil</b>
            </Typography>
          </Grid>
        </Grid>
      </div>
      <div className={classes.tool}>
        <Grid container spacing={6} direction="row-reverse" >
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
        </Grid>
      </div>
      <div className={classes.body}>
        <Grid container direction="column" spacing={3}>
          <Grid item
            container
            justify="space-between"
          >
            <Grid item sm={3} container direction="column" spacing={3}>
              <Grid item>
                <Budget title="COMMANDES" body="924" pro="3.48%" tail="en 1 mois" income={2} color={"#2DCE9C"} />
              </Grid>
              <Grid item>
                <Budget title="REVENUS" body="53 456€ HT" pro="1.17%" tail="en 1 mois" income={1} color={"#FC5555"} />
              </Grid>
            </Grid>
            <Grid item sm={4} container alignItems="stretch" >
              <LatestSales />
            </Grid>
            <Grid item sm={4} container alignItems="stretch">
              <CurveChart />
            </Grid>
          </Grid>
          <Grid item container justify="space-evenly" spacing={2}>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <Budget title="CABINETS" body="924" pro="3.48%" tail="en 1 mois" income={2} color={"#2DCE9C"} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <Budget title="GESTIONNAIRES" body="924" pro="3.48%" tail="en 1 mois" income={2} color={"#2DCE9C"} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <Budget title="IMMEUBLES" body="924" pro="3.48%" tail="en 1 mois" income={2} color={"#2DCE9C"} />
            </Grid>
            <Grid item lg={3} sm={6} xl={3} xs={12}>
              <Budget title="Copropriétaires" body="924" pro="3.48%" tail="en 1 mois" income={2} color={"#2DCE9C"} />
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default Dashboard;
