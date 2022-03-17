import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import MyButton from 'components/MyButton';
import authService from 'services/authService.js';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';
import useStyles from './useStyles';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import Badge from '@material-ui/core/Badge';
import CloseIcon from '@material-ui/icons/Close';
import Document from 'components/Document';
import { ManagerService as Service } from '../../../../../services/api.js';
const ManagerService = new Service();
const Documents = (props) => {
    const classes = useStyles();
    const { history } = props;
    const accessAssemblies = authService.getAccess('role_assemblies');
    const [visibleIndicator, setVisibleIndicator] = useState(false);
    const [docurl, setDocUrl] = React.useState("");
    const [doc, setDoc] = React.useState(null);
    const [doc_name, setDocName] = useState('');
    const [dataList, setDataList] = useState([]);
    const [thumbnails, setThumbnails] = useState([]);

    useEffect(() => {
        if (accessAssemblies !== 'denied') {
            getAssemblyDocuments();
        }
    }, [thumbnails]);
    
    const handleLoadDocument = (event) => {
        if (event.target.files[0].size > 5 * 1048576) {
            ToastsStore.warning('Document size should be low than 5 MB.');
        } else {
            setDoc(event.target.files[0]);
            setDocUrl(URL.createObjectURL(event.target.files[0]));
        }
    }
    const handleDragOverDocument = (event)=>{
        event.preventDefault();
        return false;
    }
    const handleDropDocument = (event)=>{
        event.preventDefault();
        if (event.dataTransfer.files[0] !== undefined) {
            if (event.dataTransfer.files[0].size > 5 * 1048576) {
                ToastsStore.warning('Document size should be low than 5 MB.');
            } else {
                setDoc(event.dataTransfer.files[0]);
                setDocUrl(URL.createObjectURL(event.dataTransfer.files[0]));
                setDocName(event.dataTransfer.files[0].name)
            }
        }
    }
    const handleClickDelete = (index)=>{
        console.log("index =", index)
        ManagerService.deleteAssemblyFile(index)
        .then(
            response => {
                setVisibleIndicator(false);
                switch (response.data.code) {
                    case 200:
                        const data = response.data.data;
                        localStorage.setItem("token", JSON.stringify(data.token));
                        getAssemblyDocuments();
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
    const getAssemblyDocuments = () => {
        let url = window.location;
        let parts = url.href.split('/');
        const assemblyID = Number(parts[parts.length - 1]);
        setVisibleIndicator(true);
        ManagerService.getAssemblyFiles(assemblyID)
        .then(
            response => {
                setVisibleIndicator(false);
                switch (response.data.code) {
                    case 200:
                        thumbnails.splice(0, thumbnails.length);
                        const data = response.data.data;
                        localStorage.setItem("token", JSON.stringify(data.token));
                        for (var i = 0; i < data.files.length; i++) {
                            const extend = data.files[i].name.split('.')[1];
                            if (extend.includes("doc")) {
                                thumbnails.push("/images/doc.png")
                            } else if (extend.includes("pdf")) {
                                thumbnails.push("/images/pdf.png")
                            } else if (extend.includes("png")) {
                                thumbnails.push(data.files[i].url)
                            } else {
                                thumbnails.push("/images/attachment.png")
                            }
                            setThumbnails(thumbnails);
                        }
                        setDataList(data.files);
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
    const getThumbnails = () => {
        for (var i = 0; i < dataList.length; i++) {
            const extend = dataList[i].name.split('.')[1];
            if (extend.includes("doc")) {
                thumbnails.push("/images/doc.png")
            } else if (extend.includes("pdf")) {
                thumbnails.push("/images/pdf.png")
            } else if (extend.includes("png")) {
                thumbnails.push(dataList[i].url)
            } else {
                thumbnails.push("/images/attachment.png")
            }
            setThumbnails(thumbnails);
        }
    }
    const handleClickAdd = () => {
        let url = window.location;
        let parts = url.href.split('/');
        const assemblyID = Number(parts[parts.length - 1]);
        let formdata = new FormData();
        formdata.set('assemblyID', assemblyID);
        formdata.set('file', doc);
        formdata.set('url', docurl);
        console.log(formdata)
        setVisibleIndicator(true);
        ManagerService.createAssemblyFile(formdata)
        .then(
            response => {
                setVisibleIndicator(false);
                switch (response.data.code) {
                    case 200:
                        thumbnails.splice(0, thumbnails.length);
                        const data = response.data.data;
                        localStorage.setItem("token", JSON.stringify(data.token));
                        setDocUrl("");
                        getAssemblyDocuments();
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
            { visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null }
            <Document
                onClickDelete = {handleClickDelete}
                files = {dataList}
                thumbnails = {thumbnails}
            />
            <Grid item container spacing={3} direction="column">
                <Grid item justify="center" container>
                    <p className={classes.uploadHelp}>Cliquez ou glissez pour déposer de nouveaux documents...</p>
                </Grid>
                <Grid item alignItems="center" justify="center" container>
                    <input 
                        className={classes.input} 
                        accept="*"
                        type="file" 
                        id="docpicker" 
                        onChange={accessAssemblies === 'see' ? handleLoadDocument : null } 
                    />
                    <label htmlFor="docpicker">
                        {
                            docurl === '' ?
                            <div  
                                className={classes.img} 
                                onDragOver={accessAssemblies === 'see' ? handleDragOverDocument : null} 
                                onDrop={accessAssemblies === 'see' ? handleDropDocument : null}
                            >
                                <AddCircleOutlineIcon className={classes.plus} />
                            </div>
                            :
                            <div>
                                <img className={classes.img} src='/images/attachment.png' alt="" />
                                <p className={classes.doc_name}>{doc_name}</p>
                            </div>
                        }
                    </label>
                </Grid>
            </Grid>            
            <div className={classes.footer} style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                <Grid container justify="center">
                    <MyButton name={"Añadir"} color={"1"} onClick={handleClickAdd} />
                </Grid>
            </div>
            <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
        </div>
    );
};

export default withRouter(Documents);
