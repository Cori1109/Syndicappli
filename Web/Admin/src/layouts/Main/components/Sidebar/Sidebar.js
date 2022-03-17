import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {  Drawer } from '@material-ui/core';
import authService from '../../../../services/authService.js';
import { Profile, SidebarNav, UpgradePlan } from './components';

const useStyles = makeStyles(theme => ({
  drawer: {
    [theme.breakpoints.up('xl')]: {
      width: 333,
    },
    [theme.breakpoints.between('lg','lg')]: {
      width: 233,
    },
    [theme.breakpoints.down('md')]: {
      width: 163,
    },
    background:'transparent',
    borderTopRightRadius: 15,
    borderRight: 'none'
    // [theme.breakpoints.between('sm','sm')]: {
    //   width: 114,
    // },
    // [theme.breakpoints.down('sm')]: {
    //   width: 80,
    // },
  },
  icon: {
    '&:hover,&:focus': {
      // backgroundColor: 'white',
      color:'#00bf82',
    },
    [theme.breakpoints.up('xl')]: {
      width: 24,
      height: 24,
    },
    [theme.breakpoints.between('lg','lg')]: {
      width: 17,
      height: 17,
    },
    [theme.breakpoints.down('md')]: {
      width: 12,
      height: 12,
    },
    display: 'flex',
    alignItems: 'center',
    marginRight: theme.spacing(2)
  },
  root: {
    background: 'linear-gradient(0deg, #00C9FF 30%, #0CC77C 100%)',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    overflowX: 'hidden',
    justifyContent: 'space-between',
  },
  divider: {
    margin: theme.spacing(2, 0)
  },
  nav: {
    marginBottom: theme.spacing(2)
  }
}));

const Sidebar = props => {
  const { open, variant, onClose, className, ...rest } = props;

  const classes = useStyles();
  const usertype = authService.getAccess('usertype');  
  const accessUsers = authService.getAccess('role_users');  
  const accessCompanies = authService.getAccess('role_companies'); 
  const accessBuildings = authService.getAccess('role_buildings'); 
  const accessDiscountCodes = authService.getAccess('role_discountcodes'); 
  const accessOwners = authService.getAccess('role_owners'); 
  const accessProducts = authService.getAccess('role_products'); 
  const accessManagers = authService.getAccess('role_managers'); 
  const accessOrders = authService.getAccess('role_orders'); 
  const accessChat = authService.getAccess('role_chat'); 
  const accessInvoices = authService.getAccess('role_invoices'); 
  const accessEvents = authService.getAccess('role_events');   
  const accessProviders = authService.getAccess('role_providers'); 
  const accessIncidents = authService.getAccess('role_incidents'); 
  const accessAddons = authService.getAccess('role_addons');   
  const accessCompany = authService.getAccess('role_company'); 
  const accessAssemblies = authService.getAccess('role_assemblies'); 
  const accessTeam = authService.getAccess('role_team');   
  const accessAdvertisement = authService.getAccess('role_advertisement'); 
  const accessPayments = authService.getAccess('role_payments'); 

  const admin_pages = [
    {
      title: 'Accueil',
      href: '/admin/dashboard',
      activeIcon: <img src='/images/ic_home_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_home_inactive.png' className={classes.icon}/>,
      id:0,
      status: 'visible'
    },
    {
      title: 'Mes Cabinets',
      href: '/admin/companies',
      activeIcon: <img src='/images/ic_company_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_company_inactive.png' className={classes.icon}/>,
      id:1,
      status: accessCompanies
    },
    {
      title: 'Mes Gestionnaires',
      href: '/admin/managers',
      activeIcon: <img src='/images/ic_manager_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_manager_inactive.png' className={classes.icon}/>,
      id:2,
      status: accessManagers
    },
    {
      title: 'Mes Immeubles',
      href: '/admin/buildings',
      activeIcon: <img src='/images/ic_building_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_building_inactive.png' className={classes.icon}/>,
      id:3,
      status: accessBuildings
    },
    {
      title: 'Mes Copropriétaires',
      href: '/admin/owners',
      activeIcon: <img src='/images/ic_owner_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_owner_inactive.png' className={classes.icon}/>,
      id:4,
      status: accessOwners
    },
    {
      title: 'Mes Commandes',
      href: '/admin/orders',
      activeIcon: <img src='/images/ic_order_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_order_inactive.png' className={classes.icon}/>,
      id:5,
      status: accessOrders
    },
    {
      title: 'Mes produits',
      href: '/admin/products',
      activeIcon: <img src='/images/ic_product_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_product_inactive.png' className={classes.icon}/>,
      id:6,
      status: accessProducts
    },
    {
      title: 'Mes Codes Promo',
      href: '/admin/discountcodes',
      activeIcon: <img src='/images/ic_discountcode_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_discountcode_inactive.png' className={classes.icon}/>,
      id:7,
      status: accessDiscountCodes
    },
    {
      title: 'Mes Utilisateurs',
      href: '/admin/users',
      activeIcon: <img src='/images/ic_user_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_user_inactive.png' className={classes.icon}/>,
      id:8,
      status: accessUsers
    },
  ];
  
  const manager_pages = [
    {
      title: 'Accueil',
      href: '/manager/dashboard',
      activeIcon: <img src='/images/ic_home_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_home_inactive.png' className={classes.icon}/>,
      id:0,
      status: 'visible',
    },
    {
      title: 'Mes immeubles',
      href: '/manager/buildings',
      activeIcon: <img src='/images/ic_building_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_building_inactive.png' className={classes.icon}/>,
      id:1,
      status: accessBuildings
    },
    {
      title: 'Mes Copropriétaires',
      href: '/manager/owners',
      activeIcon: <img src='/images/ic_owner_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_owner_inactive.png' className={classes.icon}/>,
      id:2,
      status: accessOwners
    },
    {
      title: 'Messagerie',
      href: '/manager/chat',
      activeIcon: <img src='/images/ic_chat_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_chat_inactive.png' className={classes.icon}/>,
      id:3,
      status: accessChat
    },
    {
      title: 'Incidents',
      href: '/manager/incidents',
      activeIcon: <img src='/images/ic_incident_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_incident_inactive.png' className={classes.icon}/>,
      id:4,
      status: accessIncidents
    },
    {
      title: 'Assemblées',
      href: '/manager/assemblies',
      activeIcon: <img src='/images/ic_user_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_user_inactive.png' className={classes.icon}/>,
      id:5,
      status: accessAssemblies
    },
    {
      title: 'Événements',
      href: '/manager/events',
      activeIcon: <img src='/images/ic_event_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_event_inactive.png' className={classes.icon}/>,
      id:6,
      status: accessEvents
    },
    {
      title: 'Mon équipe',
      href: '/manager/team',
      activeIcon: <img src='/images/ic_manager_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_manager_inactive.png' className={classes.icon}/>,
      id:7,
      status: accessTeam
    },
    {
      title: 'Mes prestataires',
      href: '/manager/providers',
      activeIcon: <img src='/images/ic_provider_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_provider_inactive.png' className={classes.icon}/>,
      id:8,
      status: accessProviders
    },
    {
      title: 'Annonces',
      href: '/manager/announcements',
      activeIcon: <img src='/images/ic_announce_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_announce_inactive.png' className={classes.icon}/>,
      id:9,
      status: accessAdvertisement
    },
    {
      title: 'Modules',
      href: '/manager/addons',
      activeIcon: <img src='/images/ic_product_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_product_inactive.png' className={classes.icon}/>,
      id:10,
      status: accessAddons
    },
  ];
  const owner_pages = [
    {
      title: 'Accueil',
      href: '/owner/dashboard',
      activeIcon: <img src='/images/ic_home_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_home_inactive.png' className={classes.icon}/>,
      id:0,
      status: 'visible'
    },
    {
      title: 'Messagerie',
      href: '/owner/chat',
      activeIcon: <img src='/images/ic_chat_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_chat_inactive.png' className={classes.icon}/>,
      id:1,
      status: accessChat
    },
    {
      title: 'Incidents',
      href: '/owner/incidents',
      activeIcon: <img src='/images/ic_incident_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_incident_inactive.png' className={classes.icon}/>,
      id:2,
      status: accessIncidents
    },
    {
      title: 'Assemblées',
      href: '/owner/assemblies',
      activeIcon: <img src='/images/ic_user_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_user_inactive.png' className={classes.icon}/>,
      id:3,
      status: accessAssemblies
    },
    {
      title: 'Événements',
      href: '/owner/events',
      activeIcon: <img src='/images/ic_event_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_event_inactive.png' className={classes.icon}/>,
      id:4,
      status: accessEvents
    },
    {
      title: 'Modules',
      href: '/owner/addons',
      activeIcon: <img src='/images/ic_product_active.png' className={classes.icon}/>,
      inactiveIcon:<img src='/images/ic_product_inactive.png' className={classes.icon}/>,
      id:5,
      status: accessAddons
    },
  ];
  return (
    <Drawer
      anchor="left"
      classes={{ paper: classes.drawer }}
      onClose={onClose}
      open={open}
      variant={variant}
    >

      <div
        {...rest}
        className={clsx(classes.root, className)}
      >
        <div>
          <Profile />
          <SidebarNav
            className={classes.nav}
            pages={usertype === 'manager' ? manager_pages : 
                  usertype === 'owner' ? owner_pages : 
                  usertype === 'admin' ? admin_pages :
                  usertype === 'superadmin' ? admin_pages :
                  null
                }
          />
        </div>
        <UpgradePlan />
      </div>
    </Drawer>
  );
};

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired
};

export default Sidebar;
