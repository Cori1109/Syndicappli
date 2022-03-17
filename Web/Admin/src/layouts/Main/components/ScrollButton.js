import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import { makeStyles, useTheme } from '@material-ui/styles';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
const useStyles = makeStyles(theme => ({
    scroll: {
        opacity: 0.5,
        background: 'linear-gradient(90deg, #00C9FF 10%, #0CC77C 90%)',
        width: 40,
        height: 40,
        position: 'fixed',
        bottom: 60,
        right: 20,
        borderRadius: 5,
        border: 'none',
        '&:hover': {
            opacity: 1
        }
    },
    arrowUp: {
        color: 'white',
        position: 'absolute',
    },
}));
const ScrollButton = (props) => {
    const classes = useStyles();
    const [thePosition, setThePosition] = useState(false);
    const [yOffSet , setYOffSet] = useState(0);
    useEffect(()=>{
        document.addEventListener("scroll", () => {
            if (window.scrollY > 170) {
                setThePosition(true);
            } else {
                setThePosition(false);
            }
        });
        window.scrollTo(0, 0);
    },[])
    useEffect(()=>{
        window.scroll(0, window.pageYOffset - props.scrollStepInPx);
        setYOffSet(window.pageYOffset);
    },[yOffSet])
    const scrollToTop = () => {
        window.scroll(0, window.pageYOffset - props.scrollStepInPx);
        setYOffSet(window.pageYOffset)
    }
    if(thePosition){
        return (
            <Button title='Back to top' className={classes.scroll}
                onClick={scrollToTop}>
                <ArrowUpwardIcon className={classes.arrowUp}/>
            </Button>
        )
    }
    return(
        <></>
    )
}
export default ScrollButton;