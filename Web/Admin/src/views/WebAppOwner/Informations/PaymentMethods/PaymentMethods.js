import React, { useState, useEffect } from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MyButton from 'components/MyButton';
import authService from 'services/authService.js';
import MyTableCard from 'components/MyTableCard';
import { withRouter } from 'react-router-dom';
import { OwnerService as Service } from 'services/api.js';
import { makeStyles } from '@material-ui/styles';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import BankCard from './BankCard';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import CircularProgress from '@material-ui/core/CircularProgress';
import validator from 'card-validator';
const useStyles = makeStyles(theme => ({
  root: {
    [theme.breakpoints.up('xl')]: {
      paddingLeft: theme.spacing(5),
      paddingRight: theme.spacing(4),
    },
    [theme.breakpoints.down('lg')]: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(3),
    },
    [theme.breakpoints.down('md')]: {
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(2),
    },
    '& .MuiTextField-root': {
      // width: '100%'
    },
    '& .MuiOutlinedInput-input': {
      [theme.breakpoints.up('xl')]: {
        padding: '17px 25px',
        fontSize: 22,
      },
      [theme.breakpoints.down('lg')]: {
        padding: '12px 18px',
        fontSize: 15,
      },
      [theme.breakpoints.down('md')]: {
        padding: '8px 13px',
        fontSize: 11,
      },
    },
    '& .MuiOutlinedInput-multiline': {
      padding: 0,
      lineHeight: 'normal'
    },
    '& p': {
      marginBottom: 0
    }
  },
  title: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  },
  modalTitle: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 28
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 20
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 14
    },
  },
  item: {
    marginTop: theme.spacing(5),
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    borderRadius: 15,
    width: 500
  },
  input: {
    display: 'none',
  },
  div_indicator: {
    width: '100%',
    height: '100%',
    display: 'flex',
    position: 'fixed',
    paddingLeft: '50%',
    alignItems: 'center',
    marginTop: '-60px',
    zIndex: 999,
  },
  indicator: {
    color: 'gray'
  },
  error: {
    color: 'red',
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
  headerTitle: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 35
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 25
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 18
    },
  },
  sepaTitle: {
    [theme.breakpoints.up('xl')]: {
      fontSize: 28
    },
    [theme.breakpoints.down('lg')]: {
      fontSize: 20
    },
    [theme.breakpoints.down('md')]: {
      fontSize: 14
    },
  },
  sepaItemTitle: {
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
  padding: {
    padding: theme.spacing(2, 4, 3),
  },
  close: {
    cursor: 'pointer',
    color: 'gray'
  },
}));
const OwnerService = new Service();
const PaymentMethods = (props) => {
  const { history } = props;
  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const accesspayments = authService.getAccess('role_payments');
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [cardDataList, setCardDataList] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [visibleIndicator, setVisibleIndicator] = useState(false);
  const [deleteId, setDeleteId] = useState(-1);
  const [ownerID, setOwnerID] = useState(-1);
  const [state, setState] = useState({ method: 'add', buttonText: 'Ajouter', pos: -1, ownerID: -1 });
  useEffect(() => {
      getBuildigs();
  }, [accesspayments]);
  useEffect(() => {
    let tmpState = { method: 'add', buttonText: 'Ajouter', pos: -1, ownerID: ownerID };
    setState(tmpState);
    if(ownerID !== -1)
      getCards();
  }, [ownerID]);
  useEffect(() => {
    if(ownerID !== -1)
      getCards();
  }, [refresh]);
  const cardCellList = [
    { key: 'last_digits', field: '' },
    { key: 'name', field: '' },
    { key: 'expiry_date', field: '' }
  ];
  const getBuildigs = () => {
    setVisibleIndicator(true);
    OwnerService.getBuildingListByOwner()
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              if (data.buildinglist) {
                if(data.buildinglist.length !== 0)
                  setOwnerID(data.buildinglist[0].userID);
              }
              break;
            case 401:
              authService.logout();
              history.push('/login');
              window.location.reload();
              break;
            default:
              ToastsStore.error(response.data.message);
          }
        },
        error => {
          ToastsStore.error("Can't connect to the server!");
          setVisibleIndicator(false);
        }
      );
  }
  const getCards = () => {
    const requestData = {
      'ownerID': ownerID
    }
    setVisibleIndicator(true);
    OwnerService.getCardList(requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              let list = data.cardlist;
              for (let i = 0; i < list.length; i++) {
                let numberValidation = validator.number(list[i].card_number);
                if (numberValidation.isPotentiallyValid) {
                  if (numberValidation.card) {
                    var digits = String(list[i].card_number);
                    list[i].last_digits = numberValidation.card.niceType + '-' + digits.substring(digits.length - 4);
                  } else
                    list[i].last_digits = list[i].card_number;
                } else
                  list[i].last_digits = list[i].card_number;
              }
              setCardDataList(list);
              break;
            case 401:
              authService.logout();
              history.push('/login');
              window.location.reload();
              break;
            default:
              ToastsStore.error(response.data.message);
          }
        },
        error => {
          ToastsStore.error("Can't connect to the server!");
          setVisibleIndicator(false);
        }
      );
  }
  const handleClose = () => {
    setOpen(false);
  };
  const handleAdd = () => {
    ToastsStore.success("Added New Card successfully!");
    setRefresh(!refresh);
  };
  const handleUpdate = () => {
    ToastsStore.success("Updated successfully!");
    setRefresh(!refresh);
  };
  const handleClickAddCard = () => {
    let tmpState = { method: 'add', buttonText: 'Ajouter', pos: -1, ownerID: ownerID };
    setState(tmpState);
    setOpen(true);
  }
  const handleClickEditCard = (id) => {
    let tmpState = { method: 'edit', buttonText: 'Mettre à jour', pos: id, ownerID: ownerID };
    setState(tmpState);
    setOpen(true);
  }
  const handleClickDeleteCard = (id) => {
    setOpenDelete(true);
    setDeleteId(id);
  }
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleDelete = () => {
    handleCloseDelete();
    setDeleteId(-1);
    setVisibleIndicator(true);
    let data = {
      'status': 'trash',
    }
    OwnerService.deleteCard(deleteId, data)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              ToastsStore.success("Deleted Successfully!");
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              setRefresh(!refresh);
              break;
            case 401:
              authService.logout();
              history.push('/login');
              window.location.reload();
              break;
            default:
              ToastsStore.error(response.data.message);
          }
        },
        error => {
          ToastsStore.error("Can't connect to the server!");
          setVisibleIndicator(false);
        }
      );
  }
  return (
    <div className={classes.root}>
      {
        visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
      }
      <div className={classes.title}>
        <Grid item>
          <p className={classes.headerTitle}><b>Moyens de paiement</b></p>
        </Grid>
      </div>
      <div className={classes.tool}>
      </div>
      <Grid container direction="column" >
        <Grid item container>
          <Grid item container justify="flex-start" direction="column" className={classes.item}>
            <Grid item>
              <p className={classes.sepaTitle}><b>carte bancaire</b></p>
            </Grid>
          </Grid>
          <Grid item sm={7}>
            <MyTableCard
              products={cardDataList}
              cells={cardCellList}
              leftBtn="ajouter une carte"
              onClickEdit={handleClickEditCard}
              onClickDelete={handleClickDeleteCard}
              onClickAdd={handleClickAddCard}
            />
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              classes={{ paper: classes.paper }}
            >
              <Grid item container className={classes.padding} justify="space-between">
                <Grid item container direction="row-reverse"><CloseIcon onClick={handleClose} className={classes.close} /></Grid>
                <Grid item>
                  <h2 id="transition-modal-title" className={classes.modalTitle}>
                    {state.method === 'add' ? "Ajouter Carte" : "Mettre à jour Carte"}
                  </h2>
                </Grid>
              </Grid>
              <BankCard onCancel={handleClose} onAdd={handleAdd} onUpdate={handleUpdate} state={state} />
            </Dialog>
          </Grid>
        </Grid>
      </Grid>
      <DeleteConfirmDialog
        openDelete={openDelete}
        handleCloseDelete={handleCloseDelete}
        handleDelete={handleDelete}
        account={'card'}
      />
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};

export default withRouter(PaymentMethods);
