import React from 'react';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import { withRouter } from 'react-router-dom';
import authService from '../../../services/authService.js';
import useStyles from './useStyles';
import ModuleCard from './components/ModuleCard';
import VotePerCorrespondance from './components/VotePerCorrespondance';
import Delegate from './components/Delegate.js';

const Addons = (props) => {
  const {history}=props;
  const token = authService.getToken();    
  if (!token) {
    window.location.replace("/login");
  }

  const classes = useStyles();
  const [openAdvance, setOpenAdvance] = React.useState(false);
  const [openDelegate, setOpenDelegate] = React.useState(false);
  const [openAudio, setOpenAudio] = React.useState(false);
  const [openVisio, setOpenVisio] = React.useState(false);

  const handleClickAdvance = ()=>{
    setOpenAdvance(true);
    // alert('advance')
  }
  const handleClickDelegate = ()=>{
    setOpenDelegate(true);
    // alert('delegate')
  }
  const handleClickAudio = ()=>{
    setOpenAudio(true);
    // alert('audio')
  }
  const handleClickVisio = ()=>{
    setOpenVisio(true);
    // alert('visio')
  }
  const handleCloseAdvance = () => {
    setOpenAdvance(false);
  };
  const handleCloseDelegate = () => {
    setOpenDelegate(false);
  };
  const handleCloseAudio = () => {
    setOpenAudio(false);
  };
  const handleCloseVisio = () => {
    setOpenVisio(false);
  };
const handleClickBuy = () => {
  history.push('/addons/payment');
  window.location.reload();
};
  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Grid item container alignItems="center">
          <Grid item xs={12} sm={6} container justify="flex-start" >
            <Grid item>
              <p className={classes.titleText}>
                <b>Modules</b>
              </p>
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div className={classes.body}>
        <Grid container direction="column" spacing={5}>
          <Grid item>
            <p className={classes.itemTitle}>Conformément à l’article 17-1 A de la Loi n° 65-557 du 10 juillet 1965 fixant le statut de la copropriété des immeubles 
              bâtis, les copropriétaires peuvent participer à l'assemblée générale par visioconférence ou par tout autre moyen de 
              communication électronique permettant leur identification.</p>
          </Grid>
          <Grid item>
            <p className={classes.itemTitle}>Conformément à l’article 13-1 du Décret n°67-223 du 17 mars 1967 pris pour l'application de la loi n° 65-557 du 10 
              juillet 1965 fixant le statut de la copropriété des immeubles bâtis, les supports doivent, au moins, transmettre leur 
              voix et permettre la retransmission continue et simultanée des délibérations pour garantir la participation effective 
              des copropriétaires.</p>
          </Grid>
        </Grid>
        <Grid item container spacing={2}>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={3}>
            <ModuleCard 
              title="Voter par correspondance"
              src="/images/advance.png"
              details="Module vous permettant de déléguer votre droit de 
                vote à un mandataire de votre choix, qu’il soit ou non 
                membre du Syndicat des copropriétaires. Pour cela, 
                vous devez acheter ce module au tarif de :"
              price="4.90€"
              onClick={handleClickAdvance}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={3}>
            <ModuleCard 
              title="Déléguer mon pouvoir"
              src="/images/delegate.png"
              details="Module vous permettant de voter l’ensemble des 
                résolutions avant la tenue de l’Assemblée Générale, au 
                moyen d’un formulaire à remplir.Pour cela, vous devez 
                acheter ce module au tarif de :"
              price="2.90€"
              onClick={handleClickDelegate}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={3}>
            <ModuleCard 
              title="Participer à une Assemblée Générale 
                      à Distance en Audio Conférence"
              src="/images/audio.png"
              details="Module vous permettant de participer à l'Assemblée 
                Générale en Audioconférence. Pour cela, vous devez 
                acheter ce module au tarif de :"
              price="9.90€"
              onClick={handleClickAudio}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={6} lg={6} xl={3}>
            <ModuleCard 
              title="Participer à une Assemblée Générale à 
                      Distance en Visio Conférence à 360°"
              src="/images/visio.png"
              details="Module vous permettant de participer à l'Assemblée 
                Générale en visioconférence à 360° en totale immersion. 
                Pour cela, vous devez acheter ce module au tarif de :"
              price="12.90€"
              onClick={handleClickVisio}
            />
          </Grid>
        </Grid>
      </div>
      <Dialog
          open={openAdvance}
          onClose={handleCloseAdvance}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          classes={{paper: classes.paper}}
      >
          <Grid item container className={classes.padding} justify="space-between">
              <Grid item container direction="row-reverse"><CloseIcon onClick={handleCloseAdvance} className={classes.close} /></Grid>
              <Grid item><h2 id="transition-modal-title" className={classes.modalTitle}>Voter par correspondance</h2></Grid>
          </Grid>
          <VotePerCorrespondance onCancel={handleCloseAdvance} onBuy={handleClickBuy}/>
      </Dialog>
      <Dialog
          open={openDelegate}
          onClose={handleCloseDelegate}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          classes={{paper: classes.paper}}
      >
          <Grid item container className={classes.padding} justify="space-between">
              <Grid item container direction="row-reverse"><CloseIcon onClick={handleCloseDelegate} className={classes.close} /></Grid>
              <Grid item><h2 id="transition-modal-title" className={classes.modalTitle}>Déléguer mon pouvoir</h2></Grid>
          </Grid>
          <Delegate onCancel={handleCloseDelegate} onBuy={handleClickBuy}/>
      </Dialog>
      <Dialog
          open={openAudio}
          onClose={handleCloseAudio}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          classes={{paper: classes.paper}}
      >
          <Grid item container className={classes.padding} justify="space-between">
              <Grid item container direction="row-reverse"><CloseIcon onClick={handleCloseAudio} className={classes.close} /></Grid>
              <Grid item><h2 id="transition-modal-title" className={classes.modalTitle}>Participer à une Assemblée Générale à Distance</h2></Grid>
          </Grid>
          <VotePerCorrespondance onCancel={handleCloseAudio} onBuy={handleClickBuy}/>
      </Dialog>
      <Dialog
          open={openVisio}
          onClose={handleCloseVisio}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          classes={{paper: classes.paper}}
      >
          <Grid item container className={classes.padding} justify="space-between">
              <Grid item container direction="row-reverse"><CloseIcon onClick={handleCloseVisio} className={classes.close} /></Grid>
              <Grid item><h2 id="transition-modal-title" className={classes.modalTitle}>Voter par correspondance</h2></Grid>
          </Grid>
          <VotePerCorrespondance onCancel={handleCloseVisio} onBuy={handleClickBuy}/>
      </Dialog>
      <div className={classes.tool}></div>
    </div>
  );
};

export default withRouter(Addons);
