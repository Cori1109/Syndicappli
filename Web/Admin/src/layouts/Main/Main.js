import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/styles';
import { useMediaQuery } from '@material-ui/core';

import { Sidebar, Topbar} from './components';
import ScrollButton from './components/ScrollButton';

const useStyles = makeStyles(theme => ({
  root: {
    height: '100%',
    backgroundColor:'white',
    [theme.breakpoints.up('xl')]: {
      paddingTop: 209,
    },
    [theme.breakpoints.down('lg')]: {
      paddingTop: 146,
    },
    [theme.breakpoints.down('md')]: {
      paddingTop: 102,
    },
  },
  shiftContent: {
    [theme.breakpoints.up('xl')]: {
      paddingLeft: 333,
    },
    [theme.breakpoints.down('lg')]: {
      paddingLeft: 233,
    },
    [theme.breakpoints.down('md')]: {
      paddingLeft: 163,
    },
  },
  content: {
    backgroundColor:'white'
  },
}));

const Main = props => {
  const { children } = props;

  const classes = useStyles();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'), {
    defaultMatches: true
  });

  const [openSidebar, setOpenSidebar] = useState(false);

  const handleSidebarOpen = () => {
    setOpenSidebar(true);
  };

  const handleSidebarClose = () => {
    setOpenSidebar(false);
  };

  const shouldOpenSidebar = isDesktop ? true : openSidebar;

  return (
    <div
      className={clsx({
        [classes.root]: true,
        [classes.shiftContent]: isDesktop
      })}
    >
      <Topbar onSidebarOpen={handleSidebarOpen}/>
      <Sidebar
        onClose={handleSidebarClose}
        open={shouldOpenSidebar}
        variant={isDesktop ? 'persistent' : 'temporary'}
      />
      <main className={classes.content}>
        {children}
      </main>
      <ScrollButton scrollStepInPx="3"/>
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node
};

export default Main;
