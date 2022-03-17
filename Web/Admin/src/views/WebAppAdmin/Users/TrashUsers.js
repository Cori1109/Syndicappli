import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import AdminService from '../../../services/api.js';
import authService from '../../../services/authService.js';
import useStyles from './useStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastsStore } from 'react-toasts';
import TrashTable from 'components/TrashTable';
import useGlobal from 'Global/global.js';

const TrashUsers = (props) => {
  const { history } = props;

  const token = authService.getToken();    
  if (!token) {
    window.location.replace("/login");
  }
  const [globalState, globalActions] = useGlobal();
  const accessUsers = authService.getAccess('role_users');
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  const classes = useStyles();
  const [dataList, setDataList] = useState([]);
  const [totalpage, setTotalPage] = useState(1);
  const [row_count, setRowCount] = useState(20);
  const [page_num, setPageNum] = useState(1);
  const [sort_column, setSortColumn] = useState(-1);
  const [sort_method, setSortMethod] = useState('asc');
  const selectList = [20, 50, 100, 200, -1];

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
  const getTrashUsers = () => {
    const requestData = {
      'search_key': '',
      'page_num': page_num - 1,
      'row_count': row_count,
      'sort_column': sort_column,
      'sort_method': sort_method,
      'status' : 'trash'
    }
    setVisibleIndicator(true);
    AdminService.getUserList(requestData)
      .then(
        response => {
          setVisibleIndicator(false);  
          switch(response.data.code){
            case 200:
                const data = response.data.data;
                localStorage.setItem("token", JSON.stringify(data.token));
                if(data.totalpage)
                    setTotalPage(data.totalpage);
                else
                    setTotalPage(1);
                setDataList(data.userlist);
                let userID = [];
                data.userlist.map((item, i) => (
                  userID[i] = item.userID
                )
                );
                globalActions.setTrash({type : 'user', ID : userID});
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
  useEffect(() => {
    if (accessUsers !== 'denied')
      getTrashUsers();
  }, [page_num, row_count, sort_column, sort_method,props.refresh]);
  const cellList = [
    { key: 'lastname', field: 'Nom' },
    { key: 'firstname', field: 'Prénom' },
    { key: 'email', field: 'Email' },
    { key: 'phone', field: 'Téléphone' },
  ];
  const columns = [];
  for (let i = 0; i < 4; i++)
    columns[i] = 'asc';

  const handleClickRestore = (id) => {
    setVisibleIndicator(true);
    let data={
        'status': 'active'
    }
    AdminService.deleteUser(id,data)
      .then(
        response => {
          setVisibleIndicator(false);  
          if (response.data.code !== 200) {
            ToastsStore.error(response.data.message);
          } else {
            ToastsStore.success("Restored Successfully!");
            const data = response.data.data;
            localStorage.setItem("token", JSON.stringify(data.token));
            getTrashUsers();
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
      <div className={classes.body}>
        <TrashTable
          onChangeSelect={handleChangeSelect}
          onChangePage={handleChangePagination}
          onSelectSort={handleSort}
          page={page_num}
          columns={columns}
          products={dataList}
          totalpage={totalpage}
          cells={cellList}
          onClickRestore={handleClickRestore}
          access={accessUsers}
        />
      </div>
    </>
  );
};

export default withRouter(TrashUsers);
