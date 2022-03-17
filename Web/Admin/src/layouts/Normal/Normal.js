import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';


const useStyles = makeStyles(() => ({
  root: {
    height:'100%',
    width: '100%',
    background: 'linear-gradient(90deg, #0CC77C 10%, #00C9FF 90%)',
  },
  content: {
     background: 'linear-gradient(90deg, #0CC77C 10%, #00C9FF 90%)'
  }
}));

const Normal = props => {
  const { children } = props;

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <main className={classes.content}>{children}</main>
    </div>
  );
};

Normal.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Normal;
