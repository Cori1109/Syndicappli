import React, { useState } from 'react';
import '../assets/custom.css';
import { Table, TableHead, TableRow, TableBody, TableCell, TableFooter } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import theme from 'theme';
import Pagination from '@material-ui/lab/Pagination';
import Grid from '@material-ui/core/Grid';
import MyButton from './MyButton';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import useGlobal from 'Global/global';
import IconButton from '@material-ui/core/IconButton';
const BootstrapInput = withStyles((theme) => ({
  root: {
    'label + &': {
      [theme.breakpoints.up('xl')]: {
        marginTop: 24,
      },
      [theme.breakpoints.between('lg', 'lg')]: {
        marginTop: 17,
      },
      [theme.breakpoints.down('md')]: {
        marginTop: 12,
      },
    },
  },
  input: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 17,
      height: 33,
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 12,
      height: 23,
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 8,
      height: 16,
    },
    borderRadius: 4,
    position: 'relative',
    backgroundColor: 'white',
    border: '1px solid #1499ff',
    color: '#1499ff',
    padding: '2px 12px',
    display: 'flex',
    alignItems: 'center',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      'Poppins',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#1499ff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}))(InputBase);

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
      // [theme.breakpoints.between('sm', 'sm')]: {
      //   fontSize: 10,
      //   padding: 6
      // },
      // [theme.breakpoints.down('sm')]: {
      //   fontSize: 8,
      //   padding: 5
      // },
    }
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
      // [theme.breakpoints.down('md')]: {
      //   fontSize: 11,
      //   width: '23 !important',
      //   height: '23 !important'
      // },
      // [theme.breakpoints.down('sm')]: {
      //   fontSize: 8,
      //   width: 16,
      //   height:16
      // },
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
  const classes = useStyles();
  const [direction, setDirection] = useState(props.columns);
  const [globalState, globalActions] = useGlobal();
  const tempDirection = props.columns;
  let tempDirect = [];
  if (tempDirection) {
    for (let i = 0; i < tempDirection.length; i++)
      tempDirect[i] = '/images/sort_down.png';
  }
  const [cells] = useState(props.cells);
  const items = props.products;
  const footer = props.footerItems ? props.footerItems : [];
  const [direct, setDirect] = React.useState(tempDirect);

  const dataList = [20, 50, 100, 200, "all"];

  const [value, setValue] = React.useState(0);
  const handleChange = (event) => {
    props.onChangeSelect(event.target.value);
    setValue(event.target.value);
  };
  const handleChangePage = (event, page) => {
    props.onChangePage(page);
  };
  const Sort = (index = 0) => {
    if (direction[index] === 'asc') {
      tempDirection[index] = 'desc';
      tempDirect[index] = '/images/sort_up.png';
      setDirect(tempDirect);
      setDirection(tempDirection);
    } else {
      tempDirection[index] = 'asc';
      tempDirect[index] = '/images/sort_down.png';
      setDirect(tempDirect);
      setDirection(tempDirection);
    }

    props.onSelectSort(index, direction[index]);
  }
  const handleClick = () => {
    props.onClick();
  }
  const priceValue = (val) => {
    if(props.type === 'managers')
      return val + '€/lot/mois HT';
    if(props.type === 'buildings')
      return val + '€/lot/an HT';
    if(props.type === 'owners')
      return val + '€/an HT';
  }
  const Value = (val) => {
    switch (val) {
      case 'active': return 'actif';
      case 'inactive': return 'inactif';
      case 'expired': return 'expiré';
      case 'owner': return 'Copropriétaire';
      case 'subaccount': return 'Sous-compte';
      case 'member': return 'Membre du Conseil Syndical';
      case 'managers': return 'Gestionnaires';
      case 'companies': return 'Cabinets';
      case 'owners': return 'Copropriétaires';
      case 'buildings': return 'Immeubles';
      case 'once': return 'une fois';
      case '2_months': return '2 mois';
      case '3_months': return '3 mois';
      case '6_months': return '6 mois';
      case '1_year': return '1 an';
      case 'all': return 'tout le cycle';
      default: return val;
    }
  }
  const handleClickEdit = (id) => {
    if (props.type === 'owner') {
      props.onClickEdit(items[id].ID, items[id].buildingID);
    } else if (props.type === 'assembly') {
      props.onClickEdit(items[id].assemblyID);
    } else {
      props.onClickEdit(items[id].ID);
    }
  }
  const handleClickDelete = (id) => {
    if (props.type === 'owner') {
      props.onClickDelete(items[id].ID, items[id].buildingID);
    } else if (props.type === 'assembly') {
      props.onClickDelete(items[id].assemblyID);
    } else {
      props.onClickDelete(items[id].ID);
    }
  }
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container direction="row-reverse">
        <div>
          <FormControl className={classes.margin}>
            <NativeSelect
              value={value}
              onChange={handleChange}
              input={<BootstrapInput />}
            >
              {
                dataList.map((select, i) =>
                  <option value={i} key={select}>Voir {select}</option>
                )}
            </NativeSelect>
          </FormControl>
        </div>
      </Grid>
      <Grid item container style={{ overflowX: 'auto' }}>
        <Table className={classes.root}>
          <TableHead>
            <TableRow >
              {
                cells.map((cell, i) => (
                  <TableCell key={i} style={{width: 100/(props.columns.length + 1) + '%'}}>
                    <button
                      type="button"
                      onClick={() => Sort(i)}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      {cell.field}
                      <img style={{ width: "30px" }} src={direct[i]}></img>
                    </button>

                  </TableCell>
                ))
              }
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, i) => (
              <TableRow key={i}>
                {
                  cells.map((cell, j) => {
                    const value = item[cell.key];
                    return (
                      <TableCell
                        key={j}
                        onClick={() => handleClickEdit(i)}
                        disabled={(props.access === 'edit' ? false : true)}
                        style={{width: 100/(props.columns.length + 1) + '%'}}
                      >
                        {
                          cell.key === 'price' ? priceValue(value): Value(value)
                        }
                      </TableCell>
                    );
                  })
                }
                <TableCell align="right">
                  <IconButton onClick={() => handleClickEdit(i)}>
                    <EditIcon
                      className={classes.editItem}
                    />
                  </IconButton>
                      &nbsp;&nbsp;
                  <IconButton onClick={props.access === 'see' ? () => handleClickDelete(i) : null}>
                    <DeleteIcon
                      className={classes.editItem}    
                    />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className={(props.tblFooter === 'true' || items.length === 0) ? classes.show : classes.hide}>
            {
              items.length === 0 ?
                <TableRow>
                  <TableCell colSpan="100%" style={{ textAlign: 'center' }}>{'Aucune donnée trouvée'}</TableCell>
                </TableRow>
                :
                <TableRow>
                  {
                    footer.map((footerItem, i) => {
                      return (
                        <TableCell key={i}>
                          {footerItem}
                        </TableCell>
                      );
                    })
                  }
                </TableRow>
            }
          </TableFooter>
        </Table>
      </Grid>
      <Grid item container className={classes.body} alignItems="center">
        <Grid xs={12} sm={6} item container className={props.leftBtn ? classes.show : classes.hide} >
          <MyButton
            name={props.leftBtn}
            color={"1"}
            onClick={handleClick}
            style={{ visibility: props.leftBtn && props.access === 'edit' ? 'visible' : 'hidden' }}
          />
        </Grid>
        <Grid xs={12} sm={6} item container direction="row-reverse">
          <Pagination
            count={props.totalpage}
            color="primary"
            page={props.page}
            onChange={handleChangePage}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};
