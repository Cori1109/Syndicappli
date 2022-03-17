import React, { useState } from 'react';
import '../../../../../assets/custom.css';
import { Table, TableHead, TableRow, TableBody, TableCell, Avatar } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import theme from 'theme';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles({
  margin: {
    width: props => props.width,
    '& .MuiSelect-select.MuiSelect-select': {
      borderColor: '#1499ff'
    },
    '& .MuiNativeSelect-icon': {
      color: '#1499ff'
    },
  },
  root: {
    boxShadow: '0px 3px 5px 2px rgba(182, 172, 251, .42)',
    '& tbody tr:last-child td': {
      borderBottom: 'none'
    },
    '& tfoot tr:last-child td': {
      borderBottom: 'none'
    },
    '& thead tr:first-child th': {
      borderRadius: 30,
    },
    [theme.breakpoints.up('xl')]: {
      marginBottom: 16,
      marginTop: 8,
      borderRadius: '30px',
    },
    [theme.breakpoints.between('lg', 'lg')]: {
      marginBottom: 11,
      marginTop: 6,
      borderRadius: '21px',
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: 8,
      marginTop: 4,
      borderRadius: '15px',
    },
    '& thead button': {
      background: 'transparent',
      outline: 'transparent',
      // color: '#363636'
    },
    '& .MuiTableCell-root': {
      fontFamily:'Poppins',
      [theme.breakpoints.up('xl')]: {
        padding: 16
      },
      [theme.breakpoints.between('lg', 'lg')]: {
        padding: 11
      },
      [theme.breakpoints.down('md')]: {
        padding: 8
      },
    }
  },
  cell: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 16,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 11,
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 8,
    },
  },
  email: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 14,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 10,
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 7,
    },
  },
  cellhead: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 18,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 13,
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 9,
    },
  },
  status: {
    color: '#1499ff',
    '&:hover': {
      cursor: 'pointer'
    },
    [theme.breakpoints.up('xl')]: {
      fontSize: 16,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 11,
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 8,
    },
  },
  body: {
    [theme.breakpoints.up('xl')]: {
      marginBottom: 16,
    },
    [theme.breakpoints.between('lg', 'lg')]: {
      marginBottom: 11,
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: 8,
    },
    '& .MuiPaginationItem-textPrimary.Mui-selected': {
      background: 'linear-gradient(90deg, #00b8d4 10%, #00bf82 90%)',
    },
    '& .MuiPaginationItem-root': {
      borderRadius: '50%',
      [theme.breakpoints.up('xl')]: {
        fontSize: 22,
        width: 47,
        height: 47
      },
      [theme.breakpoints.down('lg')]: {
        fontSize: 15,
        width: 33,
        height: 33,
      },
      [theme.breakpoints.down('md')]: {
        fontSize: 11,
        width: '23',
        height: '23'
      },
    }
  },
  editItem: {
    '&:hover': {
      cursor: 'pointer'
    },
    [theme.breakpoints.up('xl')]: {
      width: 23,
      height: 23
    },
    [theme.breakpoints.down('lg')]: {
      width: 16,
      height: 16
    },
    [theme.breakpoints.down('md')]: {
      width: 11,
      height: 11
    },
  },
  hide: {
    visibility: 'hidden'
  },
  show: {
    visibility: 'visible'
  },
});

export default function SubAccountsTable(props) {
  const classes = useStyles();
  const items = props.items;
  const handleClickViewDetails = (id) => {
    props.onClickViewDetails(id);
  }
  const handleClickResend = (id) => {
    props.onClickResend(id);
  }
  return (
    <Grid item container direction="column" spacing={2} xs={12} sm={8} md={8} lg={8} xl={6} >
      <Table className={classes.root}>
        <TableHead>
          <TableRow >
            <TableCell align="left"><p className={classes.cellhead}>Utilisateur</p></TableCell>
            <TableCell align="center"><p className={classes.cellhead}>Statut</p></TableCell>
            <TableCell align="center"><p className={classes.cellhead}>Actions</p></TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, i) => (
            <TableRow key={i}>
              <TableCell>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar alt={item.firstname + ' ' + item.lastname} src={item.photo_url} >
                      {item.firstname[0] + item.lastname[0]}
                    </Avatar>
                  </Grid>
                  <Grid item >
                    <Grid container direction="column">
                      <Grid item><p className={classes.cell}><b>{item.firstname + ' ' + item.lastname}</b></p></Grid>
                      <Grid item><p className={classes.email}>{item.email}</p></Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </TableCell>
              <TableCell align="center">
                {
                  item.invitation_status === 'invited' ?
                    <p className={classes.cell}>Invitation envoyée</p>
                    :
                    <p className={classes.cell}>Actif</p>
                }
              </TableCell>
              <TableCell align="center">
                {
                  item.invitation_status === 'invited' ?
                    <p className={classes.status} onClick={()=>handleClickResend(item.userID)}>Renvoyer l'invitation</p>
                    :
                    <p className={classes.status} onClick={()=>handleClickViewDetails(item.userID)}>Voir les détails</p>
                }
              </TableCell>
              <TableCell align="right">
                <CloseIcon className={classes.editItem} onClick={() => props.onClickDelete(item.userID)}></CloseIcon>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Grid>
  );
};
