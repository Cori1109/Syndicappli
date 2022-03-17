import React, {useState } from 'react';
import 'assets/custom.css';
import { Table, TableHead, TableRow, TableBody, TableCell} from '@material-ui/core';
import { makeStyles , withStyles} from '@material-ui/core/styles';
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
    '& tbody tr:last-child td':{
      borderBottom: 'none'
    },
    '& tbody tr:last-child td:first-child':{
        [theme.breakpoints.up('xl')]: {
          borderBottomLeftRadius: '30px',
        },
        [theme.breakpoints.between('lg','lg')]: {
          borderBottomLeftRadius: '21px',
        },
        [theme.breakpoints.down('md')]: {
          borderBottomLeftRadius: '15px',
        },
      },
      '& tbody tr:last-child td:last-child':{
        [theme.breakpoints.up('xl')]: {
          borderBottomRightRadius: '30px',
        },
        [theme.breakpoints.between('lg','lg')]: {
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
    [theme.breakpoints.between('lg','lg')]: {
      marginBottom: 11,
      marginTop: 6,
      borderRadius: '21px',
    },
    [theme.breakpoints.down('md')]: {
      marginBottom: 8,
      marginTop: 4,
      borderRadius: '15px',
    },
    '& .MuiTableCell-root': {
      fontFamily:'Poppins',
      [theme.breakpoints.up('xl')]: {
        fontSize :18,
        padding: 16
      },
      [theme.breakpoints.between('lg','lg')]: {
        fontSize :14,
        padding: 11
      },
      [theme.breakpoints.down('md')]: {
        fontSize :10,
        padding: 8
      },
    }
  },
});

export default function ModuleTable  (props)  {
  const {onClickEdit, ...rest} = props;

  const classes = useStyles();
  const [cells,setCells] = useState(props.cells);
  const items = props.products;
  return ( 
      <Grid item container xs={12} sm={8} md={8} lg={8} xl={6}>
          <Table className={classes.root}>
            <TableHead>
              <TableRow >
                {
                  cells.map((cell,i)=>(
                    <TableCell key={i} style={{width: 100/(props.columns) + '%'}}>
                      {cell.field}
                    </TableCell>
                  ))
                }
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item,i) => (
                <TableRow key={i}>
                  {
                  cells.map((cell)=>{
                    const value = item[cell.key];
                    return(
                      <TableCell  key={cell.key} style={{width: 100/(props.columns) + '%'}}>
                        {value}
                      </TableCell>
                    );
                  })
                  }
                </TableRow>
              ))}
            </TableBody>
          </Table>
      </Grid>
  );
};
