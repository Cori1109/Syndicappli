import React, { useState, useEffect, useRef } from 'react';
import '../assets/custom.css';
import { Table, TableHead, TableRow, TableBody, TableCell, TableFooter, setRef } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import theme from 'theme';
import Pagination from '@material-ui/lab/Pagination';
import Grid from '@material-ui/core/Grid';
import MyButton from './MyButton';
import { Checkbox } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { CSVLink } from "react-csv";
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
    }
  },
  input: {
    display: 'none'
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
const fileTypes = [
  'application/vnd.ms-excel',
];

function validFileType(file) {
  return fileTypes.includes(file.type);
}
export default function SelectTable(props) {
  const { onClickEdit, ...rest } = props;

  const classes = useStyles();
  const [direction, setDirection] = useState(props.columns);
  const tempDirection = props.columns;
  let tempDirect = [];
  if (tempDirection) {
    for (let i = 0; i < tempDirection.length; i++)
      tempDirect[i] = '/images/sort_down.png';
  }
  const inputFile = useRef(null);
  const [cells, setCells] = useState(props.cells);
  const [items, setItems] = useState([]);
  const [selectAllText, setSelectAllText] = useState('Tout sélectionner');
  const footer = props.footerItems ? props.footerItems : [];
  const [direct, setDirect] = React.useState(tempDirect);
  const dataList = [20, 50, 100, 200, "all"];
  const [selectAll, setSelectAll] = useState(-1);
  const [check, setCheck] = useState([]);
  const [value, setValue] = React.useState(0);
  useEffect(() => {
    let tempItems = [...props.products];
    for (let i = 0; i < props.products.length; i++) {
      tempItems[i].isChecked = false;
    }
    setItems(tempItems);
    setCheck([]);
    setSelectAll(-1);
  }, [props.state]);
  useEffect(() => {
    setItems(props.products);
  })
  const handleChange = (event) => {
    let tempItems = [...items];
    for (let i = 0; i < items.length; i++) {
      tempItems[i].isChecked = false;
    }
    setItems(tempItems);
    setCheck([]);
    setSelectAll(-1);
    props.onChangeSelect(event.target.value);
    setValue(event.target.value);
  };
  const handleChangeSelect = (event, id) => {
    let tmpCheck = [...check];
    if (tmpCheck.indexOf(id, 0) !== -1) {
      tmpCheck.splice(tmpCheck.indexOf(id, 0), 1);
    }
    else
      tmpCheck.push(id);
    setCheck(tmpCheck);
  };
  useEffect(() => {
    if (check.length === 0) {
      setSelectAll(-1);
      setSelectAllText('Tout sélectionner');
    }
    else if (check.length === items.length) {
      setSelectAll(1);
      setSelectAllText('Tout déselectionner');
    }
    else {
      setSelectAll(0);
      let tempItems = [...items];
      for (let j = 0; j < tempItems.length; j++)
        tempItems[j].isChecked = false;
      for (let j = 0; j < tempItems.length; j++)
        for (let i = 0; i < check.length; i++) {
          if (check[i] === j) {
            tempItems[j].isChecked = true;
            break;
          }
          else
            tempItems[j].isChecked = false;
        }
      setCheck(check)
      setItems(tempItems);
      setSelectAllText('Tout sélectionner');
    }
  }, [check]);
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
  const handleClickAllSelect = () => {
    if (items.length !== 0) {
      if (selectAll === 0)
        setSelectAll(1);
      else
        setSelectAll(selectAll * (-1));
    }
  }
  useEffect(() => {
    if (selectAll === 1) {
      let tempCheck = [];
      let tempItems = [...items];
      for (let i = 0; i < tempItems.length; i++) {
        tempCheck[i] = i;
        tempItems[i].isChecked = true;
      }
      setCheck(tempCheck);
      setItems(tempItems);
    }
    else if (selectAll === -1) {
      setCheck([]);
      let tempItems = [...items];
      for (let i = 0; i < tempItems.length; i++) {
        tempItems[i].isChecked = false;
      }
      setItems(tempItems);
    }
  }, [selectAll]);
  const handleClickImport = (event) => {
    if(props.id !== -1){
      document.getElementById('csvForm').value = '';
      inputFile.current.click();
    }else{
      ToastsStore.warning(props.err);
    }
  }
  const handleChangeImport = (event) => {
    if (event.target.files[0] !== undefined) {
      // if (validFileType(event.target.files[0])) {
        props.onImport(event.target.files[0]);
      // }
      // else {
      //   ToastsStore.warning('CSV format is not correct.');
      // }
    }
  }
  const handleClickExport = () => {
    if (check.length !== 0) {
      props.onExport(check);
    }
  }
  const Value = (val) => {
    switch (val) {
      case 'active': return 'actif';
      case 'inactive': return 'inactif';
      case 'owner': return 'Copropriétaire';
      case 'subaccount': return 'Sous-compte';
      case 'member': return 'Membre du Conseil Syndical';
      default: return val;
    }
  }
  const handleClickEdit = (id) => {
    if (props.type === 'owner') {
      props.onClickEdit(items[id].ID, items[id].buildingID);
    } else if (props.type === 'assembly') {
      console.log(items[id])
      props.onClickEdit(items[id].assemblyID);
    } else {
      props.onClickEdit(items[id].ID);
    }
  }
  const handleClickDelete = (id) => {
    if (props.type === 'owner') {
      props.onClickDelete(items[id].ID, items[id].buildingID);
    } else {
      props.onClickDelete(items[id].ID);
    }
  }
  return (
    <Grid container direction="column" spacing={2}>
      <Grid item container spacing={2} direction="row">
        <Grid item>
          <MyButton name={selectAllText} bgColor={"#00C9FF"} onClick={handleClickAllSelect} />
        </Grid>
        <Grid item>
          <input className={classes.input} type="file" ref={inputFile} id="csvForm" accept=".csv" onChange={handleChangeImport} />
          <MyButton name={"Importer"} bgColor={"#00C9FF"} onClick={handleClickImport} />
        </Grid>
        <Grid item>
          <MyButton name={"Exporter"} bgColor={"#00C9FF"} onClick={handleClickExport} />
        </Grid>
      </Grid>
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
                <TableCell align="center"></TableCell>
              }
              {
                cells.map((cell, i) => (
                  <TableCell key={i}>
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
                  <TableCell key={i}>
                    <Checkbox
                      checked={item.isChecked || false}
                      onChange={(event) => handleChangeSelect(event, i)}
                    />
                  </TableCell>
                }
                {
                  cells.map((cell) => {
                    const value = item[cell.key];
                    return (
                      <TableCell
                        key={cell.key}
                        onClick={() => handleClickEdit(i)}
                        disabled={(props.access === 'see' ? true : false)}
                      >

                        {
                          Value(value)
                        }
                      </TableCell>);
                  })
                }
                <TableCell align="right">
                  <IconButton onClick={() => handleClickEdit(i)}>
                    <EditIcon
                      className={classes.editItem}
                    />
                  </IconButton>
                      &nbsp;&nbsp;
                  <IconButton onClick={props.access === 'see' ? null : () => handleClickDelete(i)}>
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
        <Grid xs={12} item container direction="row-reverse">
          <Pagination
            count={props.totalpage}
            color="primary"
            page={props.page}
            onChange={handleChangePage}
          />
        </Grid>
      </Grid>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </Grid>
  );
};
