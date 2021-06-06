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

interface TitleProps {
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
}

function Title(props: TitleProps) {
    const classes = useStyles();
    
    const onChangeInputData = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        props.setTitle(e.target.value);
    };
    
    return (
        <Grid container justify="center" className={classes.heroContent}>
            <Grid item xs={12} sm={6}>
                <TextField
                    value={props.title}
                    onChange={onChangeInputData}
                    fullWidth
                />
            </Grid>
        </Grid>
    );
}
    
export default Title;
