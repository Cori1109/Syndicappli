import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Card, CardContent, Grid } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import {BudgetStyles as useStyles} from '../../useStyles';

const Budget = props => {
  const { className, ...rest } = props;
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  const [pro, setPro] = useState(props.pro);
  const [tail, setTail] = useState(props.tail); 
  const [avatar, setAvatar] = useState(props.avatar);
  const [income, setIncome] = useState(props.income);
  useEffect(()=>{
    setTail(props.tail);
  },[props.tail]);
  useEffect(()=>{
    setBody(props.body);
  },[props.body]);
  useEffect(()=>{
    setPro(props.pro);
  },[props.pro]);
  let style1, style2 ;
  useEffect(()=>{
    setIncome(props.income);

  },[props.income]);
  const classes = useStyles(props);
  if(income === 1){
    style1 = classes.show;
    style2 = classes.hide;
  }
  else{
    style1 = classes.hide;
    style2 = classes.show;
  }
  return (
    <Card
      {...rest}
      className={clsx(classes.root, className)}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
        >
          <Grid item>
            <p
            className={classes.caption}
            variant="caption"
            >
              {title}
            </p>
            <p className={classes.bodyTitle}>{body}</p>
          </Grid>
          <Grid item>
            <img className={classes.avatar} src={avatar}/>
          </Grid>
        </Grid>
        <div className={classes.difference}>
          <ArrowDownwardIcon className={style1} />
          <ArrowUpwardIcon className={style2} />
          <p
            className={classes.differenceValue}
          >
            {pro}
          </p>
          <p
            className={classes.tail}
            variant="caption"
          >
            {tail}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

Budget.propTypes = {
  className: PropTypes.string
};

export default Budget;
