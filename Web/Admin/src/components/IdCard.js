import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import CloseIcon from '@material-ui/icons/Close';
import { Avatar } from '@material-ui/core';
const useStyles = makeStyles((theme,props) => ({
  root: {

  },
  badge1: {
    cursor: 'pointer',
    [theme.breakpoints.up('xl')]: {
      width: 54,
      height: 54,
      marginRight: -30
    },
    [theme.breakpoints.down('lg')]: {
      width: 38,
      height: 38,
      marginRight: -21
    },
    [theme.breakpoints.down('md')]: {
      width: 27,
      height: 27,
      marginRight: -15
    },
    background: 'linear-gradient(0deg, #00C9FF 10%, #0CC77C 90%)',
    borderRadius: '50%',
    color: 'white',
  },
  badge2: {
    cursor: 'pointer',
    [theme.breakpoints.up('xl')]: {
      width: 31,
      height: 31,
    },
    [theme.breakpoints.down('lg')]: {
      width: 22,
      height: 22,
    },
    [theme.breakpoints.down('md')]: {
      width: 15,
      height: 15,
    },
    background: 'linear-gradient(0deg, #00C9FF 10%, #0CC77C 90%)',
    borderRadius: '50%',
    color: 'white',
  },
  identify1: {
     alignItems: 'center',
     justifyContent: 'center',
     display: 'flex',
     border: '1px dashed rgba(112,112,112,0.43)',
     borderRadius: 8,
     [theme.breakpoints.up('xl')]: {
      width: 362,
      height: 278,
      marginTop: 30,
      marginRight: 30
    },
    [theme.breakpoints.down('lg')]: {
      width: 253,
      height: 177,
      marginTop: 21,
      marginRight: 21
    },
    [theme.breakpoints.down('md')]: {
      width: 177,
      height: 124,
      marginTop: 15,
      marginRight: 15
    },
   },
   identify2: {
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
}));

export default function IdCard(props) {
  const classes = useStyles(props);
  var idcard = props.idcardurls;
  const handleClose = (num)=> {
    props.onClose(num);
  }

  return (
    <div className={classes.root}>
      {
        idcard.map((idcardurl,i)=>(
            <Badge  
            key={i}
              overlap="circle"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
                border: '2px solid gray',
                padding: '1px 4px',
              }}
              badgeContent={<CloseIcon onClick={props.disabled ? null : () => handleClose(i)} 
                className={props.badge === 'first' ? classes.badge1 : classes.badge2}/>}
            >
              <Avatar className={props.type === 'first' ? classes.identify1 : classes.identify2} alt="" src={idcardurl} />
            </Badge>
        ))
      }  
    </div>     
  );
}