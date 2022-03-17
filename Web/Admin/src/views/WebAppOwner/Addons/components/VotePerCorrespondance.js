import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import MyButton from 'components/MyButton';
import MySelect from 'components/MySelect';
import { OwnerService as Service } from 'services/api.js';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import CircularProgress from '@material-ui/core/CircularProgress';
import authService from 'services/authService';
import { withRouter } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { makeStyles } from '@material-ui/styles';

export const useStyles = makeStyles(theme => ({
    paper: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: 5,
        padding: theme.spacing(2, 4, 3),
    },
    footer: {
      [theme.breakpoints.up('xl')]: {
        paddingTop: 89,
      },
      [theme.breakpoints.down('lg')]: {
        paddingTop: 62,
      },
      [theme.breakpoints.down('md')]: {
        paddingTop: 43,
      },
      paddingBottom: 30
    },
    root: {
      '& .MuiOutlinedInput-multiline':{
        padding: 0,
        lineHeight: 'normal'
      },
      '& .MuiOutlinedInput-input':{
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
      '& p':{
        marginBottom: 0
      }
    },
    plus:{
      color: '#707070',
      [theme.breakpoints.up('xl')]: {
        width:31 , 
        height: 31,
      },
      [theme.breakpoints.down('lg')]: {
        width:22 , 
        height: 22,
      },
      [theme.breakpoints.down('md')]: {
        width:15 , 
        height: 15,
      },
    },
    input: {
        display: 'none'
    },
    img: {
      objectFit:'cover',
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        border: '1px dashed rgba(112,112,112,0.43)',
        borderRadius: 8,
        [theme.breakpoints.up('xl')]: {
          width: 116,
          height: 92,
          marginTop: 20,
          marginRight: 20
        },
        [theme.breakpoints.down('lg')]: {
          width: 81,
          height: 64,
          marginTop: 14,
          marginRight: 14
        },
        [theme.breakpoints.down('md')]: {
          width: 57,
          height: 45,
          marginTop: 10,
          marginRight: 10
        },
    },
    title:{
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
    error:{
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
  }));
const OwnerService = new Service();

const VotePerCorrespondance = (props) => {
    const { history } = props;
    const classes = useStyles();
    const [visibleIndicator, setVisibleIndicator] = React.useState(false);
    const [buildings, setBuildings] = useState([]);
    const [building, setBuilding] = useState('');
    const [assemblies, setAssemblies] = useState([]);
    const [assembly, setAssembly] = useState('');

    const [errorsBuildings, setErrorsBuildings] = useState('');
    const [errorsAssemblies, setErrorsAssemblies] = useState('');
    const handleClickBuy = ()=>{
        let cnt = 0;
        if (building.length === 0) { setErrorsBuildings('please select building'); cnt++; }
        else setErrorsBuildings('');
        if (assembly.length === 0) { setErrorsAssemblies('please select assembly'); cnt++; }
        else setErrorsAssemblies('');
        if(cnt === 0)
            props.onBuy();
    }
    const handleChangeBuildings = (event)=>{

    }
    const handleChangeAssemblies = (event)=>{

    }
    return (
        <Scrollbars style={{ height: '30vh' }}>
            <div className={classes.root}>
                {
                    visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
                }
                <div className={classes.paper} sm={12}>
                <Grid container spacing={2} >
                        <Grid item container alignItems="center" spacing={1}>
                            <Grid item><p className={classes.title}>Immeuble</p></Grid>
                            <Grid xs item container direction="column">
                                <MySelect
                                    color="gray"
                                    data={building}
                                    onChangeSelect={handleChangeBuildings}
                                    value={buildings}
                                    width="50%"
                                />
                                {errorsBuildings.length > 0 &&
                                    <span className={classes.error}>{errorsBuildings}</span>}
                            </Grid>
                        </Grid>
                        <Grid item container alignItems="center" spacing={1}>
                            <Grid item><p className={classes.title}>Assemblée Générale</p></Grid>
                            <Grid xs item container direction="column">
                                <MySelect
                                    color="gray"
                                    data={assembly}
                                    onChangeSelect={handleChangeAssemblies}
                                    value={assemblies}
                                    width="50%"
                                />
                                {errorsAssemblies.length > 0 &&
                                    <span className={classes.error}>{errorsAssemblies}</span>}
                            </Grid>
                        </Grid>
                    </Grid>    
                    <div className={classes.footer}>
                        <Grid container>
                            <MyButton name={"J'achète le module"} color={"1"} onClick={handleClickBuy} />
                        </Grid>
                    </div>
                </div>
                <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
            </div>
        </Scrollbars>
    );
};

export default withRouter(VotePerCorrespondance);
