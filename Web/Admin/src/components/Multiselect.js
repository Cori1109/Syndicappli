import React, { Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();
const Multiselect = (props)=> {
    const handleChange = async (value)=>{
      await props.onSelected(value);
    }
    return (
      <div style={{width: props.width}}>
        <Select 
          options={props.all} 
          value={props.selected}
          components={animatedComponents} 
          onChange={handleChange}
          isDisabled={props.disabled === true? true : false}
          isMulti />
      </div>
    );
}

export default Multiselect