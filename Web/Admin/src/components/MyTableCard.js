import React, { useState } from 'react';
import '../assets/custom.css';
import { Table, TableHead, TableRow, TableBody, TableCell, TableFooter } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles } from '@material-ui/core/styles';
import theme from 'theme';
import Grid from '@material-ui/core/Grid';
import MyButton from './MyButton';
import IconButton from '@material-ui/core/IconButton';
const useStyles = makeStyles({

  root: {
    boxShadow: '0 3px 5px 2px rgba(128, 128, 128, .3)',
    '& tbody tr:last-child td': {
      borderBottom: 'none'
    },
    '& tbody tr:last-child td:first-child': {
      [theme.breakpoints.up('xl')]: {
        borderBottomLeftRadius: '30px',
      },
      [theme.breakpoints.between('lg', 'lg')]: {
        borderBottomLeftRadius: '21px',
      },
      [theme.breakpoints.down('md')]: {
        borderBottomLeftRadius: '15px',
      },
    },
    '& tbody tr:last-child td:last-child': {
      [theme.breakpoints.up('xl')]: {
        borderBottomRightRadius: '30px',
      },
      [theme.breakpoints.between('lg', 'lg')]: {
        borderBottomRightRadius: '21px',
      },
      [theme.breakpoints.down('md')]: {
        borderBottomRightRadius: '15px',
      },
    },
    '& tbody tr:first-child td:first-child': {
      [theme.breakpoints.up('xl')]: {
        borderTopLeftRadius: '30px',
      },
      [theme.breakpoints.between('lg', 'lg')]: {
        borderTopLeftRadius: '21px',
      },
      [theme.breakpoints.down('md')]: {
        borderTopLeftRadius: '15px',
      },
    },
    '& tbody tr:first-child td:last-child': {
      [theme.breakpoints.up('xl')]: {
        borderTopRightRadius: '30px',
      },
      [theme.breakpoints.between('lg', 'lg')]: {
        borderTopRightRadius: '21px',
      },
      [theme.breakpoints.down('md')]: {
        borderTopRightRadius: '15px',
      },
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
      fontFamily: 'Poppins',
      [theme.breakpoints.up('xl')]: {
        fontSize: 18,
        padding: 16
      },
      [theme.breakpoints.between('lg', 'lg')]: {
        fontSize: 14,
        padding: 11
      },
      [theme.breakpoints.down('md')]: {
        fontSize: 10,
        padding: 8
      },
    }
  },

  editItem: {
    color: '#1499ff',
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

export default function ProductTable(props) {
  const { onClickEdit, ...rest } = props;

  const classes = useStyles();
  const [cells, setCells] = useState(props.cells);
  const items = props.products;

  return (
    <div >
      <Grid container direction="column" spacing={6}>
        <Grid item></Grid>
        <Grid item style={{ overflowX: 'auto' }}>
          <Table className={classes.root}>
            <TableHead />
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.ID}>
                  <TableCell  onClick={() => props.onClickEdit(item.ID)}>
                    <img src="/images/card.png"></img>
                  </TableCell>
                  {
                    cells.map((cell, i) => {
                      const value = item[cell.key];
                      return (
                        <TableCell key={cell.key}  onClick={() => props.onClickEdit(item.ID)}>

                          {value}
                        </TableCell>);
                    })
                  }
                  <TableCell align="right">
                    <IconButton  onClick={() => props.onClickEdit(item.ID)} >
                      <EditIcon className={classes.editItem}/>
                    </IconButton>
                      &nbsp;&nbsp;
                    <IconButton onClick={() => props.onClickDelete(item.ID)}>
                      <DeleteIcon className={classes.editItem}></DeleteIcon>
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className={items.length === 0 ? classes.show : classes.hide}>
              {
                items.length === 0 ?
                  <TableRow>
                    <TableCell colSpan="100%" style={{ textAlign: 'center' }}>{'Aucune donnée trouvée'}</TableCell>
                  </TableRow>
                  :
                  null
              }
            </TableFooter>
          </Table>
        </Grid>
        <Grid xs={12} item container className={props.leftBtn ? classes.show : classes.hide} >
          <MyButton name={props.leftBtn} color={"1"} onClick={() => props.onClickAdd()} />
        </Grid>
      </Grid>
    </div>
  );
};
