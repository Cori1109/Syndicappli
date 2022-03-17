import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';
import { makeStyles } from '@material-ui/styles';
import {
  Card,
  CardHeader,
  CardContent,
  Divider,
} from '@material-ui/core';

import palette from 'theme/palette';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    boxShadow: '0px 3px 5px 2px rgba(182, 172, 251, .42)',
    borderRadius: 15
  },
  chartContainer: {
    height: 'auto',
    position: 'relative'
  },
  actions: {
    justifyContent: 'flex-end'
  }
}));

const LatestSales = props => {
  const { className, ...rest } = props;
  const [items, setItems] = useState([]);
  const [lines, setLines] = useState([]);
  useEffect(()=>{
    let data = [];
    let linebar = [];
    if(props.data.result){
    if(props.data.result.length !== 0){
      for (var i = 0; i <props.data.result.length; i++) {
        data.push(props.data.result[i].count);
      }
      setItems(data);
    }
  }
  if(props.data.filter){
    if(props.data.filter.length !== 0){
      for (var i = 1; i <props.data.filter.length; i++) {
        linebar.push(props.data.filter[i]);
      }
      setLines(linebar);
    }
  }
  },[props.data]);
  const classes = useStyles();
   const data = (canvas) =>{
    var ctx = canvas.getContext("2d");

    const gradient = ctx.createLinearGradient(0, 0, 0, 150);
    gradient.addColorStop(0, '#0CC77C');
    gradient.addColorStop(1, '#00C9FF');
    return{
    labels: lines,
    datasets: [
      {
        label: 'Commandes',
        backgroundColor: 'transparent',
        borderColor: gradient,
        borderWidth: 10,
        data: items,
      }
    ]
  }
  };
  
  
   const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    legend: { display: false },
    cornerRadius: 20,
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
    layout: { padding: 0 },
    scales: {
      xAxes: [
        {
          barThickness: 12,
          maxBarThickness: 10,
          barPercentage: 0.5,
          categoryPercentage: 0.5,
          ticks: {
            fontColor: palette.text.secondary
          },
          gridLines: {
            display: false,
            drawBorder: false
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            fontColor: palette.text.secondary,
            beginAtZero: true,
            min: 0
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: palette.divider,
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: palette.divider
          }
        }
      ]
    }
  };
  
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardHeader
        title="Commandes"
      />
      <Divider />
      <CardContent>
        <div className={classes.chartContainer}>
          <Bar
            data={data}
            options={options}
            height={200}
          />
        </div>
      </CardContent>
    </Card>
  );
};

LatestSales.propTypes = {
  className: PropTypes.string
};

export default LatestSales;
