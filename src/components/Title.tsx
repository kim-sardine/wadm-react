import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    TextField,
    Grid,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    heroContent: {
        padding: theme.spacing(3, 2, 3),
    },
}));


function Title() {
    const classes = useStyles();
    const [title, setTitle] = useState("Title of the wadm table");
    
    const onChangeInputData = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setTitle(e.target.value);
    };
    
    return (
        <Grid container justify="center" className={classes.heroContent}>
            <Grid item xs={12} sm={6}>
                <TextField
                    value={title}
                    onChange={onChangeInputData}
                    fullWidth
                />
            </Grid>
        </Grid>
    );
}
    
export default Title;
