import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
    TextField,
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
        <Container maxWidth="sm" component="main" className={classes.heroContent}>
            <TextField
                value={title}
                onChange={onChangeInputData}
                fullWidth
            />
        </Container>
    );
}
    
export default Title;
