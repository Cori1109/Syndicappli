import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {Line} from 'react-chartjs-2';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Divider,
  Button
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';

import { mainChart, mainChartOpts } from './chart';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%'
  },
  chartContainer: {
    height: 'auto',
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const CurveChart = props => {
  const { className, ...rest } = props;

  const classes = useStyles();

  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        action={
          <Button
            size="small"
            variant="text"
          >
            Last 7 days <ArrowDropDownIcon />
          </Button>
        }
        title="Revenus"
      />
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          <Line data={mainChart} options={mainChartOpts} />
        </div>
      </CardContent>
      <Divider />
      <CardActions className={classes.actions}>
        <Button
          color="primary"
          size="small"
          variant="text"
        >
          Overview <ArrowRightIcon />
        </Button>
      </CardActions>
    </Card>
  );
};

CurveChart.propTypes = {
  className: PropTypes.string
};

export default CurveChart;
