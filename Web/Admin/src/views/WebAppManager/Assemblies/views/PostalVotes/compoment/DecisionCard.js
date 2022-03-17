import React, { useState, useEffect } from 'react';
import authService from 'services/authService.js';
import { withRouter } from 'react-router-dom';
import { Grid } from '@material-ui/core';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles, withStyles } from '@material-ui/core/styles';
const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            [theme.breakpoints.up('xl')]: {
                marginTop: 24,
            },
            [theme.breakpoints.between('lg', 'lg')]: {
                marginTop: 17,
            },
            [theme.breakpoints.down('md')]: {
                marginTop: 12,
            },
        },
    },
    input: {
        [theme.breakpoints.up('xl')]: {
            fontSize: 17,
            height: 33,

        },
        [theme.breakpoints.down('lg')]: {
            fontSize: 12,
            height: 23,
        },
        [theme.breakpoints.down('md')]: {
            fontSize: 8,
            height: 16,
        },
        borderRadius: 4,
        position: 'relative',
        // backgroundColor: 'white',
        border: '1px solid gray',
        color: 'gray',
        padding: '2px 24px',
        display: 'flex',
        alignItems: 'center',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            'Poppins',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#1499ff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);
const useStyles = makeStyles((theme,props)=>({

    decision: {
      [theme.breakpoints.up('xl')]: {
          fontSize :20
        },
        [theme.breakpoints.down('lg')]: {
          fontSize :14
        },
        [theme.breakpoints.down('md')]: {
          fontSize :10
        },
    },
    description: {
      [theme.breakpoints.up('xl')]: {
          fontSize :16
        },
        [theme.breakpoints.down('lg')]: {
          fontSize :11
        },
        [theme.breakpoints.down('md')]: {
          fontSize :8
        },
    },
    other: {
      [theme.breakpoints.up('xl')]: {
        fontSize :17
      },
      [theme.breakpoints.down('lg')]: {
        fontSize :12
      },
      [theme.breakpoints.down('md')]: {
        fontSize :8
      },
    },
    line: {
        backgroundColor: '#E8E8E8',
        height: 1
    },
    editHeader: {
        [theme.breakpoints.up('xl')]: {
          paddingLeft: 58,
          paddingRight: 58,
        },
        [theme.breakpoints.down('lg')]: {
          paddingLeft: 41,
          paddingRight: 41,
        },
        [theme.breakpoints.down('md')]: {
          paddingLeft: 29,
          paddingRight: 29,
        },
    },
    select: {
        backgroundRepeat: 'no-repeat, repeat',
        backgroundPosition: 'left 10px top 50%, 0 0',
        backgroundSize: '.65em auto, 100%',
    },
    flex: {
        display: 'flex', 
        alignItems:'center'
    }
  }));
const DecisionCard = (props) => {
    const classes = useStyles();
    const { history } = props;
    const accessAssemblies = authService.getAccess('role_assemblies');
    const dataList = [
        { img : 'url("/images/yes.png")', text : 'Pour'},
        { img : 'url("/images/no.png")', text : 'Contre'},
        { img: 'url("/images/abstention.png")', text : 'Abstention'},
        { img: 'url("/images/default.png")', text : 'Défaillant'},
        { img: 'url("/images/onhold.png")', text :'En attente'}
    ];
    const en_dataList = ['yes', 'no', 'abstention', 'deficient', 'onhold'];
    const [value, setValue] = React.useState({pos : 0, img : dataList[0]});
    const handleChange = (event) => {
        setValue({pos : event.target.value, img : dataList[event.target.value]});
    };
    const [sel, setSel] = useState(dataList[0]);
    return (
        <Grid container direction="column" spacing={5}>
            <Grid item>
                <div className={classes.line}></div>
            </Grid>
            <Grid item>
                <Grid item container direction="column" spacing={3} className={classes.editHeader}>
                    <Grid item>
                        <Grid item container spacing={2}>
                            <Grid item className={classes.flex}>
                                <p className={classes.decision}><b>Résolution n°{props.decision_number} : </b></p>
                            </Grid>
                            <Grid item className={classes.flex}>
                                <p className={classes.decision}>{props.decision_name}</p>
                            </Grid>
                            <Grid item className={classes.flex}>
                                <FormControl className={classes.margin}>
                                    <NativeSelect
                                    value={value.pos}
                                    onChange={handleChange}
                                    input={<BootstrapInput />}
                                    style={{
                                        backgroundImage:value.img.img,
                                    }}
                                    className={classes.select}
                                    >
                                    {
                                        dataList.map((select, i) =>
                                            <option value={i} key={i} 
                                            style={{
                                                backgroundImage:'url("/images/no.png")'
                                            }}
                                            // className={classes.select}
                                            > 
                                                {select.text}
                                            </option>
                                        )
                                    }
                                    </NativeSelect>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <p className={classes.description}>{props.description}</p>
                    </Grid>
                    <Grid item>
                        <p className={classes.other}><b>Type de majorité :</b> {props.calc_mode}</p>
                    </Grid>
                    <Grid item>
                        <p className={classes.other}><b>Clef de répartition :</b> {props.vote_branch}</p>
                    </Grid>
                    <Grid item>
                        <p className={classes.other}><b>Tantièmes :</b> {props.apartment_amount}</p>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item></Grid>
        </Grid>
    );
};

export default withRouter(DecisionCard);
