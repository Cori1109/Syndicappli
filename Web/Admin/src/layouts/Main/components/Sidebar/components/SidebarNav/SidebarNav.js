import React, { forwardRef, useState } from 'react';
import { NavLink as RouterLink } from 'react-router-dom';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { List, ListItem, Button } from '@material-ui/core';
import {withRouter} from 'react-router-dom';
const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('xl')]: {
      marginLeft: '24px',
      marginRight: '-10px',
    },
    [theme.breakpoints.between('lg', 'lg')]: {
      marginLeft: '17px',
      marginRight: '-7px',
    },
    [theme.breakpoints.down('md')]: {
      marginLeft: '12px',
      marginRight: '-5px',
    },
    paddingTop: '0'
  },
  item: {
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
  },
  button: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 20,
      height: 67,
      borderTopLeftRadius: 15,
      borderBottomLeftRadius: 15,
      padding: '10px 0px 8px 24px',
    },
    [theme.breakpoints.between('lg', 'lg')]: {
      fontSize: 14,
      height: 47,
      borderTopLeftRadius: 11,
      borderBottomLeftRadius: 11,
      padding: '7px 0px 6px 17px',
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 10,
      height: 33,
      borderTopLeftRadius: 8,
      borderBottomLeftRadius: 8,
      padding: '5px 0px 4px 12px',
    },
    color: 'white',
    '&:hover': {
      backgroundImage: 'url("/images/background.png")',
      color: '#00bf82',
      '& $icon': {
        color: '#00bf82'
      },
      '&::before': {
        [theme.breakpoints.up('xl')]: {
          width: 15,
          height: 15,
          top: -15,
          right: 10,
        },
        [theme.breakpoints.between('lg', 'lg')]: {
          width: 10,
          height: 10,
          top: -10,
          right: 7,
        },
        [theme.breakpoints.down('md')]: {
          width: 10,
          height: 10,
          top: -10,
          right: 5,
        },
        display: 'block',
        position: 'absolute',
        content: 'url("")',
        backgroundImage: 'url("/images/top.png")',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      },
      '&::after': {
        [theme.breakpoints.up('xl')]: {
          width: 15,
          height: 15,
          bottom: -15,
          right: 10,
        },
        [theme.breakpoints.between('lg', 'lg')]: {
          width: 10,
          height: 10,
          bottom: -10,
          right: 7,
        },
        [theme.breakpoints.down('md')]: {
          width: 10,
          height: 10,
          bottom: -10,
          right: 5,
        },
        display: 'block',
        position: 'absolute',
        content: 'url("")',
        backgroundImage: 'url("/images/bottom.png")',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat'
      }
    },
    justifyContent: 'flex-start',
    textTransform: 'none',
    letterSpacing: 0,
    width: '100%',
  },
  active: {
    // backgroundColor: 'white',
    color: '#00bf82',
    backgroundImage: 'url("/images/background.png")',
    '& $icon': {
      color: '#00bf82'
    },
    '&::before': {
      [theme.breakpoints.up('xl')]: {
        width: 15,
        height: 15,
        top: -15,
        right: 10,
      },
      [theme.breakpoints.between('lg', 'lg')]: {
        width: 10,
        height: 10,
        top: -10,
        right: 7,
      },
      [theme.breakpoints.down('md')]: {
        width: 10,
        height: 10,
        top: -10,
        right: 5,
      },
      display: 'block',
      position: 'absolute',
      content: 'url("")',
      backgroundImage: 'url("/images/top.png")',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    },
    '&::after': {
      [theme.breakpoints.up('xl')]: {
        width: 15,
        height: 15,
        bottom: -15,
        right: 10,
      },
      [theme.breakpoints.between('lg', 'lg')]: {
        width: 10,
        height: 10,
        bottom: -10,
        right: 7,
      },
      [theme.breakpoints.down('md')]: {
        width: 10,
        height: 10,
        bottom: -10,
        right: 5,
      },
      display: 'block',
      position: 'absolute',
      content: 'url("")',
      backgroundImage: 'url("/images/bottom.png")',
      backgroundPosition: 'center',
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat'
    }
  }
}));

const CustomRouterLink = forwardRef((props, ref) => (
  <div
    ref={ref}
    style={{ flexGrow: 1 }}
  >
    <RouterLink {...props} />
  </div>
));

const SidebarNav = props => {
  const { pages, className } = props;
  const {history} = props;
  const classes = useStyles();

  let current_url = new URL(window.location.href);
  let path_name = current_url.pathname;
  let path = path_name.split("/");
  let i = 0;
  switch(path[1]){
    case 'admin' :
      switch(path[2]){
        case 'dashboard' : i = 0; break;
        case 'companies' : i = 1; break;
        case 'managers' : i = 2; break;
        case 'buildings' : i = 3; break;
        case 'owners' : i = 4; break;
        case 'orders' : i = 5; break;
        case 'products' : i = 6; break;
        case 'discountcodes' : i = 7; break;
        case 'users' : i = 8; break;
        default : i = -1; break;
      }
      localStorage.setItem("select", JSON.stringify(i));
      break;
    case 'manager' :
      switch(path[2]){
        case 'dashboard' : i = 0; break;
        case 'buildings' : i = 1; break;
        case 'owners' : i = 2; break;
        case 'chat' : i = 3; break;
        case 'incidents' : i = 4; break;
        case 'assemblies' : i = 5; break;
        case 'events' : i = 6; break;
        case 'team' : i = 7; break;
        case 'providers' : i = 8; break;
        case 'announcements' : i = 9; break;
        case 'addons' : i = 10; break;
        default : i = -1; break;
      }
      localStorage.setItem("select", JSON.stringify(i));
      break;
    case 'owner' :
      switch(path[2]){
        case 'dashboard' : i = 0; break;
        case 'chat' : i = 1; break;
        case 'incidents' : i = 2; break;
        case 'assemblies' : i = 3; break;
        case 'events' : i = 4; break;
        case 'addons' : i = 5; break;
        default : i = -1; break;
      }
      localStorage.setItem("select", JSON.stringify(i));
      break;
  }

  let select = JSON.parse(localStorage.getItem('select'));
  let tmp = [];
  for (let k = 0; k < 12; k++) {
    tmp[k] = { active: false, over: false };
  }
  tmp[select] = { active: true, over: true };
  const [status, setStatus] = useState(tmp);
  window.addEventListener('popstate', function (event) {
    // for (let k = 0; k < 12; k++) {
    //   tmp[k] = { active: false, over: false };
    // }
    // setStatus(tmp);
    tmp[select] = { active: true, over: true };
    setStatus(tmp);
    window.location.reload()
  });
  const handleMouseOver = (event, id, state) => {
    if (state[id].active === false)
      if (state[id].over === false) {
        setStatus(status.map(
          (status, index) =>
            index === id ?
              {
                ...status,
                over: true
              } :
              status
        ))
      }
  }
  const handleMouseLeave = (event, id, state) => {
    if (state[id].active === false)
      if (state[id].over === true) {
        setStatus(status.map(
          (status, index) =>
            index === id ?
              {
                ...status,
                over: false
              } :
              status
        ))
      }
  }
  const handleMouseClick = (event, id, state) => {
    localStorage.setItem("select", JSON.stringify(id));
    if (state[id].active === false) {
      setStatus(status.map(
        (status, index) =>
          index === id ?
            {
              ...status,
              over: true,
              active: true
            } :
            {
              ...status,
              over: false,
              active: false
            }
      ))
    } else {
      setStatus(status.map(
        (status, index) =>
          index === id ?
            {
              ...status,
              over: true,
              active: true
            } :
            status
      ))
    }
  }
  return (
    <List
      className={clsx(classes.root, className)}
    >
      {pages.map((page, i) => (
        page.status !== 'denied' ?
          <ListItem
            className={classes.item}
            disableGutters
            key={page.title}
          >
            <Button
              activeClassName={classes.active}
              className={classes.button}
              component={CustomRouterLink}
              onMouseOver={(event) => handleMouseOver(event, page.id, status)}
              onMouseLeave={(event) => handleMouseLeave(event, page.id, status)}
              onClick={(event) => handleMouseClick(event, page.id, status)}
              to={page.href}
            >
              {status[page.id].over === true ? page.activeIcon : page.inactiveIcon}
              <p style={{ color: status[page.id].over === true ? '#00bf82' : 'white' }}>{page.title}</p>
            </Button>
          </ListItem>
          : null
      ))}
    </List>
  );
};

SidebarNav.propTypes = {
  className: PropTypes.string,
  pages: PropTypes.array.isRequired
};

export default withRouter(SidebarNav);
