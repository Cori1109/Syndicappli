import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme,props)=>({
  select_root: {

    boxShadow: '0px 10px 20px 10px rgba(182, 172, 251, .42)',
    [theme.breakpoints.up('xl')]: {
        borderRadius: 15,
        width:390,
        height: 154,
    },
    [theme.breakpoints.down('lg')]: {
        borderRadius: 11,
        width:273,
        height: 108,
    },
    [theme.breakpoints.down('md')]: {
        borderRadius: 8,
        width:201,
        height: 76,
    },
    '&:hover':{
        cursor:'pointer'
    }
  },
  normal_root: {

    boxShadow: '0px 3px 5px 2px rgba(182, 172, 251, .42)',
    [theme.breakpoints.up('xl')]: {
        borderRadius: 15,
        width: 350,
        height: 120,
    },
    [theme.breakpoints.down('lg')]: {
        borderRadius: 11,
        width: 245,
        height: 84,
    },
    [theme.breakpoints.down('md')]: {
        borderRadius: 8,
        width: 172,
        height: 59,
    },
    '&:hover':{
        cursor:'pointer'
    }
  },
  select_bullet: {
    display: 'flex',
    alignItems:'center',
    margin: '0 2px',
    [theme.breakpoints.up('xl')]: {
        fontSize:68,
        height:150,
    },
    [theme.breakpoints.down('lg')]: {
        fontSize :48,
        height:80,
    },
    [theme.breakpoints.down('md')]: {
        fontSize :34,
        height:40,
    },
  },
  normal_bullet: {
    display: 'flex',
    alignItems:'center',
    margin: '0 2px',
    [theme.breakpoints.up('xl')]: {
        fontSize:58,
        height:90,
    },
    [theme.breakpoints.down('lg')]: {
        fontSize :41,
        height:50,
    },
    [theme.breakpoints.down('md')]: {
        fontSize :29,
        height:20,
    },
  },
  select_name: {
    [theme.breakpoints.up('xl')]: {
        fontSize :18
      },
      [theme.breakpoints.down('lg')]: {
        fontSize :13
      },
      [theme.breakpoints.down('md')]: {
        fontSize :9
      },
  },
  normal_name: {
    [theme.breakpoints.up('xl')]: {
        fontSize :16
      },
      [theme.breakpoints.down('lg')]: {
        fontSize :11
      },
      [theme.breakpoints.down('md')]: {
        fontSize :8
      },
  },
  select_date: {
    [theme.breakpoints.up('xl')]: {
      fontSize :23
    },
    [theme.breakpoints.down('lg')]: {
      fontSize :16
    },
    [theme.breakpoints.down('md')]: {
      fontSize :11
    },
  },
  normal_date: {
    [theme.breakpoints.up('xl')]: {
      fontSize :20
    },
    [theme.breakpoints.down('lg')]: {
      fontSize :14
    },
    [theme.breakpoints.down('md')]: {
      fontSize :10
    },
  },
  pos: {
    marginBottom: 12,
  },
}));

export default function EventCard(props) {
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;
  const cardlist = props.cardlist;
  const card=cardlist[props.eventID];
  const handleClickCard = (id,card)=>{
    props.onClick(id,card);
  }
  return (
    <Card 
        className={card.select ? classes.select_root : classes.normal_root} 
        onClick={()=>handleClickCard(props.eventID, cardlist)}
    >
      <CardContent>
        <p 
            style={{color:card.online ? '#4F9F64' : 'gray'}} 
            className={card.select ? classes.select_name : classes.normal_name}
        >
            12 FEVRIER 2019
        </p>
        <div style={{alignItems: 'center', display:'flex'}}>
            <span 
                className={card.select ? classes.select_bullet : classes.normal_bullet}
                style={{color:card.online ? '#4F9F64' : 'gray'}}
            >
                •
            </span>
            <span className={card.select ? classes.select_date : classes.normal_date}>
                <b>
                  Maintenance
                </b>
            </span>
        </div>
      </CardContent>
    </Card>
  );
}
