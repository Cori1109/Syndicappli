import React, { useState, useEffect } from 'react';
import { Button, ButtonBase } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/styles';
import authService from 'services/authService';
const useStyles = makeStyles(theme => ({
    loginas: {
        opacity: 0.5,
        background: 'linear-gradient(90deg, #00C9FF 10%, #0CC77C 90%)',
        position: 'fixed',
        top: 20,
        right: 20,
        borderRadius: 5,
        border: 'none',
        zIndex : 9999,
        '&:hover': {
            opacity: 1
        }
    },
}));
const LoginAsButton = (props) => {
    const classes = useStyles();
    const handleClickLogout = () => {
        authService.logout();
        localStorage.setItem("select", JSON.stringify(0));
        window.location.replace('/login');
    }
    return (
        <Button className={classes.loginas}
            onClick={handleClickLogout}>
            Vous êtes connecté en tant que {props.loginas}. Se déconnecter
        </Button>
    )
}
export default LoginAsButton;