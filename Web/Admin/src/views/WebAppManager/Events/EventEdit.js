import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import authService from '../../../services/authService.js';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { ManagerService as Service } from '../../../services/api.js';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import { EditEventStyles as useStyles } from './useStyles';
import Informations from './Informations';
import Documents from './Documents';
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
const ManagerService = new Service();
const EventEdit = (props) => {
  const { history } = props;
  const classes = useStyles();
  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const [title, steTitle] = useState('Fête des Voisins');
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClick = () => {
    history.goBack();
  };
  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Grid item container justify="space-around" alignItems="center">
          <Grid item xs={12} sm={6} container justify="flex-start" >
            <Grid item>
              <Typography variant="h2" className={classes.headerTitle}>
                <b>{title}</b>
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6} container justify="flex-end" >
          </Grid>
        </Grid>
      </div>
      <div className={classes.tool}>
          <Grid item>
            <p onClick={handleClick} className={classes.backTitle}>&lt; Retour à la liste des Événements</p>
          </Grid>
        <Tabs value={value} onChange={handleChange}
          TabIndicatorProps={{
            style: {
              width: 0
            }
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab xs={12} sm={4} label="Informations" {...a11yProps(0)} disableRipple />
          <Tab xs={12} sm={4} label="Documents" {...a11yProps(1)} disableRipple />
        </Tabs>
      </div>
      <div >
        <TabPanel value={value} index={0}>
          <Informations />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Documents />
        </TabPanel>
      </div>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(EventEdit);
