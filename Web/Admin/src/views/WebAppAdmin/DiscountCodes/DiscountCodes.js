import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import MyTable from '../../../components/MyTable';
import CircularProgress from '@material-ui/core/CircularProgress';
import AdminService from '../../../services/api.js';
import authService from '../../../services/authService.js';
import useStyles from './useStyles';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
const DiscountCodes = (props) => {
  const { history } = props;

  const token = authService.getToken();
  if (!token) {
    window.location.replace("/login");
  }
  const accessDiscountCodes = authService.getAccess('role_discountcodes');

  const [openDelete, setOpenDelete] = React.useState(false);
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const [deleteId, setDeleteId] = useState(-1);
  const classes = useStyles();
  const [dataList, setDataList] = useState([]);
  const [totalpage, setTotalPage] = useState(1);
  const [row_count, setRowCount] = useState(20);
  const [page_num, setPageNum] = useState(1);
  const [sort_column, setSortColumn] = useState(-1);
  const [sort_method, setSortMethod] = useState('asc');
  const selectList = [20, 50, 100, 200, -1];
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleChangeSelect = (value) => {
    setRowCount(selectList[value]);
  }
  const handleChangePagination = (value) => {
    setPageNum(value);
  }
  const handleSort = (index, direct) => {
    setSortColumn(index);
    setSortMethod(direct);
  }
  const getDatas = () => {
    const requestData = {
      'search_key': '',
      'page_num': page_num - 1,
      'row_count': row_count,
      'sort_column': sort_column,
      'sort_method': sort_method,
      'status': 'active'
    }
    setVisibleIndicator(true);
    AdminService.getDiscountCodesList(requestData)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              if (!data.totalpage)
                setTotalPage(1);
              else
                setTotalPage(data.totalpage);
              let list = data.discountCodeslist;
              for(let i = 0 ; i < list.length ; i++){
                if(list[i].discount_type === 'fixed')
                  list[i].discount_amount = list[i].discount_amount + '€';
                if(list[i].discount_type === 'percentage')
                  list[i].discount_amount = list[i].discount_amount + '%';
                list[i].end_date = list[i].end_date === '' ? '-' : list[i].end_date;
                let cnt = list[i].count ? list[i].count : 0;
                let max = list[i].amount_of_use === -1 ? '-' : list[i].amount_of_use;
                list[i].activations = cnt + '/' + max;
              }
              setDataList(list);
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
          setVisibleIndicator(false);
          ToastsStore.error("Can't connect to the server.");
        }
      );
  }
  useEffect(() => {
    if (accessDiscountCodes !== 'denied')
      getDatas();
  }, [page_num, row_count, sort_column, sort_method, props.refresh]);
  const cellList = [
    { key: 'name', field: 'Nom' },
    { key: 'user_type', field: 'Catégorie' },
    { key: 'discount_amount', field: 'Réduction' },
    { key: 'start_date', field: 'Début' },
    { key: 'end_date', field: 'Fin' },
    { key: 'activations', field: 'Activations' },
    { key: 'status', field: 'Statut' }
  ];
  const columns = [];
  for (let i = 0; i < 7; i++)
    columns[i] = 'asc';
  const handleClickEdit = (id) => {
    history.push('/admin/discountcodes/edit/' + id);
    window.location.reload();
  };
  const handleClickDelete = (id) => {
    if (accessDiscountCodes === 'edit') {
      setOpenDelete(true);
      setDeleteId(id);
    }
  };
  const handleDelete = () => {
    handleCloseDelete();
    setDeleteId(-1);
    setVisibleIndicator(true);
    let data = {
      'status': 'trash'
    }
    AdminService.deleteDiscountCode(deleteId, data)
      .then(
        response => {
          setVisibleIndicator(false);
          switch (response.data.code) {
            case 200:
              const data = response.data.data;
              localStorage.setItem("token", JSON.stringify(data.token));
              ToastsStore.success("Deleted successfully!");
              getDatas();
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
    <>
      {
        visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
      }
      <div className={classes.tool}>
      </div>
      <div className={classes.body}>
        <MyTable
          onChangeSelect={handleChangeSelect}
          onChangePage={handleChangePagination}
          onSelectSort={handleSort}
          page={page_num}
          columns={columns}
          products={dataList}
          totalpage={totalpage}
          cells={cellList}
          onClickEdit={handleClickEdit}
          onClickDelete={handleClickDelete}
          access={accessDiscountCodes}
        />
      </div>
      <DeleteConfirmDialog
                openDelete={openDelete}
                handleCloseDelete={handleCloseDelete}
                handleDelete={handleDelete}
                account={'code'}
            />
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </>
  );
};

export default withRouter(DiscountCodes);
