import React,{useState} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import {withRouter } from 'react-router-dom';
const DeleteConfirmDialog= (props)=> {
  const {history}=props;
  const [isDisableDelete, setIsDisableDelete] = useState(true);
  const handleCloseDelete = () => {
    props.handleCloseDelete();
  };
  const handleDelete = ()=>{
    setIsDisableDelete(true);
      props.handleDelete();
  }
  const inputTextChange = (event) => {
    console.log(event.target.value);
    if(event.target.value === "delete") {
      setIsDisableDelete(false);
    } else {
      setIsDisableDelete(true);
    }
  }
  return (
    <Dialog
    open={props.openDelete}
    onClose={handleCloseDelete}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      Are you sure to delete this {props.account}?
    </DialogTitle>
    <DialogContent>
    <DialogContentText id="alert-dialog-description">
        Type <b style={{color: "red"}}>delete</b> into the text field
      </DialogContentText>
      <TextField
        autoFocus
        margin="dense"
        id="text"            
        type="text"
        fullWidth
        variant="outlined"
        onChange={inputTextChange}
      />
    </DialogContent>
    <DialogActions>
      <Button autoFocus onClick={handleCloseDelete} color="primary">
        Cancel
      </Button>
      <Button disabled={isDisableDelete} onClick={handleDelete} color="primary">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
  );
}
export default withRouter(DeleteConfirmDialog);