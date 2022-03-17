import React, { useState, useEffect } from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import Grid from '@material-ui/core/Grid';
import { withRouter } from 'react-router-dom';
import authService from 'services/authService.js';
import { ManagerService as Service } from 'services/api.js';
import MySelect from 'components/MySelect';
import useStyles from './useStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import useGlobal from 'Global/global';
import DeleteConfirmDialog from 'components/DeleteConfirmDialog';
import PostalVotesTable from './compoment/PostalVotesTable';

const ManagerService = new Service();

const Resolutions = (props) => {
    const { history } = props;
    const token = authService.getToken();
    if (!token) {
        window.location.replace("/login");
    }
    const accessAssemblies = authService.getAccess('role_assemblies');
    const [visibleIndicator, setVisibleIndicator] = React.useState(false);
    const classes = useStyles();
    const [globalState, globalActions] = useGlobal();
    const [openDelete, setOpenDelete] = React.useState(false);
    const [deleteId, setDeleteId] = React.useState(-1);
    const [dataList, setDataList] = useState([]);
    const [totalpage, setTotalPage] = useState(1);
    const [row_count, setRowCount] = useState(20);
    const [page_num, setPageNum] = useState(1);
    const [sort_column, setSortColumn] = useState(-1);
    const [sort_method, setSortMethod] = useState('asc');
    const selectList = [20, 50, 100, 200, -1];
    const cellList = [
        { key: 'fullname', field: 'Copropriétaire' },
        { key: 'apartments', field: 'Lots' },
        { key: 'type', field: 'Type de vote' },
    ];

    const columns = [];
    for (let i = 0; i < 3; i++)
        columns[i] = 'asc';

    const handleClickEdit = (id) => {
        globalActions.setPostalID(id);
    }
    useEffect(() => {
        if (accessAssemblies !== 'denied')
            getPostalVotes();
    }, [page_num, row_count, sort_column, sort_method, props.refresh]);

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

    const handleClickDelete = (id) => {
        setOpenDelete(true);
        setDeleteId(id);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    const handleDelete = () => {
        handleCloseDelete();
        setVisibleIndicator(true);
        let data = {
            'status': 'trash'
        }
        ManagerService.deletePostalVote(deleteId, data)
            .then(
                response => {
                    setVisibleIndicator(false);
                    switch (response.data.code) {
                        case 200:
                            const data = response.data.data;
                            localStorage.setItem("token", JSON.stringify(data.token));
                            ToastsStore.success("Deleted successfully!");
                            getPostalVotes();
                            setDeleteId(-1);
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
    const getPostalVotes = () => {
        let url = window.location;
        let parts = url.href.split('/');
        const assemblyID = Number(parts[parts.length - 1]);
        setVisibleIndicator(true);
        ManagerService.getAssemblyFiles(assemblyID)
        const requestData = {
            'search_key': '',
            'page_num': page_num - 1,
            'row_count': row_count,
            'sort_column': sort_column,
            'sort_method': sort_method,
            'assemblyID': assemblyID,
        }
        setVisibleIndicator(true);
        ManagerService.getPostalVoteList(requestData)
            .then(
                response => {
                    setVisibleIndicator(false);
                    switch (response.data.code) {
                        case 200:
                            const data = response.data.data;
                            localStorage.setItem("token", JSON.stringify(data.token));
                            setDataList(data.votes)
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
        <div>
            { visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null }
            <div className={classes.title}>
            </div>
            <div >
                <PostalVotesTable
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
                    access={accessAssemblies}
                />
            </div>
            <DeleteConfirmDialog
                openDelete={openDelete}
                handleCloseDelete={handleCloseDelete}
                handleDelete={handleDelete}
                account={'decision'}
            />
            <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
        </div>
    );
};

export default withRouter(Resolutions);
