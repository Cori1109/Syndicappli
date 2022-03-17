import React , {useEffect} from 'react';
import { ToastsContainer, ToastsContainerPosition, ToastsStore } from 'react-toasts';
import { withRouter } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import CircularProgress from '@material-ui/core/CircularProgress';
import { OwnerService as Service} from 'services/api';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
    root: {
      [theme.breakpoints.up('xl')]: {
        paddingTop: theme.spacing(12.5),
      },
      [theme.breakpoints.between('lg', 'lg')]: {
        paddingTop: theme.spacing(10.5),
      },
      [theme.breakpoints.down('md')]: {
        paddingTop: theme.spacing(9),
      },
      paddingTop: theme.spacing(15),
      justifyContent: 'center',
    },
    title: {
      [theme.breakpoints.up('xl')]: {
        width: 958,
        padding: 61,
        fontSize: 20,
        textIndent: -10,
      },
      [theme.breakpoints.down('lg')]: {
        width: 670,
        padding: 42,
        fontSize: 14,
        textIndent: -7,
      },
      [theme.breakpoints.down('md')]: {
        width: 469,
        padding: 29,
        fontSize: 10,
        textIndent: -5,
      },
      color: 'white',
      textAlign: 'center'
    },
    logo: {
      [theme.breakpoints.up('xl')]: {
        width: 438,
        height: 90
      },
      [theme.breakpoints.down('lg')]: {
        width: 306,
        height: 63
      },
      [theme.breakpoints.down('md')]: {
        width: 214,
        height: 44
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
const AcceptInvitation = (props) => {
  const classes = useStyles();
  const { history } = props;
  const [visibleIndicator, setVisibleIndicator] = React.useState(false);
  useEffect(() => {
    let params = new URLSearchParams(window.location.search);
    var data = {};
    data['token'] = params.get('token');
    setVisibleIndicator(true);
    OwnerService.acceptInvitation(data)
      .then(
        response => {
          setVisibleIndicator(false);
          if (response.data.code !== 200) {
            ToastsStore.error(response.data.message);
          } else {
            ToastsStore.success(response.data.message);
            history.push('/login');
          }
        },
        error => {
          setVisibleIndicator(false);
          ToastsStore.error("Can't connect to the Server!");
        }
      );
  }, []);
  const logo = {
    url: '/images/Login.png',
  };
  return (
    <div>
      {
        visibleIndicator ? <div className={classes.div_indicator}> <CircularProgress className={classes.indicator} /> </div> : null
      }

      <Grid container direction="column" justify="flex-start" className={classes.root}>
        <Grid item container justify="center">
          <img src={logo.url} className={classes.logo} alt="" />
        </Grid>
        <Grid item container justify="center">
          <p className={classes.title}>Bienvenue sur votre espace personnel de connexion.<br /> Veuillez entrer votre identifiant Email et votre mot de passe personnel pour vous connecter. </p>
        </Grid>
      </Grid>
      <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_RIGHT} />
    </div>
  );
};
export default withRouter(AcceptInvitation);
