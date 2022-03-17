import React, { useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Card, CardContent, Grid, Typography, Avatar } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import MoneyIcon from '@material-ui/icons/Money';
import {BudgetStyles as useStyles} from '../../useStyles';

const Budget = props => {
  const { className, ...rest } = props;
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  const [pro, setPro] = useState(props.pro);
  const [tail, setTail] = useState(props.tail); 
  //const [avatar, setAvatar] = useState(props.avatar);
  const [income, setIncome] = useState(props.income);
  const classes = useStyles(props);
  let style1, style2 ;
  if(income === 1){

    style1 = classes.show;
    style2 = classes.hide;
  }
  else{
    style1 = classes.hide;
    style2 = classes.show;
  }
  console.log(income);
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
            <Typography
            className={classes.caption}
            variant="caption"
            >
              {title}
            </Typography>
            <p className={classes.bodyTitle}>{body}</p>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <MoneyIcon className={classes.icon} />
            </Avatar>
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
          <Typography
            className={classes.tail}
            variant="caption"
          >
            {tail}
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

Budget.propTypes = {
  className: PropTypes.string
};

export default Budget;
