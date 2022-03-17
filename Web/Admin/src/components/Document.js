import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import CloseIcon from '@material-ui/icons/Close';
import { Avatar } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import useStyles from '../views/WebAppManager/Assemblies/views/Documents/useStyles';

export default function Document(props) {
    const classes = useStyles();
    var files = props.files;
    var thumbnails = props.thumbnails;
    const handleClickDelete = (index)=> {
        props.onClickDelete(files[index].fileID);
    }

    return (
        <Grid item container direction="row" spacing={3}>
            {
                files.map((file, i)=>(
                    <Grid item>
                        <Grid item container direction="column">
                            <Badge  
                                key={0}
                                overlap="circle"
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                    border: '1px solid gray',
                                    padding: '1px 4px',
                                }}
                                badgeContent={<CloseIcon onClick={()=>handleClickDelete(i)}
                                className={classes.close}/>}
                            >
                                <div className={classes.documents}>
                                    <img className={classes.size} alt="" src={thumbnails[i]} />
                                </div>
                            </Badge>
                            <p className={classes.doc_tip} style={{ width: '100px' }}>{file.name}</p>
                        </Grid>
                    </Grid>
                ))
            }
        </Grid>
    );
}