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
      // [theme.breakpoints.up('xl')]: {
      //   height: 30,
      //   paddingTop: "8px"
      // },
      // [theme.breakpoints.between('lg','lg')]: {
      //   height: 30,
      //   paddingTop: "8px"
      // },
      // [theme.breakpoints.down('md')]: {
      //   height: 30,
      //   paddingTop: "8px"
      // },
      color: 'gray'
    },
    '& .MuiAutocomplete-inputRoot[class*="MuiOutlinedInput-root"] .MuiAutocomplete-input':{
      // padding: "0px"
    }
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

export default function CustomizedSelects(props) {
  const classes = useStyles(props);
  const [items, setItems] = React.useState(props.data);
  const [value, setValue] = React.useState(props.value);
  const handleChange = (event, values) => {
    let result = 0;
    for (let i in items) {
      if (items[i] === values)
        result = i;
    }
    props.onChangeSelect(result);
    
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