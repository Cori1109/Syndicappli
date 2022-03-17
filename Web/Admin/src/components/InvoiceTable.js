import React, { useState } from 'react';
import '../assets/custom.css';
import { Table, TableHead, TableRow, TableBody, TableCell,TableFooter } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import theme from 'theme';
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
    '& thead tr:first-child th:first-child': {
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
    '& thead tr:first-child th:last-child': {
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
    color: 'red',
    '&:hover': {
      cursor: 'pointer'
    },
    [theme.breakpoints.up('xl')]: {
      width: 32,
      height: 39
    },
    [theme.breakpoints.down('lg')]: {
      width: 22,
      height: 27
    },
    [theme.breakpoints.down('md')]: {
      width: 15,
      height: 19
    },
  },
});

export default function InvoiceTable(props) {
  const { onClickEdit, ...rest } = props;

  const classes = useStyles();
  const [cells, setCells] = useState(props.cells);
  const items = props.products;
  return (
    <div style={{ overflowX: 'auto' }}>
      <Table className={classes.root}>
        <TableHead>
          <TableRow >
            {
              cells.map((cell, i) => (
                <TableCell key={i} style={{ width: 100 / (props.columns + 1) + '%' }}>
                  {cell.field}
                </TableCell>
              ))
            }
            <TableCell align="center">Télécharger</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item, i) => (
            <TableRow key={item.ID}>
              {
                cells.map((cell) => {
                  const value = item[cell.key];
                  return (
                    <TableCell key={cell.key} style={{ width: 100 / (props.columns + 1) + '%' }}>

                      {value}
                    </TableCell>);
                })
              }
              <TableCell align="center" style={{ justifyContent: 'center' }}>
                <img src="/images/pdf.png" className={classes.editItem} onClick={() => props.onClickDownload(item.ID)}></img>
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
    </div>
  );
};
