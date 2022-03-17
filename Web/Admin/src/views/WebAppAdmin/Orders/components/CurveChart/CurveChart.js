import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
} from '@material-ui/core';
import { getStyle } from '@coreui/coreui/dist/js/coreui-utilities'
import { max } from 'underscore';


const brandPrimary = getStyle('--primary');
const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    boxShadow: '0px 3px 5px 2px rgba(182, 172, 251, .42)',
    borderRadius: 15,
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
  const [items, setItems] = useState([]);
  const [lines, setLines] = useState([]);
  useEffect(() => {
    let data = [];
    let linebar = [];
    if (props.data.result) {
      if (props.data.result.length !== 0) {
        for (var i = 0; i < props.data.result.length; i++) {
          data.push(props.data.result[i].price);
        }
        setItems(data);
      }
    }
    if (props.data.filter) {
      if (props.data.filter.length !== 0) {
        for (var i = 1; i < props.data.filter.length; i++) {
          linebar.push(props.data.filter[i]);
        }
        setLines(linebar);
      }
    }
  }, [props.data]);

  const mainChart = (canvas) => {
    var ctx = canvas.getContext("2d");

    var gradientStroke = ctx.createLinearGradient(300, 0, 100, 0);
    gradientStroke.addColorStop(0, '#0CC77C');

    gradientStroke.addColorStop(1, '#00C9FF');
    return {
      labels: lines,
      datasets: [
        {
          label: 'Revenus',
          backgroundColor: 'transparent',
          borderColor: gradientStroke,
          pointBorderColor: gradientStroke,
          pointBackgroundColor: gradientStroke,
          pointHoverBackgroundColor: gradientStroke,
          pointHoverBorderColor: gradientStroke,
          borderWidth: 10,
          data: items,
        },
      ],
    }
  };

  const mainChartOpts = {
    tooltips: {
      enabled: true,
      intersect: true,
      mode: 'index',
      position: 'nearest',
      callbacks: {
        labelColor: function (tooltipItem, chart) {
          return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor }
        }
      }
    },
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            drawOnChartArea: false,
          },
        }],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            maxTicksLimit: 5,
            stepSize: Math.ceil(250 / 5),
            max: Math.ceil(max(items)),
          },
        }],
    },
    elements: {
      point: {
        radius: 0,
        hitRadius: 10,
        hoverRadius: 4,
        hoverBorderWidth: 3,
      },
    },
  };
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Revenus"
      />
      <Divider />
      <CardContent style={{
        root: {
          paddingBottom: 0
        }
      }}>
        <div className={classes.chartContainer}>
          <Line id="line" data={mainChart} options={mainChartOpts} height={200} />
        </div>
      </CardContent>
    </Card>
  );
};

CurveChart.propTypes = {
  className: PropTypes.string
};

export default CurveChart;
