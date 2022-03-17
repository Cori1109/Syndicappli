import React, { useState, useEffect } from 'react';
import 'assets/custom.css';
import { Table, TableHead, TableRow, TableBody, TableCell, TableFooter } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import theme from 'theme';
import Pagination from '@material-ui/lab/Pagination';
import Grid from '@material-ui/core/Grid';
import MyButton from 'components/MyButton';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import useGlobal from 'Global/global';
import IconButton from '@material-ui/core/IconButton';
import TableItemSelect from './TableItemSelect';
import RootRef from "@material-ui/core/RootRef";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
    // '& thead tr:first-child th': {
    //   borderRadius: 30,
    // },
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
  menu: {
    color: '#1499ff',
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

export default function ResolutionTable(props) {
  const classes = useStyles();
  const [direction, setDirection] = useState(props.columns);
  const [globalState, globalActions] = useGlobal();
  const tempDirection = props.columns;
  let tempDirect = [];
  const { products } = props;
  const { votelist } = props;
  if (tempDirection) {
    for (let i = 0; i < tempDirection.length; i++)
      tempDirect[i] = '/images/sort_down.png';
  }
  const [cells] = useState(props.cells);
  const footer = props.footerItems ? props.footerItems : [];
  const [direct, setDirect] = React.useState(tempDirect);
  const [votes, setVotes] = useState(['']);
  const calcModeList = ['majorité simple', 'majorité double', 'majorité absolue'];
  const en_calcModeList = ['simple majority', 'double majority', 'absolute majority'];
  const resultList = ['adopté', 'rejeté', 'en attente'];
  const en_resultList = ['adopted', 'rejected', 'onhold'];
  const dataList = [20, 50, 100, 200, "all"];
  const [items, setItems] = useState([]);
  const [value, setValue] = React.useState(0);
  const [result, setResult] = useState(Array.from({ length: 1000 }, () => 0));
  const [vote, setVote] = useState(Array.from({ length: 1000 }, () => 0));
  const [calcMode, setCalcMode] = useState(Array.from({ length: 1000 }, () => 0));

  useEffect(() => {
    setItems(products)
  }, [products])
  useEffect(() => {
    console.log(votelist)
    setVotes(votelist)
  }, [votelist])

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const getItemStyle = (isDragging, draggableStyle) => ({
    // styles we need to apply on draggables
    ...draggableStyle,

    ...(isDragging && {
      background: "rgb(235,235,235)"
    })
  });

  const getListStyle = isDraggingOver => ({
    //background: isDraggingOver ? 'lightblue' : 'lightgrey',
  });
  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    let items1 = reorder(
      items,
      result.source.index,
      result.destination.index
    );
    setItems(items1)
    console.log('items1:', items1)
  }



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
  const handleClickEdit = (id) => {
    if (props.type === "resolution") {
      props.onClickEdit(products[id].decisionID);
    } else {
      props.onClickEdit(items[id].ID);
    }
  }
  const handleClickDelete = (id) => {
    if (props.type === "resolution") {
      props.onClickDelete(products[id].decisionID);
    } else {
      props.onClickDelete(items[id].ID);
    }
  }
  const handleChangeVote = (val, i) => {
    let select = [...vote];
    select[i] = val;
    setVote(select);
  }
  const handleChangeCalcMode = (val, id) => {
    let select = [...calcMode];
    select[id] = val;
    setCalcMode(select);
  }
  const handleChangeResult = (val, i) => {
    let select = [...result];
    select[i] = val;
    setResult(select);
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
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <RootRef rootRef={provided.innerRef}>
                  <TableBody style={getListStyle(snapshot.isDraggingOver)}>
                    {items.map((item, i) => (
                      <Draggable key={item.decisionID} draggableId={`${item.decisionID}`} index={i}>
                        {(provided, snapshot) => (
                          <TableRow
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                            ref={provided.innerRef}
                          >
                            <TableCell onClick={() => handleClickEdit(i)}>
                              {i + 1}
                            </TableCell>
                            <TableCell onClick={() => handleClickEdit(i)}>
                              {item.name}
                            </TableCell>
                            <TableCell>
                              <TableItemSelect
                                color="gray"
                                data={votes}
                                onChangeSelect={handleChangeVote}
                                value={vote[i]}
                                pos={i}
                                width="100%"
                              />
                            </TableCell>
                            <TableCell>
                              <TableItemSelect
                                color="gray"
                                data={calcModeList}
                                onChangeSelect={handleChangeCalcMode}
                                value={calcMode[i]}
                                pos={i}
                                width="100%"
                              />
                            </TableCell>
                            <TableCell>
                              <TableItemSelect
                                color="gray"
                                data={resultList}
                                onChangeSelect={handleChangeResult}
                                pos={i}
                                value={result[i]}
                                width="100%"
                              />
                            </TableCell>
                            <TableCell align="right">
                              <IconButton
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <MenuIcon className={classes.menu} />
                              </IconButton>
                                  &nbsp;&nbsp;
                              <IconButton>
                                <EditIcon
                                  className={classes.editItem}
                                  onClick={() => handleClickEdit(i)}
                                />
                              </IconButton>
                                  &nbsp;&nbsp;
                              <IconButton>
                                <DeleteIcon
                                  className={classes.editItem}
                                  onClick={props.access === 'see' ? () => handleClickDelete(i) : null}
                                />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </TableBody>
                </RootRef>
              )}
            </Droppable>
          </DragDropContext>
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
            style={{ visibility: props.leftBtn && props.access === 'see' ? 'visible' : 'hidden' }}
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
