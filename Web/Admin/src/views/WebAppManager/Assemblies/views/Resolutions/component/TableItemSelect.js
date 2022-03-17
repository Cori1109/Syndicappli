import React, { useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

const CustomAutocomplete = withStyles((theme) => ({
  root: {
    '& .MuiInputBase-root.MuiOutlinedInput-root.MuiAutocomplete-inputRoot.MuiInputBase-fullWidth.MuiInputBase-formControl': {
      color: 'gray'
    },
  }
}))(Autocomplete);

const useStyles = makeStyles((theme, props) => ({
  margin: {
    width: props => props.width,
    '& .MuiSelect-select.MuiSelect-select': {
      borderColor: props => props.color
    },
    '& .MuiSelect-icon': {
      color: 'gray'
    },
  },
}));

export default function TableItemSelect(props) {
  const classes = useStyles(props);
  const [items, setItems] = React.useState(props.data);
  const [value, setValue] = React.useState(props.value);
  const handleChange = (event, values) => {
    let result = 0;
    for (let i in items) {
      if (items[i] === values)
        result = i;
    }
    props.onChangeSelect(result, props.pos);
    
  };

  return (
      <FormControl className={classes.margin}>
        <CustomAutocomplete
          options={items}
          value={items[props.value]}
          onChange={(event,values)=>handleChange(event, values)}
          size="small"
          renderInput={(params) => <TextField {...params} label={props.label} variant="outlined" />}
          disabled={props.disabled === true? true : null}
        />
        
      </FormControl>
  );
}